// Configuracion del servidor y el entorno
import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mi_basededatos';
export const PORT = process.env.PORT || 3000;
export const API_GROK = process.env.API_GROK || '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';

// Configuración de Google OAuth
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// URL base de la API (para callbacks de OAuth)
// En Vercel, usar VERCEL_URL si está disponible, sino usar API_BASE_URL o localhost
export const API_BASE_URL = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : (process.env.API_BASE_URL || `http://localhost:${PORT}`);

// Configuración de sesiones
export const SESSION_SECRET = process.env.SESSION_SECRET || 'edubot-secret-key-change-in-production';
// En Vercel, usar VERCEL_URL para el frontend también
export const FRONTEND_URL = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : (process.env.FRONTEND_URL || 'http://localhost:5173');