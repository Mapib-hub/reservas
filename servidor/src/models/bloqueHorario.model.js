import mongoose from "mongoose";

const bloqueHorarioSchema = new mongoose.Schema({
    cancha_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cancha', // Referencia al modelo Cancha
        required: true,
    },
    dia_semana: {
        type: Number, // 0: Domingo, 1: Lunes, ..., 6: Sábado
        required: true,
        min: 0,
        max: 6,
    }, 
    hora_inicio: {
        type: String, // Podrías usar String "HH:MM" o Number (minutos desde medianoche)
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Valida formato HH:MM
    },
    hora_fin: {
        type: String, // Podrías usar String "HH:MM" o Number (minutos desde medianoche)
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Valida formato HH:MM
    },
    activo: { // Para poder desactivar bloques sin borrarlos
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default mongoose.model("BloqueHorario", bloqueHorarioSchema);