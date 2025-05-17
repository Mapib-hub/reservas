import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNoti } from '../../context/NoticiaContex.jsx'; // Asegúrate que la ruta sea correcta

const PublicNoticiaDetallePage = () => {
  const { idNoticia } = useParams();
  const { getNoti, loading: contextLoading, error: contextError } = useNoti(); // Usaremos getNoticia para cargar una sola si es necesario
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNoti(idNoticia); // Llama a la función para obtener una noticia específica
        setNoticia(data);
      } catch (err) {
        console.error("Error fetching noticia:", err);
        setError(err.message || 'Error al cargar la noticia.');
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [idNoticia, getNoti]);

  if (loading || contextLoading) return <p className="text-center py-10">Cargando noticia...</p>;
  if (error || contextError) return <p className="text-center py-10 text-red-500">Error: {error || contextError.message || contextError}</p>;
  if (!noticia) return <p className="text-center py-10">Noticia no encontrada.</p>;

  return (
    <div className="public-noticia-detalle-container">
      <Link to="/noticias" className="btn-volver-noticias">&larr; Volver a Noticias</Link>
      <h1 className="public-noticia-detalle-title">{noticia.titulo}</h1>
      <p className="public-noticia-detalle-date">
        Publicado el: {new Date(noticia.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })}
      </p>
      {noticia.image && (
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/noticias/${noticia.image}`}
          alt={noticia.titulo}
          className="public-noticia-detalle-image"
        />
      )}
      <div className="public-noticia-detalle-content" dangerouslySetInnerHTML={{ __html: noticia.descripcion }} />
      {/* Si la descripción no es HTML, usa: <p className="public-noticia-detalle-content">{noticia.descripcion}</p> */}
    </div>
  );
};

export default PublicNoticiaDetallePage;