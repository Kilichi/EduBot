import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        trim: true
    },
    foto: {
        type: String,
        default: null
    },
    esNuevo: {
        type: Boolean,
        default: true
    },
    activo: {
        type: Boolean,
        default: true
    },
    rol: {
        type: String,
        enum: ['usuario', 'admin'],
        default: 'usuario'
    },
    ultimoAcceso: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índice compuesto para búsquedas rápidas
usuarioSchema.index({ googleId: 1, activo: 1 });

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
