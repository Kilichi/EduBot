import { Router } from 'express';
import passport from '../config/passport.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * Iniciar autenticación con Google
 */
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

/**
 * Callback de Google OAuth
 */
router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login?error=auth_failed' 
    }),
    (req, res) => {
        // Redirigir al frontend después de autenticación exitosa
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/dashboard`);
    }
);

/**
 * Verificar estado de autenticación
 */
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({
            autenticado: true,
            usuario: {
                id: req.user._id,
                email: req.user.email,
                nombre: req.user.nombre,
                apellido: req.user.apellido,
                foto: req.user.foto,
                esNuevo: req.user.esNuevo,
                rol: req.user.rol
            }
        });
    }
    
    return res.json({
        autenticado: false,
        usuario: null
    });
});

/**
 * Cerrar sesión
 */
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid');
            res.json({ 
                message: 'Sesión cerrada correctamente',
                autenticado: false 
            });
        });
    });
});

/**
 * Obtener información del usuario actual
 */
router.get('/me', isAuthenticated, (req, res) => {
    res.json({
        usuario: {
            id: req.user._id,
            email: req.user.email,
            nombre: req.user.nombre,
            apellido: req.user.apellido,
            foto: req.user.foto,
            esNuevo: req.user.esNuevo,
            rol: req.user.rol,
            ultimoAcceso: req.user.ultimoAcceso
        }
    });
});

export default router;
