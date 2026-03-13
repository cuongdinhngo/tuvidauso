interface CategoryBarProps {
  name: string;
  score: number;
  analysis: string;
}

function getBarColor(score: number): string {
  if (score >= 85) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 30) return 'bg-orange-500';
  return 'bg-red-500';
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
        <span className="text-gray-300 font-medium">{name}</span>
        <span className="text-gray-400">
          {score}% <span className="text-yellow-400 ml-1">{getRatingStars(score)}</span>
        </span>
      </div>
      <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{analysis}</p>
    </div>
  );
}
