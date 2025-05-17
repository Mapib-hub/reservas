import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
    usuario_id: { // Quién hizo la reserva
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Asegúrate que 'User' coincida con tu modelo de usuario
        required: true,
    },
    bloque_horario_id: { // Qué bloque horario se reservó (de la plantilla)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloqueHorario',
        required: true,
    },
    cancha_id: { // A qué cancha pertenece (redundante si ya está en bloque, pero útil para búsquedas)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cancha',
        required: true,
    },
    fecha_reserva: { // ¡La fecha específica para la que se hizo la reserva!
        type: Date,
        required: true,
    },
    estado: { // Estado de la reserva (ej: 'Confirmada', 'Pendiente', 'Cancelada')
        type: String,
        default: 'CONFIRMADA', // Por defecto, una reserva está confirmada
        enum: [
            'PENDIENTE',      // Reserva hecha, esperando confirmación o pago (si aplica)
            'CONFIRMADA',     // Reserva activa y lista
            'CANCELADA_USUARIO',// Cancelada por el usuario
            'CANCELADA_ADMIN',  // Cancelada por el administrador
            'COMPLETADA',     // La hora de la reserva ya pasó
            'NO_ASISTIO'      // La hora de la reserva ya pasó y el usuario no se presentó
        ],
        required: true
    },
    notas_adicionales: { type: String, trim: true, default: '' } // Notas opcionales
}, { timestamps: true });
 
// Índice único para evitar doble reserva del mismo bloque en la misma fecha
reservaSchema.index({ bloque_horario_id: 1, fecha_reserva: 1 }, { unique: true });

export default mongoose.model("Reserva", reservaSchema);