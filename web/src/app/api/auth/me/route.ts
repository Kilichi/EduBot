import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Usuario from '@/models/Usuario';
import { getAuthPayload } from '@/lib/server-auth';

export async function GET() {
  const payload = await getAuthPayload();
  if (!payload) {
    return NextResponse.json(
      { error: 'No autenticado', message: 'Debes iniciar sesión para acceder a este recurso' },
      { status: 401 }
    );
  }

  await dbConnect();
  const user = await Usuario.findById(payload.sub).lean();
  if (!user) {
    return NextResponse.json(
      { error: 'No autenticado', message: 'Debes iniciar sesión para acceder a este recurso' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    usuario: {
      id: String(user._id),
      usuario: user.usuario,
      nombre: user.nombre,
      esNuevo: user.esNuevo,
      rol: user.rol,
      ultimoAcceso: user.ultimoAcceso,
    },
  });
}

