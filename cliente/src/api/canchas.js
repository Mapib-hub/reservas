import axiosInstance from "./axios"; // Importamos nuestra instancia configurada

// Funciones para interactuar con la API de Canchas

export const getCanchasRequest = () => axiosInstance.get('/api/canchas');

export const getCanchaRequest = (id) => axiosInstance.get(`/api/canchas/${id}`);

export const createCanchaRequest = (cancha) => axiosInstance.post('/api/canchas', cancha);

export const updateCanchaRequest = (id, cancha) => axiosInstance.put(`/api/canchas/${id}`, cancha);

export const deleteCanchaRequest = (id) => axiosInstance.delete(`/api/canchas/${id}`);