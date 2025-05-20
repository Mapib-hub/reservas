import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useExcepciones } from '../../context/ExcepcionContext';
import { useCanchas } from '../../context/CanchasContext'; // Para obtener nombres de canchas
import { formatDate } from '../../utils/formatDate'; // Asumimos que tienes una utilidad para formatear fechas

const ExcepcionesPage = () => {
    const { excepciones, loading, error, fetchExcepciones, deleteExcepcion } = useExcepciones();
    const { canchas, getCanchaNombre } = useCanchas(); // Para mostrar el nombre de la cancha

    useEffect(() => {
        // Opcional: Si quieres asegurarte de que los datos están frescos al visitar la página.
        // Si el provider ya carga al inicio, esto podría ser redundante o para recargar.
        // fetchExcepciones();
    }, []); // Dependencias vacías para que se ejecute solo al montar, o según necesites.

    const handleDelete = async (id) => {
        // La confirmación y los mensajes de éxito/error ahora los maneja SweetAlert2 en el contexto
        await deleteExcepcion(id);
        // No es necesario hacer nada más aquí, a menos que quieras recargar datos o algo específico.
    };

    if (loading) return <p>Cargando excepciones...</p>;
    if (error) return <p className="text-danger">Error al cargar excepciones: {error}</p>;
 
    return (
        <div className="admin-page-container p-3"> {/* Contenedor general para la página de admin */}
            <h2 className="text-center mb-4">Gestión de Excepciones de Horarios</h2>
            <Link to="/admin/excepciones/nueva" className="button-crear">
                Crear Nueva Excepción
            </Link>
 
            {excepciones.length === 0 ? (
                <p>No hay excepciones creadas todavía.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Cancha</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Título Display</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {excepciones.map((exc) => (
                            <tr key={exc._id}>
                                <td>{formatDate(exc.fecha_inicio, true)}</td>
                                <td>{formatDate(exc.fecha_fin, true)}</td>
                                <td>{exc.cancha_id ? getCanchaNombre(exc.cancha_id) : 'Todas las canchas'}</td>
                                <td>{exc.tipo}</td>
                                <td>{exc.descripcion}</td>
                                <td>{exc.titulo_display || '-'}</td>
                                <td>
                                    <Link to={`/admin/excepciones/editar/${exc._id}`} className="button-editar">Editar</Link>
                                    <button onClick={() => handleDelete(exc._id)} className="button-eliminar">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExcepcionesPage;