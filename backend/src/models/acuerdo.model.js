import mongoose from 'mongoose';

const acuerdoSchema = new mongoose.Schema({
    fecha: { 
        type: String, 
        required: [true, 'La fecha es obligatoria'] 
    },
    titulo: { 
        type: String, 
        required: [true, 'El título es obligatorio'],
        trim: true 
    },
    descripcion: { 
        type: String, 
        required: [true, 'La descripción es obligatoria'],
        minlength: [10, 'La descripción debe ser más detallada'] 
    },
    etiquetas: { 
        type: [String], 
        default: [] 
    },
    origen: { 
        type: String, 
        required: [true, 'El origen (ej. claustro) es obligatorio'] 
    }
}, { 
    timestamps: true
});

const Acuerdo = mongoose.model('Acuerdo', acuerdoSchema);
export default Acuerdo;