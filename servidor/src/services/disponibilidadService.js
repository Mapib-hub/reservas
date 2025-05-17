// Esto es un ejemplo conceptual para tu c:\Users\Acer\Desktop\proyectos\reservas\servidor\src\services\disponibilidadService.js
import BloqueHorario from "../models/bloqueHorario.model.js";
import Reserva from "../models/reserva.model.js";
import Excepcion from "../models/excepcion.model.js";

export const getDisponibilidad = async (canchaId, fechaStr) => {
    const fechaConsultaUtc = new Date(Date.UTC(
        parseInt(fechaStr.substring(0, 4)),
        parseInt(fechaStr.substring(5, 7)) - 1, // Mes es 0-indexado
        parseInt(fechaStr.substring(8, 10)),
        0, 0, 0, 0
    ));
    const diaSemana = fechaConsultaUtc.getUTCDay();

    // 1. Obtener bloques base para la cancha y día
    const bloquesBase = await BloqueHorario.find({
        cancha_id: canchaId,
        dia_semana: diaSemana,
        activo: true
    }).lean(); // .lean() para objetos JS planos, más rápido si no necesitas métodos de Mongoose

    if (!bloquesBase.length) return [];

    const bloquesDisponibles = [];

    for (const bloque of bloquesBase) {
        // 2. Verificar si ya hay una reserva para este bloque y fecha
        const reservaExistente = await Reserva.findOne({
            bloque_horario_id: bloque._id,
            fecha_reserva: fechaConsultaUtc,
            estado: { $in: ['CONFIRMADA', 'PENDIENTE'] } // Estados que ocupan el slot
        });

        if (reservaExistente) {
            continue; // Ocupado por reserva, saltar este bloque
        }

        // 3. Verificar excepciones
        const fechaFinDiaUtc = new Date(fechaConsultaUtc);
        fechaFinDiaUtc.setUTCHours(23, 59, 59, 999);

        const excepcionAplicable = await Excepcion.findOne({
            fecha_inicio: { $lte: fechaFinDiaUtc },
            fecha_fin: { $gte: fechaConsultaUtc },
            $or: [
                { bloque_horario_id: bloque._id },
                { cancha_id: canchaId, bloque_horario_id: null },
                { cancha_id: null, bloque_horario_id: null }
            ],
            tipo: 'NO_DISPONIBLE' // O el tipo que uses para bloquear
        });

        if (excepcionAplicable) {
            continue; // Ocupado por excepción, saltar este bloque
        }

        // Si llegó hasta aquí, el bloque está disponible
        bloquesDisponibles.push({
            _id: bloque._id, // Necesario para la reserva
            hora_inicio: bloque.hora_inicio,
            hora_fin: bloque.hora_fin,
            // Puedes añadir más campos si el frontend los necesita para mostrar
        });
    }

    return bloquesDisponibles.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
};
