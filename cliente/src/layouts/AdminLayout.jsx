import React from 'react';
import { Outlet } from 'react-router-dom';
// Podríamos importar un NavbarAdmin aquí más adelante
// import NavbarAdmin from '../components/NavbarAdmin';

function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* <NavbarAdmin /> */}
      <header style={{ background: '#f0f0f0', padding: '1rem', textAlign: 'center' }}>
        <h1>Panel de Administración</h1>
      </header>
      <main style={{ padding: '1rem' }}>
        <Outlet /> {/* Aquí se renderizarán las rutas hijas (páginas específicas de admin) */}
      </main>
    </div>
  );
}

export default AdminLayout;