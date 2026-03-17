import { NextResponse } from 'next/server';
import { generateWithGemini } from '@/lib/llm/gemini';
import { getAuthPayload } from '@/lib/server-auth';

type AgreementShape = {
  fecha: string;
  titulo: string;
  descripcion: string;
  etiquetas: string[];
  origen: string;
};

function extractJsonObject(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < 0 || end <= start) {
    throw new Error('La IA no devolvio un JSON valido');
  }
  return text.slice(start, end + 1);
}

function normalizeAgreement(input: Partial<AgreementShape>): AgreementShape {
  const today = new Date();
  const fallbackDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  return {
    fecha: String(input.fecha || fallbackDate),
    titulo: String(input.titulo || 'Acuerdo sin titulo').trim(),
    descripcion: String(input.descripcion || '').trim(),
    etiquetas: Array.isArray(input.etiquetas) ? input.etiquetas.map((e) => String(e).trim()).filter(Boolean) : [],
    origen: String(input.origen || 'No especificado').trim(),
  };
}

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
    const text = String(body?.text || '').trim();
    if (!text) return NextResponse.json({ error: 'Falta el texto a estructurar' }, { status: 400 });

    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const prompt = `
Eres un asistente experto en gestion documental escolar.
La fecha de hoy es ${todayStr}.
Extrae un acuerdo de reunion a partir del siguiente texto:
"${text}"

REGLAS:
1. Si el usuario dice "hoy", "ahora" o no especifica fecha, usa la fecha de hoy: ${todayStr}.
2. Si dice "ayer", calcula la fecha correspondiente.
3. Devuelve EXCLUSIVAMENTE un objeto JSON, sin texto adicional ni bloques markdown.

Estructura exacta:
{
  "fecha": "DD/MM/AAAA",
  "titulo": "Titulo breve del acuerdo",
  "descripcion": "Explicacion detallada de lo acordado",
  "etiquetas": ["etiqueta1", "etiqueta2"],
  "origen": "Tipo de reunion (ej: Claustro, CCP, Departamento)"
}
`;

    const raw = await generateWithGemini(prompt);
    const json = extractJsonObject(raw);
    const parsed = JSON.parse(json) as Partial<AgreementShape>;
    const normalized = normalizeAgreement(parsed);

    if (!normalized.descripcion || normalized.descripcion.length < 10) {
      return NextResponse.json(
        { error: 'La descripcion generada es demasiado corta. Revisa el texto de entrada.' },
        { status: 400 }
      );
    }

    return NextResponse.json(normalized);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'La IA no pudo formatear el texto';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

