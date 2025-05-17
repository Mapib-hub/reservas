import Reserva from '../models/reserva.model.js';

export const canManageReservation = async (req, res, next) => {
    try {
        const reservaId = req.params.id; // Asumimos que el ID de la reserva viene en los parámetros de la ruta
        const userId = req.user.id; // o req.user._id, dependiendo de cómo esté en tu req.user
        const userRole = req.user.role;

        if (!mongoose.Types.ObjectId.isValid(reservaId)) {
            return res.status(400).json({ message: "ID de reserva inválido" });
        }

        const reserva = await Reserva.findById(reservaId);

        if (!reserva) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }

        // Verificar si el usuario es el dueño de la reserva o si es un administrador
        if (reserva.usuario_id.toString() === userId || userRole === 'admin') {
            next(); // El usuario tiene permiso, continuar al siguiente middleware/controlador
        } else {
            res.status(403).json({ message: "No tienes permiso para realizar esta acción sobre esta reserva." });
        }
    } catch (error) {
        console.error("Error en middleware canManageReservation:", error);
        return res.status(500).json({ message: "Error interno del servidor al verificar permisos de reserva." });
    }
};

// Podríamos necesitar importar mongoose para ObjectId.isValid
import mongoose from 'mongoose';