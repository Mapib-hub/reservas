import { Router } from "express";
import { createBloqueHorario, getBloquesHorarios, getBloqueHorario, updateBloqueHorario, deleteBloqueHorario } from "../controllers/bloqueHorario.controller.js";
    import { authRequire } from "../middlewares/validateToken.js";
    import { adminRequire } from "../middlewares/adminRequire.js";

const router = Router();

    // Todas las rutas de gestión de bloques horarios requieren ser administrador
    router.post('/bloqueshorarios', authRequire, adminRequire, createBloqueHorario);
    router.get('/bloqueshorarios', authRequire, adminRequire, getBloquesHorarios); // O solo authRequire
    router.get('/bloqueshorarios/:id', authRequire, adminRequire, getBloqueHorario); // O solo authRequire
    router.put('/bloqueshorarios/:id', authRequire, adminRequire, updateBloqueHorario);
    router.delete('/bloqueshorarios/:id', authRequire, adminRequire, deleteBloqueHorario);

export default router;
/**localhost:3000/api/disponibilidad?canchaId=681546d9436cd319690965dd&fecha=2024-07-30 */