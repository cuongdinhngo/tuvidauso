interface CategoryBarProps {
  name: string;
  score: number;
  analysis: string;
}

function getBarColor(score: number): string {
  if (score >= 85) return 'bg-good';
  if (score >= 70) return 'bg-thuy';
  if (score >= 50) return 'bg-warn';
  if (score >= 30) return 'bg-warn';
  return 'bg-bad';
}

function getRatingStars(score: number): string {
  if (score >= 85) return '★★★★★';
  if (score >= 70) return '★★★★';
  if (score >= 50) return '★★★';
  if (score >= 30) return '★★';
  return '★';
}

export default function CategoryBar({ name, score, analysis }: CategoryBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-base">
        <span className="text-ink font-medium">{name}</span>
        <span className="text-ink-muted">
          {score}% <span className="text-warn ml-1">{getRatingStars(score)}</span>
        </span>
      </div>
      <div className="h-2.5 bg-raised rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{analysis}</p>
    </div>
  );
}
