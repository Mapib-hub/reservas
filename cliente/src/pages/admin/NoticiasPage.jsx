import React from 'react';
import { useNoti } from '../../context/NoticiaContex.jsx';
import { Link } from 'react-router-dom'; // Para el botón de "Crear Nueva"
import { truncateText } from '../../utils/textUtils.js';

const NoticiasPage = () => {
  const { noticias, loading, error, deleteNoti } = useNoti(); // Obtenemos deleteNoti también

  if (loading) return <p>Cargando noticias...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Gestión de Noticias</h2>
      <Link to="/admin/noticias/nueva" className="button-crear"> {/* Enlace a la página de creación */}
        Crear Nueva Noticia
      </Link>
 
      {noticias.length === 0 ? (
        <p>No hay noticias para mostrar.</p>
      ) : (
        <div className="table-responsive-container">
          <table>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Título</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noticias.map((noticia) => (
                <tr key={noticia._id}>
                  <td>
                    {noticia.image ? (
                      <img 
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/noticias/${noticia.image}`} 
                        alt={noticia.titulo} 
                        style={{ width: '100px', height: 'auto', objectFit: 'cover' }} 
                      />
                    ) : 'No imagen'}
                  </td>
                  <td>{noticia.titulo}</td>
                   <td>{truncateText(noticia.descripcion, 100)}</td>
                  <td>{new Date(noticia.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/noticias/editar/${noticia._id}`} className="button-editar">Editar</Link>
                    <button onClick={() => deleteNoti(noticia._id)} className="button-eliminar">Eliminar</button>
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

export default NoticiasPage;