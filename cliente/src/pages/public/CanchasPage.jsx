import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import { useCanchas } from '../../context/CanchasContext'; // Asegúrate que la ruta sea correcta
import { truncateText } from '../../utils/textUtils.js'; // Asumo que tienes esta utilidad

//import './CanchasPage.css'; // Crearemos este archivo para estilos básicos

const CanchasPage = () => {
    const { canchas, loading, error, getCanchas } = useCanchas();

    useEffect(() => {
       getCanchas();
    }, []);

    if (loading) {
        return <div className="canchas-page-loading">Cargando canchas...</div>;
    }

    if (error) {
        return <div className="canchas-page-error">Error al cargar las canchas: {error}</div>;
    }

    return (
        <div className="canchas-page-container">
            <h1>Nuestras Canchas</h1>
            <div className="canchas-list">
                {Array.isArray(canchas) && canchas.length > 0 ? (
                    canchas.map((cancha) => (
                        <div key={cancha._id} className="cancha-card">
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/canchas/${cancha.imagen}`}
                                alt={cancha.nombre}
                                className='img_front_cancha'
                            />
                            <div className="cancha-card-content">
                                <h2>{cancha.nombre}</h2>
                                <p><strong>Tipo:</strong> {cancha.tipo_cancha}</p>
                                <p className="cancha-card-descripcion">
                                    {truncateText(cancha.descripcion, 100)}
                                </p>
                                <Link to={`/canchas/${cancha._id}`} className="btn btn-sm btn-outline-primary mt-2">
                                    Ver Detalles
                                </Link>
                                {/* Podríamos añadir más detalles o un enlace a una página de detalle de la cancha aquí */}
                                {/* Ejemplo: <Link to={`/canchas/${cancha._id}`}>Ver detalles</Link> */}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="canchas-page-empty">No hay canchas disponibles en este momento.</div>
                )}
            </div>
        </div>
    );
};

export default CanchasPage;