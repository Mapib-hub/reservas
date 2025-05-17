export const adminRequire = (req, res, next) => {
    // Se asume que authRequire ya se ejecutó y req.user está disponible
    if (req.user && req.user.role === 'admin') {
        next(); // El usuario es admin, continuar
    } else {
        res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
    }
};

// Podríamos añadir más roles en el futuro, ej: (req, res, next, rolesPermitidos) => { ... }
// pero por ahora, con 'admin' es suficiente.