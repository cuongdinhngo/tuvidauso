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
      <Link to="/compare" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-gold mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>

      <div className="text-center mb-8">
        <Trophy className="w-10 h-10 text-warn mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-gold">Xếp Hạng Tương Hợp</h1>
      </div>

      {sorted.length === 0 ? (
        <p className="text-center text-ink-muted">Chưa có kết quả so sánh nào.</p>
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
                className="flex items-center gap-4 bg-surface border border-white/10 rounded-lg p-4 hover:border-gold/50 transition-colors"
              >
                <span className={`text-2xl font-bold w-8 text-center ${
                  idx === 0 ? 'text-warn' : idx === 1 ? 'text-ink-muted' : idx === 2 ? 'text-warn' : 'text-ink-muted'
                }`}>
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-ink font-medium truncate">{person.name}</span>
                    <RelationBadge type={rel.relationType} />
                  </div>
                  <div className="text-xs text-ink-muted">
                    {person.lunarDate.yearCan} {person.lunarDate.yearChi} &bull; {person.lunarDate.napAm}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-ink">{score}%</div>
                  <div className="text-xs text-ink-muted">{ratingLabel}</div>
                </div>

                <div className="w-28 hidden sm:block">
                  <div className="h-2 bg-raised rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        score >= 70 ? 'bg-good' : score >= 50 ? 'bg-warn' : 'bg-bad'
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
