import { Router } from 'express';
import * as chatController from '../controllers/chat.controller.js';
import { validateConfirm } from '../validators/chat.validator.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas de chat requieren autenticación
// Ruta para el Chat de Consulta (RAG)
router.post('/consulta', isAuthenticated, chatController.consultar);

// Ruta para el Chat de Registro - Fase 1: Generar JSON sugerido
router.post('/registro/preview', isAuthenticated, chatController.previewRegistro);

// Ruta para el Chat de Registro - Fase 2: Guardar tras validación
// Aquí metemos el "validateConfirm" como escudo antes de llegar al controlador
router.post('/registro/confirm', isAuthenticated, validateConfirm, chatController.confirmRegistro);

export default router;