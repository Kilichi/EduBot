import { NextResponse } from 'next/server';
import Acuerdo from '@/models/Acuerdo';
import { dbConnect } from '@/lib/mongoose';
import { getAuthPayload } from '@/lib/server-auth';

export async function POST(request: Request) {
  const payload = await getAuthPayload();
  if (!payload) {
    return NextResponse.json(
      { error: 'No autenticado', message: 'Debes iniciar sesión para acceder a este recurso' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    await dbConnect();
    const nuevoAcuerdo = new Acuerdo(body);
    const guardado = await nuevoAcuerdo.save();

    return NextResponse.json(
      {
        message: 'Acuerdo registrado con exito',
        data: guardado,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al guardar el acuerdo';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

