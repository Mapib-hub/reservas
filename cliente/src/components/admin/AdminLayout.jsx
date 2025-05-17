import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom'; // Lo importamos, aunque aún no esté instalado
import { useAuth } from '../../context/AuthContext.jsx'; // Importamos el hook de autenticación

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth(); 

const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen); // Esto invierte el estado (true a false, false a true)
};

  // Función para cerrar el sidebar, se llamará al hacer clic en un enlace del menú
  const handleNavLinkClick = () => {
    if (isSidebarOpen) { // Solo cierra si está abierto
      setIsSidebarOpen(false);
    }
  };

  return (
     <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="admin-sidebar">
        <h2 className='display_sm'>Admin Panel</h2>
        <nav>
          <ul>
            <li><Link to="/admin" onClick={handleNavLinkClick}>Dashboard</Link></li>
            <li><Link to="/admin/canchas" onClick={handleNavLinkClick}>Canchas</Link></li>
            <li><Link to="/admin/horarios" onClick={handleNavLinkClick}>Horarios</Link></li>
            <li><Link to="/admin/noticias" onClick={handleNavLinkClick}>Noticias</Link></li>
            <li><Link to="/admin/reservas" onClick={handleNavLinkClick}>Reservas</Link></li>
            <li><Link to="/admin/usuarios" onClick={handleNavLinkClick}>Usuarios</Link></li>
            <li><Link to="/admin/excepciones" onClick={handleNavLinkClick}>Excepciones</Link></li>
          </ul>
        </nav>
      </aside>
      <div className="admin-main-container">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? 'Cerrar Menú' : 'Abrir Menú'}
          </button> 
         <div className="admin-header-info">
            {user && (
              <span className="admin-user-greeting">
                Hola, {user.username || user.email || 'Admin'}! {/* Muestra username, email o 'Admin' */}
              </span>
            )}
            <button onClick={logout} className="logout-button">Cerrar Sesión</button>
          </div>
        </header>
        <main className="admin-main-content">
          <Outlet /> {/* Aquí se renderizará el contenido de la página actual */}
        </main>
      </div>
    </div>
  );
};

 export default AdminLayout;