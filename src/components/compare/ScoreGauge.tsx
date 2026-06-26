import { getRatingLabel } from '../../data/compareData';

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

// Map score band to a design token (via CSS var), no literal hex.
function getScoreColor(score: number): string {
  if (score >= 85) return 'var(--color-good)';
  if (score >= 70) return 'var(--color-thuy)';
  if (score >= 50) return 'var(--color-warn)';
  return 'var(--color-bad)';
}

export default function ScoreGauge({ score, size = 180 }: ScoreGaugeProps) {
  const radius = 70;
  const strokeWidth = 12;
  const center = size / 2;

  // Semi-circle arc (180 degrees)
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);
  const label = getRatingLabel(score);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
          fill="none"
          className="stroke-white/10"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
        {/* Score text */}
        <text x={center} y={center - 10} textAnchor="middle" className="text-3xl font-bold" fill="var(--color-ink)">
          {score}%
        </text>
      </svg>
      <span className="text-sm font-medium mt-1" style={{ color }}>{label}</span>
    </div>
  );
}
