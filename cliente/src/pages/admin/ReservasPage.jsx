import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReservas } from '../../context/ReservaContext';
import { useCanchas } from '../../context/CanchasContext';
import { useBloqueHorarios } from '../../context/BloqueHorariosContext';
import { useUsers } from '../../context/UsersContext'; // Para obtener nombres de usuarios
import { formatDate } from '../../utils/formatDate';
import Swal from 'sweetalert2';

const ReservasPage = () => {
    const { reservas, loading, error, fetchReservas, cancelReserva, updateReserva } = useReservas(); // Cambiado deleteReserva por cancelReserva
    const { canchas, getCanchaNombre } = useCanchas(); // Importamos canchas también para depurar
    const { bloqueHorarios, getBloqueHorarioDetalles } = useBloqueHorarios(); // Importamos bloqueHorarios también
    const { users, getUserName } = useUsers(); // Importamos users también


    // useEffect(() => {
    //     // El provider ya carga las reservas al inicio.
    //     // Podrías llamar a fetchReservas() aquí si necesitas recargar explícitamente.
    // }, []);

    if (loading) return <p>Cargando reservas...</p>;
    if (error) return <p className="text-danger">Error al cargar reservas: {error}</p>;
console.log(reservas);
    return (
        <div className="admin-page-container p-3">
            <h2 className="text-center mb-4">Gestión de Reservas</h2>
            <Link to="/admin/reservas/nueva" className="button-crear mb-3">
                Crear Nueva Reserva
            </Link>

            {reservas.length === 0 ? (
                <p>No hay reservas creadas todavía.</p>
            ) : (
                <div className="table-responsive-container">
                    <table className="admin-main-content table"><thead>
                            <tr>
                                <th>Fecha Reserva</th>
                                <th>Cancha</th>
                                <th>Horario</th>
                                <th>Usuario</th>
                                <th>Estado</th>
                                <th>Notas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody> 
                            {reservas.map((res) => {
                                // Aseguramos pasar el ID del bloque horario, no el objeto completo
                                const idDelBloque = typeof res.bloque_horario_id === 'object' && res.bloque_horario_id !== null
                                    ? res.bloque_horario_id._id
                                    : res.bloque_horario_id;
                                const bloqueDetalles = getBloqueHorarioDetalles(idDelBloque);
                                // --- INICIO CONSOLE LOGS PARA DEPURAR ---
                                if (!bloqueDetalles) {
                                  //  console.log(`No se encontraron detalles para bloque_horario_id: ${res.bloque_horario_id}`, 'Reserva:', res);
                                 //   console.log('Bloques horarios disponibles en contexto:', bloqueHorarios);
                                }
                                // --- FIN CONSOLE LOGS ---
                                return (
                                    <tr key={res._id}>
                                        <td>{formatDate(res.fecha_reserva)}</td>
                                        <td>{getCanchaNombre(res.cancha_id)}</td>
                                        <td>{bloqueDetalles ? `${bloqueDetalles.hora_inicio} - ${bloqueDetalles.hora_fin}` : 'N/A'}</td>
                                        {/* Ajuste para el nombre de usuario, por si usuario_id es un objeto */}
                                        <td>{getUserName(typeof res.usuario_id === 'object' && res.usuario_id !== null ? res.usuario_id._id : res.usuario_id)}</td>
                                        <td>{res.estado}</td>
                                        <td>{res.notas_adicionales || '-'}</td>
                                        <td>
                                            <Link to={`/admin/reservas/editar/${res._id}`} className="button-editar me-2">Editar</Link>
                                            {res.estado !== 'CANCELADA_ADMIN' && res.estado !== 'CANCELADA_USUARIO' && res.estado !== 'COMPLETADA' && res.estado !== 'NO_ASISTIO' && (
                                                <button onClick={() => cancelReserva(res._id)} className="button-eliminar">Cancelar</button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReservasPage;