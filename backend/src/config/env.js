// Configuracion del servidor y el entorno
import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mi_basededatos';
export const PORT = process.env.PORT || 3000;