import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3000/api', // Asegúrate que esta sea la URL base correcta de tu backend
    withCredentials: true, // Importante si manejas sesiones/cookies con el backend
});

export default instance;