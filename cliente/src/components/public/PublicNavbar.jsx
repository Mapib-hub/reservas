import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
// import './PublicNavbar.css'; // Si decidimos crear un CSS específico

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="public-navbar">
      <div className="public-navbar-container">
        <Link to="/" className="public-navbar-brand" onClick={() => setIsMenuOpen(false)}>
          Arriendo Canchas
        </Link>

        {/* Botón Hamburguesa para móviles */}
        <button
          className={`public-navbar-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          <span className="public-navbar-toggle-icon"></span>
          <span className="public-navbar-toggle-icon"></span>
          <span className="public-navbar-toggle-icon"></span>
        </button>

        {/* Enlaces de navegación */}
        <div className={`public-navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/canchas" className="public-nav-link" activeClassName="active">Canchas</NavLink>
          <NavLink to="/tarifas" className="public-nav-link" activeClassName="active">Tarifas</NavLink>
          <NavLink to="/noticias" className="public-nav-link" activeClassName="active">Noticias</NavLink> 
          <NavLink to="/contacto" className="public-nav-link" activeClassName="active">Contacto</NavLink>
          <NavLink to="/login" className="public-nav-link btn-login" activeClassName="active">Login</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;