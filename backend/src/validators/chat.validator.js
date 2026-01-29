import { body, validationResult } from 'express-validator';

// Middleware para capturar errores de validación
const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errores de validación:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateConfirm = [
    body('fecha').notEmpty().withMessage('La fecha es obligatoria'),
    body('titulo').isLength({ min: 5 }).withMessage('El título debe tener al menos 5 caracteres'),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    body('origen').notEmpty().withMessage('El origen (claustro, etc.) es obligatorio'),
    validateResult
];