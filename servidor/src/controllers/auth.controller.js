import User from "../models/user.model.js";
import multer from "multer";
import {dirname, extname, join} from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcryptjs';
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ["image/jpeg", "image/png"];

const multerUpload = multer({
    storage : multer.diskStorage({
        destination: join(CURRENT_DIR, '../uploads'),
        filename:(req, file, cb) => {
            const filetension = extname(file.originalname);
            const fileName = file.originalname.split(filetension)[0];

            cb(null, `${fileName}${Date.now()}${filetension}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        if(MIMETYPES.includes(file.mimetype)) cb(null, true)
        else cb( new Error(`Solo ${MIMETYPES.join(' ')}este tipo de imagenes es soportada`));
    },
    limits: {
        fileSize: 2000000,
    },

});

export const register = async (req, res) => {
    const {email, password, username} = req.body ;
    console.log(email, password, username);

   // Validación básica
   if (!email || !password || !username) {
       return res.status(400).json({ message: "Faltan campos requeridos: email, password y username." });
   }

   try {
       // Hashear la contraseña
       const passwordHash = await bcrypt.hash(password, 10); // 10 es el número de rondas de salt
       const newUser = new User ({
           username,
           password: passwordHash, // Guarda la contraseña hasheada
           email,
           // role: 'user' // El rol se asignará por defecto según el modelo, o se puede especificar aquí si es necesario.
           // image: req.file ? req.file.path : undefined // Opcional: Guarda la ruta si se subió imagen
       });
       console.log(newUser);
       const userSaved = await newUser.save(); // <-- Guarda el usuario en la BD
       // Devolvemos los datos del usuario creado (sin la contraseña)
       res.status(201).json({ id: userSaved._id, username: userSaved.username, email: userSaved.email, role: userSaved.role, createdAt: userSaved.createdAt });
   } catch (error) {
       console.log(error);
       // Manejar error si el email o username ya existen (código 11000)
       if (error.code === 11000) {
           return res.status(409).json({ message: "Error: El email o nombre de usuario ya está registrado." });
       }
       res.status(500).json({ message: "Error interno al registrar el usuario", error: error.message });
   }
};

 
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json({ message: "Usuario NO encontrado" });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Credenciales Invalidas" });

        const token = await createAccessToken({ id: userFound._id, role: userFound.role }); // Incluimos el rol en el token

        res.cookie("token", token);
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role, // Incluimos el rol en la respuesta
        });
        //console.log(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
}; 
export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id)

        if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role, // Incluimos el rol
        });
    } catch (error) {
        console.log(error);
    }
}

export const verifyToken = async (req, res) => {
    const { token } = req.cookies
    if (!token) return res.status(401).json({ message: "No Autorizado" });

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "No Autorizado" });

        const userFound = await User.findById(user.id)
        if (!userFound) return res.status(401).json({ message: "No Autorizado" });

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role, // Incluimos el rol
        });
    });
};
export const getUsers = async (req, res) => {
    try {
        // Buscamos todos los usuarios y seleccionamos los campos que queremos devolver
        // Es importante NO devolver el password.
        const users = await User.find().select('-password'); // El '-' antes de password lo excluye
        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error interno al obtener la lista de usuarios", error: error.message });
    }
};
// Nueva función para que un administrador cree usuarios
export const createUser = async (req, res) => {
    const { email, password, username, role } = req.body; // El admin puede especificar el rol

    try {
        // Validar si el email ya existe (opcional, pero buena práctica)
        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(400).json({ message: ["El correo ya está en uso"] });
        }

        // Hashear la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            role: role || 'user', // Si no se especifica rol, por defecto 'user'
        });

        const userSaved = await newUser.save();

        // Devolver los datos del usuario creado (sin la contraseña)
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            role: userSaved.role,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        });

    } catch (error) {
        console.error("Error al crear usuario por admin:", error); // Log para el servidor
        res.status(500).json({ message: ["Error interno al crear el usuario"], error: error.message });
    }
};
// Nueva función para que un administrador actualice usuarios
export const updateUser = async (req, res) => {
    const { id } = req.params; // El ID del usuario a actualizar viene de la URL
    const { username, email, password, role } = req.body; // Datos a actualizar

    try {
        const updateData = {};
        if (username) updateData.username = username;
        if (email) {
            // Opcional: Verificar si el nuevo email ya está en uso por OTRO usuario
            const existingUserWithEmail = await User.findOne({ email: email, _id: { $ne: id } });
            if (existingUserWithEmail) {
                return res.status(400).json({ message: ["El nuevo correo ya está en uso por otro usuario"] });
            }
            updateData.email = email;
        }
        if (password) {
            // Si se provee una nueva contraseña, hashearla
            updateData.password = await bcrypt.hash(password, 10);
        }
        if (role) {
            // Validar que el rol sea uno de los permitidos por el esquema
            // (Mongoose lo hará automáticamente si 'role' tiene 'enum' en el modelo,
            // pero podrías añadir una verificación explícita aquí si quisieras un mensaje más amigable)
            updateData.role = role;
        }

        // Si no hay datos para actualizar, podríamos devolver un error o un mensaje
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: ["No se proporcionaron datos para actualizar"] });
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        // { new: true } es para que devuelva el documento actualizado
        // .select("-password") para no devolver el hash de la contraseña

        if (!updatedUser) {
            return res.status(404).json({ message: ["Usuario no encontrado"] });
        }

        res.json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        });

    } catch (error) {
        console.error("Error al actualizar usuario por admin:", error);
        // Manejo específico para errores de validación de Mongoose (ej. rol inválido)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: Object.values(error.errors).map(err => err.message) });
        }
        res.status(500).json({ message: ["Error interno al actualizar el usuario"], error: error.message });
    }
};
// Nueva función para que un administrador obtenga un usuario por ID
export const getUser = async (req, res) => {
    const { id } = req.params; // El ID del usuario a obtener viene de la URL

    try {
        const userFound = await User.findById(id).select("-password"); // .select("-password") para no devolver el hash

        if (!userFound) {
            return res.status(404).json({ message: ["Usuario no encontrado"] });
        }

        // Devolvemos los datos del usuario encontrado
        // Mongoose por defecto devuelve un objeto con los campos del modelo,
        // así que podemos enviarlo directamente o construir un objeto si queremos ser más explícitos.
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });

    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        // Si el ID no tiene un formato válido para MongoDB ObjectId, Mongoose puede lanzar un error CastError
        if (error.name === 'CastError') {
            return res.status(400).json({ message: ["ID de usuario no válido"] });
        }
        res.status(500).json({ message: ["Error interno al obtener el usuario"], error: error.message });
    }
};
// Nueva función para que un administrador elimine un usuario por ID
export const deleteUser = async (req, res) => {
    const { id } = req.params; // El ID del usuario a eliminar viene de la URL

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: ["Usuario no encontrado"] });
        }

        // Si se elimina correctamente, usualmente se responde con un estado 204 (No Content)
        // o un mensaje de éxito. Un 204 es común para operaciones DELETE exitosas.
        // Opcionalmente, puedes devolver el objeto del usuario eliminado si es útil.
        // res.json({ message: "Usuario eliminado correctamente", user: deletedUser });
        return res.status(200).json({ message: "Usuario eliminado correctamente" }); // O res.sendStatus(204) para no enviar cuerpo

    } catch (error) {
        console.error("Error al eliminar usuario por ID:", error);
        // Si el ID no tiene un formato válido para MongoDB ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({ message: ["ID de usuario no válido"] });
        }
        res.status(500).json({ message: ["Error interno al eliminar el usuario"], error: error.message });
    }
};
