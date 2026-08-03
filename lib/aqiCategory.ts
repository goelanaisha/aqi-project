export function getAQICategory(pollutantId: string, avgValue: string | null): {
  label: string;
  color: string;
} {
  if (!avgValue || avgValue === 'NA' || isNaN(Number(avgValue))) {
    return { label: 'No data', color: '#9ca3af' }; // gray
  }

  const value = Number(avgValue);

  // Simplified breakpoints for PM2.5 and PM10 (India CPCB standard, approximate)
  // For other pollutants we use general thresholds as a reasonable approximation
  const thresholds =
    pollutantId === 'PM2.5'
      ? [30, 60, 90, 120, 250]
      : pollutantId === 'PM10'
      ? [50, 100, 250, 350, 430]
      : [50, 100, 200, 300, 400]; // generic fallback for other pollutants

  if (value <= thresholds[0]) return { label: 'Good', color: '#22c55e' };       // green
  if (value <= thresholds[1]) return { label: 'Satisfactory', color: '#84cc16' }; // light green
  if (value <= thresholds[2]) return { label: 'Moderate', color: '#eab308' };    // yellow
  if (value <= thresholds[3]) return { label: 'Poor', color: '#f97316' };        // orange
  if (value <= thresholds[4]) return { label: 'Very Poor', color: '#ef4444' };   // red
  return { label: 'Severe', color: '#7f1d1d' };                                  // dark red
}