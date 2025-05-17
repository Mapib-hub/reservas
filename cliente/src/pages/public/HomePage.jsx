import React from 'react';
import { Link } from 'react-router-dom';
// import './HomePage.css'; // Si decidimos crear un CSS específico

const HomePage = () => {
  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-content">
          <h1>¡Reserva Tu Cancha Favorita!</h1>
          <p className="hero-subtitle">La mejor experiencia deportiva te espera. Fácil, rápido y al mejor precio.</p>
          <Link to="/canchas" className="btn btn-hero-cta">
            Ver Canchas Disponibles
          </Link>
        </div>
      </section>
      {/* Aquí irán otras secciones de la homepage más adelante */}
    </div>
  );
};

export default HomePage;