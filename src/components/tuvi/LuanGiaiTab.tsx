import { useState } from 'react';
import type { TuViChart, Palace, TuanTriet } from '../../core/types';
import type { InterpretationResult } from '../../core/tuvi/interpretation';
import { interpretPalace } from '../../core/tuvi/interpretation';
import { ratePalace } from '../../core/tuvi/palaceRating';
import {
  getStarInterpretation,
  PALACE_ADVICE,
  CAREER_MAP,
  HEALTH_MAP,
  CHIEU_TEMPLATES,
  SECTION_PALACES,
} from '../../data/interpretationRules';
import { getTamHopPositions, getDoiCung } from '../../core/tuvi/palaceRelations';
import { countElements } from '../../core/battu/fiveElements';

interface LuanGiaiTabProps {
  chart: TuViChart;
  interpretation: InterpretationResult;
}

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'tong-quan', label: 'Tổng Quan' },
  { id: 'tinh-cach', label: 'Tính Cách' },
  { id: 'su-nghiep', label: 'Sự Nghiệp' },
  { id: 'tai-loc', label: 'Tài Lộc' },
  { id: 'tinh-duyen', label: 'Tình Duyên' },
  { id: 'suc-khoe', label: 'Sức Khỏe' },
  { id: 'gia-dinh', label: 'Gia Đình' },
  { id: 'cach-cuc', label: 'Cách Cục' },
  { id: 'loi-khuyen', label: 'Lời Khuyên' },
];

const SECTION_ID_TO_NAME: Record<string, string> = {
  'tinh-cach': 'Tính Cách',
  'su-nghiep': 'Sự Nghiệp',
  'tai-loc': 'Tài Lộc',
  'tinh-duyen': 'Tình Duyên',
  'suc-khoe': 'Sức Khỏe',
  'gia-dinh': 'Gia Đình',
};

function RatingStars({ score }: { score: number }) {
  return (
    <span className="text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < score ? 'text-yellow-400' : 'text-gray-700'}>★</span>
      ))}
    </span>
  );
}

/** Render detailed analysis for a single palace */
function PalaceSection({ palace, tuanTriet, allPalaces, isPrimary }: {
  palace: Palace;
  tuanTriet: TuanTriet;
  allPalaces: Palace[];
  isPrimary: boolean;
}) {
  const rating = ratePalace(palace, tuanTriet);
  const mainStars = palace.stars.filter(s => s.type === 'chinh');
  const catStars = palace.stars.filter(s => s.type === 'cat');
  const satStars = palace.stars.filter(s => s.type === 'sat');

  // Get detailed interpretations for main stars
  const starDetails: string[] = [];
  for (const star of mainStars) {
    const brightness = star.brightness || 'Bình';
    const detail = getStarInterpretation(star.name, palace.name, brightness);
    if (detail) starDetails.push(detail);
  }

  // Tứ Hóa in this palace
  const transformNotes: string[] = [];
  for (const star of palace.stars) {
    if (star.transform === 'Hóa Lộc') {
      transformNotes.push(`${star.name} Hóa Lộc tại cung ${palace.name}: rất tốt, mang lại may mắn và cơ hội phát triển.`);
    } else if (star.transform === 'Hóa Quyền') {
      transformNotes.push(`${star.name} Hóa Quyền tại cung ${palace.name}: tăng quyền lực, chủ động và tự tin.`);
    } else if (star.transform === 'Hóa Khoa') {
      transformNotes.push(`${star.name} Hóa Khoa tại cung ${palace.name}: tăng danh tiếng, học vấn, được quý nhân giúp đỡ.`);
    } else if (star.transform === 'Hóa Kỵ') {
      transformNotes.push(`${star.name} Hóa Kỵ tại cung ${palace.name}: cần lưu ý, dễ gặp trở ngại và thị phi.`);
    }
  }

  // Tuần/Triệt notes
  const isTuan = tuanTriet.tuan.includes(palace.position);
  const isTriet = tuanTriet.triet.includes(palace.position);

  // Tam hợp / Đối cung analysis
  const tamHopPositions = getTamHopPositions(palace.position);
  const doiCungPos = getDoiCung(palace.position);
  const tamHopPalaces = tamHopPositions.map(pos => allPalaces.find(p => p.position === pos)).filter(Boolean) as Palace[];
  const doiCungPalace = allPalaces.find(p => p.position === doiCungPos);

  // Collect chiếu influences
  const chieuDetails: { source: string; type: string; texts: string[] }[] = [];

  for (const thPalace of tamHopPalaces) {
    const texts: string[] = [];
    for (const star of thPalace.stars.filter(s => s.type === 'chinh')) {
      const template = CHIEU_TEMPLATES[star.name];
      if (template) {
        texts.push(`${star.name}${star.brightness ? ` (${star.brightness})` : ''}: ${template}`);
      }
    }
    if (texts.length > 0) {
      chieuDetails.push({ source: `${thPalace.name} (${thPalace.position})`, type: 'Tam hợp', texts });
    }
  }

  if (doiCungPalace) {
    const texts: string[] = [];
    for (const star of doiCungPalace.stars.filter(s => s.type === 'chinh')) {
      const template = CHIEU_TEMPLATES[star.name];
      if (template) {
        texts.push(`${star.name}${star.brightness ? ` (${star.brightness})` : ''}: ${template}`);
      }
    }
    if (texts.length > 0) {
      chieuDetails.push({ source: `${doiCungPalace.name} (${doiCungPalace.position})`, type: 'Đối cung', texts });
    }
  }

  const genericInterp = interpretPalace(palace);

  return (
    <div className={`bg-gray-900/80 border border-gray-800 rounded-lg p-4 space-y-3 ${isPrimary ? '' : 'opacity-90'}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-purple-300">
          {isPrimary ? '' : '▸ '}Cung {palace.name} <span className="text-gray-500 font-normal">({palace.position})</span>
          {isTuan && <span className="ml-2 text-[10px] text-orange-400 border border-orange-800/40 rounded px-1">Tuần</span>}
          {isTriet && <span className="ml-2 text-[10px] text-red-400 border border-red-800/40 rounded px-1">Triệt</span>}
        </h4>
        <RatingStars score={rating.score} />
      </div>

      {/* Stars list */}
      <div className="flex flex-wrap gap-1.5">
        {mainStars.map((s, i) => (
          <span key={i} className="text-xs bg-yellow-900/30 text-yellow-300 border border-yellow-800/40 rounded px-1.5 py-0.5">
            {s.name}{s.brightness ? ` (${s.brightness})` : ''}
            {s.transform && <span className="ml-1 text-green-400">{s.transform}</span>}
          </span>
        ))}
        {catStars.map((s, i) => (
          <span key={`c${i}`} className="text-xs bg-blue-900/30 text-blue-300 border border-blue-800/40 rounded px-1.5 py-0.5">
            {s.name}
          </span>
        ))}
        {satStars.map((s, i) => (
          <span key={`s${i}`} className="text-xs bg-red-900/30 text-red-400 border border-red-800/40 rounded px-1.5 py-0.5">
            {s.name}
          </span>
        ))}
      </div>

      {/* Detailed interpretations */}
      {starDetails.length > 0 ? (
        <div className="space-y-2">
          {starDetails.map((d, i) => (
            <p key={i} className="text-sm text-gray-300 leading-relaxed">{d}</p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-300 leading-relaxed">{genericInterp}</p>
      )}

      {/* Cát tinh / Sát tinh notes */}
      {catStars.length > 0 && (
        <p className="text-sm text-blue-300/80 leading-relaxed">
          Cát tinh hội hợp: {catStars.map(s => s.name).join(', ')} — tăng thêm sức mạnh cho cung.
        </p>
      )}
      {satStars.length > 0 && (
        <p className="text-sm text-red-400/80 leading-relaxed">
          Lưu ý sát tinh: {satStars.map(s => s.name).join(', ')} — cần cẩn trọng, tránh nóng vội.
        </p>
      )}

      {/* Transform notes */}
      {transformNotes.length > 0 && (
        <div className="space-y-1">
          {transformNotes.map((note, i) => (
            <p key={i} className="text-sm text-green-300/80 leading-relaxed">{note}</p>
          ))}
        </div>
      )}

      {/* Tuần/Triệt notes */}
      {isTuan && (
        <p className="text-sm text-orange-400/70 leading-relaxed">
          Cung bị Tuần Không — sức mạnh các sao bị giảm. Giai đoạn đầu khó khăn, nhưng có thể vượt qua và phát triển mạnh sau này.
        </p>
      )}
      {isTriet && (
        <p className="text-sm text-red-400/70 leading-relaxed">
          Cung bị Triệt Lộ — các sao bị suy giảm đáng kể. Tuy nhiên nếu sao sáng sủa thì Triệt phá rồi lại thành, có thể phát triển bất ngờ.
        </p>
      )}

      {/* Tam hợp / Đối cung chiếu */}
      {chieuDetails.length > 0 && (
        <div className="border-t border-gray-800 pt-3 mt-3">
          <h5 className="text-xs font-semibold text-gray-400 mb-2">Ảnh hưởng từ các cung liên quan</h5>
          {chieuDetails.map((cd, i) => (
            <div key={i} className="mb-2">
              <div className="text-xs text-gray-500 flex items-center gap-1 mb-0.5">
                <span className={cd.type === 'Tam hợp' ? 'text-green-500' : 'text-cyan-500'}>
                  {cd.type === 'Tam hợp' ? '△' : '↔'}
                </span>
                {cd.type}: {cd.source}
              </div>
              {cd.texts.map((t, j) => (
                <p key={j} className="text-xs text-gray-400 leading-relaxed pl-4">{t}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Rating factors */}
      {rating.factors.length > 0 && (
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer hover:text-gray-400">Chi tiết đánh giá</summary>
          <ul className="mt-1 space-y-0.5 pl-3">
            {rating.factors.map((f, i) => <li key={i}>• {f}</li>)}
          </ul>
        </details>
      )}
    </div>
  );
}

export default function LuanGiaiTab({ chart, interpretation }: LuanGiaiTabProps) {
  const [activeSection, setActiveSection] = useState('tong-quan');

  const findPalace = (name: string) => chart.palaces.find(p => p.name === name);

  const renderPalaceSection = (sectionName: string) => {
    const sectionConfig = SECTION_PALACES[sectionName];
    if (!sectionConfig) return null;

    const primaryPalace = findPalace(sectionConfig.primary);
    const secondaryPalaces = sectionConfig.secondary.map(findPalace).filter(Boolean) as Palace[];

    return (
      <div className="space-y-4">
        {primaryPalace && (
          <PalaceSection
            palace={primaryPalace}
            tuanTriet={chart.tuanTriet}
            allPalaces={chart.palaces}
            isPrimary
          />
        )}
        {secondaryPalaces.length > 0 && (
          <>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Cung liên quan</h4>
            {secondaryPalaces.map(palace => (
              <PalaceSection
                key={palace.name}
                palace={palace}
                tuanTriet={chart.tuanTriet}
                allPalaces={chart.palaces}
                isPrimary={false}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  const renderSection = () => {
    const section = SECTIONS.find(s => s.id === activeSection);
    if (!section) return null;

    switch (section.id) {
      case 'tong-quan':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">Tổng Quan Lá Số</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{interpretation.overview}</p>
            </div>
            {interpretation.strengths.length > 0 && (
              <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-400 mb-2">Điểm mạnh</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {interpretation.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
            )}
            {interpretation.weaknesses.length > 0 && (
              <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-400 mb-2">Điểm cần lưu ý</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {interpretation.weaknesses.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
            )}
          </div>
        );

      case 'cach-cuc':
        return (
          <div className="space-y-4">
            {interpretation.specialPatterns.length > 0 ? (
              interpretation.specialPatterns.map((p, i) => (
                <div key={i} className="bg-yellow-900/10 border border-yellow-900/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-yellow-300 font-medium">{p.name}</span>
                    <RatingStars score={p.rating} />
                  </div>
                  <p className="text-sm text-gray-300">{p.description}</p>
                </div>
              ))
            ) : (
              <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400">Không phát hiện cách cục đặc biệt nào trong lá số.</p>
              </div>
            )}
          </div>
        );

      case 'loi-khuyen':
        return <AdviceSection chart={chart} findPalace={findPalace} />;

      default: {
        const sectionName = SECTION_ID_TO_NAME[section.id];
        if (!sectionName) return null;
        return renderPalaceSection(sectionName);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Desktop sidebar */}
      <nav className="hidden lg:block w-48 shrink-0">
        <div className="sticky top-4 space-y-1">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                activeSection === s.id
                  ? 'bg-purple-900/40 text-purple-300 font-medium'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile pill nav */}
      <div className="lg:hidden flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full transition-colors ${
              activeSection === s.id
                ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50'
                : 'text-gray-400 border border-gray-700/50 hover:text-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {renderSection()}
      </div>
    </div>
  );
}

/** Advice section with career, health, feng shui recommendations */
function AdviceSection({ chart, findPalace }: { chart: TuViChart; findPalace: (name: string) => Palace | undefined }) {
  // Career advice based on Quan Lộc main stars
  const quanLoc = findPalace('Quan Lộc');
  const careerStars = quanLoc?.stars.filter(s => s.type === 'chinh') || [];
  const careers: string[] = [];
  for (const star of careerStars) {
    const c = CAREER_MAP[star.name];
    if (c) careers.push(...c);
  }
  const uniqueCareers = [...new Set(careers)];

  // Health advice based on Ngũ Hành
  const elements = countElements(chart.fourPillars);
  const maxEl = Object.entries(elements).reduce((a, b) => b[1] > a[1] ? b : a);
  const minEl = Object.entries(elements).reduce((a, b) => b[1] < a[1] ? b : a);
  const healthNotes: string[] = [];
  const vuong = HEALTH_MAP[`${maxEl[0]}_vuong`];
  const nhuoc = HEALTH_MAP[`${minEl[0]}_nhuoc`];
  if (vuong) healthNotes.push(vuong);
  if (nhuoc && minEl[0] !== maxEl[0]) healthNotes.push(nhuoc);

  return (
    <div className="space-y-4">
      {/* Career advice */}
      {uniqueCareers.length > 0 && (
        <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-2">Nghề nghiệp phù hợp</h4>
          <p className="text-sm text-gray-300 mb-2">
            Dựa trên chính tinh tại Quan Lộc ({careerStars.map(s => s.name).join(', ')}):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {uniqueCareers.map((c, i) => (
              <span key={i} className="text-xs bg-purple-900/30 text-purple-300 border border-purple-800/40 rounded px-2 py-0.5">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Health advice */}
      {healthNotes.length > 0 && (
        <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-2">Sức khỏe cần lưu ý</h4>
          <div className="space-y-2">
            {healthNotes.map((note, i) => (
              <p key={i} className="text-sm text-gray-300 leading-relaxed">{note}</p>
            ))}
          </div>
        </div>
      )}

      {/* Palace-based advice */}
      {Object.entries(PALACE_ADVICE).map(([palaceName, advice]) => {
        const palace = findPalace(palaceName);
        if (!palace) return null;
        const rating = ratePalace(palace, chart.tuanTriet);
        const isGood = rating.score >= 3;
        return (
          <div key={palaceName} className="bg-gray-900/80 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold text-purple-300">{palaceName}</h4>
              <RatingStars score={rating.score} />
            </div>
            <p className="text-sm text-gray-300">{isGood ? advice.good : advice.bad}</p>
          </div>
        );
      })}

      {/* AI placeholder */}
      <button
        disabled
        className="w-full bg-gray-900/50 border border-purple-900/30 rounded-lg p-4 text-center opacity-60 cursor-not-allowed"
      >
        <span className="text-purple-400 text-sm">✨ AI Luận Giải — Sắp ra mắt</span>
      </button>
    </div>
  );
}
