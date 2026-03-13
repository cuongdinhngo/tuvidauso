import type { TuViChart, Palace } from '../core/types';
import { DIA_CHI_HOURS } from '../core/types';
import { computeTransformLayer } from '../core/tuvi/periodTransforms';
import { analyzeYear } from '../core/tuvi/layeredAnalysis';
import { getTamHopPositions, getDoiCung } from '../core/tuvi/palaceRelations';
import { getElement, getYinYang } from '../core/battu/fiveElements';

// ============================================
// SYSTEM PROMPT — Vai trò của AI
// ============================================

const SYSTEM_PROMPT_LUAN_GIAI = `Bạn là một chuyên gia Tử Vi Đẩu Số với hơn 30 năm kinh nghiệm luận giải lá số. Bạn được đào tạo theo trường phái Bắc phái (phổ thông), kết hợp kiến thức Bát Tự Tứ Trụ.

NGUYÊN TẮC LUẬN GIẢI:
1. Luôn xét sao TỌA THỦ (trong cung) + sao TAM HỢP CHIẾU + sao ĐỐI CUNG CHIẾU + sao GIÁP CUNG. Không bao giờ chỉ xét sao trong cung.
2. Xét MỨC SÁNG (Miếu/Vượng/Đắc/Bình/Hãm) của mỗi sao — cùng 1 sao nhưng Miếu và Hãm cho kết quả hoàn toàn khác.
3. Xét TỨ HÓA — Hóa Lộc/Quyền/Khoa/Kỵ ảnh hưởng rất lớn đến ý nghĩa sao.
4. Xét TUẦN KHÔNG và TRIỆT LỘ — sao bị Tuần/Triệt giảm lực đáng kể.
5. Phân tích phải CỤ THỂ cho lá số này, KHÔNG nói chung chung. Ví dụ: "Tử Vi Bình tại Quan Lộc được Thất Sát Miếu từ Tài Bạch chiếu → sự nghiệp có tính cạnh tranh cao", KHÔNG phải "sự nghiệp tốt".
6. Khi luận giải vận hạn, phải XẾP CHỒNG 3 lớp: Tứ Hóa bản mệnh + Tứ Hóa đại hạn + Tứ Hóa lưu niên.
7. Đặc biệt chú ý Song Kỵ (2 Hóa Kỵ cùng cung) → rất bất lợi, và Song Lộc (2 Hóa Lộc cùng cung) → rất tốt.

PHONG CÁCH:
- Viết tiếng Việt tự nhiên, dễ hiểu, thân thiện
- KHÔNG dùng quá nhiều thuật ngữ — khi dùng thì giải thích ngắn gọn trong ngoặc
- Đưa ra lời khuyên THỰC TẾ, có thể hành động được (actionable)
- Mỗi phân tích cung: 4-6 câu, đi vào trọng tâm
- Đánh giá mức độ tốt/xấu bằng thang 5 sao (⭐) cho mỗi lĩnh vực
- LUÔN kết thúc bằng lời khuyên tích cực — Tử Vi chỉ là tham khảo, con người mới quyết định cuộc đời

KHÔNG BAO GIỜ:
- Đưa ra dự đoán tuyệt đối ("chắc chắn sẽ...", "không thể...")
- Nói tiêu cực quá mức gây hoang mang
- Khuyên mê tín (đốt vàng mã, cúng giải hạn, v.v.)
- Nói chung chung giống nhau cho mọi lá số`;

// ============================================
// HELPER: Serialize chart data to text
// ============================================

function buildChartDescription(chart: TuViChart): string {
  const { birthInfo, lunarDate, fourPillars, palaces, tuanTriet } = chart;
  const hourName = DIA_CHI_HOURS[birthInfo.hour]?.name || '';
  const transforms = computeTransformLayer(lunarDate.yearCan, palaces);

  let desc = `THÔNG TIN CHỦ NHÂN:
- Giới tính: ${birthInfo.gender === 'male' ? 'Nam' : 'Nữ'}
- Ngày sinh Dương lịch: ${birthInfo.solarDate.day}/${birthInfo.solarDate.month}/${birthInfo.solarDate.year}
- Ngày sinh Âm lịch: ${lunarDate.day}/${lunarDate.month}/${lunarDate.yearCan} ${lunarDate.yearChi}${lunarDate.isLeapMonth ? ' (tháng nhuận)' : ''}
- Giờ sinh: ${hourName}
- Nạp âm: ${lunarDate.napAm}
- Con giáp: ${lunarDate.yearChi}

BÁT TỰ (TỨ TRỤ):
- Năm: ${fourPillars.year.can} ${fourPillars.year.chi}
- Tháng: ${fourPillars.month.can} ${fourPillars.month.chi}
- Ngày: ${fourPillars.day.can} ${fourPillars.day.chi} (Nhật Chủ: ${fourPillars.day.can})
- Giờ: ${fourPillars.hour.can} ${fourPillars.hour.chi}
- Nhật Chủ ${fourPillars.day.can} thuộc ${getElement(fourPillars.day.can)} - ${getYinYang(fourPillars.day.can)}

TỬ VI ĐẨU SỐ:
- Cung Mệnh: ${chart.menh} (${chart.menhPalaceName})
- Cung Thân: ${chart.than} (${chart.thanPalaceName})
- ${chart.menh === chart.than ? 'Mệnh Thân ĐỒNG CUNG' : 'Mệnh Thân khác cung'}
- Cục: ${chart.cuc.name}
- Tuần Không: ${tuanTriet.tuan[0]}-${tuanTriet.tuan[1]}
- Triệt Lộ: ${tuanTriet.triet[0]}-${tuanTriet.triet[1]}

`;

  // --- 12 cung chi tiết ---
  desc += '12 CUNG VÀ SAO:\n';

  for (const palace of palaces) {
    const isTuan = tuanTriet.tuan.includes(palace.position);
    const isTriet = tuanTriet.triet.includes(palace.position);
    const tuanTrietLabel = isTuan ? ' [TUẦN KHÔNG]' : isTriet ? ' [TRIỆT LỘ]' : '';
    const isMenh = palace.position === chart.menh;
    const isThan = palace.position === chart.than;
    const menhLabel = isMenh ? ' ★MỆNH' : isThan ? ' ★THÂN' : '';

    desc += `\n${palace.name} (${palace.position})${menhLabel}${tuanTrietLabel}`;
    if (palace.majorPeriod) {
      desc += ` — Đại hạn ${palace.majorPeriod.startAge}-${palace.majorPeriod.endAge}`;
    }
    desc += ':\n';

    // Chính tinh
    const mainStars = palace.stars.filter(s => s.type === 'chinh');
    if (mainStars.length === 0) {
      desc += '  (Vô chính diệu — mượn sao đối cung)\n';
    }
    for (const star of mainStars) {
      let starDesc = `  ◆ ${star.name}`;
      if (star.brightness) starDesc += ` [${star.brightness}]`;
      if (star.transform) starDesc += ` {${star.transform}}`;
      desc += starDesc + '\n';
    }

    // Phụ tinh quan trọng
    const auxStars = palace.stars.filter(s => s.type !== 'chinh');
    if (auxStars.length > 0) {
      const auxNames = auxStars.map(s => {
        let n = s.name;
        if (s.transform) n += `{${s.transform}}`;
        return n;
      }).join(', ');
      desc += `  ◇ Phụ tinh: ${auxNames}\n`;
    }
  }

  // --- Tứ Hóa ---
  desc += `\nTỨ HÓA BẢN MỆNH (Can ${lunarDate.yearCan}):
- Hóa Lộc: ${transforms.loc.star} → ${transforms.loc.palace} (${transforms.loc.position})
- Hóa Quyền: ${transforms.quyen.star} → ${transforms.quyen.palace} (${transforms.quyen.position})
- Hóa Khoa: ${transforms.khoa.star} → ${transforms.khoa.palace} (${transforms.khoa.position})
- Hóa Kỵ: ${transforms.ky.star} → ${transforms.ky.palace} (${transforms.ky.position})
`;

  // --- Tam Hợp các cung quan trọng ---
  desc += '\nTAM HỢP CÁC CUNG QUAN TRỌNG:\n';
  const importantPalaces = ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Phu Thê'];
  for (const palaceName of importantPalaces) {
    const palace = palaces.find(p => p.name === palaceName);
    if (!palace) continue;
    const tamHop = getTamHopPositions(palace.position);
    const doiCung = getDoiCung(palace.position);
    desc += `${palaceName} (${palace.position}): Tam hợp ${tamHop[0]}+${tamHop[1]}, Đối cung ${doiCung}\n`;
  }

  return desc;
}

// ============================================
// PROMPT BUILDERS
// ============================================

export function buildOverviewPrompt(chart: TuViChart): { system: string; user: string } {
  const chartDesc = buildChartDescription(chart);

  return {
    system: SYSTEM_PROMPT_LUAN_GIAI,
    user: `${chartDesc}

HÃY PHÂN TÍCH TỔNG QUAN LÁ SỐ NÀY theo format sau:

## Tổng Quan
Tóm tắt 3-4 câu về đặc điểm nổi bật nhất của lá số. Nêu cách cục đặc biệt nếu có.

## Tính Cách & Con Người (⭐ rating /5)
Phân tích cung Mệnh + chính tinh tọa thủ + tam hợp chiếu + đối cung chiếu. Nêu rõ tính cách chính, ưu điểm, nhược điểm. 4-6 câu.

## Sự Nghiệp (⭐ rating /5)
Phân tích cung Quan Lộc + tam hợp chiếu. Nghề nghiệp phù hợp (cụ thể 3-5 ngành). Giai đoạn phát triển. 4-6 câu.

## Tài Lộc (⭐ rating /5)
Phân tích cung Tài Bạch + Điền Trạch. Kiểu kiếm tiền, kênh đầu tư phù hợp. 4-6 câu.

## Tình Duyên (⭐ rating /5)
Phân tích cung Phu Thê. Kiểu người phù hợp, thời điểm thuận lợi, lưu ý. 4-6 câu.

## Sức Khỏe (⭐ rating /5)
Phân tích cung Tật Ách + Ngũ Hành Bát Tự. Bộ phận cần lưu ý cụ thể. 3-4 câu.

## Cách Cục Đặc Biệt
Liệt kê và giải thích các cách cục phát hiện được (nếu có).

## Lời Khuyên
3-5 lời khuyên THỰC TẾ, cụ thể dựa trên lá số. Bao gồm:
- Hướng phát triển sự nghiệp
- Chiến lược tài chính
- Hướng/màu sắc/con số hợp (dựa trên Dụng Thần Bát Tự)
- Lưu ý quan trọng nhất

Nhớ: Mỗi phân tích phải CỤ THỂ cho lá số này. Nêu tên sao, vị trí, mức sáng. Không nói chung chung.`,
  };
}

export function buildYearlyPrompt(
  chart: TuViChart,
  year: number
): { system: string; user: string } {
  const chartDesc = buildChartDescription(chart);
  const fortune = analyzeYear(year, chart);

  // Find current đại hạn palace
  let daiHanInfo = '';
  for (const p of chart.palaces) {
    if (p.majorPeriod && fortune.age >= p.majorPeriod.startAge && fortune.age <= p.majorPeriod.endAge) {
      daiHanInfo = `ĐẠI HẠN HIỆN TẠI:
- Cung: ${p.name} (${p.position})
- Can Chi: ${p.majorPeriod.can} ${p.majorPeriod.chi}
- Tuổi: ${p.majorPeriod.startAge}-${p.majorPeriod.endAge}`;
      break;
    }
  }

  // Format 3-layer transforms
  const formatTransforms = (label: string, t: typeof fortune.natal) =>
    `${label} (Can ${t.can}):
  + Lộc: ${t.loc.star} → ${t.loc.palace}
  + Quyền: ${t.quyen.star} → ${t.quyen.palace}
  + Khoa: ${t.khoa.star} → ${t.khoa.palace}
  + Kỵ: ${t.ky.star} → ${t.ky.palace}`;

  let layeredInfo = formatTransforms('Bản mệnh', fortune.natal);
  if (fortune.daiHan) {
    layeredInfo += '\n' + formatTransforms('Đại hạn', fortune.daiHan);
  }
  layeredInfo += '\n' + formatTransforms('Lưu niên', fortune.luuNien);

  // Song Kỵ / Song Lộc
  let patternInfo = '';
  if (fortune.analysis.doubleKy.length > 0) {
    patternInfo += '⚠️ SONG KỴ: ' + fortune.analysis.doubleKy.map(dk =>
      `cung ${dk.palace} (${dk.sources.join(' + ')})`
    ).join('; ') + '\n';
  }
  if (fortune.analysis.tripleKy) {
    patternInfo += '⚠️ TAM KỴ HỘI: cung ' + fortune.analysis.tripleKy.palace +
      ` (${fortune.analysis.tripleKy.sources.join(' + ')})\n`;
  }
  if (fortune.analysis.songLoc) {
    patternInfo += '✅ SONG LỘC: cung ' + fortune.analysis.songLoc.palace + '\n';
  }
  if (fortune.analysis.locQuyenKhoaHoi) {
    patternInfo += '✅ LỘC QUYỀN KHOA HỘI: cung ' + fortune.analysis.locQuyenKhoaHoi.palace + '\n';
  }
  if (!patternInfo) patternInfo = 'Không có Song Kỵ hoặc Song Lộc.';

  return {
    system: SYSTEM_PROMPT_LUAN_GIAI,
    user: `${chartDesc}

THÔNG TIN VẬN HẠN NĂM ${year}:

Năm ${year} — ${fortune.yearCan} ${fortune.yearChi}
Tuổi: ${fortune.age} (âm lịch)

${daiHanInfo}

TỨ HÓA 3 LỚP:
${layeredInfo}

XẾP CHỒNG:
${patternInfo}

HÃY PHÂN TÍCH CHI TIẾT NĂM ${year} theo format:

## Tổng Quan Năm ${year}
Đánh giá chung: năm này thuận lợi hay khó khăn? Chủ đề chính của năm là gì? 3-4 câu.

## Sự Nghiệp Năm ${year} (⭐ /5)
Xét Tứ Hóa lưu niên ảnh hưởng cung Quan Lộc thế nào. Có Song Kỵ/Song Lộc tại Quan Lộc không? Lời khuyên cụ thể. 4-5 câu.

## Tài Lộc Năm ${year} (⭐ /5)
Xét cung Tài Bạch + Điền Trạch có nhận Hóa Lộc/Kỵ lưu niên không? Nên đầu tư hay giữ tiền? 4-5 câu.

## Tình Cảm Năm ${year} (⭐ /5)
Hóa Lộc/Đào Hoa/Hồng Loan lưu niên ở đâu? Có lợi cho tình cảm không? 3-4 câu.

## Sức Khỏe Năm ${year} (⭐ /5)
Cung Tật Ách có bị Hóa Kỵ chiếu không? Lưu ý cụ thể. 2-3 câu.

## Phân Tích Theo Quý
- Q1 (tháng 1-3): Xu hướng + lời khuyên
- Q2 (tháng 4-6): Xu hướng + lời khuyên
- Q3 (tháng 7-9): Xu hướng + lời khuyên
- Q4 (tháng 10-12): Xu hướng + lời khuyên

## Tháng Cần Lưu Ý
Liệt kê 2-3 tháng đặc biệt tốt hoặc cần cẩn thận, với lý do cụ thể.

## Lời Khuyên Năm ${year}
3-5 lời khuyên thực tế, cụ thể cho năm này.

Nhớ: XẾP CHỒNG 3 lớp Tứ Hóa khi phân tích. Nếu có Song Kỵ → nhấn mạnh cung đó cần đặc biệt lưu ý.`,
  };
}

export function buildQuestionPrompt(
  chart: TuViChart,
  question: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): { system: string; messages: Array<{ role: 'user' | 'assistant'; content: string }> } {
  const chartDesc = buildChartDescription(chart);

  const systemWithChart = `${SYSTEM_PROMPT_LUAN_GIAI}

DỮ LIỆU LÁ SỐ CỦA NGƯỜI ĐANG HỎI:
${chartDesc}

Dựa trên lá số trên, hãy trả lời câu hỏi của người dùng. Luôn dẫn chứng cụ thể từ lá số (tên sao, vị trí, mức sáng, Tứ Hóa) khi trả lời. Trả lời ngắn gọn 3-6 câu trừ khi câu hỏi yêu cầu phân tích dài.`;

  // Keep last 5 exchanges to stay within token limits
  const recentHistory = conversationHistory.slice(-10);

  const messages = [
    ...recentHistory,
    { role: 'user' as const, content: question },
  ];

  return { system: systemWithChart, messages };
}

export function buildPalacePrompt(
  chart: TuViChart,
  palaceName: string
): { system: string; user: string } {
  const chartDesc = buildChartDescription(chart);

  const palace = chart.palaces.find((p: Palace) => p.name === palaceName);
  if (!palace) {
    return { system: SYSTEM_PROMPT_LUAN_GIAI, user: `Không tìm thấy cung ${palaceName} trong lá số.` };
  }

  const tamHop = getTamHopPositions(palace.position);
  const doiCung = getDoiCung(palace.position);
  const mainStarsDesc = palace.stars
    .filter(s => s.type === 'chinh')
    .map(s => `${s.name} [${s.brightness || 'Bình'}]`)
    .join(', ') || 'Vô chính diệu';

  return {
    system: SYSTEM_PROMPT_LUAN_GIAI,
    user: `${chartDesc}

HÃY PHÂN TÍCH CHI TIẾT CUNG ${palaceName.toUpperCase()} (${palace.position}):

Cung này quản lĩnh vực gì trong cuộc sống?

1. Phân tích từng chính tinh TỌA THỦ trong cung (3-4 câu mỗi sao, nêu rõ ảnh hưởng của mức sáng: ${mainStarsDesc})

2. Phân tích phụ tinh trong cung (2-3 câu chung)

3. Tam hợp chiếu từ ${tamHop[0]} và ${tamHop[1]}: sao gì chiếu vào, ảnh hưởng thế nào? (2-3 câu)

4. Đối cung chiếu từ ${doiCung}: sao gì chiếu vào? (1-2 câu)

5. Tứ Hóa ảnh hưởng: cung này có nhận Hóa Lộc/Quyền/Khoa/Kỵ nào không? (2-3 câu)

6. Tuần/Triệt: cung này có bị Tuần Không hoặc Triệt Lộ không? Ảnh hưởng? (1-2 câu nếu có)

7. Đánh giá tổng hợp: ⭐ rating /5 + tóm tắt 2-3 câu

8. Lời khuyên cụ thể cho lĩnh vực mà cung này quản (2-3 câu)`,
  };
}
