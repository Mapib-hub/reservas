import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCanchas } from '../../context/CanchasContext'; // Asegúrate que la ruta sea correcta

const PublicCanchaDetallePage = () => {
  const { idCancha } = useParams();
  // Asumimos que tu context tiene una función para obtener una cancha por ID
  // Si no la tiene, necesitaríamos añadirla o ajustar esta lógica.
  // Por ahora, buscaremos en la lista de canchas.
  const { canchas, getCancha, loading: contextLoading, error: contextError } = useCanchas();
  const [cancha, setCancha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCancha = async () => {
      try {
        setLoading(true);
        setError(null);
        // Si tienes una función getCancha(id) en tu contexto, úsala:
        const data = await getCancha(idCancha);
        setCancha(data);
        // Si no, y 'canchas' ya está cargado en el contexto:
        // const foundCancha = canchas.find(c => c._id === idCancha);
        // if (foundCancha) {
        //   setCancha(foundCancha);
        // } else if (!contextLoading && canchas.length > 0) {
        //   setError('Cancha no encontrada en la lista cargada.');
        // } else if (!contextLoading && canchas.length === 0){
        //   setError('No hay canchas cargadas para buscar.');
        // }
      } catch (err) {
        console.error("Error fetching cancha:", err);
        setError(err.message || 'Error al cargar la cancha.');
      } finally {
        setLoading(false);
      }
    };

    // Solo intentar cargar si getCancha está disponible y el idCancha existe
    if (idCancha && getCancha) {
        fetchCancha();
    } else if (!getCancha) {
        setError("La función para obtener cancha individual no está disponible.");
        setLoading(false);
    }

  }, [idCancha, getCancha]); // Dependencia de getCancha para re-ejecutar si cambia

  if (loading || contextLoading) return <p className="text-center py-10">Cargando detalles de la cancha...</p>;
  if (error || contextError) return <p className="text-center py-10 text-red-500">Error: {error || (typeof contextError === 'string' ? contextError : contextError?.message)}</p>;
  if (!cancha) return <p className="text-center py-10">Cancha no encontrada.</p>;

  return (
    <div className="public-noticia-detalle-container"> {/* Reutilizamos clase de noticia-detalle */}
      <Link to="/canchas" className="btn-volver">&larr; Volver a Canchas</Link>
      <h1 className="public-detalle-title">{cancha.nombre}</h1>
     
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/canchas/${cancha.imagen}`}
          alt={cancha.nombre}
          className="public-noticia-detalle-image"
        />
      
      <div className="public-detalle-info">
        <p><strong>Tipo:</strong> {cancha.tipo}</p>
        <p><strong>Descripción:</strong></p>
        <div className="public-detalle-content" dangerouslySetInnerHTML={{ __html: cancha.descripcion }} />
        {/* Si la descripción es texto plano: <p>{cancha.descripcion}</p> */}
        {/* Aquí podrías añadir más detalles específicos de la cancha si los tienes, como precio, horarios, etc. */}
      </div>
      <div className="mt-8 text-center">
        <Link to={`/usuario/reservar/`} className="btn btn-primary btn-lg">Reservar esta Cancha</Link>
      </div>
    </div>
  );
};

export default PublicCanchaDetallePage;