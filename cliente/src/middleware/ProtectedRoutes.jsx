import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es necesario

function ProtectedRoutes({ allowedRoles }) { // Añadimos la prop allowedRoles
    const { loading, isAuthenticated, user } = useAuth(); // Asumimos que user tiene la propiedad 'role'


  if (loading) {// Muestra un spinner o mensaje mientras se verifica la autenticación inicial
    return <p>Cargando...</p>; 
  }
if (!loading && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
// Si se especifican roles permitidos y el usuario no tiene uno de ellos
     if (!isAuthenticated) {
   // Si la ruta es /login, esta lógica no se aplicaría porque /login no usaría ProtectedRoute.
   // console.log("Usuario no autenticado. Redirigiendo a /");
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, pero no tiene el rol permitido
  if (allowedRoles && !allowedRoles.includes(user.role)) {
   // console.log(`Acceso denegado por rol. Usuario: ${user?.username}, Rol: ${user?.role}. Redirigiendo a /usuario/dashboard`);
    return <Navigate to="/usuario/dashboard" replace />;
  }
  return <Outlet />; // Si está autenticado, renderiza el contenido de la ruta hija (ej. AdminLayout)
};

export default ProtectedRoutes;