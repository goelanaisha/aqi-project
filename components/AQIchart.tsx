'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Reading {
  id: number;
  pollutantAvg: string | null;
  lastUpdate: string;
}

export default function AQIChart({ station, pollutantId }: { station: string; pollutantId: string }) {
  const [data, setData] = useState<Reading[]>([]);

  useEffect(() => {
    fetch(`/api/history?station=${encodeURIComponent(station)}&pollutantId=${pollutantId}`)
      .then((res) => res.json())
      .then(setData);
  }, [station, pollutantId]);

  const chartData = data.map((r) => ({
    time: r.lastUpdate,
    value: Number(r.pollutantAvg),
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>{station} — {pollutantId} trend</h3>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}