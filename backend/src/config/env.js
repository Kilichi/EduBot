// Configuración del servidor y el entorno
import dotenv from 'dotenv';
dotenv.config();

// MongoDB local
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edubot';
export const PORT = process.env.PORT || 3000;

// Ollama (LLM local)
export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// URL base de la API y del frontend (uso local)
export const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Configuración de sesiones
export const SESSION_SECRET = process.env.SESSION_SECRET || 'edubot-secret-key-change-in-production';
