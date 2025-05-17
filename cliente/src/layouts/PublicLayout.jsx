import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
// import './PublicLayout.css'; // Si decidimos crear un CSS específico más adelante

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <PublicNavbar />
      <main className="public-main-content">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;