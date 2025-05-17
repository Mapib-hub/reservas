import axiosInstance from "./axios"; // Importamos nuestra instancia configurada

// Funciones para interactuar con la API de Bloques de Horarios

export const getBloqueHorariosRequest = () => axiosInstance.get('/api/bloqueshorarios');

export const getBloqueHorarioRequest = (id) => axiosInstance.get(`/api/bloqueshorarios/${id}`);

export const createBloqueHorarioRequest = (bloqueHorario) => axiosInstance.post('/api/bloqueshorarios', bloqueHorario);

export const updateBloqueHorarioRequest = (id, bloqueHorario) => axiosInstance.put(`/api/bloqueshorarios/${id}`, bloqueHorario);

export const deleteBloqueHorarioRequest = (id) => axiosInstance.delete(`/api/bloqueshorarios/${id}`);