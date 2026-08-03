import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const stations = await prisma.reading.findMany({
    select: { station: true, pollutantId: true },
    distinct: ['station', 'pollutantId'],
  });

  return NextResponse.json(stations);
}