import { NextResponse } from 'next/server';
import { authCookieOptions, AUTH_COOKIE_NAME, signAuthToken } from '@/lib/auth';
import { dbConnect } from '@/lib/mongoose';
import Usuario from '@/models/Usuario';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const usuario = String(body?.usuario || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!usuario || !password) {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos', autenticado: false }, { status: 401 });
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

