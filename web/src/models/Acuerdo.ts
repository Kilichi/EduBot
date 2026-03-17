import mongoose, { Model, Schema } from 'mongoose';

export interface IAcuerdo {
  fecha: string;
  titulo: string;
  descripcion: string;
  etiquetas: string[];
  origen: string;
  createdAt: Date;
  updatedAt: Date;
}

type AcuerdoModel = Model<IAcuerdo>;

const acuerdoSchema = new Schema<IAcuerdo>(
  {
    fecha: {
      type: String,
      required: [true, 'La fecha es obligatoria'],
    },
    titulo: {
      type: String,
      required: [true, 'El titulo es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripcion es obligatoria'],
      minlength: [10, 'La descripcion debe ser mas detallada'],
    },
    etiquetas: {
      type: [String],
      default: [],
    },
    origen: {
      type: String,
      required: [true, 'El origen es obligatorio'],
    },
  },
  {
    timestamps: true,
  }
);

const Acuerdo = (mongoose.models.Acuerdo as AcuerdoModel) || mongoose.model<IAcuerdo, AcuerdoModel>('Acuerdo', acuerdoSchema);

export default Acuerdo;

