import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExcepciones } from '../../context/ExcepcionContext';
import { useCanchas } from '../../context/CanchasContext';

// Opciones para el tipo de excepción, basadas en el enum del modelo
const tiposExcepcion = ['FERIADO', 'MANTENIMIENTO', 'EVENTO_PRIVADO', 'REPARACION', 'BLOQUEO_ESPECIAL'];

const ExcepcionFormPage = () => {
    const { id } = useParams(); // Para el modo edición
    const navigate = useNavigate();
    const { createExcepcion, getExcepcion, updateExcepcion } = useExcepciones();
    const { canchas } = useCanchas(); // Para el select de canchas

    const isEdit = !!id;

    const [form, setForm] = useState({
        fecha: '', // YYYY-MM-DD
        tipo_horario: 'DIA_COMPLETO', // 'DIA_COMPLETO' o 'RANGO_HORAS'
        hora_inicio: '', // HH:MM (si tipo_horario es RANGO_HORAS)
        hora_fin: '', // HH:MM (si tipo_horario es RANGO_HORAS)
        cancha_id: '', // _id de la cancha o '' para "Todas las canchas"
        tipo: tiposExcepcion[0], // Valor por defecto del enum
        descripcion: '',
        titulo_display: '',
    });
    const [isLoading, setIsLoading] = useState(isEdit);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const cargarExcepcion = async () => {
            if (isEdit && id) {
                setIsLoading(true);
                setErrors([]);
                try {
                    const excepcion = await getExcepcion(id);
                    // Convertir fecha_inicio y fecha_fin a los campos del formulario
                    const fechaInicioDate = new Date(excepcion.fecha_inicio);
                    const fechaFinDate = new Date(excepcion.fecha_fin);

                    const formFecha = fechaInicioDate.toISOString().split('T')[0];
                    let formTipoHorario = 'DIA_COMPLETO';
                    let formHoraInicio = '';
                    let formHoraFin = '';

                    // Verificar si es día completo (00:00 a 23:59:59.999)
                    const esDiaCompleto =
                        fechaInicioDate.getHours() === 0 && fechaInicioDate.getMinutes() === 0 &&
                        fechaFinDate.getHours() === 23 && fechaFinDate.getMinutes() === 59;

                    if (!esDiaCompleto) {
                        formTipoHorario = 'RANGO_HORAS';
                        formHoraInicio = `${String(fechaInicioDate.getHours()).padStart(2, '0')}:${String(fechaInicioDate.getMinutes()).padStart(2, '0')}`;
                        formHoraFin = `${String(fechaFinDate.getHours()).padStart(2, '0')}:${String(fechaFinDate.getMinutes()).padStart(2, '0')}`;
                    }

                    setForm({
                        fecha: formFecha,
                        tipo_horario: formTipoHorario,
                        hora_inicio: formHoraInicio,
                        hora_fin: formHoraFin,
                        cancha_id: excepcion.cancha_id ? String(excepcion.cancha_id) : '', // '' para "Todas"
                        tipo: excepcion.tipo,
                        descripcion: excepcion.descripcion,
                        titulo_display: excepcion.titulo_display || '',
                    });
                } catch (error) {
                    console.error("Error al cargar la excepción para editar:", error);
                    setErrors([error.response?.data?.message || error.message || "No se pudo cargar la excepción."]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        cargarExcepcion();
    }, [id, isEdit, getExcepcion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        // Validaciones básicas
        if (!form.fecha || !form.tipo || !form.descripcion) {
            setErrors(["La fecha, tipo y descripción son obligatorios."]);
            return;
        }
        if (form.tipo_horario === 'RANGO_HORAS' && (!form.hora_inicio || !form.hora_fin)) {
            setErrors(["Si seleccionas 'Rango de horas', debes especificar hora de inicio y fin."]);
            return;
        }
        if (form.tipo_horario === 'RANGO_HORAS' && form.hora_inicio >= form.hora_fin) {
            setErrors(["La hora de inicio debe ser anterior a la hora de fin."]);
            return;
        }

        // Construir fecha_inicio y fecha_fin para el backend
        let fecha_inicio, fecha_fin;
        const [year, month, day] = form.fecha.split('-').map(Number);

        if (form.tipo_horario === 'DIA_COMPLETO') {
            fecha_inicio = new Date(year, month - 1, day, 0, 0, 0, 0); // Mes es 0-indexado
            fecha_fin = new Date(year, month - 1, day, 23, 59, 59, 999);
        } else { // RANGO_HORAS
            const [startHour, startMinute] = form.hora_inicio.split(':').map(Number);
            const [endHour, endMinute] = form.hora_fin.split(':').map(Number);
            fecha_inicio = new Date(year, month - 1, day, startHour, startMinute, 0, 0);
            fecha_fin = new Date(year, month - 1, day, endHour, endMinute, 0, 0);
        }

        const excepcionData = {
            fecha_inicio,
            fecha_fin,
            cancha_id: form.cancha_id === '' ? null : form.cancha_id, // Enviar null si es "Todas"
            tipo: form.tipo,
            descripcion: form.descripcion,
            titulo_display: form.titulo_display || null, // Enviar null si está vacío
            // bloque_horario_id se omite, el backend lo manejará como null por defecto
        };

        try {
            if (isEdit) {
                await updateExcepcion(id, excepcionData);
                alert('Excepción actualizada con éxito!');
            } else {
                await createExcepcion(excepcionData);
                alert('Excepción creada con éxito!');
            }
            navigate('/admin/excepciones');
        } catch (error) {
            console.error("Error al guardar la excepción:", error);
            if (error.response && error.response.data) {
                const message = error.response.data.message || (Array.isArray(error.response.data) ? error.response.data.join(', ') : "Error desconocido");
                setErrors([message]);
            } else {
                setErrors([error.message || "Ocurrió un error al conectar con el servidor."]);
            }
        }
    };

    if (isLoading && isEdit) return <p>Cargando datos de la excepción...</p>;

    return (
        <div className="admin-form-container"> {/* 1. Añadimos un div contenedor con una clase */}
            <h2 className="text-center mb-4">{isEdit ? 'Editar Excepción' : 'Crear Nueva Excepción'}</h2>
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    {errors.map((error, i) => (
                        <p key={i} className="mb-0">{error}</p>
                    ))}
                </div>
            )} 
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fecha">Fecha:</label>
                    <input type="date" id="fecha" name="fecha" value={form.fecha} onChange={handleChange} className="form-control" required />
                </div>

                <div className="form-group">
                    <label>Tipo de Horario:</label>
                    <div>
                        <label className="form-check-label me-3">
                            <input type="radio" name="tipo_horario" value="DIA_COMPLETO" checked={form.tipo_horario === 'DIA_COMPLETO'} onChange={handleChange} className="form-check-input me-1" />
                            Todo el día
                        </label>
                        <label className="form-check-label">
                            <input type="radio" name="tipo_horario" value="RANGO_HORAS" checked={form.tipo_horario === 'RANGO_HORAS'} onChange={handleChange} className="form-check-input me-1" />
                            Rango de horas específico
                        </label>
                    </div>
                </div>

                {form.tipo_horario === 'RANGO_HORAS' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="hora_inicio">Hora de Inicio:</label>
                            <input type="time" id="hora_inicio" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hora_fin">Hora de Fin:</label>
                            <input type="time" id="hora_fin" name="hora_fin" value={form.hora_fin} onChange={handleChange} className="form-control" />
                        </div>
                    </>
                )}

                <div className="form-group">
                    <label htmlFor="cancha_id">Cancha:</label>
                    <select id="cancha_id" name="cancha_id" value={form.cancha_id} onChange={handleChange} className="form-select">
                        <option value="">Todas las canchas</option>
                        {canchas.map(cancha => (
                            <option key={cancha._id} value={cancha._id}>{cancha.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="tipo">Tipo de Excepción:</label>
                    <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange} className="form-select" required>
                        {tiposExcepcion.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea id="descripcion" name="descripcion" value={form.descripcion} onChange={handleChange} className="form-control" rows="3" required></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="titulo_display">Título Corto (Opcional):</label>
                    <input type="text" id="titulo_display" name="titulo_display" value={form.titulo_display} onChange={handleChange} className="form-control" />
                </div>

                <div className="form-buttons-container">
                    <button type="submit" className="form-button">
                        {isEdit ? 'Actualizar Excepción' : 'Crear Excepción'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin/excepciones')} className="form-button form-button-cancel">Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default ExcepcionFormPage;