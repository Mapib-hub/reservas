import React from 'react';
// import './PublicFooter.css'; // Si decidimos crear un CSS específico

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="public-footer">
      <p>&copy; {currentYear} TuRecintoDeportivo. Todos los derechos reservados.</p>
      {/* Aquí podríamos añadir enlaces a redes sociales, etc. */}
    </footer>
  );
};

export default PublicFooter;