import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import indexRoutes from "./routes/auth.routes.js";
import excepcionRoutes from './routes/excepcion.routes.js';
import canchaRoutes from './routes/cancha.routes.js'; // <-- Importa rutas de canchas
import bloqueHorarioRoutes from './routes/bloqueHorario.routes.js'; // <-- Importa rutas de bloques
import reservaRoutes from './routes/reserva.routes.js'; 
import disponibilidadRoutes from './routes/disponibilidad.routes.js'; // <-- Importa las nuevas rutas
import noticiasRoutes from './routes/noticias.routes.js';


const app = express();
// En c:\Users\Acer\Desktop\proyectos\reservas\servidor\src\app.js
// ...
app.use(cors({
    origin: function (origin, callback) {
        console.log("Solicitud CORS - Origen recibido por el servidor:", origin); // Para depurar
        const allowedOrigins = ['http://localhost:5173', 'http://localhost:5173/']; // Lista de orígenes permitidos
        if (!origin || allowedOrigins.includes(origin)) {
            // Si el origen está en la lista (o no hay origen, como en Postman), permitir
            callback(null, true);
        } else {
            console.error("Origen no permitido por CORS:", origin);
            callback(new Error('Este origen no está permitido por la política CORS.'));
        }
    },
    credentials: true,
}));
// ...


app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


app.use(express.urlencoded({ extended: false }));
app.use(express.json())

const __dirname = dirname(fileURLToPath(import.meta.url))

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/api',indexRoutes);
app.use('/api', excepcionRoutes);
app.use('/api', canchaRoutes); // <-- Añade esta línea
app.use('/api', bloqueHorarioRoutes); // <-- Añade esta línea
app.use('/api', reservaRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes); // <-- Monta las rutas de disponibilidad
app.use("/api", noticiasRoutes);

app.use('/uploads', express.static(join(__dirname, '../uploads')));

export default app;