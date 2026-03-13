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
    case 'chinh': return 'text-yellow-300 font-semibold';
    case 'cat': return 'text-blue-300';
    case 'sat': return 'text-red-400';
    default: return 'text-gray-300';
  }
}

function RatingStars({ score }: { score: number }) {
  return (
    <span className="text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < score ? 'text-yellow-400' : 'text-gray-700'}>★</span>
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
    <div className="w-full lg:w-96 bg-gray-900 border border-gray-700 rounded-lg lg:sticky lg:top-20 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 z-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-purple-300">{palace.name}</h3>
              <RatingStars score={rating.score} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-gray-500">{palace.position}</span>
              {isMenh && <span className="text-[10px] text-yellow-400 border border-yellow-800/40 rounded px-1">Mệnh</span>}
              {isThan && <span className="text-[10px] text-blue-400 border border-blue-800/40 rounded px-1">Thân</span>}
              {isTuan && <span className="text-[10px] text-orange-400 border border-orange-800/40 rounded px-1">Tuần</span>}
              {isTriet && <span className="text-[10px] text-red-400 border border-red-800/40 rounded px-1">Triệt</span>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        {palaceData && (
          <p className="text-xs text-gray-500 mt-1">{palaceData.meaning}</p>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Đại hạn */}
        {palace.majorPeriod && (
          <div className="text-xs text-gray-400 bg-gray-800/50 rounded px-3 py-2">
            Đại hạn: <span className="text-gray-300">{palace.majorPeriod.can} {palace.majorPeriod.chi}</span>
            <span className="text-gray-500 ml-1">({palace.majorPeriod.startAge}–{palace.majorPeriod.endAge} tuổi)</span>
          </div>
        )}

        {/* Chính tinh */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Chính tinh</h4>
          {mainStars.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Vô chính diệu — cần xem tam hợp và đối cung để luận.</p>
          ) : (
            <div className="space-y-3">
              {mainStars.map((star, i) => {
                const data = STAR_DATABASE[star.name];
                const interp = getStarInterpretation(star.name, palace.name, star.brightness || 'Bình');
                return (
                  <div key={i} className="bg-gray-800/40 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-yellow-300 font-semibold">{star.name}</span>
                        {star.brightness && (
                          <span className={`text-[10px] px-1 rounded ${
                            star.brightness === 'Miếu' ? 'bg-yellow-900/30 text-yellow-400' :
                            star.brightness === 'Vượng' ? 'bg-green-900/30 text-green-400' :
                            star.brightness === 'Đắc' ? 'bg-blue-900/30 text-blue-400' :
                            star.brightness === 'Hãm' ? 'bg-red-900/30 text-red-400' :
                            'bg-gray-800 text-gray-400'
                          }`}>
                            {star.brightness}
                          </span>
                        )}
                      </div>
                      {star.transform && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          star.transform === 'Hóa Lộc' ? 'bg-green-900/40 text-green-300' :
                          star.transform === 'Hóa Quyền' ? 'bg-red-900/40 text-red-300' :
                          star.transform === 'Hóa Khoa' ? 'bg-blue-900/40 text-blue-300' :
                          'bg-purple-900/40 text-purple-300'
                        }`}>
                          {star.transform}
                        </span>
                      )}
                    </div>
                    {data && (
                      <p className="text-[10px] text-gray-500 mb-1">{data.element} • {data.yinYang} • {data.keywords.join(', ')}</p>
                    )}
                    {interp && (
                      <p className="text-xs text-gray-300 leading-relaxed">{interp}</p>
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
            <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Phụ tinh</h4>
            <div className="space-y-1">
              {auxStars.map((star, i) => {
                const data = STAR_DATABASE[star.name];
                return (
                  <div key={i} className="flex items-center justify-between py-0.5 border-b border-gray-800/30">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${getStarColorClass(star.type)}`}>{star.name}</span>
                      {data && <span className="text-[10px] text-gray-600">{data.keywords[0]}</span>}
                    </div>
                    {star.transform && (
                      <span className={`text-[10px] px-1 rounded ${
                        star.transform === 'Hóa Lộc' ? 'text-green-400' :
                        star.transform === 'Hóa Quyền' ? 'text-red-400' :
                        star.transform === 'Hóa Khoa' ? 'text-blue-400' :
                        'text-purple-400'
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
            isTriet ? 'bg-red-950/30 text-red-400/80' : 'bg-orange-950/30 text-orange-400/70'
          }`}>
            {isTriet
              ? 'Cung bị Triệt Lộ — sức mạnh các sao bị suy giảm đáng kể. Tuy nhiên sao sáng có thể "phá Triệt" rồi phát triển mạnh.'
              : 'Cung bị Tuần Không — sức mạnh các sao bị giảm. Giai đoạn đầu chậm, nhưng có thể bứt phá sau.'
            }
          </div>
        )}

        {/* Palace Relations */}
        {influence && (
          <div className="space-y-3 border-t border-gray-800 pt-3">
            {/* Tam Hop */}
            {influence.tamHop.palaces.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-green-400/80 mb-1.5 flex items-center gap-1">
                  <span className="text-green-500">△</span> Tam hợp chiếu
                </h4>
                {influence.tamHop.palaces.map((p) => {
                  const mainS = p.stars.filter(s => s.type === 'chinh');
                  return (
                    <div key={p.position} className="mb-2">
                      <span className="text-xs text-gray-500">{p.name} ({p.position}):</span>
                      <div className="mt-0.5 space-y-0.5">
                        {mainS.length > 0 ? mainS.map((s, i) => {
                          const tmpl = CHIEU_TEMPLATES[s.name];
                          return (
                            <div key={i} className="text-xs text-gray-400 pl-2">
                              <span className="text-yellow-300/80">{s.name}</span>
                              {s.brightness && <span className="text-gray-600"> [{s.brightness}]</span>}
                              {tmpl && <span className="text-gray-500"> — {tmpl.replace(`${s.name} chiếu vào → `, '')}</span>}
                            </div>
                          );
                        }) : (
                          <span className="text-xs text-gray-600 italic pl-2">không có chính tinh</span>
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
                <h4 className="text-xs font-semibold text-cyan-400/80 mb-1.5 flex items-center gap-1">
                  <span className="text-cyan-500">↔</span> Đối cung chiếu
                </h4>
                <span className="text-xs text-gray-500">
                  {influence.doiCung.palace.name} ({influence.doiCung.position}):
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {influence.doiCung.stars.filter(s => s.type === 'chinh').length > 0
                    ? influence.doiCung.stars.filter(s => s.type === 'chinh').map((s, i) => {
                        const tmpl = CHIEU_TEMPLATES[s.name];
                        return (
                          <div key={i} className="text-xs text-gray-400 pl-2">
                            <span className="text-yellow-300/80">{s.name}</span>
                            {s.brightness && <span className="text-gray-600"> [{s.brightness}]</span>}
                            {tmpl && <span className="text-gray-500"> — {tmpl.replace(`${s.name} chiếu vào → `, '')}</span>}
                          </div>
                        );
                      })
                    : <span className="text-xs text-gray-600 italic pl-2">không có chính tinh</span>
                  }
                </div>
              </div>
            )}

            {/* Giap Cung */}
            <div>
              <h4 className="text-xs font-semibold text-amber-400/80 mb-1.5 flex items-center gap-1">
                <span className="text-amber-500">⊟</span> Giáp cung
              </h4>
              {influence.giapCung.palaces.map((p, i) => p && (
                <div key={i} className="mb-1">
                  <span className="text-xs text-gray-500">{p.name} ({influence.giapCung.positions[i]}):</span>
                  <div className="flex flex-wrap gap-1 mt-0.5 pl-2">
                    {p.stars.filter(s => s.type === 'chinh').map((s, j) => (
                      <span key={j} className="text-xs text-yellow-300/80">
                        {s.name}{s.brightness ? ` [${s.brightness}]` : ''}
                      </span>
                    ))}
                    {p.stars.filter(s => s.type === 'chinh').length === 0 && (
                      <span className="text-xs text-gray-600 italic">không có chính tinh</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating details */}
        {rating.factors.length > 0 && (
          <details className="text-xs text-gray-500 border-t border-gray-800 pt-3">
            <summary className="cursor-pointer hover:text-gray-400">Chi tiết đánh giá ({rating.score}/5)</summary>
            <ul className="mt-1 space-y-0.5 pl-3">
              {rating.factors.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
