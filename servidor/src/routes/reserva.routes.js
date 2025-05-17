import { Router } from "express";
import { createReserva, getReservas, getReserva, updateReserva, deleteReserva } from "../controllers/reserva.controller.js";
import { authRequire } from "../middlewares/validateToken.js";
//import { validateSchema } from "../middlewares/validator.middleware.js";
//import { createReservaSchema } from "../schemas/reserva.schema.js";
import { canManageReservation } from "../middlewares/canManageReservation.js";

const router = Router();

// Todas las rutas de reservas requieren autenticación
router.post('/reservas', authRequire, createReserva);
router.get('/reservas', authRequire, getReservas);
router.get('/reservas/:id', authRequire, getReserva);

// Para actualizar y eliminar, además de autenticación, se verifica si el usuario puede gestionar esa reserva específica
router.put("/reservas/:id", authRequire, canManageReservation, updateReserva);
router.delete("/reservas/:id", authRequire, canManageReservation, deleteReserva);

export default router;