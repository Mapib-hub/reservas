import React from 'react';
import { useUsers } from '../../context/UsersContext.jsx'; // Importamos el hook del contexto
import { Link } from 'react-router-dom'; // Para los enlaces de crear y editar

const UsuariosPage = () => {
  const { users, loading, error, deleteUser } = useUsers(); // Obtenemos los datos y funciones del contexto

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <Link to="/admin/usuarios/nuevo" className="button-crear"> {/* Enlace a la página de creación */}
        Crear Nuevo Usuario
      </Link>

      {users.length === 0 ? (
        <p>No hay usuarios para mostrar.</p>
      ) : (
        <div className="table-responsive-container"> {/* Usamos la misma clase para responsive */}
          <table>
            <thead>
              <tr>
                <th>Nombre de Usuario</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user._id}>
                    <td>{user.username}</td> 
                    <td>{user.email}</td>    
                    <td>{user.role}</td>     
                    <td>
                      <Link to={`/admin/usuarios/editar/${user._id}`} className="button-editar">Editar</Link>
                      <button onClick={() => deleteUser(user._id)} className="button-eliminar">Eliminar</button>
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

 export default UsuariosPage;