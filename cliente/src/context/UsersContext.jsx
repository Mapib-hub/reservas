import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  getUsersRequest,
  createUserRequest,
  getUserRequest,
  updateUserRequest,
  deleteUserRequest
} from '../api/users.js';
import { useAuth } from './AuthContext.jsx';
import Swal from 'sweetalert2'; // Para la confirmación de eliminación

const UsersContext = createContext();

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers debe ser usado dentro de un UsersProvider");
  }
  return context;
};

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user, loading: authLoading } = useAuth(); // Obtenemos el estado de autenticación y el usuario

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUsersRequest();
      setUsers(res.data);
    } catch (err) {
      console.error("Error en getUsers (context):", err);
      setError(err.message || "Error al cargar usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    // Solo cargar si está autenticado, la autenticación no está cargando Y el usuario es admin
    if (isAuthenticated && !authLoading && user && user.role === 'admin') {
      getUsers();
    } else if (!isAuthenticated && !authLoading) {
      // Si no está autenticado y la auth ya terminó de cargar, reseteamos y dejamos de cargar
      setUsers([]);
      setLoading(false);
    } else if (isAuthenticated && !authLoading && user && user.role !== 'admin') {
      // Si está autenticado como no-admin, también reseteamos y no cargamos
      setUsers([]);
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, user]); // Añadir 'user' a las dependencias

  const createUser = async (userData) => {
    try {
      const res = await createUserRequest(userData);
      getUsers(); // Recargar usuarios después de crear
      return res;
    } catch (error) {
      console.error("Error en createUser (context):", error);
      throw error;
    }
  };

  const getUser = async (id) => {
    try {
      const res = await getUserRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error en getUser (context):", error);
      throw error;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const res = await updateUserRequest(id, userData);
      getUsers(); // Recargar usuarios después de actualizar
      return res;
    } catch (error) {
      console.error("Error en updateUser (context):", error);
      throw error;
    }
  };

  const deleteUser = async (id) => {
   const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esta acción!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, ¡eliminar!',
    cancelButtonText: 'Cancelar'
  });
    if (result.isConfirmed) {
      try {
        await deleteUserRequest(id);
        setUsers(users.filter(user => user._id !== id));
        Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
        return true;
      } catch (error) {
        console.error("Error en deleteUser (context):", error);
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
        return false;
      }
    }
    return false;
  };
const getUserName = (id) => {
        if (!id) return 'Usuario no especificado';
        const user = users.find(u => u._id === String(id));
        return user ? (user.username || user.email || `ID: ${String(id).slice(-5)}...`) : `Usuario ID: ${String(id).slice(-5)}... (No encontrado)`;
    };
  return (
    <UsersContext.Provider value={{
      users,
      loading,
      error,
      getUsers,
      createUser,
      getUser,
      updateUser,
      deleteUser,
      getUserName,
    }}>
      {children}
    </UsersContext.Provider>
  );
};