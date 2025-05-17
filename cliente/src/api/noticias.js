import axiosInstance from "./axios"; // Importamos nuestra instancia configurada

export const getNoticiasRequest = () => axiosInstance.get(`/api/noticias`);
// Podrías añadir más funciones aquí en el futuro, como:
 export const getNoticiaRequest = (id) => axiosInstance.get(`/api/noticias/${id}`);
 export const createNoticiaRequest = (noti) => axiosInstance.post(`/api/noticias`, noti);
 export const deleteNoticiaRequest = (id) => axiosInstance.delete(`/api/noticias/${id}`);
 export const updateNoticiaRequest = (id, noti) => axiosInstance.put(`/api/noticias/${id}`, noti);