import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginRequest, verifyTokenRequest } from '../api/auth.js'; // Ajusta la ruta si es necesario
import Cookies from 'js-cookie'; // Para manejar cookies si el backend las usa para el token

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true); // Para la verificación inicial de sesión

  const signin = async (userData) => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await loginRequest(userData);
      setUser(res.data); // Asumimos que el backend devuelve los datos del usuario
      //console.log("Usuario después de login (AuthContext):", res.data); // <--- AÑADIMOS ESTO
      setIsAuthenticated(true);
      setLoading(false);
      // Si el backend establece una cookie HttpOnly, no necesitamos hacer nada más aquí con cookies.
      // Si el backend devuelve un token en la respuesta que debemos guardar en el cliente (ej. localStorage o cookie de JS):
      // Cookies.set('token', res.data.token); // Ejemplo si el token viene en res.data.token
    } catch (error) {
      console.error("Error en signin (context):", error.response?.data || error.message);
      setErrors(error.response?.data?.message ? [error.response.data.message] : (Array.isArray(error.response?.data) ? error.response.data : ['Error al iniciar sesión']));
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  const logout = () => {
    // Si usas cookies de JS para el token, bórralas.
    Cookies.remove('token'); // Ejemplo si guardaste un token en una cookie llamada 'token'
    // Si tu backend tiene un endpoint de logout para invalidar la sesión/cookie HttpOnly, llámalo aquí.
    // await logoutRequest(); 
    setUser(null);
    setIsAuthenticated(false);
  };

  // Verificar si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    const checkLogin = async () => {
      const tokenCookie = Cookies.get('token'); // O la cookie que use tu backend para la sesión
      // Si no hay cookie de token, no intentamos verificar (a menos que tu backend maneje sesiones HttpOnly sin token visible al cliente)
      // Para este ejemplo, si no hay token visible, asumimos que no está logueado o el backend lo maneja con HttpOnly.
      // La llamada a verifyTokenRequest es crucial si el backend usa cookies HttpOnly y necesitas confirmar la sesión.
      try {
        const res = await verifyTokenRequest(); // Esta llamada es clave
        if (res.data) {
          setIsAuthenticated(true);
          setUser(res.data);
          //console.log("Usuario después de verifyToken (AuthContext):", res.data); // <--- Y ESTO
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // Si verifyTokenRequest falla (ej. 401 no autorizado), no está autenticado
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      errors,
      loading,
      signin,
      logout
      // Podríamos añadir una función signup si fuera necesaria
    }}>
      {children}
    </AuthContext.Provider>
  );
};