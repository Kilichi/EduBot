import bcrypt from 'bcryptjs';
import mongoose, { HydratedDocument, Model, Schema } from 'mongoose';

export interface IUser {
  usuario: string;
  password: string;
  nombre: string;
  esNuevo: boolean;
  activo: boolean;
  rol: 'usuario' | 'admin';
  ultimoAcceso: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  compararPassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, object, IUserMethods>;

const usuarioSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    usuario: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    esNuevo: {
      type: Boolean,
      default: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    rol: {
      type: String,
      enum: ['usuario', 'admin'],
      default: 'usuario',
    },
    ultimoAcceso: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

usuarioSchema.index({ usuario: 1, activo: 1 });

usuarioSchema.pre('save', async function savePassword(this: HydratedDocument<IUser>) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

usuarioSchema.methods.compararPassword = function compararPassword(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Usuario = (mongoose.models.Usuario as UserModel) || mongoose.model<IUser, UserModel>('Usuario', usuarioSchema);

export default Usuario;

