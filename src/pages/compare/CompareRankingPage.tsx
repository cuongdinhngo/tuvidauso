import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useCompareStore } from '../../store/compareStore';
import RelationBadge from '../../components/compare/RelationBadge';

export default function CompareRankingPage() {
  const { profiles, relationships } = useCompareStore();

  const sorted = [...relationships]
    .filter(r => r.result)
    .sort((a, b) => (b.result?.overallScore || 0) - (a.result?.overallScore || 0));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/compare" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>

      <div className="text-center mb-8">
        <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-purple-300">Xếp Hạng Tương Hợp</h1>
      </div>

      {sorted.length === 0 ? (
        <p className="text-center text-gray-500">Chưa có kết quả so sánh nào.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((rel, idx) => {
            const person = profiles.find(p => p.id === rel.person2Id);
            if (!person) return null;
            const score = rel.result?.overallScore ?? 0;
            const ratingLabel = rel.result?.ratingLabel ?? '';

            return (
              <Link
                key={rel.id}
                to={`/compare/result/${rel.id}`}
                className="flex items-center gap-4 bg-gray-900/80 border border-gray-800 rounded-lg p-4 hover:border-purple-800/50 transition-colors"
              >
                <span className={`text-2xl font-bold w-8 text-center ${
                  idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-200 font-medium truncate">{person.name}</span>
                    <RelationBadge type={rel.relationType} />
                  </div>
                  <div className="text-xs text-gray-500">
                    {person.lunarDate.yearCan} {person.lunarDate.yearChi} &bull; {person.lunarDate.napAm}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-gray-200">{score}%</div>
                  <div className="text-xs text-gray-500">{ratingLabel}</div>
                </div>

                <div className="w-28 hidden sm:block">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
