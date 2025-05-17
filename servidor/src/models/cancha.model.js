import mongoose from "mongoose";

const canchaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: { // Nuevo campo para la descripción
        type: String,
        required: false, // Podría ser opcional si algunas canchas no tienen descripción detallada
        trim: true,
        default: "Descripción no disponible." // Un valor por defecto
    },
    imagen: { // Nuevo campo para la URL de la imagen
        type: String,
        required: false, // Podría ser opcional
        default: "https://via.placeholder.com/400x300.png?text=Cancha" // URL de placeholder por defecto
    }
}, { timestamps: true });

export default mongoose.model("Cancha", canchaSchema); 