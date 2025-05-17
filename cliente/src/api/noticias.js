import axiosInstance from "./axios"; // Importamos nuestra instancia configurada

export const getNoticiasRequest = () => axiosInstance.get(`/api/noticias`);

// Podrías añadir más funciones aquí en el futuro, como:
 export const getNoticiaRequest = (id) => axiosInstance.get(`/noticias/${id}`);
 export const createNoticiaRequest = (noti) => axiosInstance.post(`/noticias`, noti);
 export const deleteNoticiaRequest = (id) => axiosInstance.delete(`/noticias/${id}`);
 export const updateNoticiaRequest = (id, noti) => axiosInstance.put(`/noticias/${id}`, noti);