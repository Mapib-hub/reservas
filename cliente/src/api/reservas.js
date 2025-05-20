import axios from './axios'; // Tu instancia de axios configurada

// Las rutas base para las reservas en tu API
const API_URL = '/api/reservas';

export const getReservasRequest = () => axios.get(API_URL);
export const getReservaRequest = (id) => axios.get(`${API_URL}/${id}`);
export const createReservaRequest = (reservaData) => axios.post(API_URL, reservaData);
export const updateReservaRequest = (id, reservaData) => axios.put(`${API_URL}/${id}`, reservaData);
export const deleteReservaRequest = (id) => axios.delete(`${API_URL}/${id}`);
export const getDisponibilidadRequest = (canchaId, fecha) => 
    axios.get(`/disponibilidad?canchaId=${canchaId}&fecha=${fecha}`); // Corregido: cancha_id a canchaId
