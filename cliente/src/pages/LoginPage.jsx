import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Ajusta la ruta si es necesario
//import '../components/user/LoginPage.css'; // Asegúrate que la ruta sea correcta

const LoginPage = () => {
  const [email, setEmail] = useState(''); // O username, según tu backend
  const [password, setPassword] = useState('');
  const { signin, isAuthenticated, errors: authErrors, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signin({ email, password }); // Asegúrate que tu backend espera 'email' o 'username'
  };

  useEffect(() => {
    if (isAuthenticated && !loading) { // Solo redirigir si no está cargando y está autenticado
      navigate('/admin'); // Redirige al dashboard del admin después del login
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          {/* Podrías poner un logo aquí o un ícono */}
          <h2>Panel de Administración</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        {authErrors && authErrors.length > 0 && (
          <div className="auth-errors">
            {authErrors.map((error, i) => (
              <p key={i}>{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group-login">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email" // O "text" si usas username
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group-login">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        
        {/* Opcional: Enlace para "Olvidé mi contraseña" o "Registrarse" si aplica */}
        {/* <div className="login-footer-links">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;