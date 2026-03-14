import type { TuViChart } from '../types';
import type { NumerologyChart } from './types';
import { LIFE_PATH_MEANINGS, PERSONAL_YEAR_MEANINGS } from '../../data/numerologyData';
import { ANTI_HALLUCINATION_RULE } from '../ai/prompts/systemPrompts';

export function buildEastWestPrompt(
  tuViChart: TuViChart,
  numerologyChart: NumerologyChart,
): { system: string; user: string } {
  const menhPalace = tuViChart.palaces.find(p => p.name === 'Mệnh');
  const quanLocPalace = tuViChart.palaces.find(p => p.name === 'Quan Lộc');
  const taiBachPalace = tuViChart.palaces.find(p => p.name === 'Tài Bạch');

  const menhStars = menhPalace?.stars.filter(s => s.type === 'chinh').map(s => s.name).join(', ') || '—';
  const quanLocStars = quanLocPalace?.stars.filter(s => s.type === 'chinh').map(s => s.name).join(', ') || '—';
  const taiBachStars = taiBachPalace?.stars.filter(s => s.type === 'chinh').map(s => s.name).join(', ') || '—';

  const lpMeaning = LIFE_PATH_MEANINGS[numerologyChart.lifePath.value];
  const pyMeaning = PERSONAL_YEAR_MEANINGS[numerologyChart.personalYear.value];
  const currentYear = new Date().getFullYear();

  return {
    system: `${ANTI_HALLUCINATION_RULE}

Bạn là chuyên gia cả Tử Vi Đẩu Số (phương Đông) lẫn Thần Số Học (phương Tây).
Hãy phân tích KẾT HỢP 2 hệ thống để đưa ra cái nhìn toàn diện nhất.
Khi 2 hệ thống ĐỒNG NHẤT → nhấn mạnh, đó là điểm rất đáng tin cậy.
Khi 2 hệ thống KHÁC BIỆT → giải thích góc nhìn khác nhau, cả 2 đều có giá trị.`,
    user: `TỬ VI ĐẨU SỐ:
- Mệnh: ${tuViChart.menhPalaceName} (${tuViChart.menh}) — Chính tinh: ${menhStars}
- Quan Lộc: ${quanLocStars}
- Tài Bạch: ${taiBachStars}
- Cục: ${tuViChart.cuc.name}

THẦN SỐ HỌC:
- Số Chủ Đạo: ${numerologyChart.lifePath.value} (${lpMeaning?.title || ''})
- Số Vận Mệnh: ${numerologyChart.expression.value}
- Số Linh Hồn: ${numerologyChart.soulUrge.value}
- Năm Cá Nhân ${currentYear}: ${numerologyChart.personalYear.value} (${pyMeaning?.theme || ''})

Hãy phân tích kết hợp:
1. Tính cách: Tử Vi nói gì vs Thần Số Học nói gì → điểm chung?
2. Sự nghiệp: 2 hệ thống có cùng hướng không?
3. Năm ${currentYear}: Cả Đông và Tây nói gì về năm nay?
4. Lời khuyên tổng hợp từ cả 2 hệ thống.`,
  };
}
