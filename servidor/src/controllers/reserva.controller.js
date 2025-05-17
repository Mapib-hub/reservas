import Reserva from "../models/reserva.model.js";
import BloqueHorario from "../models/bloqueHorario.model.js";
import Excepcion from "../models/excepcion.model.js";
import mongoose from "mongoose";

// --- Función Auxiliar para verificar disponibilidad ---
async function verificarDisponibilidad(bloque_horario_id, fecha_reserva_iso) {
    const fecha = new Date(fecha_reserva_iso);
    fecha.setUTCHours(0, 0, 0, 0); // Normalizar a inicio del día UTC para comparar

    // 1. Verificar si el bloque existe y está activo
    const bloque = await BloqueHorario.findById(bloque_horario_id);
    if (!bloque || !bloque.activo) {
        return { disponible: false, motivo: "Bloque horario no existe o no está activo." };
    }

    // 2. Verificar si ya existe una reserva para ese bloque en esa fecha
    const reservaExistente = await Reserva.findOne({
        bloque_horario_id: bloque._id,
        fecha_reserva: fecha,
        estado: 'Confirmada' // O considerar 'Pendiente' también si aplica
    });
    if (reservaExistente) {
        return { disponible: false, motivo: "El bloque ya está reservado para esta fecha." };
    }

    // 3. Verificar si hay una excepción que afecte a este bloque en esa fecha
    const fechaFinDia = new Date(fecha);
    fechaFinDia.setUTCHours(23, 59, 59, 999); // Fin del día UTC

    const excepcionAplicable = await Excepcion.findOne({
        fecha_inicio: { $lte: fechaFinDia }, // La excepción empieza antes o el mismo día
        fecha_fin: { $gte: fecha },       // La excepción termina después o el mismo día
        $or: [
            { bloque_horario_id: bloque._id }, // Excepción específica para este bloque
            { cancha_id: bloque.cancha_id, bloque_horario_id: null }, // Excepción para toda la cancha ese día
            { cancha_id: null, bloque_horario_id: null } // Excepción global para todas las canchas ese día
        ],
        tipo: 'NO_DISPONIBLE' // O cualquier otro tipo que signifique bloqueo
    });

    if (excepcionAplicable) {
        return { disponible: false, motivo: `No disponible debido a excepción: ${excepcionAplicable.descripcion || excepcionAplicable.tipo}` };
    }

    // Si pasó todas las verificaciones, está disponible
    return { disponible: true, motivo: "Disponible", cancha_id: bloque.cancha_id };
}

// --- Controlador para Crear Reserva ---
export const createReserva = async (req, res) => {
    const { bloque_horario_id, fecha_reserva: fecha_reserva_str, estado } = req.body; // Añadimos 'estado'
    const usuario_id = req.user.id; // authRequire añade 'user' con 'id' (string del _id) a 'req'

    if (!bloque_horario_id || !fecha_reserva_str) {
        return res.status(400).json({ message: "Faltan datos: bloque_horario_id y fecha_reserva (YYYY-MM-DD) son requeridos en el cuerpo de la solicitud." });
    }

    // Validar y preparar la fecha para guardar
    // Se espera que fecha_reserva_str sea un string como "YYYY-MM-DD"
    const dateParts = fecha_reserva_str.split('-');
    if (dateParts.length !== 3 || isNaN(parseInt(dateParts[0])) || isNaN(parseInt(dateParts[1])) || isNaN(parseInt(dateParts[2]))) {
        return res.status(400).json({ message: "El formato de fecha_reserva no es válido. Use YYYY-MM-DD." });
    }
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]); // 1-12
    const day = parseInt(dateParts[2]);
    const fechaParaGuardar = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Mes es 0-indexado en Date.UTC

    try {
        // verificarDisponibilidad maneja la normalización de la fecha a partir del string
        const disponibilidad = await verificarDisponibilidad(bloque_horario_id, fecha_reserva_str);

        if (!disponibilidad.disponible) {
            return res.status(409).json({ message: "Horario no disponible.", motivo: disponibilidad.motivo }); // 409 Conflict
        }

        const nuevaReserva = new Reserva({
            usuario_id,
            bloque_horario_id,
            cancha_id: disponibilidad.cancha_id, // Obtenido de la verificación
            fecha_reserva: fechaParaGuardar, // Guardar la fecha normalizada a UTC 00:00:00.000Z
            estado: estado || 'CONFIRMADA' // Usamos el estado del body, o 'CONFIRMADA' como fallback/default
        });

        const reservaGuardada = await nuevaReserva.save();
        res.status(201).json(reservaGuardada);

    } catch (error) {
        console.error("Error al crear reserva:", error);
        // Manejar error de índice único (doble reserva)
        if (error.code === 11000) {
            return res.status(409).json({ message: "Error: Este bloque ya fue reservado para esta fecha (doble intento)." });
        }
        res.status(500).json({ message: "Error interno al crear la reserva", error: error.message });
    }
};

// --- Controlador para Obtener Reservas (Ejemplo básico) ---
export const getReservas = async (req, res) => {
    try {
        let query = {}; // Objeto de consulta inicial vacío

        // Verificar el rol del usuario para filtrar las reservas
        // req.user es establecido por el middleware authRequire
        if (req.user.role === 'user') {
            query.usuario_id = req.user.id; // Si es 'user', filtrar por su ID
        }
        // Si es 'admin', query permanece vacío ({}). Reserva.find({}) obtiene todos los documentos.

        //console.log(`Fetching reservas. User role: ${req.user.role}, User ID: ${req.user.id}. Query:`, query);

        const reservas = await Reserva.find(query) // Aplicar el filtro
            .populate('usuario_id', 'username email')
            .populate({
                path: 'bloque_horario_id',
                populate: { path: 'cancha_id', select: 'nombre' }
            });
           // console.log("Reservas obtenidas:", reservas);
        res.json(reservas);
    } catch (error) {
        console.error("Error en getReservas controller:", error);
        res.status(500).json({ message: "Error al obtener las reservas", error: error.message });
    }
};
// Obtener una reserva específica por ID
export const getReserva = async (req, res) => {
    try {
        const reservaId = req.params.id;
        const reserva = await Reserva.findById(reservaId)
            .populate('usuario_id', 'username email') // Muestra username y email del usuario
            .populate({
                path: 'cancha_id',
                select: 'nombre descripcion', // Muestra nombre y descripción de la cancha
            })
            .populate({
                path: 'bloque_horario_id',
                select: 'dia_semana hora_inicio hora_fin', // Muestra detalles del bloque horario
            });

        if (!reserva) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }
        res.json(reserva);
    } catch (error) {
        console.error("Error al obtener reserva:", error);
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de reserva inválido" });
        res.status(500).json({ message: "Error interno al obtener la reserva", error: error.message });
    }
};
// Actualizar una reserva existente por ID
export const updateReserva = async (req, res) => {
    try {
        const reservaId = req.params.id;
        const datosActualizar = req.body;

        // Si se está actualizando la fecha_reserva, normalizarla a UTC 00:00:00.000Z
        if (datosActualizar.fecha_reserva && typeof datosActualizar.fecha_reserva === 'string') {
            const dateParts = datosActualizar.fecha_reserva.split('-');
            if (dateParts.length === 3 && !isNaN(parseInt(dateParts[0])) && !isNaN(parseInt(dateParts[1])) && !isNaN(parseInt(dateParts[2]))) {
                const year = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]); // 1-12
                const day = parseInt(dateParts[2]);
                datosActualizar.fecha_reserva = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Mes es 0-indexado
            } else {
                // Si el formato no es YYYY-MM-DD, podríamos devolver un error o no actualizar la fecha.
                return res.status(400).json({ message: "El formato de fecha_reserva para actualizar no es válido. Use YYYY-MM-DD." });
            }
        }

        // Encuentra y actualiza la reserva.
        // { new: true } devuelve el documento actualizado.
        // runValidators: true asegura que las validaciones del esquema se ejecuten.
        const reservaActualizada = await Reserva.findByIdAndUpdate(
            reservaId,
            datosActualizar,
            { new: true, runValidators: true }
        )
        .populate('usuario_id', 'username email')
        .populate({
            path: 'cancha_id',
            select: 'nombre descripcion',
        })
        .populate({
            path: 'bloque_horario_id',
            select: 'dia_semana hora_inicio hora_fin',
        });

        if (!reservaActualizada) {
            return res.status(404).json({ message: "Reserva no encontrada para actualizar" });
        }
        res.json(reservaActualizada);
    } catch (error) {
        console.error("Error al actualizar reserva:", error);
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de reserva inválido" });
        if (error.name === 'ValidationError') return res.status(400).json({ message: "Error de validación al actualizar", errors: error.errors });
        res.status(500).json({ message: "Error interno al actualizar la reserva", error: error.message });
    }
};
// Eliminar una reserva por ID
export const deleteReserva = async (req, res) => {
    try {
        const reservaId = req.params.id;
        const reservaEliminada = await Reserva.findByIdAndDelete(reservaId);

        if (!reservaEliminada) {
            return res.status(404).json({ message: "Reserva no encontrada para eliminar" });
        }

        // Puedes devolver un 204 (No Content) o un 200 con un mensaje.
        // res.sendStatus(204); 
        res.json({ message: "Reserva eliminada correctamente", reserva: reservaEliminada }); // Opcional: devolver la reserva eliminada

    } catch (error) {
        console.error("Error al eliminar reserva:", error);
        if (error.name === 'CastError') return res.status(400).json({ message: "ID de reserva inválido" });
        res.status(500).json({ message: "Error interno al eliminar la reserva", error: error.message });
    }
};
