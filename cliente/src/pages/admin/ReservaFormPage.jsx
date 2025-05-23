import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReservas } from '../../context/ReservaContext';
import { useCanchas } from '../../context/CanchasContext';
import { useBloqueHorarios } from '../../context/BloqueHorariosContext';
import { useUsers } from '../../context/UsersContext';
import { useExcepciones } from '../../context/ExcepcionContext'; // Para verificar excepciones
import Swal from 'sweetalert2'; // 1. Importar SweetAlert2

// Opciones para el estado de la reserva, basadas en el enum del modelo
const estadosReserva = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA_USUARIO', 'CANCELADA_ADMIN', 'COMPLETADA', 'NO_ASISTIO'];
const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const ReservaFormPage = () => {
    const { id } = useParams(); // Para el modo edición
    const navigate = useNavigate();
    const { createReserva, getReserva, updateReserva, reservas: todasLasReservas } = useReservas();
    const { canchas } = useCanchas();
    const { bloqueHorarios } = useBloqueHorarios();
    const { users } = useUsers();
    const { excepciones } = useExcepciones();

    const isEdit = !!id;

    const [form, setForm] = useState({
        fecha_reserva: '', // YYYY-MM-DD
        cancha_id: '',
        bloque_horario_id: '',
        usuario_id: '',
        estado: 'CONFIRMADA', // Valor por defecto
        notas_adicionales: '',
    });

    const [bloquesDisponibles, setBloquesDisponibles] = useState([]);
    const [isLoading, setIsLoading] = useState(isEdit);
    const [errors, setErrors] = useState([]);

    // Cargar datos de la reserva si estamos en modo edición
    useEffect(() => {
        const cargarReserva = async () => {
            if (isEdit && id) {
                setIsLoading(true);
                setErrors([]);
                try {
                    const reserva = await getReserva(id);
                    setForm({
                        fecha_reserva: reserva.fecha_reserva ? new Date(reserva.fecha_reserva).toISOString().split('T')[0] : '',
                        cancha_id: reserva.cancha_id?._id || reserva.cancha_id || '',
                        bloque_horario_id: reserva.bloque_horario_id?._id || reserva.bloque_horario_id || '',
                        usuario_id: reserva.usuario_id?._id || reserva.usuario_id || '',
                        estado: reserva.estado,
                        notas_adicionales: reserva.notas_adicionales || '',
                    });
                } catch (error) {
                    console.error("Error al cargar la reserva para editar:", error);
                    setErrors([error.response?.data?.message || error.message || "No se pudo cargar la reserva."]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        cargarReserva();
    }, [id, isEdit, getReserva]);

    // Calcular bloques disponibles cuando cambia la fecha o la cancha seleccionada
    const calcularBloquesDisponibles = useCallback(() => {
        if (!form.fecha_reserva || !form.cancha_id || !bloqueHorarios.length) {
            setBloquesDisponibles([]);
            return;
        }

        const fechaSeleccionada = new Date(form.fecha_reserva + "T00:00:00"); // Asegurar que es la fecha local
        const diaSemanaSeleccionado = fechaSeleccionada.getDay(); // Domingo = 0, Lunes = 1, ...

        const bloquesParaCanchaYDia = bloqueHorarios.filter(bh =>
            (bh.cancha_id?._id || bh.cancha_id) === form.cancha_id &&
            bh.dia_semana === diaSemanaSeleccionado
        );

        const disponibles = bloquesParaCanchaYDia.filter(bloque => {
            // 1. Verificar si ya está reservado
            const estaReservado = todasLasReservas.some(res =>
                (res.bloque_horario_id?._id || res.bloque_horario_id) === bloque._id &&
                new Date(res.fecha_reserva).toISOString().split('T')[0] === form.fecha_reserva &&
                res.estado !== 'CANCELADA_ADMIN' && res.estado !== 'CANCELADA_USUARIO' && // No contar canceladas
                (!isEdit || res._id !== id) // Si estamos editando, no contar la reserva actual como "ya reservada"
            );
            if (estaReservado) return false;

            // 2. Verificar si hay una excepción que lo bloquee
            const inicioBloqueDate = new Date(`${form.fecha_reserva}T${bloque.hora_inicio}:00`);
            const finBloqueDate = new Date(`${form.fecha_reserva}T${bloque.hora_fin}:00`);

            const hayExcepcion = excepciones.some(exc => {
                const excInicio = new Date(exc.fecha_inicio);
                const excFin = new Date(exc.fecha_fin);
                const aplicaCancha = !exc.cancha_id || (exc.cancha_id?._id || exc.cancha_id) === form.cancha_id;

                // Verifica si el bloque se solapa con la excepción
                return aplicaCancha && inicioBloqueDate < excFin && finBloqueDate > excInicio;
            });
            if (hayExcepcion) return false;

            return true;
        });

        setBloquesDisponibles(disponibles.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)));

    }, [form.fecha_reserva, form.cancha_id, bloqueHorarios, todasLasReservas, excepciones, isEdit, id]);

    useEffect(() => {
        calcularBloquesDisponibles();
    }, [calcularBloquesDisponibles]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => {
            const newForm = { ...prevForm, [name]: value };
            // Si cambia la fecha o la cancha, resetear el bloque_horario_id
            if (name === "fecha_reserva" || name === "cancha_id") {
                newForm.bloque_horario_id = "";
            }
            return newForm;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        if (!form.fecha_reserva || !form.cancha_id || !form.bloque_horario_id || !form.usuario_id) {
            setErrors(["Todos los campos (Fecha, Cancha, Bloque Horario, Usuario) son obligatorios."]);
            return;
        }

        const reservaData = {
            fecha_reserva: form.fecha_reserva,
            cancha_id: form.cancha_id,
            bloque_horario_id: form.bloque_horario_id,
            usuario_id: form.usuario_id,
            estado: form.estado,
            notas_adicionales: form.notas_adicionales,
        };
 
        //console.log("Datos a enviar para la reserva:", reservaData); // <-- Añadimos este log

        try {
            if (isEdit) {
                await updateReserva(id, reservaData);
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Reserva actualizada con éxito.',
                    icon: 'success',
                    timer: 2000, // Cierra automáticamente después de 2 segundos
                    showConfirmButton: false
                });
            } else {
                await createReserva(reservaData);
                Swal.fire({
                    title: '¡Creado!',
                    text: 'Reserva creada con éxito.',
                    icon: 'success',
                    timer: 2000, // Cierra automáticamente después de 2 segundos
                    showConfirmButton: false
                });
            }
            setTimeout(() => {
                window.location.href = '/admin/reservas';
            }, 2000); // Navegar después de que se muestre el SweetAlert
        } catch (error) {
            console.error("Error al guardar la reserva:", error);
            if (error.response && error.response.data) {
                const message = error.response.data.message || (Array.isArray(error.response.data) ? error.response.data.join(', ') : "Error desconocido");
                setErrors([message]);
            } else {
                setErrors([error.message || "Ocurrió un error al conectar con el servidor."]);
            }
        }
    };

    if (isLoading && isEdit) return <p>Cargando datos de la reserva...</p>;

    return (
        <div className="admin-form-container">
            <h2 className="text-center mb-4">{isEdit ? 'Editar Reserva' : 'Crear Nueva Reserva'}</h2>
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    {errors.map((errorMsg, i) => (
                        <p key={i} className="mb-0">{errorMsg}</p>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fecha_reserva">Fecha de Reserva:</label>
                    <input type="date" id="fecha_reserva" name="fecha_reserva" value={form.fecha_reserva} onChange={handleChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label htmlFor="cancha_id">Cancha:</label>
                    <select id="cancha_id" name="cancha_id" value={form.cancha_id} onChange={handleChange} className="form-select" required>
                        <option value="">Seleccione una cancha</option>
                        {canchas.map(cancha => (
                            <option key={cancha._id} value={cancha._id}>{cancha.nombre}</option>
                        ))}
                    </select>
                </div>

                {form.fecha_reserva && form.cancha_id && (
                    <div className="form-group">
                        <label htmlFor="bloque_horario_id">Bloque Horario Disponible:</label>
                        <select id="bloque_horario_id" name="bloque_horario_id" value={form.bloque_horario_id} onChange={handleChange} className="form-select" required>
                            <option value="">Seleccione un bloque horario</option>
                            {bloquesDisponibles.length > 0 ? (
                                bloquesDisponibles.map(bloque => (
                                    <option key={bloque._id} value={bloque._id}>
                                        {`${diasSemana[bloque.dia_semana]}: ${bloque.hora_inicio} - ${bloque.hora_fin}`}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No hay bloques disponibles para esta fecha/cancha</option>
                            )}
                        </select>
                        {bloquesDisponibles.length === 0 && <small className="form-text text-muted">Verifique la fecha, la cancha, o si hay excepciones.</small>}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="usuario_id">Usuario:</label>
                    <select id="usuario_id" name="usuario_id" value={form.usuario_id} onChange={handleChange} className="form-select" required>
                        <option value="">Seleccione un usuario</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.username || user.email}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="estado">Estado:</label>
                    <select id="estado" name="estado" value={form.estado} onChange={handleChange} className="form-select" required>
                        {estadosReserva.map(estado => (
                            <option key={estado} value={estado}>{estado.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="notas_adicionales">Notas Adicionales (Opcional):</label>
                    <textarea id="notas_adicionales" name="notas_adicionales" value={form.notas_adicionales} onChange={handleChange} className="form-control" rows="3"></textarea>
                </div>

                <div className="form-buttons-container">
                    <button type="submit" className="form-button">
                        {isEdit ? 'Actualizar Reserva' : 'Crear Reserva'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin/reservas')} className="form-button form-button-cancel">Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default ReservaFormPage;