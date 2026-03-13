import { Link } from 'react-router-dom';
import { Heart, Plus, Trophy, Trash2 } from 'lucide-react';
import { useCompareStore } from '../../store/compareStore';
import { useTuViStore } from '../../store/tuViStore';
import { buildPersonProfile } from '../../core/compare/buildProfile';
import PersonCard from '../../components/compare/PersonCard';
import RelationBadge from '../../components/compare/RelationBadge';

export default function ComparePage() {
  const { mainProfile, profiles, relationships, setMainProfileDirect, removePerson, reset } = useCompareStore();
  const tuViChart = useTuViStore(s => s.tuViChart);
  const birthInfo = useTuViStore(s => s.birthInfo);

  function handleImportFromChart() {
    if (!tuViChart || !birthInfo) return;
    const name = birthInfo.name || 'Bản thân';
    const profile = buildPersonProfile(name, birthInfo);
    setMainProfileDirect(profile);
  }

  const sortedRelationships = [...relationships]
    .filter(r => r.result)
    .sort((a, b) => (b.result?.overallScore || 0) - (a.result?.overallScore || 0));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Heart className="w-10 h-10 text-pink-400 mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-purple-300">So Sánh Hợp Duyên</h1>
        <p className="text-sm text-gray-500 mt-1">Phân tích tương hợp theo Tử Vi Đẩu Số</p>
      </div>

      {/* Main profile */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-2">Hồ sơ của tôi</h2>
        {mainProfile ? (
          <PersonCard person={mainProfile} highlight />
        ) : (
          <div className="bg-gray-900/80 border border-dashed border-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-3">Chưa có hồ sơ chính</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {tuViChart && birthInfo && (
                <button
                  onClick={handleImportFromChart}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                >
                  Dùng lá số đã lập
                </button>
              )}
              <Link
                to="/compare/add?main=true"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
              >
                Nhập thông tin mới
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Person list */}
      {mainProfile && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-400">Danh sách so sánh</h2>
            <span className="text-xs text-gray-600">{profiles.length}/20</span>
          </div>

          {relationships.length === 0 ? (
            <div className="bg-gray-900/80 border border-dashed border-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-3">Chưa có ai để so sánh</p>
            </div>
          ) : (
            <div className="space-y-2">
              {relationships.map(rel => {
                const person = profiles.find(p => p.id === rel.person2Id);
                if (!person) return null;
                const score = rel.result?.overallScore ?? 0;
                const ratingLabel = rel.result?.ratingLabel ?? '';

                return (
                  <div key={rel.id} className="bg-gray-900/80 border border-gray-800 rounded-lg p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-200 font-medium text-sm truncate">{person.name}</span>
                        <RelationBadge type={rel.relationType} />
                      </div>
                      <div className="text-xs text-gray-500">
                        {person.lunarDate.yearCan} {person.lunarDate.yearChi} &bull; {person.lunarDate.napAm}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-gray-200">{score}%</div>
                      <div className="text-xs text-gray-500">{ratingLabel}</div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <Link
                        to={`/compare/result/${rel.id}`}
                        className="px-2 py-1 text-xs bg-purple-900/50 text-purple-300 rounded hover:bg-purple-800/50 transition-colors"
                      >
                        Xem
                      </Link>
                      <button
                        onClick={() => removePerson(person.id)}
                        className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link
            to="/compare/add"
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors border border-gray-700"
          >
            <Plus className="w-4 h-4" />
            Thêm người mới
          </Link>
        </section>
      )}

      {/* Ranking */}
      {sortedRelationships.length >= 2 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <h2 className="text-sm font-semibold text-gray-400">Xếp hạng tương hợp</h2>
          </div>
          <div className="space-y-1.5">
            {sortedRelationships.map((rel, idx) => {
              const person = profiles.find(p => p.id === rel.person2Id);
              if (!person) return null;
              const score = rel.result?.overallScore ?? 0;
              return (
                <Link
                  key={rel.id}
                  to={`/compare/result/${rel.id}`}
                  className="flex items-center gap-3 bg-gray-900/50 rounded-lg p-2 hover:bg-gray-800/50 transition-colors"
                >
                  <span className={`w-6 text-center font-bold ${idx === 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm text-gray-300 truncate">{person.name}</span>
                  <RelationBadge type={rel.relationType} />
                  <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-10 text-right">{score}%</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Reset */}
      {(mainProfile || profiles.length > 0) && (
        <div className="text-center pt-4 border-t border-gray-800">
          <button
            onClick={reset}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            Xóa tất cả dữ liệu so sánh
          </button>
        </div>
      )}
    </div>
  );
}
