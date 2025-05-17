import { Router } from "express";
import { login, register, logout, profile, verifyToken, getUsers, createUser, updateUser, getUser, deleteUser } from "../controllers/auth.controller.js"; // Añadimos deleteUser
import { validateSchema } from "../middlewares/validator.middleware.js";
import { authRequire } from "../middlewares/validateToken.js"; // Importamos authRequire
import {registerSchema, loginSchema } from  "../schema/auth.schema.js";
import { adminRequire } from "../middlewares/adminRequire.js"; // Importamos el nuevo middleware


const router = Router()

router.post('/login',validateSchema(loginSchema), login);

router.post('/register', register);

router.post('/logout', logout);

router.get('/verify', verifyToken);

router.get('/profile', authRequire, profile); // Aplicamos authRequire

// Rutas para administración de usuarios (requieren ser admin)
router.get('/users', authRequire, adminRequire, getUsers); // Aplicamos authRequire y adminRequire
router.post('/users', authRequire, adminRequire, createUser); // Aplicamos authRequire y adminRequire
router.get('/users/:id', authRequire, adminRequire, getUser); // Asumiendo que quieres proteger esta también
router.put('/users/:id', authRequire, adminRequire, updateUser);  // Aplicamos authRequire y adminRequire
router.delete('/users/:id', authRequire, adminRequire, deleteUser); // Aplicamos authRequire y adminRequire

export default router 