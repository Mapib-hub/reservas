import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getCanchasRequest, 
  createCanchaRequest, 
  getCanchaRequest, 
  updateCanchaRequest, 
  deleteCanchaRequest 
} from '../api/canchas.js'; // Ajusta la ruta si es necesario
import { useAuth } from './AuthContext.jsx'; // Importamos useAuth
import Swal from 'sweetalert2';

const CanchasContext = createContext();

export const useCanchas = () => {
  const context = useContext(CanchasContext);
  if (!context) {
    throw new Error("useCanchas debe ser usado dentro de un CanchasProvider");
  }
  return context;
};

export const CanchasProvider = ({ children }) => {
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const getCanchas = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCanchasRequest();
      console.log("Canchas obtenidas:", res.data); // Para depurar
      setCanchas(res.data);
    } catch (err) {
      console.error("Error en getCanchas (context):", err);
      setError(err.message || "Error al cargar canchas");
      setCanchas([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
          // Solo cargar si está autenticado y la autenticación no está cargando
          if (isAuthenticated && !authLoading) {
              getCanchas();
          } else if (!isAuthenticated && !authLoading) {
              // Si no está autenticado y la auth ya terminó de cargar, reseteamos y dejamos de cargar
              setCanchas([]);
              setLoading(false);
          }
      }, [isAuthenticated, authLoading]);

  // Implementar funciones CRUD (similares a noticias, sin imagen)
  const createCancha = async (canchaData) => {
    try {
      const res = await createCanchaRequest(canchaData);
      // Después de crear, volvemos a cargar todas las canchas para actualizar la lista
      getCanchas(); 
      return res; // Devolver la respuesta por si el componente la necesita
    } catch (error) {
      console.error("Error en createCancha (context):", error);
      throw error; // Re-lanzar para que el componente que llama (CanchaFormPage) lo maneje
    }
  };
  // Dentro de CanchaProvider en CanchasContext.jsx

const getCanchaNombre = (id) => {
    const cancha = canchas.find(c => c._id === id);
    return cancha ? cancha.nombre : 'Cancha no encontrada'; // O un string vacío, o el ID mismo
};

  const getCancha = async (id) => {
    try {
      const res = await getCanchaRequest(id);
      return res.data; // Devuelve los datos de la cancha específica
    } catch (error) {
      console.error("Error en getCancha (context):", error);
      throw error; // Re-lanzar para que el componente lo maneje
    }
  };
  const updateCancha = async (id, canchaData) => {
    try {
      const res = await updateCanchaRequest(id, canchaData);
      getCanchas(); // Recargar todas las canchas después de actualizar
      return res; // Devolver la respuesta por si el componente la necesita
    } catch (error) {
      console.error("Error en updateCancha (context):", error);
      throw error; // Re-lanzar para que el componente lo maneje
    }
  };
   
  const deleteCancha = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        await deleteCanchaRequest(id);
        setCanchas(canchas.filter(cancha => cancha._id !== id)); // Actualizar estado local
        Swal.fire('¡Eliminado!', 'La cancha ha sido eliminada.', 'success');
        return true; // Indicar que la eliminación fue exitosa
      } catch (error) {
        console.error("Error en deleteCancha (context):", error);
        Swal.fire('Error', 'No se pudo eliminar la cancha.', 'error');
        return false; // Indicar que hubo un error
      }
    }
    return false; // Indicar que el usuario canceló
  };

  return (
    <CanchasContext.Provider value={{
        canchas,
        loading, // si lo tienes
        error,   // si lo tienes
        createCancha, // tus otras funciones
        getCancha,
        updateCancha,
        deleteCancha,
       getCanchas,
        getCanchaNombre // <--- ¡Asegúrate de que esté aquí!
    }}>
        {children}
    </CanchasContext.Provider>
);
};