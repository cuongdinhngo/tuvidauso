import type { Palace, TuViChart } from '../types';
import { STAR_DATABASE } from '../../data/starDatabase';
import { PALACE_DATABASE } from '../../data/palaceDatabase';
import { CACHE_PATTERNS, type CacheCuc } from '../../data/cachePatterns';

export interface InterpretationResult {
  overview: string;
  palaceAnalysis: Record<string, string>;
  specialPatterns: CacheCuc[];
  strengths: string[];
  weaknesses: string[];
}

/** Detect special star patterns (cach cuc) in the chart */
function detectPatterns(palaces: Palace[]): CacheCuc[] {
  const detected: CacheCuc[] = [];

  // Build a map: star name -> position
  const starPositions: Record<string, string> = {};
  for (const palace of palaces) {
    for (const star of palace.stars) {
      starPositions[star.name] = palace.position;
    }
  }

  // Build a map: position -> star names
  const positionStars: Record<string, string[]> = {};
  for (const palace of palaces) {
    positionStars[palace.position] = palace.stars.map(s => s.name);
  }

  for (const pattern of CACHE_PATTERNS) {
    let matched = true;

    for (const condition of pattern.conditions) {
      if (condition.position) {
        // Stars must be at specific position
        const starsAtPos = positionStars[condition.position] || [];
        if (!condition.stars.every(s => starsAtPos.includes(s))) {
          matched = false;
          break;
        }
      } else {
        // Stars must be in same palace (any position)
        const positions = condition.stars.map(s => starPositions[s]).filter(Boolean);
        if (positions.length !== condition.stars.length) {
          matched = false;
          break;
        }
        // Check if all stars are in the same position
        if (new Set(positions).size > 1) {
          matched = false;
          break;
        }
      }
    }

    if (matched) {
      detected.push(pattern);
    }
  }

  return detected;
}

/** Generate interpretation for a single palace */
export function interpretPalace(palace: Palace): string {
  const parts: string[] = [];
  const palaceData = PALACE_DATABASE[palace.name];

  if (palaceData) {
    parts.push(palaceData.meaning);
  }

  const mainStars = palace.stars.filter(s => s.type === 'chinh');
  const catStars = palace.stars.filter(s => s.type === 'cat');
  const satStars = palace.stars.filter(s => s.type === 'sat');

  if (mainStars.length === 0) {
    parts.push('Cung này không có chính tinh tọa thủ, cần xem tam hợp và đối cung để luận.');
  } else {
    for (const star of mainStars) {
      const data = STAR_DATABASE[star.name];
      if (data) {
        let desc = `${star.name}`;
        if (star.brightness) desc += ` (${star.brightness})`;
        desc += `: ${data.nature}`;
        if (star.transform) {
          desc += ` ${star.transform} tại cung này.`;
        }
        parts.push(desc);
      }
    }
  }

  if (catStars.length > 0) {
    parts.push(`Cát tinh hội hợp: ${catStars.map(s => s.name).join(', ')} — tăng thêm sức mạnh cho cung.`);
  }

  if (satStars.length > 0) {
    parts.push(`Sát tinh xâm phạm: ${satStars.map(s => s.name).join(', ')} — cần cẩn thận.`);
  }

  return parts.join(' ');
}

/** Generate full chart interpretation */
export function interpretChart(chart: TuViChart): InterpretationResult {
  const patterns = detectPatterns(chart.palaces);
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Analyze menh cung
  const menhPalace = chart.palaces.find(p => p.position === chart.menh);
  if (menhPalace) {
    const mainStars = menhPalace.stars.filter(s => s.type === 'chinh');
    const mieuVuong = mainStars.filter(s => s.brightness === 'Miếu' || s.brightness === 'Vượng');
    const ham = mainStars.filter(s => s.brightness === 'Hãm');

    if (mieuVuong.length > 0) {
      strengths.push(`Cung Mệnh có ${mieuVuong.map(s => s.name).join(', ')} sáng sủa, tố chất tốt.`);
    }
    if (ham.length > 0) {
      weaknesses.push(`Cung Mệnh có ${ham.map(s => s.name).join(', ')} hãm địa, cần nỗ lực nhiều hơn.`);
    }

    const hasLoc = menhPalace.stars.some(s => s.transform === 'Hóa Lộc');
    if (hasLoc) strengths.push('Mệnh cung có Hóa Lộc, tài lộc may mắn.');

    const hasKy = menhPalace.stars.some(s => s.transform === 'Hóa Kỵ');
    if (hasKy) weaknesses.push('Mệnh cung có Hóa Kỵ, cần chú ý trở ngại.');
  }

  // Add pattern-based strengths/weaknesses
  for (const p of patterns) {
    if (p.rating >= 4) strengths.push(`Cách cục ${p.name}: ${p.description}`);
    if (p.rating <= 2) weaknesses.push(`Cách cục ${p.name}: ${p.description}`);
  }

  // Generate palace analysis
  const palaceAnalysis: Record<string, string> = {};
  for (const palace of chart.palaces) {
    palaceAnalysis[palace.name] = interpretPalace(palace);
  }

  // Overview
  const overviewParts = [
    `Lá số ${chart.birthInfo.gender === 'male' ? 'Nam' : 'Nữ'} mạng ${chart.lunarDate.yearCan} ${chart.lunarDate.yearChi}, ${chart.lunarDate.napAm}.`,
    `Cung Mệnh tại ${chart.menh}, ${chart.cuc.name}.`,
  ];
  if (chart.menh === chart.than) {
    overviewParts.push('Mệnh Thân đồng cung — toàn bộ cuộc đời tập trung vào một hướng.');
  }
  if (patterns.length > 0) {
    overviewParts.push(`Phát hiện ${patterns.length} cách cục đặc biệt.`);
  }

  return {
    overview: overviewParts.join(' '),
    palaceAnalysis,
    specialPatterns: patterns,
    strengths,
    weaknesses,
  };
}
