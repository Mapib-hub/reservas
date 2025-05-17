import multer from "multer";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
// Podríamos tener diferentes tipos de archivo o límites para canchas si quisiéramos
const MIMETYPES_CANCHA = ["image/jpeg", "image/jpg", "image/png", "image/webp"]; // Mismos que noticias por ahora

const storageCancha = multer.diskStorage({
    destination: join(CURRENT_DIR, '../../uploads/canchas'), // Directorio específico para imágenes de canchas
    filename: (req, file, cb) => {
        const fileExtension = extname(file.originalname);
        // Usamos Date.now() para asegurar nombres de archivo únicos
        cb(null, `${Date.now()}${fileExtension}`);
    },
});

export const uploadCanchaImage = multer({
    storage: storageCancha,
    fileFilter: (req, file, cb) => {
        if (MIMETYPES_CANCHA.includes(file.mimetype)) cb(null, true);
        else cb(new Error(`Solo se soportan imágenes de tipo: ${MIMETYPES_CANCHA.join(' ')} para las canchas.`));
    },
    limits: {
        fileSize: 5000000, // Límite de 5MB para imágenes de canchas (un poco más grande que noticias, por ejemplo)
    },
}).single('imagen'); // Espera un solo archivo del campo 'imagen' (coincide con el frontend)