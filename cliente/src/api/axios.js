import axios from "axios";

const instance = axios.create({
    //baseURL: 'http://localhost:3000/api',
    baseURL: '/api',
    withCredentials: true, // Importante si manejas sesiones/cookies con el backend
});

export default instance;