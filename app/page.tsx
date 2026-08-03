import { prisma } from '@/lib/prisma';
import AQIDashboardControls from '@/components/AQIDashboardControls';
import { getAQICategory } from '@/lib/aqiCategory';

export default async function Home() {
  const readings = await prisma.reading.findMany({
    orderBy: { fetchedAt: 'desc' },
    take: 50,
  });

  // Keep only the latest reading per station+pollutant combo
  const latestByStation = new Map<string, typeof readings[0]>();
  for (const r of readings) {
    const key = `${r.station}-${r.pollutantId}`;
    if (!latestByStation.has(key)) {
      latestByStation.set(key, r);
    }
  }
  const latest = Array.from(latestByStation.values());

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Delhi AQI Dashboard</h1>
      <AQIDashboardControls />
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
    <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Station</th>
    <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Pollutant</th>
    <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Avg Value</th>
    <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Category</th>
    <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Last Updated</th>
  </tr>
</thead>
          <tbody>
  {latest.map((r) => {
    const category = getAQICategory(r.pollutantId, r.pollutantAvg);
    return (
      <tr key={r.id}>
        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{r.station}</td>
        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{r.pollutantId}</td>
        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{r.pollutantAvg}</td>
        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
          <span style={{
            backgroundColor: category.color,
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.85rem',
          }}>
            {category.label}
          </span>
        </td>
        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{r.lastUpdate}</td>
      </tr>
    );
  })}
</tbody>
        
      </table>
    </main>
  );
}