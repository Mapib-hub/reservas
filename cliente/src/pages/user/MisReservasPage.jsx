import React from 'react';
import { useReservas } from '../../context/ReservaContext'; // Importamos useReservas
import { useCanchas } from '../../context/CanchasContext'; // Para obtener el nombre de la cancha

function MisReservasPage() {
  const { reservas, loading: loadingReservas, error: errorReservas, cancelUserReserva } = useReservas(); // Añadimos cancelUserReserva
  const { getCanchaNombre } = useCanchas(); // Para obtener el nombre de la cancha

  return (
    <div>
      <h2>Mis Reservas</h2>
      <p>Aquí puedes ver el historial completo de tus reservas.</p>

      {loadingReservas && <p>Cargando tus reservas...</p>}
      {errorReservas && <p style={{ color: 'red' }}>Error al cargar reservas: {errorReservas}</p>}
      {!loadingReservas && !errorReservas && (
        reservas.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}> {/* Quitamos los puntos de la lista */}
            {reservas.map((reserva) => (
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
                    return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate()).toLocaleDateString();
                  })()}
                </p>
                <p><strong>Hora:</strong> {reserva.bloque_horario_id?.hora_inicio} - {reserva.bloque_horario_id?.hora_fin}</p>
                <p><strong>Estado:</strong> {reserva.estado}</p>
                {/* Botón para cancelar la reserva por el usuario */}
                {(reserva.estado === 'PENDIENTE' || reserva.estado === 'CONFIRMADA') && (
                  <button 
                    onClick={() => cancelUserReserva(reserva._id)}
                    style={{ 
                      marginTop: '10px', 
                      padding: '8px 12px', 
                      backgroundColor: '#dc3545', // Rojo
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer' }}>
                    Cancelar Mi Reserva
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes ninguna reserva registrada.</p>
        )
      )}
    </div>
  );
}

export default MisReservasPage;