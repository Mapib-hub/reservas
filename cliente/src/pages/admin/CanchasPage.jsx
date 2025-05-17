import React from 'react';
import { useCanchas } from '../../context/CanchasContext.jsx'; // Importamos el hook del contexto
import { Link } from 'react-router-dom'; // Para los enlaces de crear y editar
import { truncateText } from '../../utils/textUtils.js'; // Importamos nuestra nueva función

const CanchasPage = () => {
  const { canchas, loading, error, deleteCancha } = useCanchas(); // Obtenemos los datos y funciones del contexto

  if (loading) return <p>Cargando canchas...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Gestión de Canchas</h2>
      
      <Link to="/admin/canchas/nueva" className="button-crear"> {/* Enlace a la página de creación */}
        Crear Nueva Cancha
      </Link>

      {canchas.length === 0 ? (
        <p>No hay canchas para mostrar.</p>
      ) : (
        <div className="table-responsive-container"> {/* Usamos la misma clase para responsive */}
          <table>
            <thead>
              <tr>
                <th>imagen</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {canchas.map((cancha) => {
                return (
                <tr key={cancha._id}>
                    <td>{<img 
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/canchas/${cancha.imagen}`} 
                        alt={cancha.nombre} 
                        style={{ width: '100px', height: 'auto', objectFit: 'cover' }} 
                      />}</td>
                    <td>{cancha.nombre}</td>
                    <td>{truncateText(cancha.descripcion, 100)}</td> 
                    <td>
                      <Link to={`/admin/canchas/editar/${cancha._id}`} className="button-editar">Editar</Link>
                      <button onClick={() => deleteCancha(cancha._id)} className="button-eliminar">Eliminar</button>
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

 export default CanchasPage;