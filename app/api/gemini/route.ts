
//app/api/gemini/route.ts
import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await generateContent(prompt);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to process with Gemini API' },
      { status: 500 }
    );
  }
}