import { getDisponibilidad } from '../services/disponibilidadService.js';

export const consultarDisponibilidad = async (req, res) => {
    // Extraemos los parámetros de la query string de la URL
    // Ejemplo: /api/disponibilidad?canchaId=60f...&fecha=2024-07-28
    const { canchaId, fecha } = req.query;

    // Validación básica de parámetros
    if (!canchaId || !fecha) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos: canchaId y fecha.' });
    }

    // Podríamos añadir validación de formato para la fecha aquí si quisiéramos

    try {
        // Llamamos a nuestro servicio para obtener la disponibilidad
        const bloquesDisponibles = await getDisponibilidad(canchaId, fecha);

        // Enviamos la respuesta con los bloques encontrados
        res.json(bloquesDisponibles);

    } catch (error) {
        console.error('Error al consultar disponibilidad:', error);
        res.status(500).json({ message: 'Error interno del servidor al consultar disponibilidad.' });
    }
};