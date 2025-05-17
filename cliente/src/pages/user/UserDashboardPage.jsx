// c:\Users\Acer\Desktop\proyectos\reservas\cliente\src\pages\user\UserDashboardPage.jsx
import React, { useEffect, useMemo } from 'react'; // Añadimos useEffect y useMemo
import { useReservas } from '../../context/ReservaContext'; // 1. Importamos useReservas
import { useAuth } from '../../context/AuthContext'; // Para mostrar el nombre del usuario
import { useCanchas } from '../../context/CanchasContext'; // Para obtener el nombre de la cancha
import { Link } from 'react-router-dom'; // Para el enlace a "Mis Reservas"

function UserDashboardPage() {
  const { user } = useAuth(); // Obtenemos el usuario para un saludo
  const { getCanchaNombre } = useCanchas(); // Para obtener el nombre de la cancha
  const { reservas, loading: loadingReservas, error: errorReservas } = useReservas(); // 2. Obtenemos las reservas y estados

  const proximasReservas = useMemo(() => {
    if (!reservas || reservas.length === 0) return [];

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día para comparar

    return reservas
      .filter(reserva => {
        const fechaReserva = new Date(reserva.fecha_reserva);
        // Considerar solo las reservas cuya fecha (ignorando la hora) es hoy o futura
        const fechaReservaNormalizada = new Date(Date.UTC(fechaReserva.getUTCFullYear(), fechaReserva.getUTCMonth(), fechaReserva.getUTCDate()));
        return fechaReservaNormalizada >= hoy;
      })
      .sort((a, b) => {
        const fechaA = new Date(a.fecha_reserva);
        const fechaB = new Date(b.fecha_reserva);
        if (fechaA.getTime() !== fechaB.getTime()) {
          return fechaA - fechaB; // Ordenar por fecha
        }
        // Si las fechas son iguales, ordenar por hora de inicio del bloque
        return (a.bloque_horario_id?.hora_inicio || '').localeCompare(b.bloque_horario_id?.hora_inicio || '');
      })
      .slice(0, 3); // Mostrar solo las próximas 3
  }, [reservas]);
//console.log(reservas);
  return (
    <div>
      {/* Log para depurar la fecha y próximas reservas */}
      {useEffect(() => {
        if (reservas && reservas.length > 0) {
         // console.log("Fechas de reserva recibidas en UserDashboardPage:", reservas.map(r => ({ id: r._id, fecha_original: r.fecha_reserva })));
         // console.log("Próximas reservas calculadas:", proximasReservas);
        }
      }, [reservas, proximasReservas])}

       <h2>Dashboard de {user?.username || 'Usuario'}</h2>
      <p>Bienvenido a tu panel personal. Aquí puedes ver un resumen de tu actividad.</p>

      <div style={{ marginTop: '30px' }}>
        <h3>Tus Próximas 3 Reservas:</h3>
        {loadingReservas && <p>Cargando tus reservas...</p>}
        {errorReservas && <p style={{ color: 'red' }}>Error al cargar reservas: {errorReservas}</p>}
        {!loadingReservas && !errorReservas && (
          proximasReservas.length > 0 ? (
            <ul>
              {proximasReservas.map((reserva) => (
                <li 
                  key={reserva._id} 
                  style={{ 
                    border: '1px solid #ddd',
                    padding: '15px', 
                    marginBottom: '15px', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                  <p><strong>Cancha:</strong> {getCanchaNombre(reserva.cancha_id) || 'No especificada'}</p>
                  <p><strong>Fecha:</strong> 
                    {(() => {
                      const utcDate = new Date(reserva.fecha_reserva);
                      // Usamos las 12:00 UTC para evitar problemas de cruce de día con toLocaleDateString
                      return new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(), 12, 0, 0)).toLocaleDateString();
                    })()}
                  </p>
                  <p><strong>Hora:</strong> {reserva.bloque_horario_id?.hora_inicio} - {reserva.bloque_horario_id?.hora_fin}</p>
                  <p><strong>Estado:</strong> {reserva.estado}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes próximas reservas programadas.</p>
          )
        )}
        {!loadingReservas && reservas.length > 0 && ( // Mostrar solo si hay reservas en total
            <Link to="/usuario/mis-reservas" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                Ver todas mis reservas
            </Link>
        )}
      </div>
    </div>
  );
}
export default UserDashboardPage;
