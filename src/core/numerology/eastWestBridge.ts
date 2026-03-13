import type { TuViChart } from '../types';
import type { NumerologyChart } from './types';
import { LIFE_PATH_MEANINGS, PERSONAL_YEAR_MEANINGS, NUMBER_MEANINGS } from '../../data/numerologyData';

export interface EastWestComparison {
  personality: {
    tuvi: string;
    numerology: string;
    agreement: 'high' | 'medium' | 'low';
    analysis: string;
  };
  career: {
    tuvi: string;
    numerology: string;
    agreement: 'high' | 'medium' | 'low';
    analysis: string;
  };
  yearForecast: {
    tuvi: string;
    numerology: string;
    agreement: 'high' | 'medium' | 'low';
    analysis: string;
  };
  overallInsight: string;
}

// Mapping TuVi main stars to numerology number traits
const STAR_TRAITS: Record<string, number[]> = {
  'Tử Vi': [1, 8],
  'Thiên Cơ': [3, 7],
  'Thái Dương': [1, 3],
  'Vũ Khúc': [4, 8],
  'Thiên Đồng': [3, 5],
  'Liêm Trinh': [5, 8],
  'Thiên Phủ': [4, 6],
  'Thái Âm': [2, 7],
  'Tham Lang': [3, 5],
  'Cự Môn': [7, 9],
  'Thiên Tướng': [2, 6],
  'Thiên Lương': [6, 9],
  'Thất Sát': [1, 8],
  'Phá Quân': [5, 1],
};

function getAgreement(starTraits: number[], numerologyNumber: number): 'high' | 'medium' | 'low' {
  if (starTraits.includes(numerologyNumber)) return 'high';
  // Check adjacent numbers
  if (starTraits.some(t => Math.abs(t - numerologyNumber) <= 1)) return 'medium';
  return 'low';
}

export function compareEastWest(
  tuViChart: TuViChart,
  numerologyChart: NumerologyChart,
  currentYear: number,
): EastWestComparison {
  const menhPalace = tuViChart.palaces.find(p => p.name === 'Mệnh');
  const quanLocPalace = tuViChart.palaces.find(p => p.name === 'Quan Lộc');
  const menhStars = menhPalace?.stars.filter(s => s.type === 'chinh') || [];
  const quanLocStars = quanLocPalace?.stars.filter(s => s.type === 'chinh') || [];

  const lpValue = numerologyChart.lifePath.value;
  const lpMeaning = LIFE_PATH_MEANINGS[lpValue];
  const exValue = numerologyChart.expression.value;
  const exMeaning = NUMBER_MEANINGS[exValue];
  const pyValue = numerologyChart.personalYear.value;
  const pyMeaning = PERSONAL_YEAR_MEANINGS[pyValue];

  // Personality comparison
  const menhTraits = menhStars.flatMap(s => STAR_TRAITS[s.name] || []);
  const personalityAgreement = menhTraits.length > 0 ? getAgreement(menhTraits, lpValue) : 'medium';
  const menhNames = menhStars.map(s => s.name).join(', ') || '—';

  // Career comparison
  const careerTraits = quanLocStars.flatMap(s => STAR_TRAITS[s.name] || []);
  const careerAgreement = careerTraits.length > 0 && exValue > 0 ? getAgreement(careerTraits, exValue) : 'medium';
  const quanLocNames = quanLocStars.map(s => s.name).join(', ') || '—';

  // Year forecast
  const yearAgreement: 'high' | 'medium' | 'low' = 'medium';

  const agreementText = { high: 'đồng nhất cao', medium: 'tương đối tương đồng', low: 'có góc nhìn khác nhau' };

  return {
    personality: {
      tuvi: menhNames,
      numerology: `Số ${lpValue} — ${lpMeaning?.title || ''}`,
      agreement: personalityAgreement,
      analysis: `Tử Vi chỉ ra tính cách qua ${menhNames} tại Mệnh, Thần Số Học qua Số Chủ Đạo ${lpValue} (${lpMeaning?.title || ''}). Hai hệ thống ${agreementText[personalityAgreement]}.`,
    },
    career: {
      tuvi: quanLocNames,
      numerology: exValue > 0 ? `Số ${exValue} — ${exMeaning?.title || ''}` : 'Chưa có tên',
      agreement: careerAgreement,
      analysis: `Quan Lộc có ${quanLocNames}${exValue > 0 ? `, Số Vận Mệnh ${exValue} (${exMeaning?.title || ''})` : ''}. Hai hệ thống ${agreementText[careerAgreement]}.`,
    },
    yearForecast: {
      tuvi: tuViChart.menhPalaceName,
      numerology: `Năm ${pyValue} — ${pyMeaning?.theme || ''}`,
      agreement: yearAgreement,
      analysis: `Năm ${currentYear}: Tử Vi tại ${tuViChart.menhPalaceName}, Thần Số Học là Năm Cá Nhân ${pyValue} (${pyMeaning?.theme || ''}).`,
    },
    overallInsight: `Kết hợp cả hai hệ thống Đông — Tây cho cái nhìn toàn diện hơn. Mỗi hệ thống có góc nhìn riêng và bổ trợ lẫn nhau.`,
  };
}
