import React from 'react';
import { useBloqueHorarios } from '../../context/BloqueHorariosContext.jsx'; // Importamos el hook del contexto
import { useCanchas } from '../../context/CanchasContext.jsx'; // Para obtener nombres de canchas
import { Link } from 'react-router-dom'; // Para los enlaces de crear y editar
import HorariosGlobales from "../../components/admin/HorariosGlobales.jsx";
const HorariosPage = () => {
  const { bloqueHorarios, loading, error, deleteBloqueHorario } = useBloqueHorarios();
  // Asumimos que useCanchas también podría devolver un error, lo capturamos.
  const { canchas, loading: loadingCanchas, error: errorCanchas } = useCanchas();

  // Función para obtener el nombre de la cancha a partir de su ID
 const getNombreCancha = (canchaData) => {
  if (!canchaData) return 'Sin cancha asignada';

  // Si viene como objeto con nombre
  if (typeof canchaData === 'object' && canchaData.nombre) {
    return canchaData.nombre;
  }

  // Si viene como string (ID)
  if (typeof canchaData === 'string') {
    const canchaEncontrada = canchas.find(c => c._id === canchaData);
    if (canchaEncontrada) return canchaEncontrada.nombre;
  }

  return 'Desconocida';
};


  if (loading || loadingCanchas) return <p>Cargando horarios y canchas...</p>;
  if (error) return <p style={{ color: 'red' }}>Error al cargar horarios: {error}</p>;
  // Si hay un error cargando canchas, también lo mostramos.
  if (errorCanchas) return <p style={{ color: 'red' }}>Error al cargar canchas: {typeof errorCanchas === 'string' ? errorCanchas : (errorCanchas.message || "Error desconocido al cargar canchas")}</p>;
 //console.log(bloqueHorarios);
 const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const getNombreDia = (numeroDia) => {
  return diasSemana[numeroDia] || 'Día desconocido';
};

  return (
  <div>
    <h2>Gestión de Horarios</h2>
    <p>Aquí se administrarán los horarios (CRUD).</p>

    <h3>Vista Global de Horarios Disponibles</h3>
    <HorariosGlobales bloques={bloqueHorarios} />

    <h2>Gestión de Bloques de Horarios</h2>
    <Link to="/admin/horarios/nuevo" className="button-crear">
      Crear Nuevo Bloque de Horario
    </Link>

    {bloqueHorarios.length === 0 ? (
      <p>No hay bloques de horarios para mostrar.</p>
    ) : (
      <div className="table-responsive-container">
        <table>
          <thead>
            <tr>
              <th>Día de la Semana</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Cancha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bloqueHorarios.map((bh) => (
              <tr key={bh._id}>
                <td>{getNombreDia(bh.dia_semana)}</td>
                <td>{bh.hora_inicio}</td>
                <td>{bh.hora_fin}</td>
                <td>{getNombreCancha(bh.cancha_id)}</td>
                <td> 
                  <Link to={`/admin/horarios/editar/${bh._id}`} className="button-editar">Editar</Link>
                  <button onClick={() => deleteBloqueHorario(bh._id)} className="button-eliminar">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
};

 export default HorariosPage;