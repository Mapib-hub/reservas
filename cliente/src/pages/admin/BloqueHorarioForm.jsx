import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBloqueHorarios } from '../../context/BloqueHorariosContext.jsx';
import { useCanchas } from '../../context/CanchasContext.jsx';
// import './BloqueHorarioForm.css'; // Eliminamos la importación si no vamos a usar un CSS específico

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Este componente ahora manejará su propia lógica de envío y determinación de edición.
// Ya no necesita las props `onSubmit` ni `isEdit`.
const BloqueHorarioForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { bloqueHorarios, createBloqueHorario, updateBloqueHorario } = useBloqueHorarios();
    const { canchas } = useCanchas();
    const isEdit = !!id; // Determina si estamos en modo edición basado en la presencia del id.

    // Estado inicial del formulario para creación.
    const [form, setForm] = useState({
        dia_semana: 0, // Domingo por defecto
        hora_inicio: '',
        hora_fin: '',
        cancha_id: '',
    });
    const [isLoading, setIsLoading] = useState(isEdit); // Feedback mientras se cargan datos para editar

    useEffect(() => {
        // Lógica para cargar datos cuando estamos en modo edición.
        if (isEdit && id) {
            setIsLoading(true);
            // Buscar el bloque horario específico a editar.
            // Asumimos que el ID del bloque horario es `_id`. Ajusta si es diferente.
            const bloqueAEditar = bloqueHorarios.find(bh => bh._id === id);

            if (bloqueAEditar) {
                let canchaIdParaForm = '';
                if (bloqueAEditar.cancha_id) {
                    // Si cancha_id es un objeto (populado), tomamos su _id.
                    // Si no, asumimos que ya es el ID (string o número).
                    if (typeof bloqueAEditar.cancha_id === 'object' && bloqueAEditar.cancha_id._id) {
                        canchaIdParaForm = String(bloqueAEditar.cancha_id._id);
                    } else {
                        canchaIdParaForm = String(bloqueAEditar.cancha_id);
                    }
                }
                setForm({
                    dia_semana: bloqueAEditar.dia_semana !== undefined ? bloqueAEditar.dia_semana : 0,
                    hora_inicio: bloqueAEditar.hora_inicio || '',
                    hora_fin: bloqueAEditar.hora_fin || '',
                    // Aseguramos que cancha_id sea string para el select.
                    cancha_id: canchaIdParaForm,
                });
            } else if (bloqueHorarios.length > 0) {
                // Solo mostrar advertencia si ya hay bloques cargados y no se encontró el específico.
                console.warn(`Bloque horario con id "${id}" no encontrado para editar en la lista de bloqueHorarios.`);
                // Opcional: podrías redirigir o mostrar un mensaje de error.
                // navigate('/admin/bloques-horarios');
            }
            setIsLoading(false);
        } else {
            // Si no es edición (es creación), reseteamos a valores iniciales.
            setForm({
                dia_semana: 0,
                hora_inicio: '',
                hora_fin: '',
                cancha_id: '',
            });
            setIsLoading(false);
        }
    }, [id, isEdit, bloqueHorarios]); // Dependencias del efecto.

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === "cancha_id" ? String(value) : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validaciones básicas (puedes añadir más según necesites)
        if (!form.hora_inicio || !form.hora_fin || !form.cancha_id) {
            alert("Por favor, completa todos los campos requeridos (hora inicio, hora fin, cancha).");
            return;
        }
        if (form.hora_inicio && form.hora_fin && form.hora_inicio >= form.hora_fin) {
            alert("La hora de inicio debe ser anterior a la hora de fin.");
            return;
        }

        try {
            if (isEdit) {
                await updateBloqueHorario(id, form);
                alert('Bloque horario actualizado con éxito!');
            } else {
                await createBloqueHorario(form);
                alert('Bloque horario creado con éxito!');
            }
            navigate('/admin/horarios'); // O a donde quieras redirigir después de guardar
        } catch (error) {
            console.error("Error al guardar el bloque horario:", error);
            // Podrías mostrar un mensaje de error más amigable al usuario aquí
            alert(`Error al guardar: ${error.response?.data?.message || error.message || 'Ocurrió un problema'}`);
        }
    };

    if (isLoading && isEdit) {
        return <p>Cargando datos del bloque horario...</p>;
    }

    return (
        // Eliminamos la clase contenedora específica si vamos a depender de estilos globales
        <div>
            <h2>{isEdit ? 'Editar Bloque Horario' : 'Crear Nuevo Bloque Horario'}</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>
                    Día de la semana:<br />
                    <select className="form-group" name="dia_semana" value={form.dia_semana} onChange={handleChange}>
                        {diasSemana.map((dia, idx) => (
                            <option key={idx} value={idx}>{dia}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="form-group">
                <label>
                    Hora de inicio:<br />
                    <input className="form-group" type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} required />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Hora de fin:<br />
                    <input className="form-group" type="time" name="hora_fin" value={form.hora_fin} onChange={handleChange} required />
                </label>
            </div>
            <div className="form-group">
                <label><br />
                    Cancha:<br />
                    <select className="form-group" name="cancha_id" value={form.cancha_id} onChange={handleChange} required>
                        <option value="">Selecciona una cancha</option>
                        {/* Aseguramos que canchas exista y tenga elementos antes de mapear */}
                        {canchas && canchas.length > 0 ? (
                            canchas.map((cancha) => (
                                // Usamos String(cancha._id) para asegurar que el value sea string,
                                // coincidiendo con cómo se guarda en el estado `form`.
                                <option key={cancha._id} value={String(cancha._id)}>{cancha.nombre}</option>
                            ))
                        ) : (
                            <option value="" disabled>No hay canchas disponibles</option>
                        )}
                    </select>
                </label>
            </div>
            {/* Añadimos la clase form-button para que coincida con NoticiaFormPage */}
            <button type="submit" className="form-button">{isEdit ? 'Actualizar Bloque Horario' : 'Crear Bloque Horario'}</button>
        </form>
        </div>
    );
};

export default BloqueHorarioForm;