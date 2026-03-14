import type { TuViChart } from '../../types';
import type { AIMessage, ModelTier } from '../types';
import { trimConversationHistory } from '../types';
import { ANTI_HALLUCINATION_RULE } from './systemPrompts';
import { SUGGESTION_INSTRUCTION } from './suggestionInstruction';
import { getTamHopPositions, getDoiCung } from '../../tuvi/palaceRelations';
import { getElement } from '../../battu/fiveElements';

export type LuanGiaiSectionId =
  | 'tong-quan' | 'tinh-cach' | 'su-nghiep' | 'tai-loc'
  | 'tinh-duyen' | 'suc-khoe' | 'gia-dinh' | 'cach-cuc' | 'loi-khuyen';

const SYSTEM_PROMPT_LUAN_GIAI = `${ANTI_HALLUCINATION_RULE}

Bạn là chuyên gia Tử Vi Đẩu Số. Phân tích dựa trên dữ liệu lá số được cung cấp.

QUY TẮC:
- MỌI nhận định phải dẫn chứng TÊN SAO + MỨC SÁNG + VỊ TRÍ cụ thể
- Xét sao TỌA THỦ + TAM HỢP CHIẾU + ĐỐI CUNG CHIẾU
- Xét Tứ Hóa ảnh hưởng
- Xét Tuần/Triệt nếu cung bị ảnh hưởng
- Rating ⭐ (1-5) cho mỗi lĩnh vực
- Ngắn gọn, mỗi đoạn 3-5 câu, đi thẳng vào insight
- KHÔNG lặp lại thông tin rule-based đã hiện sẵn trên UI`;

const SECTION_PALACES: Record<LuanGiaiSectionId, string[]> = {
  'tong-quan': ['Mệnh'],
  'tinh-cach': ['Mệnh'],
  'su-nghiep': ['Quan Lộc', 'Mệnh', 'Thiên Di'],
  'tai-loc': ['Tài Bạch', 'Điền Trạch', 'Phúc Đức'],
  'tinh-duyen': ['Phu Thê', 'Tử Tức'],
  'suc-khoe': ['Tật Ách', 'Mệnh'],
  'gia-dinh': ['Phụ Mẫu', 'Huynh Đệ', 'Tử Tức'],
  'cach-cuc': ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Phu Thê'],
  'loi-khuyen': ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Phu Thê', 'Tật Ách'],
};

const DEEP_ANALYSIS_SECTIONS: LuanGiaiSectionId[] = [
  'tinh-cach', 'su-nghiep', 'tai-loc', 'tinh-duyen', 'suc-khoe',
];

const NHAT_CHU_SECTIONS: LuanGiaiSectionId[] = [
  'suc-khoe', 'loi-khuyen', 'tong-quan',
];

function buildSectionData(section: LuanGiaiSectionId, chart: TuViChart): string {
  let data = `Mệnh: ${chart.menh}, Thân: ${chart.than}, Cục: ${chart.cuc.name}, Nạp Âm: ${chart.lunarDate.napAm}\n`;

  // Tứ Hóa: scan all palaces for stars with transform
  const tuHoaLines: string[] = [];
  for (const palace of chart.palaces) {
    for (const star of palace.stars) {
      if (star.transform) {
        tuHoaLines.push(`${star.transform}: ${star.name} @ ${palace.name}`);
      }
    }
  }
  if (tuHoaLines.length) data += `Tứ Hóa: ${tuHoaLines.join(', ')}\n`;

  data += `Tuần: ${chart.tuanTriet.tuan.join('-')}, Triệt: ${chart.tuanTriet.triet.join('-')}\n\n`;

  const palaceNames = SECTION_PALACES[section];
  const includeRelations = DEEP_ANALYSIS_SECTIONS.includes(section);

  for (const name of palaceNames) {
    const palace = chart.palaces.find(p => p.name === name);
    if (!palace) continue;

    const isTuan = chart.tuanTriet.tuan.includes(palace.position);
    const isTriet = chart.tuanTriet.triet.includes(palace.position);

    // Chính tinh
    const mainStars = palace.stars
      .filter(s => s.type === 'chinh')
      .map(s => {
        let n = s.name;
        if (s.brightness) n += `[${s.brightness}]`;
        if (s.transform) n += `{${s.transform}}`;
        return n;
      });

    // Phụ tinh quan trọng (cát, sát, or has transform)
    const auxStars = palace.stars
      .filter(s => s.type !== 'chinh' && (s.type === 'cat' || s.type === 'sat' || s.transform))
      .map(s => s.transform ? `${s.name}{${s.transform}}` : s.name);

    data += `${name} (${palace.position})${isTuan ? ' [TUẦN]' : ''}${isTriet ? ' [TRIỆT]' : ''}:\n`;
    data += `  Chính: ${mainStars.join(', ') || 'Vô chính diệu'}\n`;
    if (auxStars.length) data += `  Phụ: ${auxStars.join(', ')}\n`;

    // Tam hợp + Đối cung (for deep analysis sections)
    if (includeRelations) {
      const tamHop = getTamHopPositions(palace.position);
      const doiCung = getDoiCung(palace.position);

      for (const pos of [...tamHop, doiCung]) {
        const relPalace = chart.palaces.find(p => p.position === pos);
        if (relPalace) {
          const relStars = relPalace.stars
            .filter(s => s.type === 'chinh')
            .map(s => s.brightness ? `${s.name}[${s.brightness}]` : s.name);
          if (relStars.length) {
            const relType = tamHop.includes(pos) ? 'Tam hợp' : 'Đối cung';
            data += `  ${relType} ${relPalace.name}(${pos}): ${relStars.join(', ')}\n`;
          }
        }
      }
    }
  }

  // Bát Tự compact (cho Sức Khỏe + Lời Khuyên + Tổng Quan)
  if (NHAT_CHU_SECTIONS.includes(section) && chart.fourPillars) {
    data += `\nNhật Chủ: ${chart.fourPillars.day.can} (${getElement(chart.fourPillars.day.can)})\n`;
  }

  return data;
}

const SECTION_PROMPTS: Record<LuanGiaiSectionId, string> = {
  'tong-quan': `Tóm tắt lá số trong 4-6 câu: điểm nổi bật nhất, xu hướng chung, tiềm năng. Rating tổng ⭐/5.`,

  'tinh-cach': `Phân tích tính cách dựa trên cung Mệnh + chính tinh + tam hợp chiếu + đối cung chiếu.
Nêu: 3 điểm mạnh nổi bật (dẫn chứng sao), 2 điểm cần cải thiện, và 1 insight bất ngờ.
Rating ⭐/5.`,

  'su-nghiep': `Phân tích sự nghiệp từ cung Quan Lộc + tam hợp + đối cung.
Nêu: Phong cách làm việc, kiểu sự nghiệp phù hợp, 5-7 nghề CỤ THỂ (không chỉ ngành chung), giai đoạn phát triển.
Rating ⭐/5.`,

  'tai-loc': `Phân tích tài lộc từ cung Tài Bạch + Điền Trạch.
Nêu: Cách kiếm tiền phù hợp, kênh đầu tư tốt, cạm bẫy tài chính cần tránh, chiến lược tài chính.
Rating ⭐/5.`,

  'tinh-duyen': `Phân tích tình duyên từ cung Phu Thê + Tử Tức.
Nêu: Kiểu hôn nhân, mẫu người phù hợp (MÔ TẢ cụ thể, không chung chung), thử thách chính và cách vượt qua, thời điểm thuận lợi.
Rating ⭐/5.`,

  'suc-khoe': `Phân tích sức khỏe từ cung Tật Ách + Ngũ Hành Bát Tự.
Nêu: 2-3 bộ phận cần lưu ý (DẪN CHỨNG từ sao + ngũ hành), loại bệnh có xu hướng, lời khuyên phòng ngừa CỤ THỂ.
Rating ⭐/5.`,

  'gia-dinh': `Phân tích gia đình từ cung Phụ Mẫu + Huynh Đệ + Tử Tức.
Nêu: Quan hệ với cha mẹ, anh em, triển vọng con cái. Mỗi phần 2-3 câu.`,

  'cach-cuc': `Phân tích các cách cục đặc biệt trong lá số.
Với mỗi cách cục: giải thích ý nghĩa, ảnh hưởng thực tế, và cách phát huy/hóa giải.
Nếu không có cách cục → phân tích tổ hợp sao đáng chú ý nhất.`,

  'loi-khuyen': `Đưa 5-7 lời khuyên THỰC TẾ, CỤ THỂ, HÀNH ĐỘNG ĐƯỢC dựa trên toàn bộ lá số.
Mỗi lời khuyên: 1 câu khuyên + 1 câu giải thích tại sao (dẫn chứng sao).
Bao gồm: nghề nghiệp, tài chính, tình cảm, sức khỏe, hướng/màu phù hợp.`,
};

const SECTION_TITLES: Record<LuanGiaiSectionId, string> = {
  'tong-quan': 'Tổng Quan',
  'tinh-cach': 'Tính Cách',
  'su-nghiep': 'Sự Nghiệp',
  'tai-loc': 'Tài Lộc',
  'tinh-duyen': 'Tình Duyên',
  'suc-khoe': 'Sức Khỏe',
  'gia-dinh': 'Gia Đình',
  'cach-cuc': 'Cách Cục',
  'loi-khuyen': 'Lời Khuyên',
};

/**
 * Build prompt for initial AI analysis of a section
 */
export function buildLuanGiaiPrompt(
  section: LuanGiaiSectionId,
  chart: TuViChart,
): { system: string; user: string } {
  const data = buildSectionData(section, chart);
  const sectionPrompt = SECTION_PROMPTS[section];

  return {
    system: SYSTEM_PROMPT_LUAN_GIAI,
    user: `${data}\n${sectionPrompt}${SUGGESTION_INSTRUCTION}`,
  };
}

/**
 * Build prompt for follow-up questions within a section
 */
export function buildLuanGiaiQuestionPrompt(
  question: string,
  section: LuanGiaiSectionId,
  chart: TuViChart,
  conversationHistory: AIMessage[],
  tier: ModelTier = 'strong',
): { system: string; messages: AIMessage[] } {
  const data = buildSectionData(section, chart);
  const sectionTitle = SECTION_TITLES[section];

  const trimmedHistory = trimConversationHistory(conversationHistory, tier);

  const messages: AIMessage[] = [
    // Initial context as first user message
    { role: 'user', content: `${data}\n${SECTION_PROMPTS[section]}` },
    // Conversation history
    ...trimmedHistory,
    // New question
    { role: 'user', content: `Về ${sectionTitle}: ${question}${SUGGESTION_INSTRUCTION}` },
  ];

  return {
    system: SYSTEM_PROMPT_LUAN_GIAI,
    messages,
  };
}
