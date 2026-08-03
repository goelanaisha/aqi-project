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
    </div>
  );
}