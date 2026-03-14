import { describe, it, expect } from 'vitest';
import { solarToLunar } from '../src/core/calendar/solarToLunar';
import { calculateFourPillars } from '../src/core/battu/fourPillars';
import { getMenhCung } from '../src/core/tuvi/menhCung';
import { getThanCung } from '../src/core/tuvi/thanCung';
import { getCuc } from '../src/core/tuvi/cuc';
import { placeMainStars } from '../src/core/tuvi/mainStars';
import { placeAuxStars } from '../src/core/tuvi/auxStars';
import { arrangePalaces } from '../src/core/tuvi/twelvePalaces';
import { getStarTransform } from '../src/core/tuvi/fourTransforms';
import { getBrightness } from '../src/core/tuvi/brightness';
import type { TuViChart, BirthInfo, Palace, Star } from '../src/core/types';
import { calculateNumerology } from '../src/core/numerology/calculator';
import { getSunSign } from '../src/core/astrology/sunSign';
import { getMoonSign, diaChiToHour } from '../src/core/astrology/moonSign';
import type { Big3Result } from '../src/core/astrology/types';

import { buildNumerologyDescription, buildNumerologyAIPrompt } from '../src/core/ai/prompts/numerologyPrompt';
import { buildAstrologyDescription, buildAstrologyAIPrompt } from '../src/core/ai/prompts/astrologyPrompt';
import { buildCombinedAIPrompt, buildUnifiedQuestionPrompt } from '../src/core/ai/prompts/combinedPrompt';
import { SYSTEM_PROMPT_NUMEROLOGY, SYSTEM_PROMPT_ASTROLOGY, SYSTEM_PROMPT_COMBINED } from '../src/core/ai/prompts/systemPrompts';

// --- Test data setup ---

function buildTestChart(solarYear: number, solarMonth: number, solarDay: number, hourIndex: number, gender: 'male' | 'female'): TuViChart {
  const lunarDate = solarToLunar(solarYear, solarMonth, solarDay);
  const fourPillars = calculateFourPillars(solarYear, solarMonth, solarDay, hourIndex);
  const menh = getMenhCung(lunarDate.month, hourIndex);
  const than = getThanCung(lunarDate.month, hourIndex);
  const cuc = getCuc(lunarDate.yearCan, menh);
  const palacePositions = arrangePalaces(menh);
  const mainStars = placeMainStars(cuc.value, lunarDate.day);
  const auxStars = placeAuxStars(lunarDate.yearCan, lunarDate.yearChi, lunarDate.month, lunarDate.day, hourIndex);

  const palaces: Palace[] = palacePositions.map((pp) => {
    const stars: Star[] = [];
    for (const ms of mainStars) {
      if (ms.position === pp.position) {
        stars.push({
          name: ms.star,
          type: 'chinh',
          brightness: getBrightness(ms.star, pp.position),
          transform: getStarTransform(lunarDate.yearCan, ms.star) as any,
        });
      }
    }
    for (const as_ of auxStars) {
      if (as_.position === pp.position) {
        stars.push({ name: as_.star, type: 'phu', transform: getStarTransform(lunarDate.yearCan, as_.star) as any });
      }
    }
    return { name: pp.palace, position: pp.position, stars };
  });

  const birthInfo: BirthInfo = { solarDate: { year: solarYear, month: solarMonth, day: solarDay }, hour: hourIndex, gender };

  return {
    birthInfo, lunarDate, fourPillars, menh, than, cuc, palaces,
    menhPalaceName: 'Mệnh', thanPalaceName: palaces.find(p => p.position === than)?.name || '',
  };
}

const numChart = calculateNumerology('Ngô Đình Cường', 6, 11, 1988, 2026, 3);
const sunSign = getSunSign(1988, 4, 15);
const moonSign = getMoonSign(1988, 4, 15, diaChiToHour(6), 0, 7);
const big3Full: Big3Result = { sun: sunSign, moon: moonSign, rising: null };
const big3SunOnly: Big3Result = { sun: sunSign, moon: null, rising: null };
const tuViChart = buildTestChart(1988, 4, 15, 6, 'male');

// --- Numerology prompt tests ---

describe('buildNumerologyDescription', () => {
  it('contains all key sections', () => {
    const desc = buildNumerologyDescription(numChart, 'Ngô Đình Cường');
    expect(desc).toContain('Life Path');
    expect(desc).toContain(String(numChart.lifePath.value));
    expect(desc).toContain('Expression');
    expect(desc).toContain('Soul Urge');
    expect(desc).toContain('Personality');
    expect(desc).toContain('Pinnacles');
    expect(desc).toContain('Challenges');
    expect(desc).toContain('Năm Cá Nhân');
    expect(desc).toContain('Ngô Đình Cường');
  });

  it('shows "Chưa nhập tên" when name is empty', () => {
    const desc = buildNumerologyDescription(numChart, '');
    expect(desc).toContain('Chưa nhập tên');
  });
});

describe('buildNumerologyAIPrompt', () => {
  it('returns system = SYSTEM_PROMPT_NUMEROLOGY', () => {
    const prompt = buildNumerologyAIPrompt(numChart, 'Test', 2026, 1988);
    expect(prompt.system).toBe(SYSTEM_PROMPT_NUMEROLOGY);
  });

  it('user prompt contains analysis instruction and chart data', () => {
    const prompt = buildNumerologyAIPrompt(numChart, 'Ngô Đình Cường', 2026, 1988);
    expect(prompt.user).toContain('HÃY PHÂN TÍCH');
    expect(prompt.user).toContain('Life Path');
    expect(prompt.user).toContain('Expression');
    expect(prompt.user).toContain('Năm 2026');
  });
});

// --- Astrology prompt tests ---

describe('buildAstrologyDescription', () => {
  it('contains Sun Sign info and Decan', () => {
    const desc = buildAstrologyDescription(big3Full);
    expect(desc).toContain(sunSign.sign.nameEn);
    expect(desc).toContain('Decan');
  });

  it('with moon: contains Moon Sign', () => {
    const desc = buildAstrologyDescription(big3Full);
    expect(desc).toContain('Moon Sign');
  });

  it('sun-only: does not contain Moon Sign', () => {
    const desc = buildAstrologyDescription(big3SunOnly);
    expect(desc).not.toContain('Moon Sign');
  });
});

describe('buildAstrologyAIPrompt', () => {
  it('returns system = SYSTEM_PROMPT_ASTROLOGY', () => {
    const prompt = buildAstrologyAIPrompt(big3Full);
    expect(prompt.system).toBe(SYSTEM_PROMPT_ASTROLOGY);
  });

  it('user prompt contains analysis instruction', () => {
    const prompt = buildAstrologyAIPrompt(big3Full);
    expect(prompt.user).toContain('HÃY PHÂN TÍCH CHI TIẾT');
  });

  it('sun-only: uses "Tính Cách Chi Tiết" instead of "Big 3 Kết Hợp"', () => {
    const prompt = buildAstrologyAIPrompt(big3SunOnly);
    expect(prompt.user).toContain('Tính Cách Chi Tiết');
    expect(prompt.user).not.toContain('Big 3 Kết Hợp');
  });
});

// --- Combined prompt tests ---

describe('buildCombinedAIPrompt', () => {
  it('returns system = SYSTEM_PROMPT_COMBINED', () => {
    const prompt = buildCombinedAIPrompt(tuViChart, numChart, big3Full, 'Test', 2026);
    expect(prompt.system).toBe(SYSTEM_PROMPT_COMBINED);
  });

  it('user prompt contains all 3 system descriptions', () => {
    const prompt = buildCombinedAIPrompt(tuViChart, numChart, big3Full, 'Test', 2026);
    expect(prompt.user).toContain('TỬ VI ĐẨU SỐ');
    expect(prompt.user).toContain('THẦN SỐ HỌC');
    expect(prompt.user).toContain('CUNG HOÀNG ĐẠO');
  });

  it('without question: contains combined analysis instruction', () => {
    const prompt = buildCombinedAIPrompt(tuViChart, numChart, big3Full, 'Test', 2026);
    expect(prompt.user).toContain('HÃY PHÂN TÍCH KẾT HỢP CẢ 3 HỆ THỐNG');
  });

  it('with question: contains "CÂU HỎI CỤ THỂ" and the question', () => {
    const prompt = buildCombinedAIPrompt(tuViChart, numChart, big3Full, 'Test', 2026, 'Năm nay tôi nên làm gì?');
    expect(prompt.user).toContain('CÂU HỎI CỤ THỂ');
    expect(prompt.user).toContain('Năm nay tôi nên làm gì?');
    expect(prompt.user).not.toContain('HÃY PHÂN TÍCH KẾT HỢP CẢ 3 HỆ THỐNG');
  });

  it('with null moon: marks Moon as unknown instead of using Sun sign', () => {
    const prompt = buildCombinedAIPrompt(tuViChart, numChart, big3SunOnly, 'Test', 2026);
    expect(prompt.user).toContain('chưa có dữ liệu');
    expect(prompt.user).not.toContain(`Moon ${sunSign.sign.nameEn} → cảm xúc yêu`);
  });
});

describe('buildUnifiedQuestionPrompt', () => {
  it('system contains combined prompt + data context', () => {
    const result = buildUnifiedQuestionPrompt('Tôi hợp nghề gì?', tuViChart, numChart, big3Full, 'Test', []);
    expect(result.system).toContain(SYSTEM_PROMPT_COMBINED);
    expect(result.system).toContain('TỬ VI ĐẨU SỐ');
    expect(result.system).toContain('THẦN SỐ HỌC');
  });

  it('messages ends with user question', () => {
    const result = buildUnifiedQuestionPrompt('Tôi hợp nghề gì?', tuViChart, numChart, big3Full, 'Test', []);
    const last = result.messages[result.messages.length - 1];
    expect(last.role).toBe('user');
    expect(last.content).toBe('Tôi hợp nghề gì?');
  });

  it('prepends conversation history', () => {
    const history = [
      { role: 'user' as const, content: 'Xin chào' },
      { role: 'assistant' as const, content: 'Chào bạn!' },
    ];
    const result = buildUnifiedQuestionPrompt('Câu hỏi tiếp', tuViChart, numChart, big3Full, 'Test', history);
    expect(result.messages.length).toBe(3);
    expect(result.messages[0].content).toBe('Xin chào');
    expect(result.messages[1].content).toBe('Chào bạn!');
    expect(result.messages[2].content).toBe('Câu hỏi tiếp');
  });

  it('handles null charts gracefully', () => {
    const result = buildUnifiedQuestionPrompt('Hỏi gì đó', null, null, null, 'Test', []);
    expect(result.system).toContain(SYSTEM_PROMPT_COMBINED);
    expect(result.messages.length).toBe(1);
  });
});
