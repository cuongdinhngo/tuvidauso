import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { useCompareStore } from '../../store/compareStore';
import ScoreGauge from '../../components/compare/ScoreGauge';
import CategoryBar from '../../components/compare/CategoryBar';
import PersonCard from '../../components/compare/PersonCard';
import RelationBadge from '../../components/compare/RelationBadge';
import MiniTuViChart from '../../components/compare/MiniTuViChart';
import { RELATION_PALACE_MAP } from '../../data/compareData';

export default function CompareResultPage() {
  const { id } = useParams<{ id: string }>();
  const { mainProfile, profiles, relationships } = useCompareStore();

  const relationship = relationships.find(r => r.id === id);
  const person2 = relationship ? profiles.find(p => p.id === relationship.person2Id) : null;

  if (!relationship || !mainProfile || !person2 || !relationship.result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Không tìm thấy kết quả so sánh.</p>
        <Link to="/compare" className="text-purple-400 hover:text-purple-300 text-sm">
          Quay lại
        </Link>
      </div>
    );
  }

  const result = relationship.result;
  const palaceMap = RELATION_PALACE_MAP[relationship.relationType];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <Link to="/compare" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>

      {/* Side-by-side profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <PersonCard person={mainProfile} highlight />
        <div>
          <PersonCard person={person2} />
          <div className="mt-2 flex justify-end">
            <RelationBadge type={relationship.relationType} />
          </div>
        </div>
      </div>

      {/* Overall score gauge */}
      <div className="flex justify-center mb-8">
        <ScoreGauge score={result.overallScore} />
      </div>

      {/* Category bars */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-400 mb-4">Phân tích chi tiết</h2>
        <div className="space-y-4">
          {result.categories.map(cat => (
            <CategoryBar key={cat.name} name={cat.name} score={cat.score} analysis={cat.analysis} />
          ))}
        </div>
      </section>

      {/* Strengths & Challenges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {result.strengths.length > 0 && (
          <section className="bg-green-950/20 border border-green-900/30 rounded-lg p-4">
            <h3 className="text-base font-semibold text-green-400 mb-3 flex items-center gap-1">
              <Check className="w-4 h-4" /> Điểm mạnh
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-400 leading-relaxed">{s}</li>
              ))}
            </ul>
          </section>
        )}

        {result.challenges.length > 0 && (
          <section className="bg-red-950/20 border border-red-900/30 rounded-lg p-4">
            <h3 className="text-base font-semibold text-red-400 mb-3 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Thử thách
            </h3>
            <ul className="space-y-2">
              {result.challenges.map((c, i) => (
                <li key={i} className="text-sm text-gray-400 leading-relaxed">{c}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Advice */}
      {result.advice.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-400 mb-3">Lời khuyên</h2>
          <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4">
            <ol className="space-y-2">
              {result.advice.map((a, i) => (
                <li key={i} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-purple-400 font-medium shrink-0">{i + 1}.</span>
                  {a}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Relation-specific */}
      {Object.keys(result.relationSpecific).length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-400 mb-3">Phân tích đặc thù</h2>
          <div className="space-y-3">
            {Object.entries(result.relationSpecific).map(([key, value]) => (
              <div key={key} className="bg-gray-900/80 border border-gray-800 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-purple-300 mb-1">{key}</h4>
                <p className="text-sm text-gray-400">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mini charts side by side */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-400 mb-3">Lá Số Song Song</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">{mainProfile.name}</p>
            <MiniTuViChart
              palaces={mainProfile.tuViChart.palaces}
              menh={mainProfile.tuViChart.menh}
              than={mainProfile.tuViChart.than}
              tuanTriet={mainProfile.tuViChart.tuanTriet}
              highlightPalace={palaceMap.p1}
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">{person2.name}</p>
            <MiniTuViChart
              palaces={person2.tuViChart.palaces}
              menh={person2.tuViChart.menh}
              than={person2.tuViChart.than}
              tuanTriet={person2.tuViChart.tuanTriet}
              highlightPalace={palaceMap.p2}
            />
          </div>
        </div>
      </section>

      {/* AI placeholder */}
      <button
        disabled
        className="w-full bg-gray-900/50 border border-purple-900/30 rounded-lg p-4 text-center opacity-60 cursor-not-allowed"
      >
        <span className="text-purple-400 text-sm">AI Luận Giải Chi Tiết — Sắp ra mắt</span>
      </button>
    </div>
  );
}
