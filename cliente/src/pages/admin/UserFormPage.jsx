import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUsers } from '../../context/UsersContext.jsx';

const UserFormPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { createUser, getUser, updateUser } = useUsers();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Rol por defecto 'user'
  const [errors, setErrors] = useState([]);

  // Lógica para cargar datos si estamos editando (la implementaremos después)
  useEffect(() => {
    const cargarUser = async () => {
      if (params.id) {
         try {
          const user = await getUser(params.id);
          if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setRole(user.role);
            // No cargamos la contraseña por seguridad, el usuario deberá ingresarla si quiere cambiarla
          }
        } catch (error) {
          console.error("Error al cargar usuario para editar:", error);
          setErrors(["No se pudo cargar el usuario para editar."]);
        }
      }
    };
    cargarUser();
  }, [params.id, getUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const userData = { username, email, role };
    // Solo incluimos la contraseña si se está creando un nuevo usuario o si se ingresa una nueva al editar
    if (!params.id || password) {
      userData.password = password;
    }

    try {
      if (params.id) {
         await updateUser(params.id, userData);
      } else {
        await createUser(userData);
      }
      navigate('/admin/usuarios');
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      const errorMessages = error.response?.data?.message ? [error.response.data.message] : (Array.isArray(error.response?.data) ? error.response.data : ['Ocurrió un error al guardar el usuario.']);
      setErrors(errorMessages);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>{params.id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:{params.id ? " (Dejar en blanco para no cambiar)" : ""}</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!params.id} />
        </div> 
        <div className="form-group">
          <label htmlFor="role">Rol:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="form-buttons-container">
          <button type="submit" className="form-button">Guardar Usuario</button>
          <button type="button" onClick={() => navigate('/admin/usuarios')} className="form-button form-button-cancel">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default UserFormPage;