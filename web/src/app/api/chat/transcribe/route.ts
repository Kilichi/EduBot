import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;

    if (!audioBlob) {
      return NextResponse.json({ error: 'No se envió audio' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key no configurada' }, { status: 500 });
    }

    const buffer = Buffer.from(await audioBlob.arrayBuffer());

    const groqResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: buffer,
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      return NextResponse.json({ error: 'Error en transcripción' }, { status: 500 });
    }

    const result = await groqResponse.json();
    return NextResponse.json({ text: result.text || '' });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
