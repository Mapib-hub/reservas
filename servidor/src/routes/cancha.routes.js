import { Router } from "express";
import { createCancha, getCanchas, getCancha, updateCancha, deleteCancha } from "../controllers/cancha.controller.js";
import { authRequire } from "../middlewares/validateToken.js";
import { adminRequire } from "../middlewares/adminRequire.js";
import { uploadCanchaImage } from "../middlewares/multer_cancha.js"; // Importamos el middleware de Multer para canchas

const router = Router();

    // Todas las rutas de gestión de canchas requieren ser administrador
    router.post('/canchas',authRequire, adminRequire, uploadCanchaImage, createCancha); // Añadimos uploadCanchaImage
    router.get('/canchas', getCanchas); // O solo authRequire si los usuarios pueden ver la lista
    router.get('/canchas/:id',getCancha); // O solo authRequire si los usuarios pueden ver detalles
    router.put('/canchas/:id',authRequire, adminRequire, uploadCanchaImage, updateCancha); // Añadimos uploadCanchaImage
    router.delete('/canchas/:id',authRequire, adminRequire, deleteCancha);

export default router;