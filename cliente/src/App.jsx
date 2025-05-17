import { Routes, Route } from "react-router-dom";
import { NotiProvider } from "./context/NoticiaContex.jsx"; // Ya no se importa ni usa aquí
import { CanchasProvider } from "./context/CanchasContext.jsx"; // Importamos el nuevo provider
import { AuthProvider } from "./context/AuthContext.jsx"; // Importamos el AuthProvider
import { UsersProvider } from "./context/UsersContext.jsx"; // Importamos el UsersProvider
import { BloqueHorariosProvider } from "./context/BloqueHorariosContext.jsx"; // Importamos el BloqueHorariosProvider
import { ExcepcionProvider } from './context/ExcepcionContext'; // 1. Importamos el nuevo provider
import { ReservaProvider } from './context/ReservaContext'; // 1. Importamos el nuevo provider de Reservas

// Páginas Públicas
import HomePage from './pages/public/HomePage.jsx'; // Asumimos que esta página existe
import CanchaspublicPage from './pages/public/CanchasPage.jsx'; // <-- 1. Importamos la nueva página
import TarifasPage from './pages/public/TarifasPage.jsx';
import ContactoPage from './pages/public/ContactoPage.jsx';
import PublicNoticiasPage from './pages/public/PublicNoticiasPage.jsx'; // Importamos la página pública de noticias
import PublicNoticiaDetallePage from './pages/public/PublicNoticiaDetallePage.jsx'; // Importamos la página de detalle de noticia
import PublicCanchaDetallePage from './pages/public/PublicCanchaDetallePage.jsx'; // Importamos la página de detalle de cancha

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx'; // CORREGIDO: Usar el layout existente en components/admin
import UserLayout from './layouts/UserLayout.jsx';   // UserLayout sí es nuevo y está en layouts
import ProtectedRoute from './middleware/ProtectedRoutes.jsx'; // Renombrado para claridad (antes ProtectedRoutes)
// Admin Pages
import DashboardPage from './pages/admin/DashboardPage.jsx';
import CanchasPage from './pages/admin/CanchasPage.jsx';
import HorariosPage from './pages/admin/HorariosPage.jsx';
import NoticiasPage from './pages/admin/NoticiasPage.jsx';
import ReservasPage from './pages/admin/ReservasPage.jsx';
import UsuariosPage from './pages/admin/UsuariosPage.jsx';
import ExcepcionesPage from './pages/admin/ExcepcionesPage.jsx';
import NoticiaFormPage from './pages/admin/NoticiaFormPage.jsx';
import CanchaFormPage from './pages/admin/CanchaFormPage.jsx'; // Importamos la nueva página
import UserFormPage from './pages/admin/UserFormPage.jsx'; // Importamos la página de formulario de usuario
import LoginPage from './pages/LoginPage.jsx'; // Importamos la página de Login
import ExcepcionFormPage from './pages/admin/ExcepcionFormPage.jsx'; // Asumimos que este será el nombre del form
import BloqueHorarioForm from './pages/admin/BloqueHorarioForm.jsx'; // Importamos la página de formulario de bloque horario
import ReservaFormPage from './pages/admin/ReservaFormPage.jsx'; // 1. Importamos el futuro formulario de reservas

// User Pages (ejemplos, algunas podrían no existir aún)
import UserDashboardPage from './pages/user/UserDashboardPage.jsx'; // Ejemplo
import MisReservasPage from './pages/user/MisReservasPage.jsx';     // Ejemplo
import HacerReservaPage from './pages/user/HacerReservaPage.jsx';   // Ejemplo
import UserProfilePage from './pages/user/UserProfilePage.jsx';     // Ejemplo
// Webfront Pages (ejemplos, aún no creadas)
// import HomePage from './pages/web/HomePage.jsx';


function App() {
  return (
    <AuthProvider>
      <ReservaProvider>
        <ExcepcionProvider>
          <UsersProvider> {/* Mantenemos el UsersProvider */}
            <NotiProvider> {/* Mantenemos el NoticiasProvider */}
              <CanchasProvider> {/* Envolvemos con CanchasProvider */}
                <BloqueHorariosProvider>
                  <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<PublicLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="/canchas" element={<CanchaspublicPage />} />
                       <Route path="/canchas/:idCancha" element={<PublicCanchaDetallePage />} />
                      <Route path="/tarifas" element={<TarifasPage />} />
                      <Route path="/noticias" element={<PublicNoticiasPage />} />
                      <Route path="/noticias/:idNoticia" element={<PublicNoticiaDetallePage />} />
                      <Route path="/contacto" element={<ContactoPage />} />
                      {/* Aquí añadiremos más rutas públicas como /canchas, /contacto, etc. */}
                    </Route>

                    {/* Rutas Protegidas para Administradores */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                      <Route path="/admin" element={<AdminLayout />}> {/* AdminLayout envuelve las rutas de admin */}
                        <Route index element={<DashboardPage />} /> {/* /admin */}
                        <Route path="dashboard" element={<DashboardPage />} /> {/* /admin/dashboard */}
                        <Route path="canchas" element={<CanchasPage />} /> {/* /admin/canchas */}
                        <Route path="canchas/nueva" element={<CanchaFormPage />} /> {/* /admin/canchas/nueva */}
                        <Route path="canchas/editar/:id" element={<CanchaFormPage />} /> {/* /admin/canchas/editar/:id */}
                        <Route path="horarios" element={<HorariosPage />} /> {/* /admin/horarios */}
                        <Route path="horarios/nuevo" element={<BloqueHorarioForm />} /> {/* /admin/horarios/nuevo */}
                        <Route path="horarios/editar/:id" element={<BloqueHorarioForm />} /> {/* /admin/horarios/editar/:id */}
                        <Route path="noticias" element={<NoticiasPage />} /> {/* /admin/noticias */}
                        <Route path="noticias/nueva" element={<NoticiaFormPage />} /> {/* /admin/noticias/nueva */}
                        <Route path="noticias/editar/:id" element={<NoticiaFormPage />} /> {/* /admin/noticias/editar/:id */}
                        <Route path="reservas" element={<ReservasPage />} /> {/* /admin/reservas (todas las reservas) */}
                        <Route path="reservas/nueva" element={<ReservaFormPage />} /> {/* /admin/reservas/nueva */}
                        <Route path="reservas/editar/:id" element={<ReservaFormPage />} /> {/* /admin/reservas/editar/:id */}
                        <Route path="usuarios" element={<UsuariosPage />} /> {/* /admin/usuarios */}
                        <Route path="usuarios/nuevo" element={<UserFormPage />} /> {/* /admin/usuarios/nuevo */}
                        <Route path="usuarios/editar/:id" element={<UserFormPage />} /> {/* /admin/usuarios/editar/:id */}
                        <Route path="excepciones" element={<ExcepcionesPage />} /> {/* /admin/excepciones */}
                        <Route path="excepciones/nueva" element={<ExcepcionFormPage />} /> {/* /admin/excepciones/nueva */}
                        <Route path="excepciones/editar/:id" element={<ExcepcionFormPage />} /> {/* /admin/excepciones/editar/:id */}
                      </Route> {/* Fin de rutas anidadas en AdminLayout */}
                    </Route> {/* Fin de ProtectedRoute para admin */}

                    {/* Rutas Protegidas para Usuarios Normales (y también admins si quieres) */}
                    {/* Si un admin también puede usar estas rutas, 'admin' debe estar en allowedRoles */}
                    <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                      <Route path="/usuario" element={<UserLayout />}> {/* UserLayout envuelve las rutas de usuario */}
                        <Route index element={<UserDashboardPage />} /> {/* /usuario */}
                        <Route path="dashboard" element={<UserDashboardPage />} /> {/* /usuario/dashboard */}
                        <Route path="reservar" element={<HacerReservaPage />} /> {/* /usuario/reservar */}
                        <Route path="mis-reservas" element={<MisReservasPage />} /> {/* /usuario/mis-reservas */}
                        <Route path="perfil" element={<UserProfilePage />} /> {/* /usuario/perfil */}
                        {/* Aquí podrían ir otras rutas específicas para el usuario */}
                      </Route> {/* Fin de rutas anidadas en UserLayout */}
                    </Route>

                    {/* Ruta para página no encontrada */}
                    <Route path="/*" element={<h1>404 - Página No Encontrada</h1>} />

                  </Routes>
                </BloqueHorariosProvider>
              </CanchasProvider>
            </NotiProvider>
          </UsersProvider>
        </ExcepcionProvider>
      </ReservaProvider>
    </AuthProvider>
  )
}

export default App;
