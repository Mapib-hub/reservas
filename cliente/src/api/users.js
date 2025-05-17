import axiosInstance from "./axios"; // Importamos nuestra instancia configurada

// Funciones para interactuar con la API de Usuarios

export const getUsersRequest = () => axiosInstance.get('/users');

export const getUserRequest = (id) => axiosInstance.get(`/users/${id}`);

export const createUserRequest = (user) => axiosInstance.post('/users', user);

export const updateUserRequest = (id, user) => axiosInstance.put(`/users/${id}`, user);

export const deleteUserRequest = (id) => axiosInstance.delete(`/users/${id}`);