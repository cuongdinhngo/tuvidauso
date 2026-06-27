import { Link } from 'react-router-dom';
import { Heart, Plus, Trophy, Trash2 } from 'lucide-react';
import { useCompareStore } from '../../store/compareStore';
import { useTuViStore } from '../../store/tuViStore';
import { buildPersonProfile } from '../../core/compare/buildProfile';
import PersonCard from '../../components/compare/PersonCard';
import RelationBadge from '../../components/compare/RelationBadge';
import PageHero from '../../components/shared/PageHero';

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
      <PageHero icon={Heart} title="So Sánh Hợp Duyên" subtitle="Phân tích tương hợp theo Tử Vi Đẩu Số." />
      <div className="mb-8" />

      {/* Main profile */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-ink-muted mb-2">Hồ sơ của tôi</h2>
        {mainProfile ? (
          <PersonCard person={mainProfile} highlight />
        ) : (
          <div className="bg-surface border border-dashed border-white/10 rounded-lg p-6 text-center">
            <p className="text-ink-muted mb-3">Chưa có hồ sơ chính</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {tuViChart && birthInfo && (
                <button
                  onClick={handleImportFromChart}
                  className="px-4 py-2 min-h-[44px] bg-gold hover:bg-gold/90 text-base font-semibold text-sm rounded-md transition-colors"
                >
                  Dùng lá số đã lập
                </button>
              )}
              <Link
                to="/compare/add?main=true"
                className="inline-flex items-center justify-center px-4 py-2 min-h-[44px] bg-raised hover:bg-white/5 border border-white/10 text-ink text-sm rounded-md transition-colors"
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
            <h2 className="text-sm font-semibold text-ink-muted">Danh sách so sánh</h2>
            <span className="text-xs text-ink-muted">{profiles.length}/20</span>
          </div>

          {relationships.length === 0 ? (
            <div className="bg-surface border border-dashed border-white/10 rounded-lg p-6 text-center">
              <p className="text-ink-muted mb-3">Chưa có ai để so sánh</p>
            </div>
          ) : (
            <div className="space-y-2">
              {relationships.map(rel => {
                const person = profiles.find(p => p.id === rel.person2Id);
                if (!person) return null;
                const score = rel.result?.overallScore ?? 0;
                const ratingLabel = rel.result?.ratingLabel ?? '';

                return (
                  <div key={rel.id} className="bg-surface border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-ink font-medium text-sm truncate">{person.name}</span>
                      <RelationBadge type={rel.relationType} />
                    </div>
                    <div className="text-xs text-ink-muted mt-0.5">
                      {person.lunarDate.yearCan} {person.lunarDate.yearChi} &bull; {person.lunarDate.napAm}
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-ink">{score}%</span>
                        <span className="text-xs text-ink-muted">{ratingLabel}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/compare/result/${rel.id}`}
                          className="inline-flex items-center justify-center min-h-[44px] px-4 text-sm bg-gold/50 text-gold rounded-md hover:bg-gold/60 transition-colors"
                        >
                          Xem
                        </Link>
                        <button
                          onClick={() => removePerson(person.id)}
                          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] text-ink-muted hover:text-bad transition-colors"
                          aria-label="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link
            to="/compare/add"
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-raised hover:bg-raised text-ink text-sm rounded-lg transition-colors border border-white/10"
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
            <Trophy className="w-4 h-4 text-warn" />
            <h2 className="text-sm font-semibold text-ink-muted">Xếp hạng tương hợp</h2>
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
                  className="flex items-center gap-3 bg-surface rounded-lg p-2 hover:bg-raised transition-colors"
                >
                  <span className={`w-6 text-center font-bold ${idx === 0 ? 'text-warn' : 'text-ink-muted'}`}>
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm text-ink truncate">{person.name}</span>
                  <RelationBadge type={rel.relationType} />
                  <div className="w-24 h-1.5 bg-raised rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${score >= 70 ? 'bg-good' : score >= 50 ? 'bg-warn' : 'bg-bad'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-sm text-ink-muted w-10 text-right">{score}%</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Reset */}
      {(mainProfile || profiles.length > 0) && (
        <div className="text-center pt-4 border-t border-white/10">
          <button
            onClick={reset}
            className="text-xs text-ink-muted hover:text-bad transition-colors"
          >
            Xóa tất cả dữ liệu so sánh
          </button>
        </div>
      )}
    </div>
  );
}
