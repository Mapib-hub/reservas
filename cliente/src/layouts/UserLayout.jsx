import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarUser from '../components/user/NavbarUser'; // Importamos el NavbarUser

function UserLayout() {
  return (
    <div className="user-layout">
      <NavbarUser /> {/* Añadimos el NavbarUser aquí */}
      {/* El header que teníamos antes ya no es necesario si el Navbar cumple esa función */}
      {/* <header style={{ background: '#e6f7ff', padding: '1rem', textAlign: 'center' }}>
        <h1>Bienvenido Usuario</h1>      </header> */}
      <main style={{ padding: '1rem', marginTop: '1rem' }}> {/* Añadido un poco de margen superior */}
        <Outlet /> {/* Aquí se renderizarán las rutas hijas (páginas específicas de usuario) */}
      </main>
    </div>
  );
}

export default UserLayout;