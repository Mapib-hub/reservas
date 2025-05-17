import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    getBloqueHorariosRequest,
    createBloqueHorarioRequest,
    getBloqueHorarioRequest,
    updateBloqueHorarioRequest,
    deleteBloqueHorarioRequest
} from '../api/bloqueHorarios.js'; // Ajusta la ruta si es necesario
import { useAuth } from './AuthContext.jsx'; // Importamos useAuth
import Swal from 'sweetalert2'; // Para la confirmación de eliminación

const BloqueHorariosContext = createContext();

export const useBloqueHorarios = () => {
    const context = useContext(BloqueHorariosContext);
    if (!context) {
        throw new Error("useBloqueHorarios debe ser usado dentro de un BloqueHorariosProvider");
    }
    return context;
};

export const BloqueHorariosProvider = ({ children }) => {
    const [bloqueHorarios, setBloqueHorarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user, loading: authLoading } = useAuth(); // Obtenemos el estado de autenticación

    const fetchBloqueHorarios = async () => {
        try {
            setLoading(true);
            setError(null);
             const res = await getBloqueHorariosRequest();
      setBloqueHorarios(res.data);
    } catch (err) {
      console.error("Error en fetchBloqueHorarios (context):", err);
      setError(err.message || "Error al cargar bloques horarios");
     setBloqueHorarios([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (isAuthenticated && !authLoading && user && user.role === 'admin') {
      fetchBloqueHorarios(); // O como se llame tu función para obtener bloques
    } else if (!isAuthenticated && !authLoading) {
      // Si no está autenticado y la auth ya terminó de cargar, reseteamos y dejamos de cargar
      setBloqueHorarios([]);
      setLoading(false);
    } else if (isAuthenticated && !authLoading && user && user.role !== 'admin') {
      // Si está autenticado como no-admin, también reseteamos y no cargamos
      setBloqueHorarios([]);
      setLoading(false);
    }
    }, [isAuthenticated, authLoading, user]);// Dependemos de isAuthenticated y authLoading
    
    const createBloqueHorario = async (data) => {
        try {
            const res = await createBloqueHorarioRequest(data);
            getBloqueHorarios(); // Recargar después de crear
            return res;
        } catch (error) {
            console.error("Error en createBloqueHorario (context):", error);
            throw error;
        }
    };

    const getBloqueHorario = async (id) => {
        try {
            const res = await getBloqueHorarioRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error en getBloqueHorario (context):", error);
            throw error;
        }
    };

    const updateBloqueHorario = async (id, data) => {
        try {
            const res = await updateBloqueHorarioRequest(id, data);
            getBloqueHorarios(); // Recargar después de actualizar
            return res;
        } catch (error) {
            console.error("Error en updateBloqueHorario (context):", error);
            throw error;
        }
    };

    // En c:\Users\Acer\Desktop\proyectos\reservas\cliente\src\context\BloqueHorariosContext.jsx
    const deleteBloqueHorario = async (id) => {
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
                await deleteBloqueHorarioRequest(id);
                setBloqueHorarios(bloqueHorarios.filter(bh => bh._id !== id));
                Swal.fire('¡Eliminado!', 'El bloque de horario ha sido eliminado.', 'success');
                return true;
            } catch (error) {
                console.error("Error en deleteBloqueHorario (context):", error);
                Swal.fire('Error', 'No se pudo eliminar el bloque de horario.', 'error');
                return false;
            }
        }
        return false;
    };
   const getBloqueHorarioDetalles = (id) => {
    if (!id) return null;
    const bloque = bloqueHorarios.find(bh => bh._id === String(id));
    return bloque ? { hora_inicio: bloque.hora_inicio, hora_fin: bloque.hora_fin, dia_semana: bloque.dia_semana } : null;
};

    return (
        <BloqueHorariosContext.Provider value={{
            bloqueHorarios,
            loading,
            error,
            fetchBloqueHorarios, // Corregido: usar el nombre correcto de la función
            createBloqueHorario,
            getBloqueHorario,
            updateBloqueHorario,
            deleteBloqueHorario,
            getBloqueHorarioDetalles,
        }}>
            {children}
        </BloqueHorariosContext.Provider>
    );
};