import axiosInstance from "./axios"; // Importamos nuestra instancia configurada

// Funciones para interactuar con la API de Canchas

export const getCanchasRequest = () => axiosInstance.get('/canchas');

export const getCanchaRequest = (id) => axiosInstance.get(`/canchas/${id}`);

export const createCanchaRequest = (cancha) => axiosInstance.post('/canchas', cancha);

export const updateCanchaRequest = (id, cancha) => axiosInstance.put(`/canchas/${id}`, cancha);

export const deleteCanchaRequest = (id) => axiosInstance.delete(`/canchas/${id}`);