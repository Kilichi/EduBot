import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import chatRoutes from './routes/chat.routes.js';

import { PORT } from './config/env.js';
import { connectDB } from './config/db.js';

const app = express();

// 1. Middlewares
app.use(cors()); // Permite que tu Frontend (React) se conecte
app.use(express.json()); // Permite leer el cuerpo de las peticiones JSON

// 2. Rutas
app.use('/api/chat', chatRoutes);

// 3. Inicio del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
    console.log(`🤖 Esperando peticiones para Ollama...`);
    connectDB();
});
