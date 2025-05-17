import multer from "multer";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ["image/jpeg", "image/jpg", "image/png"];

const storage = multer.diskStorage({
    destination: join(CURRENT_DIR, '../../uploads/noticias'), // Directorio donde se guardarán las imágenes de noticias
    filename: (req, file, cb) => {
        const fileExtension = extname(file.originalname);
        // Usamos Date.now() para asegurar nombres de archivo únicos y evitar sobreescrituras
        cb(null, `${Date.now()}${fileExtension}`);
    },
});
 
export const uploadNoticiaImage = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (MIMETYPES.includes(file.mimetype)) cb(null, true);
        else cb(new Error(`Solo se soportan imágenes de tipo: ${MIMETYPES.join(' ')}`));
    },
    limits: {
        fileSize: 2000000, // 2MB límite de tamaño
    },
}).single('image'); // Espera un solo archivo del campo 'foto_noti'