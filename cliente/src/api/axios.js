import axios from "axios";

const instance = axios.create({
   // baseURL: 'http://localhost:3000',
    baseURL: '/api',
    withCredentials: true, // Importante si manejas sesiones/cookies con el backend
});

// Interceptor para depuración (opcional, pero útil para este caso)
instance.interceptors.request.use(config => {
    console.log('Enviando solicitud a:', config.url);
    if (config.params) {
        console.log('Con parámetros:', config.params);
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;