import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const station = searchParams.get('station');
  const pollutantId = searchParams.get('pollutantId') || 'PM2.5';

  if (!station) {
    return NextResponse.json({ error: 'station query param is required' }, { status: 400 });
  }

  const readings = await prisma.reading.findMany({
    where: { station, pollutantId },
    orderBy: { fetchedAt: 'asc' },
    take: 100,
  });

  return NextResponse.json(readings);
}