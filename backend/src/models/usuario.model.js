import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    nombre: {
        type: String,
        required: true,
        trim: true
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

usuarioSchema.index({ usuario: 1, activo: 1 });

// Hash de contraseña antes de guardar
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

usuarioSchema.methods.compararPassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
