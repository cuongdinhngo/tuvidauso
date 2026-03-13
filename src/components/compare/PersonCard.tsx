import type { PersonProfile } from '../../core/types/compare';

interface PersonCardProps {
  person: PersonProfile;
  highlight?: boolean;
}

export default function PersonCard({ person, highlight }: PersonCardProps) {
  const { lunarDate, tuViChart } = person;

  return (
    <div className={`bg-gray-900/80 border rounded-lg p-4 ${
      highlight ? 'border-purple-500/50' : 'border-gray-800'
    }`}>
      <h3 className="font-semibold text-gray-100 mb-2">{person.name}</h3>
      <div className="grid grid-cols-2 gap-1 text-sm">
        <span className="text-gray-500">Năm sinh:</span>
        <span className="text-gray-300">{lunarDate.yearCan} {lunarDate.yearChi}</span>

        <span className="text-gray-500">Nạp Âm:</span>
        <span className="text-gray-300">{lunarDate.napAm}</span>

        <span className="text-gray-500">Mệnh:</span>
        <span className="text-gray-300">{tuViChart.menhPalaceName} ({tuViChart.menh})</span>

        <span className="text-gray-500">Cục:</span>
        <span className="text-gray-300">{tuViChart.cuc.name}</span>

        <span className="text-gray-500">Ngày sinh:</span>
        <span className="text-gray-300">
          {person.birthInfo.solarDate.day}/{person.birthInfo.solarDate.month}/{person.birthInfo.solarDate.year}
        </span>
      </div>
    </div>
  );
}
