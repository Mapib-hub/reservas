import { Router } from "express";
import multer from "multer"; // Importamos multer para poder identificar sus errores
import { 
    crearNoticiaController,
    getNoticiasController,
    getNoticiaByIdController, 
    updateNoticiaController,  
    deleteNoticiaController   
} from "../controllers/noticias.controller.js";
import { authRequire } from "../middlewares/validateToken.js";
import { adminRequire } from "../middlewares/adminRequire.js";
import { uploadNoticiaImage } from "../middlewares/multer_noti.js"; // Usando el nombre de tu archivo

const router = Router();

// Middleware para manejar errores de Multer específicamente
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Un error de Multer ocurrió (ej. archivo muy grande, campo inesperado)
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "El archivo es demasiado grande. El límite es 2MB." });
        } else {
            // Otros errores de Multer
            return res.status(400).json({ message: err.message });
        }
    } else if (err) {
        // Otro tipo de error (ej. el fileFilter lanzó un error)
        return res.status(400).json({ message: err.message });
    } else {
        // Si no hay error, pasar al siguiente middleware o controlador
        next();
    }
};

// Ruta para CREAR una nueva noticia
// POST /api/noticias/
// Protegida: solo administradores.
router.post('/noticias', authRequire, adminRequire,uploadNoticiaImage, handleMulterError, crearNoticiaController);

router.get('/noticias', getNoticiasController);

router.get('/noticias/:id', getNoticiaByIdController); // La dejamos pública por ahora

 router.put('/noticias/:id', authRequire, adminRequire, uploadNoticiaImage,handleMulterError,updateNoticiaController); // uploadNoticiaImage si se puede cambiar la imagen

 router.delete('/noticias/:id', authRequire, adminRequire,deleteNoticiaController);
 
export default router;