import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js"; // <-- AÑADIR: Importar el modelo User

export const authRequire = (req, res, next) => {
    const {token} = req.cookies;

    if(!token) return res.status(400).json({message: "No Token, No Autorizado"});

    jwt.verify(token, TOKEN_SECRET, async (err, decodedPayload)=> { // <-- Hacer la función callback async y renombrar 'user' a 'decodedPayload'
        if(err) return res.status(403).json({message: "Invalid Token"});
    
        try {
            const userFound = await User.findById(decodedPayload.id).select("-password"); // Buscar usuario por ID del token y excluir contraseña
            if (!userFound) return res.status(401).json({ message: "Usuario no encontrado / Token inválido" });

            req.user = userFound; // Asignar el objeto completo del usuario (con rol) a req.user
            next();
        } catch (error) {
            console.error("Error en authRequire al buscar usuario:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    })
}; 