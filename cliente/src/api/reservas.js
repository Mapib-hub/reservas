import axios from './axios'; // Tu instancia de axios configurada

// Las rutas base para las reservas en tu API
const API_URL = 'api/reservas'; // Relativo al baseURL ('/api')

export const getReservasRequest = () => axios.get(API_URL);
export const getReservaRequest = (id) => axios.get(`${API_URL}/${id}`);
export const createReservaRequest = (reservaData) => axios.post(API_URL, reservaData);
export const updateReservaRequest = (id, reservaData) => axios.put(`${API_URL}/${id}`, reservaData);
export const deleteReservaRequest = (id) => axios.delete(`${API_URL}/${id}`);
// ... (código anterior en tu componente o donde llames a getDisponibilidadRequest)
export const getDisponibilidadRequest = (canchaId, fecha) => {
  console.log('Llamando a getDisponibilidadRequest con:', { canchaId, fecha }); // <-- Añade esto
  return axios.get('/api/disponibilidad', {
    params: {
      canchaId: canchaId,
      fecha: fecha
    }
  });
};
// ... (código posterior)

