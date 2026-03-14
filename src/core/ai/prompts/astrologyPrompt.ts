import type { Big3Result } from '../../astrology/types';
import { SYSTEM_PROMPT_ASTROLOGY } from './systemPrompts';

const ELEMENT_VI: Record<string, string> = {
  fire: 'Hỏa', earth: 'Thổ', air: 'Khí', water: 'Nước',
};

const PLANET_VI: Record<string, string> = {
  mars: 'Sao Hỏa', venus: 'Sao Kim', mercury: 'Sao Thủy',
  moon: 'Mặt Trăng', sun: 'Mặt Trời', jupiter: 'Sao Mộc',
  saturn: 'Sao Thổ', uranus: 'Thiên Vương', neptune: 'Hải Vương', pluto: 'Diêm Vương',
};

export function buildAstrologyDescription(big3: Big3Result): string {
  const { sun } = big3;
  let desc = `CUNG HOÀNG ĐẠO (Western Astrology):

Sun Sign: ${sun.sign.symbol} ${sun.sign.name} (${sun.sign.nameEn})
  Nguyên tố: ${ELEMENT_VI[sun.sign.element] || sun.sign.element} | Phẩm chất: ${sun.sign.modality}
  Hành tinh: ${PLANET_VI[sun.sign.rulingPlanet] || sun.sign.rulingPlanet}
  Decan: ${sun.decan} (cai quản bởi ${PLANET_VI[sun.decanRuler] || sun.decanRuler})
  Vị trí: ${sun.degree.toFixed(1)}° trong ${sun.sign.nameEn}
  ${sun.cuspDate ? '⚠️ Sinh ngày giáp ranh (cusp) — mang đặc điểm cả 2 cung' : ''}`;

  if (big3.moon) {
    desc += `\n\nMoon Sign: ${big3.moon.sign.symbol} ${big3.moon.sign.name} (${big3.moon.sign.nameEn})
  Nguyên tố: ${ELEMENT_VI[big3.moon.sign.element] || big3.moon.sign.element}
  Vị trí: ${big3.moon.degree.toFixed(1)}°
  → Thế giới cảm xúc, phản ứng bản năng, nhu cầu an toàn`;
  }

  if (big3.rising) {
    desc += `\n\nRising Sign (Ascendant): ${big3.rising.sign.symbol} ${big3.rising.sign.name} (${big3.rising.sign.nameEn})
  Nguyên tố: ${ELEMENT_VI[big3.rising.sign.element] || big3.rising.sign.element}
  Vị trí: ${big3.rising.degree.toFixed(1)}°
  → Ấn tượng đầu tiên, vẻ ngoài, cách tiếp cận cuộc sống`;
  }

  if (big3.moon && big3.rising) {
    const elements = [sun.sign.element, big3.moon.sign.element, big3.rising.sign.element];
    desc += `\n\nBig 3 Element Balance:
  ${ELEMENT_VI[sun.sign.element]} (Sun) + ${ELEMENT_VI[big3.moon.sign.element]} (Moon) + ${ELEMENT_VI[big3.rising.sign.element]} (Rising)`;

    const counts: Record<string, number> = {};
    elements.forEach((e) => (counts[e] = (counts[e] || 0) + 1));
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (dominant[1] >= 2) {
      desc += `\n  → Dominant: ${ELEMENT_VI[dominant[0]] || dominant[0]} (${dominant[1]}/3)`;
    }
  }

  return desc;
}

export function buildAstrologyAIPrompt(big3: Big3Result): { system: string; user: string } {
  const astroDesc = buildAstrologyDescription(big3);
  const { sun } = big3;
  const hasBig3 = big3.moon && big3.rising;

  return {
    system: SYSTEM_PROMPT_ASTROLOGY,
    user: `${astroDesc}

HÃY PHÂN TÍCH CHI TIẾT:

## ${sun.sign.symbol} Sun in ${sun.sign.nameEn} — Decan ${sun.decan}
Phân tích CỤ THỂ cho Decan ${sun.decan} (không chỉ nói chung về cung).
Decan ${sun.decan} cai quản bởi ${PLANET_VI[sun.decanRuler] || sun.decanRuler} → ảnh hưởng thế nào?
${sun.cuspDate ? 'Sinh ngày cusp → mang đặc điểm gì từ cung bên cạnh?' : ''}
(4-6 câu)

${hasBig3 ? `## 🌙 Moon in ${big3.moon!.sign.nameEn} — Cảm Xúc Bên Trong
Moon ${big3.moon!.sign.nameEn} có HÒA HỢP hay MÂU THUẪN với Sun ${sun.sign.nameEn}?
${ELEMENT_VI[big3.moon!.sign.element]} Moon + ${ELEMENT_VI[sun.sign.element]} Sun = kết hợp thế nào?
Bạn CẢM THẤY thế nào so với bạn HÀNH ĐỘNG thế nào?
(4-5 câu)

## ⬆️ Rising in ${big3.rising!.sign.nameEn} — Ấn Tượng Đầu Tiên
Người khác thấy bạn là ${big3.rising!.sign.nameEn} trước — khác gì với Sun ${sun.sign.nameEn}?
Rising ${ELEMENT_VI[big3.rising!.sign.element]} + Sun ${ELEMENT_VI[sun.sign.element]} + Moon ${ELEMENT_VI[big3.moon!.sign.element]} = Big 3 balance?
(3-4 câu)

## 🎭 Phân Tích Big 3 Kết Hợp (⭐ /5)
Tổng hợp Sun + Moon + Rising thành 1 BỨC TRANH HOÀN CHỈNH.
Mâu thuẫn nội tâm (nếu có)? Điểm mạnh khi kết hợp?
(5-6 câu, đây là phần QUAN TRỌNG NHẤT)` : `
## 👤 Tính Cách Chi Tiết (⭐ /5)
Phân tích sâu hơn template: nêu cụ thể ưu điểm và nhược điểm trong bối cảnh Decan ${sun.decan}.
(4-5 câu)`}

## 💼 Sự Nghiệp (⭐ /5)
${hasBig3 ? `Sun ${sun.sign.nameEn} (mục tiêu) + Moon ${big3.moon!.sign.nameEn} (cần gì) + Rising ${big3.rising!.sign.nameEn} (phong cách làm việc) → nghề phù hợp?` : `${sun.sign.nameEn} Decan ${sun.decan} → nghề phù hợp cụ thể?`}
(4-5 câu, nêu 5-7 nghề)

## 💑 Tình Yêu (⭐ /5)
${hasBig3 ? `Sun yêu kiểu gì? Moon CẦN gì trong tình yêu? Rising THU HÚT kiểu người nào?
3 tầng này có thể khiến bạn HẤP DẪN 1 kiểu người nhưng CẦN 1 kiểu khác.` : `${sun.sign.nameEn} yêu thế nào?`}
Cung tương hợp nhất & thử thách nhất — giải thích TẠI SAO (element + modality).
(4-5 câu)

## 🏥 Sức Khỏe (⭐ /5)
Bộ phận cần lưu ý theo cung. Lời khuyên cụ thể.
(2-3 câu)

## 💡 Lời Khuyên
5 lời khuyên thực tế.`,
  };
}
