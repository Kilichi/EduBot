import { NextResponse } from 'next/server';
import Acuerdo from '@/models/Acuerdo';
import { dbConnect } from '@/lib/mongoose';
import { generateWithGemini } from '@/lib/llm/gemini';
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
    const prompt = String(body?.prompt || '').trim();
    if (!prompt) return NextResponse.json({ error: 'Falta el prompt' }, { status: 400 });

    await dbConnect();
    const acuerdos = await Acuerdo.find()
      .select('fecha titulo descripcion origen etiquetas')
      .lean();

    if (!acuerdos.length) {
      return NextResponse.json({ respuesta: 'No hay acuerdos en la base de datos.', acuerdos: [] });
    }

    const contextoAcuerdos = acuerdos
      .map((a, i) => `[${i}] Fecha: ${a.fecha} | Titulo: ${a.titulo} | Descripcion: ${a.descripcion} | Origen: ${a.origen}`)
      .join('\n');

    const geminiPrompt = `
Eres un asistente escolar experto.
Responde al usuario basandote SOLO en los acuerdos proporcionados.
Si la pregunta no se puede responder con los acuerdos, dilo claramente.

IMPORTANTE: Al final de tu respuesta, en una linea separada, escribe EXACTAMENTE:
ACUERDOS_REF: seguido de los numeros de indice de los acuerdos que mencionas, separados por comas.
Si no mencionas ningun acuerdo, escribe: ACUERDOS_REF: ninguno

Acuerdos disponibles:
${contextoAcuerdos}

PREGUNTA DEL USUARIO: "${prompt}"
`;

    const raw = await generateWithGemini(geminiPrompt);

    let respuesta = raw;
    const refMatch = raw.match(/ACUERDOS_REF:\s*(.+)/i);
    const referencedAcuerdos: typeof acuerdos = [];

    if (refMatch) {
      respuesta = raw.replace(/ACUERDOS_REF:\s*.+/i, '').trim();
      const refText = refMatch[1].trim();
      if (refText !== 'ninguno') {
        const indices = refText.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
        for (const idx of indices) {
          if (idx >= 0 && idx < acuerdos.length) {
            referencedAcuerdos.push(acuerdos[idx]);
          }
        }
      }
    }

    const acuerdosClean = referencedAcuerdos.map((a) => ({
      fecha: a.fecha,
      titulo: a.titulo,
      descripcion: a.descripcion,
      origen: a.origen,
      etiquetas: a.etiquetas || [],
    }));

    return NextResponse.json({ respuesta, acuerdos: acuerdosClean });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error procesando la consulta';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
