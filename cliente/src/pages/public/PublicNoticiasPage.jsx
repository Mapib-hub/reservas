import React from 'react';
import { useNoti } from '../../context/NoticiaContex.jsx'; // Asegúrate que la ruta sea correcta
import { Link } from 'react-router-dom'; // Opcional: si cada noticia fuera clickeable a un detalle
import { truncateText } from '../../utils/textUtils.js'; // Para resumir la descripción

const PublicNoticiasPage = () => {
  const { noticias, loading, error } = useNoti();

  if (loading) return <p className="text-center py-5" >Cargando noticias...</p>;
  if (error) return <p className="text-center py-5 text-red-500">Error al cargar noticias: {error.message || error}</p>;
//console.log(noticias);
  return (
    <div className="public-noticias-page-container">
      <h1 className="text-3xl font-bold text-center my-8">Últimas Noticias</h1>

      {noticias.length === 0 ? (
        <p className="text-center text-gray-600">No hay noticias publicadas por el momento.</p>
      ) : (
        <div className="noticias-grid">
          {noticias.slice().reverse().map((noticia) => ( // .slice().reverse() para mostrar las más nuevas primero sin mutar el array original
            <div key={noticia._id} className="noticia-card-public">
              {noticia.image && (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/uploads/noticias/${noticia.image}`}
                  alt={noticia.titulo}
                  className="noticia-card-public-image"
                />
              )}
              <div className="noticia-card-public-content">
                <h2 className="noticia-card-public-title">{noticia.titulo}</h2>
                <p className="noticia-card-public-date">
                  Publicado el: {new Date(noticia.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <p className="noticia-card-public-description">
                  {truncateText(noticia.descripcion, 150)}
                </p>
                <Link to={`/noticias/${noticia._id}`} className="noticia-card-public-leermas">
                  Leer más...
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicNoticiasPage;