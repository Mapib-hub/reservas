import Noticia from "../models/noticia.model.js"; // Corregido el nombre de la importación

export const getNoticiasController = async (req, res) => { // Renombrado para consistencia
    try {
        const noticiasList = await Noticia.find().sort({ createdAt: -1 }); // Ordenar por más reciente
        res.json(noticiasList);
    } catch (error) {
        console.error("Error al obtener noticias:", error);
        return res.status(500).json({message: "Error interno al obtener las noticias"});  
    }
};

export const crearNoticiaController = async (req, res) => {
    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion) {
        return res.status(400).json({ message: "Título y descripción son requeridos." });
    }

    let imageName;
    if (req.file) {
        imageName = req.file.filename; // Usa el nombre del archivo subido
    } else {
        imageName = "noti.jpg"; // Nombre de la imagen por defecto que sugieres
    }

    try {
        const nuevaNoticia = new Noticia({
            titulo,
            descripcion,
            image: imageName // Asigna el nombre del archivo (subido o por defecto)
        });
        const noticiaGuardada = await nuevaNoticia.save();
        res.status(201).json(noticiaGuardada);
    } catch (error) {
        console.error("Error al crear noticia:", error);
        res.status(500).json({ message: "Error interno al crear la noticia", error: error.message });
    }
};
// Controlador para OBTENER UNA noticia por ID
export const getNoticiaByIdController = async (req, res) => {
    try {
        const noticiaId = req.params.id;
        const noticia = await Noticia.findById(noticiaId);

        if (!noticia) {
            return res.status(404).json({ message: "Noticia no encontrada" });
        }

        res.json(noticia);
    } catch (error) {
        console.error("Error al obtener noticia por ID:", error);
        // Si el ID tiene un formato inválido para MongoDB ObjectId, Mongoose puede lanzar un CastError
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de noticia inválido" });
        }
        res.status(500).json({ message: "Error interno al obtener la noticia", error: error.message });
    }
};
// Controlador para ACTUALIZAR una noticia por ID
export const updateNoticiaController = async (req, res) => {
    try {
        const noticiaId = req.params.id;
        const { titulo, descripcion } = req.body;
        
        const datosActualizar = { titulo, descripcion };

        // Si se sube una nueva imagen, la actualizamos.
        // Si no, mantenemos la imagen existente (no la tocamos).
        if (req.file) {
            datosActualizar.image = req.file.filename; // Usamos el nombre del archivo guardado por Multer
        }

        const noticiaActualizada = await Noticia.findByIdAndUpdate(
            noticiaId,
            datosActualizar,
            { new: true, runValidators: true } // new:true devuelve el doc actualizado, runValidators aplica validaciones
        );

        if (!noticiaActualizada) {
            return res.status(404).json({ message: "Noticia no encontrada para actualizar" });
        }

        res.json(noticiaActualizada);
    } catch (error) {
        console.error("Error al actualizar noticia:", error);
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de noticia inválido" });
        if (error.name === 'ValidationError') return res.status(400).json({ message: "Error de validación", errors: error.errors });
        res.status(500).json({ message: "Error interno al actualizar la noticia", error: error.message });
    }
};

// Controlador para ELIMINAR una noticia por ID
export const deleteNoticiaController = async (req, res) => {
    try {
        const noticiaId = req.params.id;
        const noticiaEliminada = await Noticia.findByIdAndDelete(noticiaId);

        if (!noticiaEliminada) {
            return res.status(404).json({ message: "Noticia no encontrada para eliminar" });
        }

        // Opcional: Aquí podrías añadir lógica para eliminar el archivo de imagen del servidor si es necesario.
        res.json({ message: "Noticia eliminada correctamente", noticia: noticiaEliminada });
    } catch (error) {
        console.error("Error al eliminar noticia:", error);
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de noticia inválido" });
        res.status(500).json({ message: "Error interno al eliminar la noticia", error: error.message });
    }
};