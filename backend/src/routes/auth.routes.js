import { Router } from 'express';
import passport from '../config/passport.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import Usuario from '../models/usuario.model.js';

const router = Router();

/**
 * Login con usuario y contraseña
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor', autenticado: false });
        }
        if (!user) {
            return res.status(401).json({
                error: info?.message || 'Usuario o contraseña incorrectos',
                autenticado: false
            });
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                return res.status(500).json({ error: 'Error al iniciar sesión', autenticado: false });
            }
            return res.json({
                autenticado: true,
                usuario: {
                    id: user._id,
                    usuario: user.usuario,
                    nombre: user.nombre,
                    esNuevo: user.esNuevo,
                    rol: user.rol
                }
            });
        });
    })(req, res, next);
});

/**
 * Registro de nuevo usuario (opcional)
 */
router.post('/register', async (req, res) => {
    try {
        const { usuario, password, nombre } = req.body;
        if (!usuario || !password || !nombre) {
            return res.status(400).json({
                error: 'Faltan campos: usuario, password y nombre son obligatorios'
            });
        }
        const existente = await Usuario.findOne({ usuario: usuario.toLowerCase() });
        if (existente) {
            return res.status(409).json({ error: 'Ese nombre de usuario ya existe' });
        }
        const nuevo = await Usuario.create({
            usuario: usuario.trim().toLowerCase(),
            password: password,
            nombre: nombre.trim(),
            rol: 'usuario',
            activo: true
        });
        const u = nuevo.toObject();
        delete u.password;
        res.status(201).json({
            message: 'Usuario creado',
            usuario: { id: u._id, usuario: u.usuario, nombre: u.nombre, rol: u.rol }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

/**
 * Verificar estado de autenticación
 */
router.get('/status', (req, res) => {
    if (req.isAuthenticated() && req.user) {
        return res.json({
            autenticado: true,
            usuario: {
                id: req.user._id,
                usuario: req.user.usuario,
                nombre: req.user.nombre,
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
            usuario: req.user.usuario,
            nombre: req.user.nombre,
            esNuevo: req.user.esNuevo,
            rol: req.user.rol,
            ultimoAcceso: req.user.ultimoAcceso
        }
    });
});

export default router;
