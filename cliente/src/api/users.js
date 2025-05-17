import axiosInstance from "./axios"; // Importamos nuestra instancia configurada

// Funciones para interactuar con la API de Usuarios

export const getUsersRequest = () => axiosInstance.get('/api/users');

export const getUserRequest = (id) => axiosInstance.get(`/api/users/${id}`);

export const createUserRequest = (user) => axiosInstance.post('/api/users', user);

export const updateUserRequest = (id, user) => axiosInstance.put(`/api/users/${id}`, user);

export const deleteUserRequest = (id) => axiosInstance.delete(`/api/users/${id}`);