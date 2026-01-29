// validacion de la api con express-validator

import { body } from 'express-validator';
import { validateResult } from '../utils/validateHelper.js'; // Un helper para manejar errores

export const validateAcuerdo = [
    body('fecha').exists().notEmpty().withMessage('La fecha es requerida'),
    body('titulo').exists().trim().isLength({ min: 5 }).withMessage('Título demasiado corto'),
    body('descripcion').exists().notEmpty().withMessage('La descripción no puede estar vacía'),
    body('origen').exists().withMessage('El origen es obligatorio'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];