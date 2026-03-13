import type { PersonProfile, CompatibilityResult, RelationType } from '../types/compare';
import { RELATION_LABELS, RELATION_PALACE_MAP } from '../../data/compareData';

function buildChartSummary(person: PersonProfile): string {
  const { lunarDate, fourPillars, tuViChart } = person;
  const menhPalace = tuViChart.palaces.find(p => p.position === tuViChart.menh);
  const menhStars = menhPalace?.stars.filter(s => s.type === 'chinh').map(s => {
    let desc = s.name;
    if (s.brightness) desc += ` [${s.brightness}]`;
    if (s.transform) desc += ` ${s.transform}`;
    return desc;
  }).join(', ') || 'Vô chính diệu';

  return `  Năm: ${lunarDate.yearCan} ${lunarDate.yearChi} (${lunarDate.napAm})
  Tứ Trụ: ${fourPillars.year.can}${fourPillars.year.chi} / ${fourPillars.month.can}${fourPillars.month.chi} / ${fourPillars.day.can}${fourPillars.day.chi} / ${fourPillars.hour.can}${fourPillars.hour.chi}
  Mệnh: ${tuViChart.menhPalaceName} (${tuViChart.menh}) — ${menhStars}
  Thân: ${tuViChart.thanPalaceName} (${tuViChart.than})
  Cục: ${tuViChart.cuc.name}
  Tuần Không: ${tuViChart.tuanTriet.tuan.join(', ')} | Triệt Lộ: ${tuViChart.tuanTriet.triet.join(', ')}
  Giới tính: ${person.birthInfo.gender === 'male' ? 'Nam' : 'Nữ'}`;
}

/**
 * Build system + user prompts for Claude API comparison analysis.
 * Pure function — no API call.
 */
export function buildComparePrompt(
  p1: PersonProfile,
  p2: PersonProfile,
  result: CompatibilityResult,
  relationType: RelationType
): { system: string; user: string } {
  const relationLabel = RELATION_LABELS[relationType];
  const palaceMap = RELATION_PALACE_MAP[relationType];

  const system = `Bạn là chuyên gia Tử Vi Đẩu Số và Bát Tự, phân tích MỐI QUAN HỆ giữa 2 người.
Loại mối quan hệ: ${relationLabel}.

NGUYÊN TẮC:
1. Xét Nạp Âm tương sinh/khắc
2. Xét Con Giáp tam hợp/lục hợp/lục xung
3. Xét cung liên quan: ${palaceMap.label}
4. Xét Tứ Hóa chiếu chéo
5. Xét Ngũ Hành Bát Tự bổ trợ
6. KHÔNG BAO GIỜ khuyên chia tay/cắt đứt — luôn đưa giải pháp xây dựng.
7. Mỗi phân tích phải DẪN CHỨNG CỤ THỂ sao + cung + mức sáng.`;

  const categorySummary = result.categories
    .map(c => `- ${c.name}: ${c.score}/100 — ${c.analysis}`)
    .join('\n');

  const user = `NGƯỜI 1 (Người hỏi): ${p1.name}
${buildChartSummary(p1)}

NGƯỜI 2: ${p2.name}
${buildChartSummary(p2)}

MỐI QUAN HỆ: ${relationLabel}

KẾT QUẢ TÍNH TOÁN SƠ BỘ:
- Điểm tổng: ${result.overallScore}/100 (${result.ratingLabel})
${categorySummary}

HÃY PHÂN TÍCH CHI TIẾT:

## Đánh Giá Tổng Quan
Tóm tắt mức độ tương hợp, 2-3 điểm nổi bật. 3-4 câu.

## Điểm Mạnh Của Mối Quan Hệ
3-5 điểm mạnh, DẪN CHỨNG CỤ THỂ từ lá số.

## Thử Thách Cần Vượt Qua
2-4 thử thách, kèm GIẢI PHÁP cụ thể.

## Lời Khuyên
5 lời khuyên CỤ THỂ, THỰC TẾ. Dẫn chứng từ lá số.`;

  return { system, user };
}
