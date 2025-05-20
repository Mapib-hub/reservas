import React, { useState, useEffect } from 'react';
import { useCanchas } from '../../context/CanchasContext'; // Para obtener las canchas
import { getDisponibilidadRequest } from '../../api/reservas'; // Para obtener disponibilidad
import { useReservas } from '../../context/ReservaContext'; // Para crear la reserva
import Swal from 'sweetalert2';

function HacerReservaPage() {
  const { canchas, loading: loadingCanchas } = useCanchas();
  const { createReserva } = useReservas();

  const [selectedCancha, setSelectedCancha] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // Para el bloque_horario_id

  // Preseleccionar la primera cancha si solo hay una o cuando cargan las canchas
  useEffect(() => {
    if (canchas.length > 0 && !selectedCancha) {
      setSelectedCancha(canchas[0]._id);
    }
  }, [canchas, selectedCancha]);

  // Obtener disponibilidad cuando la cancha o la fecha cambian
  useEffect(() => {
    if (selectedCancha && selectedDate) {
      fetchDisponibilidad();
    }
  }, [selectedCancha, selectedDate]);

  const fetchDisponibilidad = async () => {
    // Asegurarse de que hay cancha y fecha antes de llamar
    if (!selectedCancha || !selectedDate) {
      setAvailableSlots([]); // Limpiar si no hay cancha o fecha
      setSelectedSlot(null);
      return;
    }
    setLoadingSlots(true);
    setAvailableSlots([]); // Limpiar slots anteriores
    setSelectedSlot(null); // Limpiar slot seleccionado
    try {
      const formattedDate = selectedDate; // El input date ya da YYYY-MM-DD
      // Loguear los parámetros que se envían
      console.log('Solicitando disponibilidad con Cancha ID:', selectedCancha, 'y Fecha:', formattedDate);
      const res = await getDisponibilidadRequest(selectedCancha, formattedDate);      
      setAvailableSlots(res.data);
    } catch (error) {
      console.error("Error fetching disponibilidad:", error);
      let errorMessage = 'No se pudo cargar la disponibilidad.';
      if (error.response) {
        console.error("Respuesta del servidor (error):", error.response.data); // Loguea la respuesta completa del error del backend
        // Intentar obtener un mensaje más específico del backend
        if (typeof error.response.data === 'object' && error.response.data !== null && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string' && error.response.data.length > 0) {
          errorMessage = error.response.data; // Si el backend envía un string simple como error
        }
      }
      Swal.fire('Error', errorMessage, 'error');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleReservaSubmit = async () => {
    if (!selectedSlot || !selectedDate) {
      Swal.fire('Atención', 'Por favor, selecciona una cancha, fecha y horario.', 'warning');
      return;
    }
    try {
      await createReserva({
        bloque_horario_id: selectedSlot, // Este es el ID del bloque horario
        fecha_reserva: selectedDate,
        // El usuario_id se tomará del token en el backend
      });
      Swal.fire('¡Reserva Creada!', 'Tu reserva ha sido creada exitosamente.', 'success');
      // Limpiar campos o redirigir
      setSelectedSlot(null);
      setAvailableSlots([]);
      // Podrías querer resetear la fecha también o redirigir a "Mis Reservas"
    } catch (error) {
      console.error("Error al crear reserva:", error);
      Swal.fire('Error', error.response?.data?.message || 'No se pudo crear la reserva.', 'error');
      // Si falla la creación, es buena idea refrescar la disponibilidad
      // por si el slot se ocupó mientras tanto o hubo otro problema.
      fetchDisponibilidad(); 
    }
  };

  return (
    <div className="hacer-reserva-page">
      <h2>Hacer una Reserva</h2>
      
      <div className="form-group-reserva">
        <label htmlFor="cancha">Selecciona una Cancha:</label>
        <select id="cancha" value={selectedCancha} onChange={(e) => setSelectedCancha(e.target.value)} disabled={loadingCanchas || canchas.length <= 1}>
          {canchas.length === 0 && !loadingCanchas && <option>No hay canchas disponibles</option>}
          {canchas.map(cancha => (
            <option key={cancha._id} value={cancha._id}>{cancha.nombre}</option>
          ))}
        </select>
      </div>

      <div className="form-group-reserva">
        <label htmlFor="fecha">Selecciona una Fecha:</label>
        <input type="date" id="fecha" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      {loadingSlots && <p className="loading-message">Buscando horarios disponibles...</p>}
      {!loadingSlots && availableSlots.length > 0 && (
        <div className="form-group-reserva">
          <h3>Horarios Disponibles:</h3>
          <div className="available-slots-grid">
            {availableSlots.map(slot => (
              <button
                key={slot._id}
                onClick={() => setSelectedSlot(slot._id)}
                className={`slot-button ${selectedSlot === slot._id ? 'selected' : ''}`}
              >
                {slot.hora_inicio} - {slot.hora_fin}
              </button>
            ))}
          </div>
        </div>
      )}
      {!loadingSlots && selectedCancha && selectedDate && availableSlots.length === 0 && (
        <p className="no-slots-message">No hay horarios disponibles para la cancha y fecha seleccionada.</p>
      )}

      {selectedSlot && selectedDate && selectedCancha && (
        <button 
          onClick={handleReservaSubmit} 
          className="confirm-reserva-button">
          Confirmar Reserva
        </button>
      )}
    </div>
  );
}
export default HacerReservaPage;