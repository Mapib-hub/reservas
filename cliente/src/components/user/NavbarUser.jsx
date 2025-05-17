import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


function NavbarUser() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar-user">
      <div className="navbar-user-brand">
        {/* Podrías poner un Link a la página principal o un título aquí */}
        <Link to="/usuario/dashboard" className="navbar-user-brand-link">Mi App Reservas</Link>
      </div>
      <button className="navbar-user-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation">
        {/* Icono de hamburguesa (puedes usar SVGs o FontAwesome si lo tienes) */}
        <span className="navbar-user-toggle-icon"></span>
        <span className="navbar-user-toggle-icon"></span>
        <span className="navbar-user-toggle-icon"></span>
      </button>
      <div className={`navbar-user-collapse ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="navbar-user-links">
          <Link to="/usuario/dashboard" className="navbar-user-link" onClick={() => setIsMobileMenuOpen(false)}>Mi Dashboard</Link>
          <Link to="/usuario/reservar" className="navbar-user-link" onClick={() => setIsMobileMenuOpen(false)}>Hacer Reserva</Link>
          <Link to="/usuario/mis-reservas" className="navbar-user-link" onClick={() => setIsMobileMenuOpen(false)}>Mis Reservas</Link>
          <Link to="/usuario/perfil" className="navbar-user-link" onClick={() => setIsMobileMenuOpen(false)}>Mi Perfil</Link>
        </div>
        <div className="navbar-user-session">
          {user && <span className="navbar-user-greeting">Hola, {user.username}</span>}
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="btn-navbar-logout"> {/* Quitamos la clase 'btn' para unificar con nuestros estilos */}
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarUser;