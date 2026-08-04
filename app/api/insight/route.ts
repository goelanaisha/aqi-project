import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const station = searchParams.get('station');
  const pollutantId = searchParams.get('pollutantId');

  if (!station || !pollutantId) {
    return NextResponse.json({ error: 'station and pollutantId are required' }, { status: 400 });
  }

  const readings = await prisma.reading.findMany({
    where: { station, pollutantId },
    orderBy: { fetchedAt: 'desc' },
    take: 10,
  });

  if (readings.length === 0) {
    return NextResponse.json({ insight: 'Not enough data yet for this station.' });
  }

  const dataSummary = readings
    .map((r) => `${r.lastUpdate}: avg=${r.pollutantAvg}, min=${r.pollutantMin}, max=${r.pollutantMax}`)
    .join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: `You are analyzing air quality data for ${station}, pollutant ${pollutantId}. Here are the most recent readings:\n\n${dataSummary}\n\nIn 2-3 short sentences, describe what's happening with this pollutant at this station based ONLY on this data. Do not invent causes (like traffic, weather, construction) unless the data itself shows a clear pattern like a trend or spike. If there isn't enough variation to say anything meaningful, say so plainly.`,
  });

  return NextResponse.json({ insight: response.text });
}