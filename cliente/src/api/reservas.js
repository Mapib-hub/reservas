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
  console.log('Llamando a getDisponibilidadRequest con:', { canchaId, fecha });
  // WORKAROUND: Usar URL absoluta para evitar problemas con el proxy/backend y la pérdida de parámetros.
  // Idealmente, esto se configuraría globalmente o vendría de una variable de entorno.
  // Asegúrate de que esta IP y puerto sean los correctos para tu entorno de desarrollo/producción.
  const backendUrl = 'http://100.107.48.58:8087/api'; // O process.env.VITE_API_BASE_URL si usas Vite

  return axios.get(`${backendUrl}/api/disponibilidad`, { // URL absoluta
    params: {
      canchaId: canchaId,
      fecha: fecha
    }
  });
};

// Nueva función para consultar disponibilidad usando POST
export const consultarDisponibilidadRequestPOST = (canchaId, fecha) => {
  console.log('Consultando disponibilidad (POST) con:', { canchaId, fecha });
  // Asegúrate de que esta IP y puerto sean los correctos para tu backend.
  // Esta URL apunta a /api/disponibilidad en tu servidor.
  const targetUrl = 'http://100.107.48.58:8087/api/api/disponibilidad'; 

  return axios.post(targetUrl, { // axios.post para enviar datos en el cuerpo
    canchaId: canchaId, // Enviamos canchaId en el cuerpo
    fecha: fecha        // Enviamos fecha en el cuerpo
  });
};
