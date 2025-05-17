import Cancha from "../models/cancha.model.js";
// Asumimos que uploadCanchaImage se importará y usará en las rutas
import fs from 'fs'; // Para manejar archivos (ej. eliminar imagen antigua)
import path from 'path'; // Para manejar rutas de archivos
import { fileURLToPath } from 'url'; // Necesario para path.dirname con ES Modules

// Crear una nueva cancha (versión con Multer)
export const createCancha = async (req, res) => {
    const { nombre, descripcion } = req.body; // Multer pone los campos de texto aquí
    let imageName;

    if (req.file) {
        imageName = req.file.filename; // Multer guarda el archivo y pone el nombre aquí
    }
    // Si no se sube archivo (req.file es undefined), imageName será undefined.
    // El modelo usará su valor por defecto para 'imagen' en ese caso.

    try {
        const newCancha = new Cancha({ nombre, descripcion, imagen: imageName });
        const canchaGuardada = await newCancha.save();
        res.status(201).json(canchaGuardada);
    } catch (error) {
        console.error("Error al crear cancha:", error);
        res.status(500).json({ message: "Error interno al crear la cancha", error: error.message });
    }
};
// Obtener todas las canchas
export const getCanchas = async (req, res) => {
    const canchas = await Cancha.find();
    res.json(canchas);
};
// Obtener una cancha específica por ID
export const getCancha = async (req, res) => {
    try {
        const canchaId = req.params.id;
        const cancha = await Cancha.findById(canchaId);
        // Si el modelo Cancha tuviera referencias a otros modelos (ej. bloques horarios directamente),
        // aquí podrías usar .populate()

        if (!cancha) {
            return res.status(404).json({ message: "Cancha no encontrada" });
        }
        res.json(cancha);
    } catch (error) {
        console.error("Error al obtener cancha:", error);
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de cancha inválido" });
        res.status(500).json({ message: "Error interno al obtener la cancha", error: error.message });
    }
};

// Actualizar una cancha existente por ID
export const updateCancha = async (req, res) => {
    try {
        const canchaId = req.params.id;
        const { nombre, descripcion } = req.body; // Campos de texto del body

        const datosActualizar = { nombre, descripcion };

        if (req.file) {
            // Si se subió una nueva imagen, la añadimos a los datos a actualizar
            datosActualizar.imagen = req.file.filename;

            // Opcional: Eliminar la imagen antigua si existía y no era la por defecto
            const canchaExistente = await Cancha.findById(canchaId);
            // Asegúrate de que la URL por defecto coincida con la de tu modelo
            const defaultImageUrl = "https://via.placeholder.com/400x300.png?text=Cancha";

            if (canchaExistente && canchaExistente.imagen && canchaExistente.imagen !== defaultImageUrl) {
                // Construir la ruta completa de la imagen antigua
                // Asumiendo que las imágenes se guardan en servidor/uploads/canchas
                const oldImagePath = path.join(
                    path.dirname(fileURLToPath(import.meta.url)), // Directorio actual del controlador
                    '../../uploads/canchas', // Subir dos niveles y entrar a uploads/canchas
                    canchaExistente.imagen // Nombre del archivo antiguo
                );
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error al eliminar imagen antigua:", oldImagePath, err);
                    else console.log("Imagen antigua eliminada:", oldImagePath);
                });
            }
        }
        // Si no se sube un nuevo archivo (req.file es undefined), el campo 'imagen'
        // no se incluye en datosActualizar, por lo que Mongoose no lo modificará
        // y se conservará la imagen existente (o el default si no tenía).

        const canchaActualizada = await Cancha.findByIdAndUpdate(
            canchaId,
            datosActualizar,
            { new: true, runValidators: true } // new:true devuelve el doc actualizado, runValidators aplica validaciones
        );

        if (!canchaActualizada) {
            return res.status(404).json({ message: "Cancha no encontrada" });
        }
        res.json(canchaActualizada);
    } catch (error) {
        console.error("Error al actualizar cancha:", error);
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de cancha inválido" });
        // Si tu modelo Cancha tiene validaciones (ej. 'nombre' es requerido y lo envías vacío)
        if (error.name === 'ValidationError') return res.status(400).json({ message: "Error de validación al actualizar cancha", errors: error.errors });
        res.status(500).json({ message: "Error interno al actualizar la cancha", error: error.message });
    }
};
// Eliminar una cancha por ID
export const deleteCancha = async (req, res) => {
    try {
        const canchaId = req.params.id;
        const canchaEliminada = await Cancha.findByIdAndDelete(canchaId);

        if (!canchaEliminada) {
            return res.status(404).json({ message: "Cancha no encontrada para eliminar" });
        }

        // Opcional: Eliminar la imagen asociada si no es la por defecto
        const defaultImageUrl = "https://via.placeholder.com/400x300.png?text=Cancha";
        if (canchaEliminada.imagen && canchaEliminada.imagen !== defaultImageUrl) {
             // Construir la ruta completa de la imagen
             const imagePath = path.join(
                 path.dirname(fileURLToPath(import.meta.url)), // Directorio actual del controlador
                 '../../uploads/canchas', // Subir dos niveles y entrar a uploads/canchas
                 canchaEliminada.imagen // Nombre del archivo
             );
             fs.unlink(imagePath, (err) => {
                 if (err) console.error("Error al eliminar imagen de cancha:", imagePath, err);
                 else console.log("Imagen de cancha eliminada:", imagePath);
             });
        }

        res.sendStatus(204); // No Content es común para DELETE exitoso
    } catch (error) {
        console.error("Error al eliminar cancha:", error);
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de cancha inválido" });
        res.status(500).json({ message: "Error interno al eliminar la cancha", error: error.message });
    }
};
