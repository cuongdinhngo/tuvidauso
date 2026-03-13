import type { TuViChart } from '../types';
import { computeTransformLayer, type PeriodTransforms } from './periodTransforms';
import { getYearlyStars, type YearlyStar } from './yearlyStars';
import { getYearCanChi } from '../calendar/canChi';

export interface DoubleKy {
  palace: string;
  position: string;
  sources: string[]; // e.g. ['Bản mệnh: Thiên Cơ', 'Đại hạn: Vũ Khúc']
}

export interface LocKyConflict {
  star: string;
  palace: string;
  position: string;
}

export interface LayeredAnalysis {
  doubleKy: DoubleKy[];
  tripleKy: DoubleKy | null;
  songLoc: { palace: string; position: string } | null;
  locQuyenKhoaHoi: { palace: string; position: string } | null;
  locToKy: LocKyConflict[];
}

export interface LayeredFortune {
  year: number;
  age: number;
  yearCan: string;
  yearChi: string;

  natal: PeriodTransforms;
  daiHan: PeriodTransforms | null;
  luuNien: PeriodTransforms;

  yearlyStars: YearlyStar[];
  analysis: LayeredAnalysis;
}

function collectKyPositions(
  layers: { label: string; transforms: PeriodTransforms }[]
): { palace: string; position: string; source: string }[] {
  return layers
    .filter(l => l.transforms.ky.position)
    .map(l => ({
      palace: l.transforms.ky.palace,
      position: l.transforms.ky.position,
      source: `${l.label}: ${l.transforms.ky.star}`,
    }));
}

function collectLocPositions(
  layers: { label: string; transforms: PeriodTransforms }[]
): { palace: string; position: string; source: string }[] {
  return layers
    .filter(l => l.transforms.loc.position)
    .map(l => ({
      palace: l.transforms.loc.palace,
      position: l.transforms.loc.position,
      source: `${l.label}: ${l.transforms.loc.star}`,
    }));
}

function analyzeOverlap(
  natal: PeriodTransforms,
  daiHan: PeriodTransforms | null,
  luuNien: PeriodTransforms
): LayeredAnalysis {
  const layers: { label: string; transforms: PeriodTransforms }[] = [
    { label: 'Bản mệnh', transforms: natal },
    ...(daiHan ? [{ label: 'Đại hạn', transforms: daiHan }] : []),
    { label: 'Lưu niên', transforms: luuNien },
  ];

  // Detect Song Kỵ / Tam Kỵ
  const kyPositions = collectKyPositions(layers);
  const kyByPos: Record<string, string[]> = {};
  for (const k of kyPositions) {
    if (!kyByPos[k.position]) kyByPos[k.position] = [];
    kyByPos[k.position].push(k.source);
  }

  const doubleKy: DoubleKy[] = [];
  let tripleKy: DoubleKy | null = null;
  for (const [pos, sources] of Object.entries(kyByPos)) {
    if (sources.length >= 3) {
      const palace = kyPositions.find(k => k.position === pos)?.palace || '';
      tripleKy = { palace, position: pos, sources };
    } else if (sources.length >= 2) {
      const palace = kyPositions.find(k => k.position === pos)?.palace || '';
      doubleKy.push({ palace, position: pos, sources });
    }
  }

  // Detect Song Lộc
  const locPositions = collectLocPositions(layers);
  const locByPos: Record<string, number> = {};
  for (const l of locPositions) {
    locByPos[l.position] = (locByPos[l.position] || 0) + 1;
  }
  let songLoc: { palace: string; position: string } | null = null;
  for (const [pos, count] of Object.entries(locByPos)) {
    if (count >= 2) {
      const palace = locPositions.find(l => l.position === pos)?.palace || '';
      songLoc = { palace, position: pos };
      break;
    }
  }

  // Detect Lộc Quyền Khoa hội (3 positive transforms in same palace from any layers)
  let locQuyenKhoaHoi: { palace: string; position: string } | null = null;
  const positiveByPos: Record<string, Set<string>> = {};
  for (const l of layers) {
    for (const key of ['loc', 'quyen', 'khoa'] as const) {
      const t = l.transforms[key];
      if (t.position) {
        if (!positiveByPos[t.position]) positiveByPos[t.position] = new Set();
        positiveByPos[t.position].add(key);
      }
    }
  }
  for (const [pos, types] of Object.entries(positiveByPos)) {
    if (types.size >= 3) {
      const palace = layers[0].transforms.loc.position === pos
        ? layers[0].transforms.loc.palace
        : '';
      locQuyenKhoaHoi = { palace, position: pos };
      break;
    }
  }

  // Detect Lộc chuyển Kỵ (same star gets Lộc in one layer, Kỵ in another)
  const locToKy: LocKyConflict[] = [];
  for (const l1 of layers) {
    for (const l2 of layers) {
      if (l1 === l2) continue;
      if (l1.transforms.loc.star && l1.transforms.loc.star === l2.transforms.ky.star) {
        locToKy.push({
          star: l1.transforms.loc.star,
          palace: l1.transforms.loc.palace,
          position: l1.transforms.loc.position,
        });
      }
    }
  }

  return { doubleKy, tripleKy, songLoc, locQuyenKhoaHoi, locToKy };
}

/**
 * Analyze a specific year with 3-layer transform stacking.
 */
export function analyzeYear(
  year: number,
  chart: TuViChart
): LayeredFortune {
  const birthYear = chart.birthInfo.solarDate.year;
  const age = year - birthYear + 1; // Vietnamese age counting

  const yearCanChi = getYearCanChi(year);

  // Layer 1: Natal
  const natal = computeTransformLayer(chart.lunarDate.yearCan, chart.palaces);

  // Layer 2: Đại hạn — find which major period this year falls in
  let daiHan: PeriodTransforms | null = null;
  for (const p of chart.palaces) {
    if (p.majorPeriod && age >= p.majorPeriod.startAge && age <= p.majorPeriod.endAge) {
      daiHan = computeTransformLayer(p.majorPeriod.can, chart.palaces);
      break;
    }
  }

  // Layer 3: Lưu niên
  const luuNien = computeTransformLayer(yearCanChi.can, chart.palaces);

  // Yearly stars
  const yearlyStars = getYearlyStars(year);

  // Analysis
  const analysis = analyzeOverlap(natal, daiHan, luuNien);

  return {
    year,
    age,
    yearCan: yearCanChi.can,
    yearChi: yearCanChi.chi,
    natal,
    daiHan,
    luuNien,
    yearlyStars,
    analysis,
  };
}
