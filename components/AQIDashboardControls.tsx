'use client';

import { useEffect, useState } from 'react';
import AQIChart from './AQIchart';

interface StationOption {
  station: string;
  pollutantId: string;
}

export default function AQIDashboardControls() {
  const [options, setOptions] = useState<StationOption[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedPollutant, setSelectedPollutant] = useState<string>('');

  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);


  useEffect(() => {
    fetch('/api/stations')
      .then((res) => res.json())
      .then((data: StationOption[]) => {
        setOptions(data);
        if (data.length > 0) {
          setSelectedStation(data[0].station);
          setSelectedPollutant(data[0].pollutantId);
        }
      });
  }, []);

  const uniqueStations = Array.from(new Set(options.map((o) => o.station)));
  const pollutantsForStation = options
    .filter((o) => o.station === selectedStation)
    .map((o) => o.pollutantId);

    async function fetchInsight() {
    setLoadingInsight(true);
  setInsight('');
  try {
    const res = await fetch(`/api/insight?station=${encodeURIComponent(selectedStation)}&pollutantId=${selectedPollutant}`);
    const data = await res.json();
    if (data.error) {
      setInsight(`Error: ${data.error}`);
    } else {
      setInsight(data.insight);
    }
  } catch (err) {
    setInsight('Something went wrong fetching the insight.');
    console.error(err);
  } finally {
    setLoadingInsight(false);
  }
  }


  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select
          value={selectedStation}
          onChange={(e) => {
            const newStation = e.target.value;
            setSelectedStation(newStation);
            const firstPollutant = options.find((o) => o.station === newStation)?.pollutantId;
            if (firstPollutant) setSelectedPollutant(firstPollutant);
          }}
        >
          {uniqueStations.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={selectedPollutant}
          onChange={(e) => setSelectedPollutant(e.target.value)}
        >
          {pollutantsForStation.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {selectedStation && selectedPollutant && (
        <AQIChart station={selectedStation} pollutantId={selectedPollutant} />
      )}

      <button onClick={fetchInsight} disabled={loadingInsight} style={{ marginTop: '1rem', padding: '8px 16px' }}>
        {loadingInsight ? 'Analyzing...' : 'Get AI Insight'}
      </button>
      {insight && (
        <p style={{ marginTop: '1rem', padding: '12px', background: '#f3f4f6', borderRadius: '6px' }}>
          {insight}
        </p>
      )}
    </div>
  );
}