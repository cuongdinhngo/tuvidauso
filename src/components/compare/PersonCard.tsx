import type { PersonProfile } from '../../core/types/compare';

interface PersonCardProps {
  person: PersonProfile;
  highlight?: boolean;
}

export default function PersonCard({ person, highlight }: PersonCardProps) {
  const { lunarDate, tuViChart } = person;

  return (
    <div className={`bg-surface border rounded-lg p-4 ${
      highlight ? 'border-gold/50' : 'border-white/10'
    }`}>
      <h3 className="font-semibold text-ink mb-2">{person.name}</h3>
      <div className="grid grid-cols-2 gap-1 text-sm">
        <span className="text-ink-muted">Năm sinh:</span>
        <span className="text-ink">{lunarDate.yearCan} {lunarDate.yearChi}</span>

        <span className="text-ink-muted">Nạp Âm:</span>
        <span className="text-ink">{lunarDate.napAm}</span>

        <span className="text-ink-muted">Mệnh:</span>
        <span className="text-ink">{tuViChart.menhPalaceName} ({tuViChart.menh})</span>

        <span className="text-ink-muted">Cục:</span>
        <span className="text-ink">{tuViChart.cuc.name}</span>

        <span className="text-ink-muted">Ngày sinh:</span>
        <span className="text-ink">
          {person.birthInfo.solarDate.day}/{person.birthInfo.solarDate.month}/{person.birthInfo.solarDate.year}
        </span>
      </div>
    </div>
  );
}
