/**
 * Middleware para verificar si el usuario está autenticado
 */
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    // Si no está autenticado, devolver error 401
    return res.status(401).json({
        error: 'No autenticado',
        message: 'Debes iniciar sesión para acceder a este recurso'
    });
};

/**
 * Middleware opcional para verificar autenticación (no bloquea si no está autenticado)
 */
export const optionalAuth = (req, res, next) => {
    // Simplemente continúa, la autenticación es opcional
    return next();
};
