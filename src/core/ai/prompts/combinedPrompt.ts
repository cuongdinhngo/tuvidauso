import type { TuViChart } from '../../types';
import type { NumerologyChart } from '../../numerology/types';
import type { Big3Result } from '../../astrology/types';
import type { AIMessage, ModelTier } from '../types';
import { trimConversationHistory } from '../types';
import { SYSTEM_PROMPT_COMBINED } from './systemPrompts';
import { buildNumerologyDescription } from './numerologyPrompt';
import { buildAstrologyDescription } from './astrologyPrompt';
import { calculateYearlyFortune } from '../../tuvi/yearlyPeriod';
import { computeTransformLayer } from '../../tuvi/periodTransforms';

function buildTuViDescription(chart: TuViChart): string {
  const menhPalace = chart.palaces.find((p) => p.name === 'Mệnh');
  const quanLocPalace = chart.palaces.find((p) => p.name === 'Quan Lộc');
  const taiBachPalace = chart.palaces.find((p) => p.name === 'Tài Bạch');
  const phuThePalace = chart.palaces.find((p) => p.name === 'Phu Thê');
  const tatAchPalace = chart.palaces.find((p) => p.name === 'Tật Ách');

  const getStars = (palace: typeof menhPalace) =>
    palace?.stars.filter((s) => s.type === 'chinh').map((s) => s.name).join(', ') || '—';

  return `TỬ VI ĐẨU SỐ:
- Mệnh: ${chart.menhPalaceName} (${chart.menh}) — Chính tinh: ${getStars(menhPalace)}
- Thân: ${chart.thanPalaceName} (${chart.than})
- Cục: ${chart.cuc.name}
- Quan Lộc: ${getStars(quanLocPalace)}
- Tài Bạch: ${getStars(taiBachPalace)}
- Phu Thê: ${getStars(phuThePalace)}
- Tật Ách: ${getStars(tatAchPalace)}
- Âm lịch: ${chart.lunarDate.yearCan} ${chart.lunarDate.yearChi} (${chart.lunarDate.napAm})`;
}

/**
 * Detect if a question is about time/yearly fortune.
 */
function isTimeRelatedQuestion(question: string): boolean {
  const timeKeywords = [
    'năm nay', 'năm 202', 'năm tới', 'năm sau',
    'tháng này', 'tháng tới',
    'hiện tại', 'bao giờ', 'khi nào', 'thời điểm',
    'đại hạn', 'tiểu hạn', 'lưu niên', 'vận hạn',
    'hôm nay', 'tuần này',
    'đông và tây', 'east west',
  ];
  const q = question.toLowerCase();
  return timeKeywords.some(kw => q.includes(kw));
}

/**
 * Build yearly fortune context from existing chart data.
 */
function buildYearlyContext(
  tuViChart: TuViChart,
  numerologyChart: NumerologyChart | null,
  currentYear: number,
): string {
  const birthYear = tuViChart.birthInfo.solarDate.year;
  const currentAge = currentYear - birthYear;

  let ctx = `\nDỮ LIỆU VẬN HẠN NĂM ${currentYear} (ĐÃ TÍNH SẴN — KHÔNG ĐƯỢC BỊA THÊM):\n`;

  // Đại Hạn: find from palaces
  const currentMajorPeriod = tuViChart.palaces.find(
    p => p.majorPeriod && currentAge >= p.majorPeriod.startAge && currentAge <= p.majorPeriod.endAge
  );
  if (currentMajorPeriod?.majorPeriod) {
    const mp = currentMajorPeriod.majorPeriod;
    ctx += `[Tử Vi] Đại Hạn hiện tại: ${mp.can} ${mp.chi} (tuổi ${mp.startAge}-${mp.endAge}), tại cung ${currentMajorPeriod.name}\n`;

    // Đại Hạn Tứ Hóa
    const dhTransforms = computeTransformLayer(mp.can, tuViChart.palaces);
    ctx += `[Tử Vi] Đại Hạn Tứ Hóa (Can ${mp.can}):\n`;
    ctx += `  Lộc: ${dhTransforms.loc.star} → ${dhTransforms.loc.palace || '?'}\n`;
    ctx += `  Quyền: ${dhTransforms.quyen.star} → ${dhTransforms.quyen.palace || '?'}\n`;
    ctx += `  Khoa: ${dhTransforms.khoa.star} → ${dhTransforms.khoa.palace || '?'}\n`;
    ctx += `  Kỵ: ${dhTransforms.ky.star} → ${dhTransforms.ky.palace || '?'}\n`;
  }

  // Tiểu Hạn: calculate for current year
  const palacePositions = tuViChart.palaces.map(p => ({ palace: p.name, position: p.position }));
  const yearlyFortunes = calculateYearlyFortune(
    tuViChart.lunarDate.yearChi,
    tuViChart.birthInfo.gender,
    birthYear,
    palacePositions,
    currentYear,
    currentYear,
  );
  const yearlyFortune = yearlyFortunes[0];
  if (yearlyFortune) {
    ctx += `[Tử Vi] Tiểu Hạn ${currentYear}: cung ${yearlyFortune.palace} (${yearlyFortune.position}), tuổi ${yearlyFortune.age}\n`;

    // Lưu Niên Tứ Hóa
    const lnTransforms = computeTransformLayer(yearlyFortune.yearCan, tuViChart.palaces);
    ctx += `[Tử Vi] Lưu Niên Tứ Hóa (Can ${yearlyFortune.yearCan}):\n`;
    ctx += `  Lộc: ${lnTransforms.loc.star} → ${lnTransforms.loc.palace || '?'}\n`;
    ctx += `  Quyền: ${lnTransforms.quyen.star} → ${lnTransforms.quyen.palace || '?'}\n`;
    ctx += `  Khoa: ${lnTransforms.khoa.star} → ${lnTransforms.khoa.palace || '?'}\n`;
    ctx += `  Kỵ: ${lnTransforms.ky.star} → ${lnTransforms.ky.palace || '?'}\n`;
  }

  // Numerology yearly data
  if (numerologyChart) {
    ctx += `[Thần Số] Năm Cá Nhân ${currentYear}: ${numerologyChart.personalYear.value}\n`;
    ctx += `[Thần Số] Tháng Cá Nhân hiện tại: ${numerologyChart.personalMonth.value}\n`;

    const currentPinnacle = numerologyChart.pinnacles.find(
      p => currentAge >= p.startAge && (p.endAge === null || p.endAge === undefined || currentAge <= p.endAge)
    );
    if (currentPinnacle) {
      ctx += `[Thần Số] Đỉnh Cao hiện tại: Số ${currentPinnacle.number} (${currentPinnacle.startAge}-${currentPinnacle.endAge || '∞'} tuổi)\n`;
    }
  }

  // Astrology — explicitly state no transit data
  ctx += `[Hoàng Đạo] Không có thông tin transit cụ thể trong data. CHỈ phân tích dựa trên Sun Sign + Personal Year.\n`;

  return ctx;
}

export function buildCombinedAIPrompt(
  tuViChart: TuViChart,
  numerologyChart: NumerologyChart,
  big3: Big3Result,
  fullName: string,
  currentYear: number,
  question?: string,
): { system: string; user: string } {
  const tuViDesc = buildTuViDescription(tuViChart);
  const numDesc = buildNumerologyDescription(numerologyChart, fullName);
  const astroDesc = buildAstrologyDescription(big3);

  const sunName = big3.sun.sign.nameEn;
  const moonName = big3.moon ? big3.moon.sign.nameEn : null;

  // Always inject yearly context for the "Năm" section
  const yearlyContext = buildYearlyContext(tuViChart, numerologyChart, currentYear);

  return {
    system: SYSTEM_PROMPT_COMBINED,
    user: `${tuViDesc}

${numDesc}

${astroDesc}

${question ? `${yearlyContext}

CÂU HỎI CỤ THỂ: ${question}

Trả lời dựa trên CẢ 3 hệ thống. Mỗi hệ thống nói gì? Đồng nhất hay khác biệt?` :
`${yearlyContext}

HÃY PHÂN TÍCH KẾT HỢP CẢ 3 HỆ THỐNG:

## 🌏 Tổng Quan — Bạn Là Ai?
[Tử Vi]: Mệnh cung + chính tinh → nói gì về bạn?
[Thần Số]: Life Path ${numerologyChart.lifePath.value} → nói gì?
[Hoàng Đạo]: Sun ${sunName} → nói gì?
→ 3 hệ thống ĐỒNG NHẤT hay KHÁC BIỆT? Phân tích.
(5-6 câu)

## 💼 Sự Nghiệp — 3 Góc Nhìn
[Tử Vi]: Cung Quan Lộc có sao gì? → nghề gì?
[Thần Số]: Expression ${numerologyChart.expression.value} + Life Path → nghề gì?
[Hoàng Đạo]: Sun Sign element + ${big3.sun.sign.rulingPlanet} → nghề gì?
→ Điểm chung? Nghề nào ĐƯỢC CẢ 3 HỆ THỐNG ỦNG HỘ?
(5-6 câu, liệt kê nghề cả 3 đồng ý)

## 💰 Tài Chính — 3 Góc Nhìn
[Tử Vi]: Cung Tài Bạch → cách kiếm tiền
[Thần Số]: Birthday ${numerologyChart.birthday.value} + Inclusion → thói quen tài chính
[Hoàng Đạo]: Element → quan hệ với tiền bạc
→ Kết hợp: chiến lược tài chính tối ưu?
(4-5 câu)

## 💑 Tình Yêu — 3 Góc Nhìn
[Tử Vi]: Cung Phu Thê → kiểu hôn nhân
[Thần Số]: Soul Urge ${numerologyChart.soulUrge.value} → cần gì trong tình yêu
${moonName ? `[Hoàng Đạo]: Moon ${moonName} → cảm xúc yêu` : '[Hoàng Đạo]: Moon Sign chưa có dữ liệu (không biết giờ sinh)'}
→ Kiểu người phù hợp nhất theo CẢ 3 hệ thống?
(4-5 câu)

## 📅 Năm ${currentYear} — 3 Góc Nhìn
DỮ LIỆU VẬN HẠN ĐÃ CUNG CẤP Ở TRÊN — CHỈ dùng data đó, KHÔNG bịa thêm.
[Tử Vi]: Đại hạn + Tiểu hạn + Lưu niên Tứ Hóa → phân tích từ data
[Thần Số]: Năm Cá Nhân ${numerologyChart.personalYear.value}
[Hoàng Đạo]: Chỉ phân tích dựa trên Sun Sign, KHÔNG bịa transit
→ CẢ 3 cùng nói năm nay thế nào? Tháng nào tốt nhất?
(5-6 câu)

## 🏥 Sức Khỏe — 3 Góc Nhìn
[Tử Vi]: Cung Tật Ách + Ngũ Hành Bát Tự → bộ phận nào?
[Thần Số]: Số thiếu/dư → năng lượng mất cân bằng
[Hoàng Đạo]: Body part theo cung → bộ phận nào?
→ Bộ phận nào ĐƯỢC CẢ 2-3 HỆ THỐNG CẢNH BÁO?
(3-4 câu)

## ✅ Điểm ĐỒNG NHẤT (Rất đáng tin cậy)
Liệt kê 3-5 điểm mà CẢ 3 hệ thống đồng ý.

## 🔄 Điểm KHÁC BIỆT (Góc nhìn đa chiều)
Liệt kê 2-3 điểm mà các hệ thống có quan điểm khác nhau. Giải thích tại sao khác nhau và cả 2 góc nhìn đều có giá trị.

## 💡 Lời Khuyên Tổng Hợp
5-7 lời khuyên DỰA TRÊN CẢ 3 HỆ THỐNG. Mỗi lời khuyên ghi rõ được hệ thống nào ủng hộ.`}`,
  };
}

export function buildUnifiedQuestionPrompt(
  question: string,
  tuViChart: TuViChart | null,
  numerologyChart: NumerologyChart | null,
  big3: Big3Result | null,
  fullName: string,
  conversationHistory: AIMessage[],
  tier: ModelTier = 'strong',
): { system: string; messages: AIMessage[] } {
  let chartData = '';
  if (tuViChart) chartData += buildTuViDescription(tuViChart) + '\n\n';
  if (numerologyChart) chartData += buildNumerologyDescription(numerologyChart, fullName) + '\n\n';
  if (big3) chartData += buildAstrologyDescription(big3) + '\n\n';

  // Inject yearly context for time-related questions
  let yearlyContext = '';
  if (isTimeRelatedQuestion(question) && tuViChart) {
    const currentYear = new Date().getFullYear();
    yearlyContext = buildYearlyContext(tuViChart, numerologyChart, currentYear);
  }

  const trimmedHistory = trimConversationHistory(conversationHistory, tier);

  const instructions = `Khi trả lời, hãy TỰ ĐỘNG xác định hệ thống nào phù hợp nhất với câu hỏi:
- Câu hỏi về sao, cung Tử Vi → dùng Tử Vi
- Câu hỏi về số, năm cá nhân → dùng Thần Số
- Câu hỏi về cung hoàng đạo, hành tinh → dùng Chiêm Tinh
- Câu hỏi chung (tính cách, nghề nghiệp, tình yêu) → KẾT HỢP CẢ 3

Trả lời ngắn gọn 4-8 câu, DẪN CHỨNG CỤ THỂ từ data. Ghi rõ [Tử Vi], [Thần Số], [Hoàng Đạo] khi trích dẫn.`;

  if (tier === 'lite') {
    // Lite tier: short system prompt (rules only), data in user message
    const system = SYSTEM_PROMPT_COMBINED;

    const userMessage = `Dữ liệu của tôi:
${chartData}${yearlyContext}

Câu hỏi: ${question}

${instructions}
Trả lời 4-8 câu, MỖI CÂU phải dẫn chứng từ dữ liệu trên. KHÔNG bịa thêm.`;

    return {
      system,
      messages: [
        ...trimmedHistory,
        { role: 'user', content: userMessage },
      ],
    };
  }

  // Medium/Strong tier: data in system prompt
  const system = `${SYSTEM_PROMPT_COMBINED}

DỮ LIỆU ĐẦY ĐỦ CỦA NGƯỜI HỎI:
${chartData}
${instructions}`;

  const userContent = yearlyContext
    ? `${question}\n${yearlyContext}`
    : question;

  return {
    system,
    messages: [
      ...trimmedHistory,
      { role: 'user', content: userContent },
    ],
  };
}
