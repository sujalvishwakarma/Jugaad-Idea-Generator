import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { problem } = await req.json();

    if (!problem) {
      return NextResponse.json({ error: 'Problem is required' }, { status: 400 });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'NVIDIA API key is missing. Please configure it in the settings.' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const completion = await openai.chat.completions.create({
      model: 'meta/llama-3.1-405b-instruct',
      messages: [
        {
          role: 'system',
          content: "You are an expert in 'Jugaad', the Indian concept of a flexible approach to problem-solving that uses limited resources in an innovative way. Structure your response with a catchy title, a list of everyday items needed, and step-by-step instructions. Keep it fun, resourceful, and culturally authentic. Use Markdown for formatting.",
        },
        {
          role: 'user',
          content: `I have this problem: "${problem}". Give me a creative, low-cost, and practical (or humorously practical) 'jugaad' (Indian hack) solution.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1024,
    });

    const jugaad = completion.choices[0]?.message?.content;

    if (!jugaad) {
      throw new Error('Failed to generate a response from NVIDIA API.');
    }

    return NextResponse.json({ jugaad });
  } catch (error: any) {
    console.error('NVIDIA API Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
