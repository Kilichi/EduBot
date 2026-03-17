import Groq from 'groq-sdk';

function getClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing env var: GROQ_API_KEY');
  return new Groq({ apiKey });
}

export async function generateWithGemini(prompt: string): Promise<string> {
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const client = getClient();

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'Eres un asistente escolar experto y te llamas Manuel.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 2048,
  });

  return completion.choices[0]?.message?.content ?? '';
}
