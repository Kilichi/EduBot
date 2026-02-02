// Configuracion del servidor y el entorno
import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mi_basededatos';
export const PORT = process.env.PORT || 3000;
export const API_GROK = process.env.API_GROK || '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'