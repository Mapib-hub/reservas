import axiosInstance from "./axios"; // Importamos nuestra instancia configurada de Axios

// Función para el login
export const loginRequest = (user) => axiosInstance.post(`/login`, user);

// Función para verificar el token/sesión (si el backend tiene este endpoint)
export const verifyTokenRequest = () => axiosInstance.get(`/verify`);

// Función para el logout (si el backend tiene un endpoint específico para invalidar sesión/token)
// export const logoutRequest = () => axiosInstance.post(`/logout`);

// Podrías añadir registerRequest si fuera necesario para el admin