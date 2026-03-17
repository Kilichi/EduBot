import { NextResponse } from 'next/server';
import { getAuthPayload } from '@/lib/server-auth';
import { dbConnect } from '@/lib/mongoose';
import Usuario from '@/models/Usuario';

export async function GET() {
  const payload = await getAuthPayload();
  if (!payload) {
    return NextResponse.json({ autenticado: false, usuario: null });
  }

  await dbConnect();
  const user = await Usuario.findById(payload.sub).lean();
  if (!user) {
    return NextResponse.json({ autenticado: false, usuario: null });
  }

  return NextResponse.json({
    autenticado: true,
    usuario: {
      id: String(user._id),
      usuario: user.usuario,
      nombre: user.nombre,
      esNuevo: user.esNuevo,
      rol: user.rol,
    },
  });
}

