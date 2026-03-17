import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Usuario from '@/models/Usuario';
import { validateRegisterForm } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const usuario = String(body?.usuario || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const nombre = String(body?.nombre || '').trim();

    const validation = validateRegisterForm(usuario, password, nombre);
    if (!validation.valid) {
      const allErrors = [...validation.usuario, ...validation.nombre, ...validation.password];
      return NextResponse.json({ error: allErrors[0] }, { status: 400 });
    }

    await dbConnect();

    const existente = await Usuario.findOne({ usuario });
    if (existente) {
      return NextResponse.json({ error: 'Ese nombre de usuario ya existe' }, { status: 409 });
    }

    const nuevo = await Usuario.create({
      usuario,
      password,
      nombre,
      rol: 'usuario',
      activo: true,
    });

    return NextResponse.json(
      {
        message: 'Usuario creado',
        usuario: {
          id: nuevo._id.toString(),
          usuario: nuevo.usuario,
          nombre: nuevo.nombre,
          rol: nuevo.rol,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 });
  }
}
