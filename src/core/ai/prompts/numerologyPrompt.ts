import type { NumerologyChart } from '../../numerology/types';
import { SYSTEM_PROMPT_NUMEROLOGY } from './systemPrompts';

export function buildNumerologyDescription(chart: NumerologyChart, fullName: string): string {
  return `THẦN SỐ HỌC (${fullName || 'Chưa nhập tên'}):

Các số chính:
- Số Chủ Đạo (Life Path): ${chart.lifePath.value}${chart.lifePath.masterNumber ? ' (MASTER NUMBER)' : ''}${chart.lifePath.karmicDebt ? ' (có Nợ Nghiệp)' : ''}
  Quá trình: ${chart.lifePath.reductionPath}
- Số Vận Mệnh (Expression): ${chart.expression.value}${chart.expression.masterNumber ? ' (MASTER)' : ''}
- Số Linh Hồn (Soul Urge): ${chart.soulUrge.value}
- Số Nhân Cách (Personality): ${chart.personality.value}
- Số Ngày Sinh (Birthday): ${chart.birthday.value}
- Số Thái Độ (Attitude): ${chart.attitude.value}

Nợ Nghiệp (Karmic Debt): ${chart.karmicDebt.length > 0 ? chart.karmicDebt.join(', ') : 'Không có'}
Bài Học Nghiệp (thiếu trong tên): ${chart.karmicLesson.length > 0 ? chart.karmicLesson.join(', ') : 'Không có'}
Đam Mê Ẩn (số nhiều nhất): ${chart.hiddenPassion.join(', ')}

Biểu đồ Inclusion: ${Object.entries(chart.inclusionChart).map(([n, c]) => `${n}:${c}`).join(' | ')}

4 Đỉnh Cao (Pinnacles):
${chart.pinnacles.map((p, i) => `  Đỉnh ${i + 1} (${p.startAge}-${p.endAge || '∞'} tuổi): Số ${p.number}`).join('\n')}

4 Thử Thách (Challenges):
${chart.challenges.map((c, i) => `  Thử thách ${i + 1}: Số ${c.number}`).join('\n')}

Năm Cá Nhân hiện tại: ${chart.personalYear.value}
Tháng Cá Nhân hiện tại: ${chart.personalMonth.value}`;
}

function getCurrentPinnacle(chart: NumerologyChart, birthYear: number): number {
  const currentAge = new Date().getFullYear() - birthYear;
  for (let i = 0; i < chart.pinnacles.length; i++) {
    const p = chart.pinnacles[i];
    if (p.endAge === null || p.endAge === undefined || currentAge <= p.endAge) {
      return i + 1;
    }
  }
  return 4;
}

export function buildNumerologyAIPrompt(
  chart: NumerologyChart,
  fullName: string,
  currentYear: number,
  birthYear: number,
): { system: string; user: string } {
  const numDesc = buildNumerologyDescription(chart, fullName);

  return {
    system: SYSTEM_PROMPT_NUMEROLOGY,
    user: `${numDesc}

HÃY PHÂN TÍCH THẦN SỐ HỌC CỦA ${fullName || 'người này'}:

## 🔢 Phân Tích Số Chủ Đạo ${chart.lifePath.value}
Số Chủ Đạo là nền tảng — nhưng hãy phân tích trong BỐI CẢNH các số khác.
Life Path ${chart.lifePath.value} KẾT HỢP Expression ${chart.expression.value} nói gì?
Soul Urge ${chart.soulUrge.value} có hòa hợp hay mâu thuẫn với Life Path?
Personality ${chart.personality.value} khiến người ngoài nhìn bạn thế nào so với bản chất thật?
(4-6 câu, CỤ THỂ cho tổ hợp số này)

## 👤 Tính Cách Tổng Hợp (⭐ /5)
Kết hợp TẤT CẢ các số để vẽ chân dung tính cách HOÀN CHỈNH.
Đừng liệt kê từng số riêng — hãy TỔNG HỢP thành 1 bức tranh.
(4-5 câu)

## 💼 Sự Nghiệp (⭐ /5)
Expression ${chart.expression.value} cho biết năng lực biểu đạt.
Life Path ${chart.lifePath.value} cho biết con đường.
Birthday ${chart.birthday.value} cho biết tài năng bẩm sinh.
→ Kết hợp 3 số: nghề nghiệp phù hợp CỤ THỂ? (không chỉ danh mục chung)
(4-5 câu, nêu 5-7 nghề cụ thể)

## 💰 Tài Chính (⭐ /5)
Phân tích cách kiếm tiền, thói quen tài chính, cạm bẫy cần tránh.
(3-4 câu)

## 💑 Tình Yêu (⭐ /5)
Soul Urge ${chart.soulUrge.value} = bạn THỰC SỰ cần gì trong tình yêu.
Personality ${chart.personality.value} = bạn THỂ HIỆN ra sao khi yêu.
Life Path tương hợp nhất với số nào? Thử thách với số nào?
(4-5 câu)

${chart.karmicDebt.length > 0 ? `## ⚠️ Nợ Nghiệp ${chart.karmicDebt.join(', ')}
Giải thích bài học cụ thể, cách vượt qua, KHÔNG gây hoang mang.
(3-4 câu)` : ''}

## 📅 Năm ${currentYear} — Năm Cá Nhân ${chart.personalYear.value}
Chủ đề năm này là gì? Nên tập trung vào điều gì?
Kết hợp với Pinnacle hiện tại (Đỉnh ${getCurrentPinnacle(chart, birthYear)}): giai đoạn này đang ở đâu trong cuộc đời?
(4-6 câu, lời khuyên cụ thể theo quý)

## 📊 Biểu Đồ Inclusion — Năng Lượng Dư/Thiếu
Số thiếu: ${chart.karmicLesson.join(', ') || 'Không'} → bài học cần học
Đam mê ẩn: ${chart.hiddenPassion.join(', ')} → năng lượng tự nhiên
Phân tích: thiếu gì cần bổ sung, dư gì cần cân bằng.
(3-4 câu)

## 💡 Lời Khuyên
5 lời khuyên thực tế dựa trên BỘ SỐ TỔNG HỢP (không phải từ 1 số riêng lẻ).`,
  };
}
