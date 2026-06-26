import { X } from 'lucide-react';
import type { Palace, TuanTriet } from '../../core/types';
import type { PalaceInfluence } from '../../core/tuvi/palaceRelations';
import { PALACE_DATABASE } from '../../data/palaceDatabase';
import { STAR_DATABASE } from '../../data/starDatabase';
import { getStarInterpretation, CHIEU_TEMPLATES } from '../../data/interpretationRules';
import { ratePalace } from '../../core/tuvi/palaceRating';

interface CungDetailProps {
  palace: Palace;
  isMenh: boolean;
  isThan: boolean;
  onClose: () => void;
  influence?: PalaceInfluence;
  tuanTriet?: TuanTriet;
}

function getStarColorClass(type: string): string {
  switch (type) {
    case 'chinh': return 'text-gold font-semibold';
    case 'cat': return 'text-thuy';
    case 'sat': return 'text-bad';
    default: return 'text-ink-muted';
  }
}

function RatingStars({ score }: { score: number }) {
  return (
    <span className="text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < score ? 'text-warn' : 'text-ink-muted'}>★</span>
      ))}
    </span>
  );
}

export default function CungDetail({ palace, isMenh, isThan, onClose, influence, tuanTriet }: CungDetailProps) {
  const isTuan = tuanTriet?.tuan.includes(palace.position);
  const isTriet = tuanTriet?.triet.includes(palace.position);
  const palaceData = PALACE_DATABASE[palace.name];
  const rating = ratePalace(palace, tuanTriet);
  const mainStars = palace.stars.filter(s => s.type === 'chinh');
  const auxStars = palace.stars.filter(s => s.type !== 'chinh');

  return (
    <div className="w-full lg:w-96 bg-surface border border-white/10 rounded-lg lg:sticky lg:top-20 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-surface border-b border-white/10 p-4 z-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gold">{palace.name}</h3>
              <RatingStars score={rating.score} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-ink-muted">{palace.position}</span>
              {isMenh && <span className="text-[10px] text-warn border border-warn/40 rounded px-1">Mệnh</span>}
              {isThan && <span className="text-[10px] text-thuy border border-thuy/40 rounded px-1">Thân</span>}
              {isTuan && <span className="text-[10px] text-warn border border-warn/40 rounded px-1">Tuần</span>}
              {isTriet && <span className="text-[10px] text-bad border border-bad/40 rounded px-1">Triệt</span>}
            </div>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        {palaceData && (
          <p className="text-xs text-ink-muted mt-1">{palaceData.meaning}</p>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Đại hạn */}
        {palace.majorPeriod && (
          <div className="text-xs text-ink-muted bg-raised rounded px-3 py-2">
            Đại hạn: <span className="text-ink">{palace.majorPeriod.can} {palace.majorPeriod.chi}</span>
            <span className="text-ink-muted ml-1">({palace.majorPeriod.startAge}-{palace.majorPeriod.endAge} tuổi)</span>
          </div>
        )}

        {/* Chính tinh */}
        <div>
          <h4 className="text-xs font-semibold text-ink-muted mb-2 uppercase tracking-wider">Chính tinh</h4>
          {mainStars.length === 0 ? (
            <p className="text-ink-muted text-sm italic">Vô chính diệu - cần xem tam hợp và đối cung để luận.</p>
          ) : (
            <div className="space-y-3">
              {mainStars.map((star, i) => {
                const data = STAR_DATABASE[star.name];
                const interp = getStarInterpretation(star.name, palace.name, star.brightness || 'Bình');
                return (
                  <div key={i} className="bg-raised rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gold font-semibold">{star.name}</span>
                        {star.brightness && (
                          <span className={`text-[10px] px-1 rounded-sm ${
                            star.brightness === 'Miếu' ? 'bg-gold/30 text-gold' :
                            star.brightness === 'Vượng' ? 'bg-good/30 text-good' :
                            star.brightness === 'Đắc' ? 'bg-thuy/30 text-thuy' :
                            star.brightness === 'Hãm' ? 'bg-bad/30 text-bad' :
                            'bg-raised text-ink-muted'
                          }`}>
                            {star.brightness}
                          </span>
                        )}
                      </div>
                      {star.transform && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-sm ${
                          star.transform === 'Hóa Lộc' ? 'bg-good/40 text-good' :
                          star.transform === 'Hóa Quyền' ? 'bg-warn/40 text-warn' :
                          star.transform === 'Hóa Khoa' ? 'bg-thuy/40 text-thuy' :
                          'bg-bad/40 text-bad'
                        }`}>
                          {star.transform}
                        </span>
                      )}
                    </div>
                    {data && (
                      <p className="text-[10px] text-ink-muted mb-1">{data.element} • {data.yinYang} • {data.keywords.join(', ')}</p>
                    )}
                    {interp && (
                      <p className="text-xs text-ink leading-relaxed">{interp}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Phụ tinh */}
        {auxStars.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-ink-muted mb-2 uppercase tracking-wider">Phụ tinh</h4>
            <div className="space-y-1">
              {auxStars.map((star, i) => {
                const data = STAR_DATABASE[star.name];
                return (
                  <div key={i} className="flex items-center justify-between py-0.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${getStarColorClass(star.type)}`}>{star.name}</span>
                      {data && <span className="text-[10px] text-ink-muted">{data.keywords[0]}</span>}
                    </div>
                    {star.transform && (
                      <span className={`text-[10px] px-1 rounded ${
                        star.transform === 'Hóa Lộc' ? 'text-good' :
                        star.transform === 'Hóa Quyền' ? 'text-warn' :
                        star.transform === 'Hóa Khoa' ? 'text-thuy' :
                        'text-bad'
                      }`}>
                        {star.transform}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tuần/Triệt note */}
        {(isTuan || isTriet) && (
          <div className={`text-xs rounded px-3 py-2 ${
            isTriet ? 'bg-bad/30 text-bad/80' : 'bg-warn/30 text-warn/70'
          }`}>
            {isTriet
              ? 'Cung bị Triệt Lộ - sức mạnh các sao bị suy giảm đáng kể. Tuy nhiên sao sáng có thể "phá Triệt" rồi phát triển mạnh.'
              : 'Cung bị Tuần Không - sức mạnh các sao bị giảm. Giai đoạn đầu chậm, nhưng có thể bứt phá sau.'
            }
          </div>
        )}

        {/* Palace Relations */}
        {influence && (
          <div className="space-y-3 border-t border-white/10 pt-3">
            {/* Tam Hop */}
            {influence.tamHop.palaces.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-good/80 mb-1.5 flex items-center gap-1">
                  <span className="text-good">△</span> Tam hợp chiếu
                </h4>
                {influence.tamHop.palaces.map((p) => {
                  const mainS = p.stars.filter(s => s.type === 'chinh');
                  return (
                    <div key={p.position} className="mb-2">
                      <span className="text-xs text-ink-muted">{p.name} ({p.position}):</span>
                      <div className="mt-0.5 space-y-0.5">
                        {mainS.length > 0 ? mainS.map((s, i) => {
                          const tmpl = CHIEU_TEMPLATES[s.name];
                          return (
                            <div key={i} className="text-xs text-ink-muted pl-2">
                              <span className="text-warn/80">{s.name}</span>
                              {s.brightness && <span className="text-ink-muted"> [{s.brightness}]</span>}
                              {tmpl && <span className="text-ink-muted"> - {tmpl.replace(`${s.name} chiếu vào → `, '')}</span>}
                            </div>
                          );
                        }) : (
                          <span className="text-xs text-ink-muted italic pl-2">không có chính tinh</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Doi Cung */}
            {influence.doiCung.palace && (
              <div>
                <h4 className="text-xs font-semibold text-thuy/80 mb-1.5 flex items-center gap-1">
                  <span className="text-thuy">↔</span> Đối cung chiếu
                </h4>
                <span className="text-xs text-ink-muted">
                  {influence.doiCung.palace.name} ({influence.doiCung.position}):
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {influence.doiCung.stars.filter(s => s.type === 'chinh').length > 0
                    ? influence.doiCung.stars.filter(s => s.type === 'chinh').map((s, i) => {
                        const tmpl = CHIEU_TEMPLATES[s.name];
                        return (
                          <div key={i} className="text-xs text-ink-muted pl-2">
                            <span className="text-warn/80">{s.name}</span>
                            {s.brightness && <span className="text-ink-muted"> [{s.brightness}]</span>}
                            {tmpl && <span className="text-ink-muted"> - {tmpl.replace(`${s.name} chiếu vào → `, '')}</span>}
                          </div>
                        );
                      })
                    : <span className="text-xs text-ink-muted italic pl-2">không có chính tinh</span>
                  }
                </div>
              </div>
            )}

            {/* Giap Cung */}
            <div>
              <h4 className="text-xs font-semibold text-warn/80 mb-1.5 flex items-center gap-1">
                <span className="text-warn">⊟</span> Giáp cung
              </h4>
              {influence.giapCung.palaces.map((p, i) => p && (
                <div key={i} className="mb-1">
                  <span className="text-xs text-ink-muted">{p.name} ({influence.giapCung.positions[i]}):</span>
                  <div className="flex flex-wrap gap-1 mt-0.5 pl-2">
                    {p.stars.filter(s => s.type === 'chinh').map((s, j) => (
                      <span key={j} className="text-xs text-warn/80">
                        {s.name}{s.brightness ? ` [${s.brightness}]` : ''}
                      </span>
                    ))}
                    {p.stars.filter(s => s.type === 'chinh').length === 0 && (
                      <span className="text-xs text-ink-muted italic">không có chính tinh</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating details */}
        {rating.factors.length > 0 && (
          <details className="text-xs text-ink-muted border-t border-white/10 pt-3">
            <summary className="cursor-pointer hover:text-ink-muted">Chi tiết đánh giá ({rating.score}/5)</summary>
            <ul className="mt-1 space-y-0.5 pl-3">
              {rating.factors.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
