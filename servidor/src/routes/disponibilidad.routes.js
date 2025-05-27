import { Router } from 'express';
import { consultarDisponibilidad, consultarDisponibilidad2 } from '../controllers/disponibilidad.controller.js';
// Podríamos añadir middlewares de autenticación aquí si fuera necesario en el futuro

const router = Router();

// Definimos la ruta GET raíz para este conjunto de rutas
router.get('/disponibilidad', consultarDisponibilidad);
router.post('/disponibilidad', consultarDisponibilidad2);

export default router;  