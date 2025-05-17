import axiosInstance from "./axios"; // Importamos nuestra instancia configurada

// Funciones para interactuar con la API de Bloques de Horarios

export const getBloqueHorariosRequest = () => axiosInstance.get('/bloqueshorarios');

export const getBloqueHorarioRequest = (id) => axiosInstance.get(`/bloqueshorarios/${id}`);

export const createBloqueHorarioRequest = (bloqueHorario) => axiosInstance.post('/bloqueshorarios', bloqueHorario);

export const updateBloqueHorarioRequest = (id, bloqueHorario) => axiosInstance.put(`/bloqueshorarios/${id}`, bloqueHorario);

export const deleteBloqueHorarioRequest = (id) => axiosInstance.delete(`/bloqueshorarios/${id}`);