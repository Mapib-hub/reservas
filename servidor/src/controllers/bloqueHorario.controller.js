import BloqueHorario from "../models/bloqueHorario.model.js";

// Crear un nuevo bloque horario o múltiples bloques
export const createBloqueHorario = async (req, res) => {
    try {
        // Verificamos si el body es un array o un solo objeto
        if (Array.isArray(req.body)) {
            // Es un array, usamos insertMany
            // Añadimos validación básica para asegurarnos que es un array no vacío
            if (req.body.length === 0) {
                return res.status(400).json({ message: 'El array de bloques horarios no puede estar vacío.' });
            }
            // Asegúrate de que cada objeto en req.body tenga los campos necesarios
            const newBloques = await BloqueHorario.insertMany(req.body, { ordered: false, lean: true });
            res.status(201).json(newBloques); // 201 Created es más apropiado para creación

        } else if (typeof req.body === 'object' && req.body !== null) {
            // Es un solo objeto, lo creamos como antes
            const { cancha_id, dia_semana, hora_inicio, hora_fin, activo } = req.body; // Extraemos de req.body

            // Validación básica para el objeto único
            if (!cancha_id || dia_semana === undefined || !hora_inicio || !hora_fin) {
                return res.status(400).json({ message: 'Faltan campos requeridos para crear el bloque horario.' });
            }

            const newBloque = new BloqueHorario({
                cancha_id,
                dia_semana,
                hora_inicio,
                hora_fin,
                activo // Si no se envía, usará el default: true del modelo
            });
            const savedBloque = await newBloque.save();
            res.status(201).json(savedBloque);

        } else {
             // El formato no es ni objeto ni array válido
             return res.status(400).json({ message: 'El cuerpo de la solicitud debe ser un objeto JSON o un array de objetos JSON.' });
        }
    } catch (error) {
        console.error("Error al crear bloque horario:", error);
        // Podrías añadir manejo específico para errores de validación o duplicados si es necesario
        res.status(500).json({ message: "Error interno al crear el bloque horario", error: error.message });
    }
};

// Obtener todos los bloques horarios (podrías filtrar por cancha_id o día después)
export const getBloquesHorarios = async (req, res) => {
    try {
        // Populate para mostrar el nombre de la cancha en lugar de solo el ID
        const bloques = await BloqueHorario.find().populate('cancha_id', 'nombre'); // Añadimos 'nombre' para especificar qué campo de Cancha queremos
        res.json(bloques);
    } catch (error) {
        console.error("Error al obtener bloques horarios:", error);
        res.status(500).json({ message: "Error interno al obtener los bloques horarios", error: error.message });
    }
};
// Obtener un bloque horario específico por ID
export const getBloqueHorario = async (req, res) => {
    try {
        const bloqueId = req.params.id;
        const bloqueHorario = await BloqueHorario.findById(bloqueId)
            .populate('cancha_id', 'nombre'); // Populamos para obtener el nombre de la cancha

        if (!bloqueHorario) {
            return res.status(404).json({ message: "Bloque horario no encontrado" });
        }
        res.json(bloqueHorario);
    } catch (error) {
        console.error("Error al obtener bloque horario:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de bloque horario inválido" });
        }
        res.status(500).json({ message: "Error interno al obtener el bloque horario", error: error.message });
    }
};

// Actualizar un bloque horario existente por ID
export const updateBloqueHorario = async (req, res) => {
    try {
        const bloqueId = req.params.id;
        const datosActualizar = req.body;

        const bloqueActualizado = await BloqueHorario.findByIdAndUpdate(
            bloqueId,
            datosActualizar,
            { new: true, runValidators: true } // new:true devuelve el doc actualizado, runValidators aplica validaciones
        ).populate('cancha_id', 'nombre'); // Populamos para obtener el nombre de la cancha

        if (!bloqueActualizado) {
            return res.status(404).json({ message: "Bloque horario no encontrado para actualizar" });
        }
        res.json(bloqueActualizado);
    } catch (error) {
        console.error("Error al actualizar bloque horario:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de bloque horario inválido" });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Error de validación al actualizar bloque horario", errors: error.errors });
        }
        res.status(500).json({ message: "Error interno al actualizar el bloque horario", error: error.message });
    }
};
// Eliminar un bloque horario por ID
export const deleteBloqueHorario = async (req, res) => {
    try {
        const bloqueId = req.params.id;
        const bloqueEliminado = await BloqueHorario.findByIdAndDelete(bloqueId);

        if (!bloqueEliminado) {
            return res.status(404).json({ message: "Bloque horario no encontrado para eliminar" });
        }

        // res.sendStatus(204); // Opción 1: No Content
        res.json({ message: "Bloque horario eliminado correctamente", bloque: bloqueEliminado }); // Opción 2: Mensaje y objeto eliminado

    } catch (error) {
        console.error("Error al eliminar bloque horario:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de bloque horario inválido" });
        }
        res.status(500).json({ message: "Error interno al eliminar el bloque horario", error: error.message });
    }
};