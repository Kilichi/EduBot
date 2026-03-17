import { NextResponse } from 'next/server';
import { authCookieOptions, AUTH_COOKIE_NAME, signAuthToken } from '@/lib/auth';
import { dbConnect } from '@/lib/mongoose';
import Usuario from '@/models/Usuario';

const MAX_INPUT = 128;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const usuario = String(body?.usuario || '').trim().toLowerCase().slice(0, MAX_INPUT);
    const password = String(body?.password || '').slice(0, MAX_INPUT);

    if (!usuario || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña son obligatorios', autenticado: false }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(usuario)) {
      return NextResponse.json({ error: 'Formato de usuario inválido', autenticado: false }, { status: 400 });
    }

    await dbConnect();

    const user = await Usuario.findOne({ usuario, activo: true }).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos', autenticado: false }, { status: 401 });
    }

    const ok = await user.compararPassword(password);
    if (!ok) {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos', autenticado: false }, { status: 401 });
    }

    user.ultimoAcceso = new Date();
    user.esNuevo = false;
    await user.save({ validateBeforeSave: false });

    const token = signAuthToken({
      sub: user._id.toString(),
      usuario: user.usuario,
      nombre: user.nombre,
      rol: user.rol,
    });

    const response = NextResponse.json({
      autenticado: true,
      usuario: {
        id: user._id.toString(),
        usuario: user.usuario,
        nombre: user.nombre,
        esNuevo: user.esNuevo,
        rol: user.rol,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, authCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: 'Error en el servidor', autenticado: false }, { status: 500 });
  }
}
