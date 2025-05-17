import { Router } from "express";
import { createExcepcion, getExcepciones, getExcepcion, updateExcepcion, deleteExcepcion } from "../controllers/excepcion.controller.js";
import { authRequire } from "../middlewares/validateToken.js"; // Middleware para verificar autenticación
import { adminRequire } from "../middlewares/adminRequire.js"; // Middleware para verificar rol de admin

const router = Router();

// Todas las rutas de excepciones requerirán autenticación y rol de administrador

router.post('/excepciones', authRequire, adminRequire, createExcepcion);
router.get('/excepciones', authRequire, adminRequire, getExcepciones);
router.get('/excepciones/:id', authRequire, adminRequire, getExcepcion);
router.put('/excepciones/:id', authRequire, adminRequire, updateExcepcion);
router.delete('/excepciones/:id', authRequire, adminRequire, deleteExcepcion);


export default router;