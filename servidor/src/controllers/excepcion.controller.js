import Excepcion from "../models/excepcion.model.js";

// Crear una nueva excepción
export const createExcepcion = async (req, res) => {
    const { fecha_inicio, fecha_fin, bloque_horario_id, cancha_id, tipo, descripcion } = req.body;

    try {
        const nuevaExcepcion = new Excepcion({
            fecha_inicio,
            fecha_fin,
            bloque_horario_id: bloque_horario_id || null, // Asegura null si no viene
            cancha_id: cancha_id || null,             // Asegura null si no viene
            tipo,
            descripcion,
        });
        const excepcionGuardada = await nuevaExcepcion.save();
        res.status(201).json(excepcionGuardada);
    } catch (error) {
        console.error("Error al crear excepción:", error);
        res.status(500).json({ message: "Error interno al crear la excepción", error: error.message });
    }
};

// Obtener todas las excepciones (para empezar)
export const getExcepciones = async (req, res) => {
    const excepciones = await Excepcion.find(); // Más adelante podrías filtrar por fecha aquí
    res.json(excepciones);
};
// Obtener una excepción específica por ID
export const getExcepcion = async (req, res) => {
    try {
        const excepcionId = req.params.id;
        const excepcion = await Excepcion.findById(excepcionId)
            // Opcional: Poblar campos referenciados si es necesario
            // .populate('cancha_id', 'nombre')
            // .populate('bloque_horario_id'); 

        if (!excepcion) {
            return res.status(404).json({ message: "Excepción no encontrada" });
        }
        res.json(excepcion);
    } catch (error) {
        console.error("Error al obtener excepción:", error);
        // Si el ID tiene un formato inválido para MongoDB, Mongoose puede lanzar un CastError
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de excepción inválido" });
        res.status(500).json({ message: "Error interno al obtener la excepción", error: error.message });
    }
};

// Actualizar una excepción existente por ID
export const updateExcepcion = async (req, res) => {
    try {
        const excepcionId = req.params.id;
        const datosActualizar = req.body; // Los campos a actualizar vienen en el body

        // Usamos findByIdAndUpdate para encontrar y actualizar.
        // { new: true } hace que devuelva el documento actualizado.
        const excepcionActualizada = await Excepcion.findByIdAndUpdate(
            excepcionId,
            datosActualizar,
            { new: true, runValidators: true } // runValidators para que se apliquen las validaciones del modelo
        );

        if (!excepcionActualizada) {
            return res.status(404).json({ message: "Excepción no encontrada para actualizar" });
        }
        res.json(excepcionActualizada);
    } catch (error) {
        console.error("Error al actualizar excepción:", error);
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de excepción inválido" });
        if (error.name === 'ValidationError') return res.status(400).json({ message: "Error de validación", errors: error.errors });
        res.status(500).json({ message: "Error interno al actualizar la excepción", error: error.message });
    }
};
// Eliminar una excepción por ID
export const deleteExcepcion = async (req, res) => {
    try {
        const excepcionId = req.params.id;
        const excepcionEliminada = await Excepcion.findByIdAndDelete(excepcionId);

        if (!excepcionEliminada) {
            return res.status(404).json({ message: "Excepción no encontrada para eliminar" });
        }

        // Puedes devolver un 204 (No Content) o un 200 con un mensaje.
        // res.sendStatus(204);
        res.json({ message: "Excepción eliminada correctamente", excepcion: excepcionEliminada }); // Opcional: devolver la excepción eliminada
    } catch (error) {
        console.error("Error al eliminar excepción:", error);
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de excepción inválido" });
        res.status(500).json({ message: "Error interno al eliminar la excepción", error: error.message });
    }
};