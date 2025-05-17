import { createContext, useContext, useState, useEffect } from 'react';
import {
    getReservasRequest,
    createReservaRequest,
    deleteReservaRequest, // Aunque no se usa directamente aquí, es bueno tenerlo si se necesita
    getReservaRequest,
    updateReservaRequest
    // Ya no necesitamos getUserReservasRequest
} from '../api/reservas.js';
import { useAuth } from "./AuthContext";
import Swal from 'sweetalert2';

const ReservaContext = createContext();

export const useReservas = () => {
    const context = useContext(ReservaContext);
    if (!context) throw new Error("useReservas must be used within a ReservaProvider");
    return context;
}

export const ReservaProvider = ({ children }) => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true); // Empezamos asumiendo que cargaremos algo
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useAuth();

    // Esta es la única función que necesitamos para cargar reservas.
    // El backend se encarga de filtrar por rol.
    const fetchReservas = async () => {
        if (isAuthenticated && user) { // Solo si está autenticado y hay un objeto 'user'
            //console.log(`[ReservaContext] fetchReservas: Usuario ${user.role} (ID: ${user._id}). Intentando cargar reservas.`);
            setLoading(true);
            setError(null);
            try {
                const response = await getReservasRequest(); // Llama a GET /api/reservas
                //console.log("[ReservaContext] fetchReservas: Respuesta de getReservasRequest:", response.data);
                setReservas(response.data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || "Error al cargar reservas";
                console.error("[ReservaContext] fetchReservas: Error al obtener reservas:", errorMessage, error);
                setError(errorMessage);
                setReservas([]); // Limpiar en caso de error
            } finally {
                setLoading(false);
            }
        } else {
            // Si no está autenticado o el usuario aún no está disponible,
            // limpiamos las reservas y nos aseguramos de que no esté cargando.
           // console.log("[ReservaContext] fetchReservas: No autenticado o 'user' es null/incompleto. No se cargan reservas.");
            setReservas([]);
            setLoading(false);
            setError(null);
        }
    };

    // Este useEffect se encarga de llamar a fetchReservas cuando cambia el estado de autenticación o el usuario.
    useEffect(() => {
        //console.log("[ReservaContext] useEffect: Verificando estado de autenticación y rol.", { isAuthenticated, userId: user?._id, userRole: user?.role });
        if (isAuthenticated && user) {
            // Si está autenticado y el objeto 'user' está presente (con rol, id, etc.)
           // console.log(`[ReservaContext] useEffect: Usuario ${user.role} autenticado. Llamando a fetchReservas().`);
            fetchReservas();
        } else {
            // Si no está autenticado, o el objeto 'user' es null (ej. al desloguearse o antes del login)
            //console.log("[ReservaContext] useEffect: Usuario NO autenticado o 'user' es null. Limpiando estado 'reservas'.");
            setReservas([]);
            setLoading(false); // No estamos cargando nada
            setError(null);    // Limpiar errores
        }
    }, [isAuthenticated, user]); // Dependencias: se ejecuta si cambia isAuthenticated o el objeto user

    // --- Funciones CRUD para reservas ---

    const createReserva = async (reservaData) => {
        try {
            const res = await createReservaRequest(reservaData);
            // Actualizamos el estado local añadiendo la nueva reserva
            // y luego volvemos a llamar a fetchReservas para asegurar consistencia y ordenamiento si lo hay en el backend
            // Opcionalmente, si la respuesta de creación ya es la reserva completa y correcta:
            setReservas(prevReservas => [...prevReservas, res.data].sort((a, b) => new Date(a.fecha_reserva) - new Date(b.fecha_reserva))); // Ejemplo de ordenamiento
            // fetchReservas(); // Podrías llamar a fetchReservas() para recargar todo si prefieres
            return res.data;
        } catch (error) {
            console.error("Error creating reserva:", error.response?.data || error.message);
            throw error;
        }
    };

    const getReserva = async (id) => {
        try {
            const res = await getReservaRequest(id);
            return res.data;
        } catch (error) {
            console.error(`Error fetching reserva with id ${id}:`, error.response?.data || error.message);
            throw error;
        }
    };

    const updateReserva = async (id, reservaData) => {
        try {
            const response = await updateReservaRequest(id, reservaData);
            const updatedReserva = response.data;
            setReservas(prevReservas =>
                prevReservas.map(reserva => (reserva._id === id ? updatedReserva : reserva))
            );
            return updatedReserva;
        } catch (error) {
            console.error(`Error updating reserva with id ${id}:`, error.response?.data || error.message);
            throw error;
        }
    };

    const cancelReserva = async (id) => { // Para Admin
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción cambiará el estado de la reserva a 'Cancelada por Admin'.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cancelar reserva',
            cancelButtonText: 'No, mantener'
        });

        if (result.isConfirmed) {
            try {
                const updatedReserva = await updateReserva(id, { estado: 'CANCELADA_ADMIN' });
                Swal.fire('¡Cancelada!', 'La reserva ha sido marcada como cancelada por el administrador.', 'success');
                return updatedReserva;
            } catch (error) {
                Swal.fire('Error', error.response?.data?.message || 'No se pudo cancelar la reserva.', 'error');
                throw error;
            }
        }
    };

    const cancelUserReserva = async (id) => { // Para Usuario
        const result = await Swal.fire({
            title: '¿Estás seguro de cancelar tu reserva?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar mi reserva',
            cancelButtonText: 'No, mantener'
        });

        if (result.isConfirmed) {
            try {
                const updatedReserva = await updateReserva(id, { estado: 'CANCELADA_USUARIO' });
                Swal.fire('¡Reserva Cancelada!', 'Tu reserva ha sido cancelada exitosamente.', 'success');
                return updatedReserva;
            } catch (error) {
                Swal.fire('Error', error.response?.data?.message || 'No se pudo cancelar tu reserva.', 'error');
                throw error;
            }
        }
    };

    return (
        <ReservaContext.Provider value={{
            reservas,
            loading,
            error,
            fetchReservas, // Exponemos la función para recargar si es necesario desde algún componente
            createReserva,
            getReserva,
            updateReserva,
            cancelReserva,
            cancelUserReserva
            // Ya no necesitamos exportar fetchMisReservas
        }}>
            {children}
        </ReservaContext.Provider>
    );
};
