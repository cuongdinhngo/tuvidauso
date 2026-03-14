import type { TuViChart } from '../../types';
import type { NumerologyChart } from '../../numerology/types';
import type { Big3Result } from '../../astrology/types';
import type { AIMessage } from '../types';
import { SYSTEM_PROMPT_COMBINED } from './systemPrompts';
import { buildNumerologyDescription } from './numerologyPrompt';
import { buildAstrologyDescription } from './astrologyPrompt';

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

  return {
    system: SYSTEM_PROMPT_COMBINED,
    user: `${tuViDesc}

${numDesc}

${astroDesc}

${question ? `CÂU HỎI CỤ THỂ: ${question}

Trả lời dựa trên CẢ 3 hệ thống. Mỗi hệ thống nói gì? Đồng nhất hay khác biệt?` :
`HÃY PHÂN TÍCH KẾT HỢP CẢ 3 HỆ THỐNG:

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
[Tử Vi]: Đại hạn + Tiểu hạn + Lưu niên Tứ Hóa
[Thần Số]: Năm Cá Nhân ${numerologyChart.personalYear.value}
[Hoàng Đạo]: Transit / Solar Return trends
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
): { system: string; messages: AIMessage[] } {
  let context = '';
  if (tuViChart) context += buildTuViDescription(tuViChart) + '\n\n';
  if (numerologyChart) context += buildNumerologyDescription(numerologyChart, fullName) + '\n\n';
  if (big3) context += buildAstrologyDescription(big3) + '\n\n';

  const system = `${SYSTEM_PROMPT_COMBINED}

DỮ LIỆU ĐẦY ĐỦ CỦA NGƯỜI HỎI:
${context}

Khi trả lời, hãy TỰ ĐỘNG xác định hệ thống nào phù hợp nhất với câu hỏi:
- Câu hỏi về sao, cung Tử Vi → dùng Tử Vi
- Câu hỏi về số, năm cá nhân → dùng Thần Số
- Câu hỏi về cung hoàng đạo, hành tinh → dùng Chiêm Tinh
- Câu hỏi chung (tính cách, nghề nghiệp, tình yêu) → KẾT HỢP CẢ 3

Trả lời ngắn gọn 4-8 câu, DẪN CHỨNG CỤ THỂ từ data. Ghi rõ [Tử Vi], [Thần Số], [Hoàng Đạo] khi trích dẫn.`;

  return {
    system,
    messages: [
      ...conversationHistory,
      { role: 'user', content: question },
    ],
  };
}
