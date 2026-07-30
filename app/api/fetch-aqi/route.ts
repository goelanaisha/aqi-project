import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RESOURCE_ID = '3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69';
const API_KEY = process.env.DATA_GOV_API_KEY;

interface AQIRecord {
  state: string;
  city: string;
  station: string;
  last_update: string;
  pollutant_id: string;
  min_value: string;
  max_value: string;
  avg_value: string;
}

export async function GET() {
  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=50&filters[city]=Delhi`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json() as { records: AQIRecord[] };

    for (const record of data.records) {
      await prisma.reading.create({
        data: {
          state: record.state,
          city: record.city,
          station: record.station,
          pollutantId: record.pollutant_id,
          pollutantMin: record.min_value,
          pollutantMax: record.max_value,
          pollutantAvg: record.avg_value,
          lastUpdate: record.last_update,
        },
      });
    }

    return NextResponse.json({ success: true, count: data.records.length });
  } catch (err) {
    console.error('Error fetching AQI data:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}