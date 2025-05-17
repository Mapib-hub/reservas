import { Router } from 'express';
import { consultarDisponibilidad } from '../controllers/disponibilidad.controller.js';
// Podríamos añadir middlewares de autenticación aquí si fuera necesario en el futuro

const router = Router();

// Definimos la ruta GET raíz para este conjunto de rutas
router.get('/', consultarDisponibilidad);

export default router;