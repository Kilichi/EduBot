import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';
import chatRoutes from './routes/chat.routes.js';
import authRoutes from './routes/auth.routes.js';

import { PORT, MONGODB_URI, SESSION_SECRET, FRONTEND_URL } from './config/env.js';
import { connectDB } from './config/db.js';

const app = express();

// 1. Middlewares básicos
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true // Permite enviar cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Configuración de sesiones con MongoDB
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        ttl: 14 * 24 * 60 * 60 // 14 días
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        httpOnly: true, // Previene acceso desde JavaScript
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 días
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Para cross-site en producción
    }
}));

// 3. Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// 4. Rutas de autenticación (deben ir antes de las rutas protegidas)
app.use('/api/auth', authRoutes);

// 5. Rutas protegidas
app.use('/api/chat', chatRoutes);

// 6. Ruta de salud para verificar que el servidor está funcionando
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// 7. Inicio del servidor (solo en desarrollo, Vercel maneja esto automáticamente)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
        console.log(`🤖 Esperando peticiones para Ollama...`);
        console.log(`🔐 Autenticación con Google OAuth configurada`);
        connectDB();
    });
} else {
    // En producción (Vercel), conectar a la base de datos al iniciar
    connectDB();
}

// Exportar para Vercel serverless functions
export default app;
