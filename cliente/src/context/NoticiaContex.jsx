import { createContext, useContext, useState, useEffect } from "react";
import { getNoticiasRequest,createNoticiaRequest, getNoticiaRequest, updateNoticiaRequest, deleteNoticiaRequest } from "../api/noticias";
import { useAuth } from './AuthContext.jsx';
import Swal from 'sweetalert2'; // Importamos SweetAlert2

const NoticiaContext = createContext();

export const useNoti = () => {
  const context = useContext(NoticiaContext);
  if (!context) {
    throw new Error("useNoti must be used withing a NotiProvider");
  }
  return context;
};

export function NotiProvider({ children }) {
  const [noticias, setNoticias] = useState([]); // Inicializar como array vacío
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState(null); 
  const { isAuthenticated, loading: authLoading } = useAuth();
  

  const getNoticias = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getNoticiasRequest();
      setNoticias(res.data);
    } catch (err) {
      console.error("Error en getNoticias (context):", err);
      setError(err.message || "Error al cargar noticias");
      setNoticias([]); // Asegurar que noticias sea un array en caso de error
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
    // Solo cargar si está autenticado y la autenticación no está cargando
    if (isAuthenticated && !authLoading) {
      getNoticias();
    } else if (!isAuthenticated && !authLoading) {
      // Si no está autenticado y la auth ya terminó de cargar, reseteamos y dejamos de cargar
      setNoticias([]);
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);
  
 const createNoti = async (notiData) => { // Cambié 'task' a 'notiData' para más claridad
    try {
      const res = await createNoticiaRequest(notiData);
      getNoticias(); // Opción 2: Recargar todas las noticias
      return res; // Devolver la respuesta por si el componente la necesita
    } catch (error) {
      console.error("Error en createNoti (context):", error);
      throw error; // Re-lanzar para que el componente que llama (NoticiaFormPage) lo maneje
    }
  };
const deleteNoti = async (id) => {
  // Mostrar la alerta de confirmación
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

  // Si el usuario confirma la eliminación
  if (result.isConfirmed) {
    try {
        const res = await deleteNoticiaRequest(id);
        if (res.status === 200 || res.status === 204) {
          setNoticias(noticias.filter(noticia => noticia._id !== id));
          Swal.fire(
            '¡Eliminado!',
            'La noticia ha sido eliminada.',
            'success'
          );
        }
        return res; // Devolver la respuesta por si se necesita
    } catch (error) {
        console.log(error);
        Swal.fire(
          'Error',
          'No se pudo eliminar la noticia.',
          'error'
        );
    }
      }
};
const getNoti = async (id) => {
  try {
      const res = await getNoticiaRequest(id);
      //console.log(res.data);
      return res.data;
  } catch (error) {
      console.log(error);
  }
};
const updateNoti = async (id, notiData)  => {
  try {
   const res = await updateNoticiaRequest(id, notiData);
    getNoticias(); // Volvemos a cargar todas las noticias después de actualizar
    return res; // Devolver la respuesta por si el componente la necesita
  }  catch (error) {
     console.error("Error en updateNoti (context):", error);
    throw error; // Re-lanzar para que el componente que llama lo maneje
  }
};

  return (
    <NoticiaContext.Provider
      value={{
        noticias,
        loading,
        error,
        getNoticias,
        createNoti,
        deleteNoti,
        getNoti,
        updateNoti,
      }}
    >
      {children}
    </NoticiaContext.Provider>
  );
}
