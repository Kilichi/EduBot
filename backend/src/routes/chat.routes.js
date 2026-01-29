import { Router } from 'express';
import * as chatController from '../controllers/chat.controller.js';
import { validateConfirm } from '../validators/chat.validator.js';

const router = Router();

// Ruta para el Chat de Consulta (RAG)
router.post('/consulta', chatController.consultar);

// Ruta para el Chat de Registro - Fase 1: Generar JSON sugerido
router.post('/registro/preview', chatController.previewRegistro);

// Ruta para el Chat de Registro - Fase 2: Guardar tras validación
// Aquí metemos el "validateConfirm" como escudo antes de llegar al controlador
router.post('/registro/confirm', validateConfirm, chatController.confirmRegistro);

export default router;