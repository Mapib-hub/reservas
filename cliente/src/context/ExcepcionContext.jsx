import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    getExcepcionesRequest,
    createExcepcionRequest,
    deleteExcepcionRequest,
    getExcepcionRequest,
    updateExcepcionRequest
} from '../api/excepciones.js'; // Asumiremos que este archivo API existirá
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext.jsx';

const ExcepcionContext = createContext();

export const useExcepciones = () => {
    const context = useContext(ExcepcionContext);
    if (!context) {
        throw new Error("useExcepciones must be used within an ExcepcionProvider");
    }
    return context;
};

export const ExcepcionProvider = ({ children }) => {
    const [excepciones, setExcepciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user, loading: authLoading } = useAuth(); // Obtenemos el estado de autenticación y el usuario

    const fetchExcepciones = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getExcepcionesRequest();
            setExcepciones(res.data);
        } catch (error) {
            console.error("Error en fetchExcepciones (context):", err);
      setError(err.response?.data?.message || err.message || "Error al cargar excepciones");
      setExcepciones([]);
        } finally {
            setLoading(false);
        }
    };

    // Cargar excepciones al montar el provider
    // Podríamos quitar esto si preferimos cargar las excepciones solo cuando se necesiten en una página específica.
    // Por ahora, lo dejamos para que estén disponibles globalmente si se usa el provider en App.jsx
     useEffect(() => {
    
    // Solo cargar si está autenticado, la autenticación no está cargando Y el usuario es admin
    if (isAuthenticated && !authLoading && user && user.role === 'admin') {
      fetchExcepciones();
    } else if (!isAuthenticated && !authLoading) {
      // Si no está autenticado y la auth ya terminó de cargar, reseteamos y dejamos de cargar
      setExcepciones([]);
      setLoading(false);
    } else if (isAuthenticated && !authLoading && user && user.role !== 'admin') {
      // Si está autenticado como no-admin, también reseteamos y no cargamos
      setExcepciones([]);
      setLoading(false);
    }
  
  }, [isAuthenticated, authLoading, user]);
 
    const createExcepcion = async (excepcionData) => {
        try {
            const res = await createExcepcionRequest(excepcionData);
            // Actualizar el estado local añadiendo la nueva excepción
            setExcepciones(prevExcepciones => [...prevExcepciones, res.data]);
            return res.data; // Devolver la excepción creada por si se necesita
        } catch (error) {
            console.error("Error creating excepcion:", error);
            // Lanzar el error para que el componente del formulario pueda manejarlo
            throw error;
        }
    };

    const getExcepcion = async (id) => {
        try {
            const res = await getExcepcionRequest(id);
            return res.data;
        } catch (error) {
            console.error(`Error fetching excepcion with id ${id}:`, error);
            throw error;
        }
    };

    const updateExcepcion = async (id, excepcionData) => {
        try {
            const res = await updateExcepcionRequest(id, excepcionData);
            // Actualizar el estado local
            setExcepciones(prevExcepciones =>
                prevExcepciones.map(exc => (exc._id === id ? res.data : exc))
            );
            return res.data; // Devolver la excepción actualizada
        } catch (error) {
            console.error(`Error updating excepcion with id ${id}:`, error);
            throw error;
        }
    };

    const deleteExcepcion = async (id) => {
         const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir la eliminación de esta excepción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteExcepcionRequest(id);
                // Actualizar el estado local eliminando la excepción
                setExcepciones(prevExcepciones => prevExcepciones.filter(exc => exc._id !== id));
                Swal.fire('¡Eliminada!', 'La excepción ha sido eliminada.', 'success');
                return true; // Indicar que la eliminación fue exitosa
            } catch (error) {
                console.error(`Error deleting excepcion with id ${id}:`, error);
                Swal.fire('Error', error.response?.data?.message || error.message || 'No se pudo eliminar la excepción.', 'error');
                // setError(error.response?.data?.message || error.message || "Error al eliminar la excepción"); // Opcional, si quieres mostrar el error también en otro lado
                return false; // Indicar que hubo un error
            }
        }
        return false; // Indicar que el usuario canceló
    };

    return (
        <ExcepcionContext.Provider value={{
            excepciones,
            loading,
            error,
            fetchExcepciones, // Exponer para recargar manualmente si es necesario
            createExcepcion,
            getExcepcion,
            updateExcepcion,
            deleteExcepcion
        }}>
            {children}
        </ExcepcionContext.Provider>
    );
};