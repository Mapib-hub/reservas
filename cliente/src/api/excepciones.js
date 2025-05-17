import axios from './axios'; // Tu instancia de axios configurada

// Las rutas base para las excepciones en tu API
const API_URL = '/api/excepciones';

export const getExcepcionesRequest = () => axios.get(API_URL);
export const getExcepcionRequest = (id) => axios.get(`${API_URL}/${id}`);
export const createExcepcionRequest = (excepcionData) => axios.post(API_URL, excepcionData);
export const updateExcepcionRequest = (id, excepcionData) => axios.put(`${API_URL}/${id}`, excepcionData);
export const deleteExcepcionRequest = (id) => axios.delete(`${API_URL}/${id}`);