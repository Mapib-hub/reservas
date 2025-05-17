import mongoose from "mongoose";

const excepcionSchema = new mongoose.Schema({
    fecha_inicio: {
        type: Date,
        required: true,
    },
    fecha_fin: {
        type: Date,
        required: true,
    },
    // Referencias opcionales a otros modelos (si los tienes definidos)
    bloque_horario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloqueHorario', // Asegúrate de que el nombre coincida con tu modelo de bloques
        default: null,
    },
    cancha_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cancha', // Asegúrate de que el nombre coincida con tu modelo de canchas
        default: null,
    },
    tipo: {
        type: String,
        required: true,
        enum: ['FERIADO', 'MANTENIMIENTO', 'EVENTO_PRIVADO', 'REPARACION', 'BLOQUEO_ESPECIAL'],
        default: 'BLOQUEO_ESPECIAL',
    },
    descripcion: {
        type: String,
        required: true, // Hacemos la descripción obligatoria
        trim: true
    },
    titulo_display: { // Título corto opcional para mostrar en vistas (ej. tarjetas)
        type: String,
        trim: true,
        default: null,
    }
}, { timestamps: true }); // timestamps añade createdAt y updatedAt automáticamente

export default mongoose.model("Excepcion", excepcionSchema); 