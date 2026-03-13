import type { ZodiacSign, Element } from '../core/astrology/types';

// Mô tả Moon Sign — thế giới cảm xúc bên trong
export const MOON_SIGN_DESCRIPTIONS: Record<ZodiacSign, string> = {
  aries: "Cảm xúc mãnh liệt và bùng nổ. Bạn phản ứng nhanh, nóng nảy nhưng cũng nguội nhanh. Cần hành động để giải tỏa cảm xúc. Không giỏi che giấu tâm trạng.",
  taurus: "Cảm xúc ổn định và sâu sắc. Bạn cần an toàn về vật chất và cảm xúc. Thích ở nhà, ăn ngon, sống thoải mái. Rất khó thay đổi một khi đã quyết định.",
  gemini: "Cảm xúc linh hoạt, hay thay đổi. Bạn xử lý cảm xúc bằng lý trí và giao tiếp. Cần nói chuyện để giải tỏa. Đôi khi tách rời cảm xúc khỏi suy nghĩ.",
  cancer: "Cảm xúc cực kỳ phong phú và sâu sắc. Bạn nhạy cảm, trực giác mạnh, gắn bó gia đình. Tâm trạng thay đổi theo pha Mặt Trăng. Cần được chăm sóc và yêu thương.",
  leo: "Cảm xúc nồng nhiệt và hào phóng. Bạn cần được công nhận và yêu thương. Tự hào về gia đình và người thân. Thể hiện tình cảm một cách rõ ràng, mạnh mẽ.",
  virgo: "Cảm xúc kín đáo và kiểm soát. Bạn phân tích cảm xúc thay vì sống với chúng. Thể hiện tình yêu qua hành động chăm sóc thực tế. Hay lo lắng và tự phê bình.",
  libra: "Cảm xúc cần sự hài hòa và cân bằng. Bạn khó chịu với xung đột, luôn tìm kiếm hòa bình. Cần mối quan hệ để cảm thấy hoàn thiện. Đôi khi hy sinh bản thân cho người khác.",
  scorpio: "Cảm xúc cực kỳ mãnh liệt và sâu thẳm. Bạn cảm nhận mọi thứ gấp mười lần người thường. Trung thành tuyệt đối nhưng không tha thứ sự phản bội. Trực giác gần như siêu nhiên.",
  sagittarius: "Cảm xúc lạc quan và phóng khoáng. Bạn cần tự do và không gian. Xử lý buồn bằng cách tìm ý nghĩa và triết lý. Hài hước ngay cả trong lúc khó khăn.",
  capricorn: "Cảm xúc kiểm soát và kỷ luật. Bạn ít bộc lộ cảm xúc ra ngoài, mang vẻ lạnh lùng nhưng bên trong rất sâu sắc. Trưởng thành về cảm xúc từ sớm. Lo lắng về trách nhiệm.",
  aquarius: "Cảm xúc độc lập và lý trí. Bạn giữ khoảng cách với cảm xúc mãnh liệt, xử lý bằng tư duy. Quan tâm đến cộng đồng hơn cá nhân. Cần tự do trong các mối quan hệ.",
  pisces: "Cảm xúc như đại dương — sâu, rộng, và không ranh giới. Bạn hấp thụ cảm xúc của mọi người xung quanh. Trực giác và tâm linh mạnh. Giàu trí tưởng tượng, đôi khi thoát ly thực tế.",
};

// Mô tả Rising Sign — ấn tượng đầu tiên & mặt nạ xã hội
export const RISING_SIGN_DESCRIPTIONS: Record<ZodiacSign, string> = {
  aries: "Ấn tượng đầu tiên: năng động, tự tin, quyết đoán. Bạn toát ra năng lượng mạnh mẽ, đi nhanh, nói thẳng. Người khác thấy bạn là người dũng cảm và có sức hút hành động.",
  taurus: "Ấn tượng đầu tiên: điềm tĩnh, đáng tin, thanh lịch. Bạn toát ra sự ổn định và thẩm mỹ. Dáng vẻ chắc chắn, giọng nói dễ chịu. Người khác cảm thấy an tâm bên bạn.",
  gemini: "Ấn tượng đầu tiên: thông minh, hoạt bát, duyên dáng. Bạn giao tiếp giỏi, hài hước, luôn có câu chuyện hay. Người khác thấy bạn trẻ trung và đa tài.",
  cancer: "Ấn tượng đầu tiên: ấm áp, chu đáo, nhẹ nhàng. Bạn tạo cảm giác như ở nhà cho người khác. Biểu cảm phong phú trên khuôn mặt. Người khác muốn mở lòng với bạn.",
  leo: "Ấn tượng đầu tiên: tự tin, charismatic, thu hút mọi ánh nhìn. Bạn bước vào phòng và mọi người chú ý. Phong thái sang trọng, hào phóng. Người khác ngưỡng mộ bạn.",
  virgo: "Ấn tượng đầu tiên: gọn gàng, khiêm tốn, thông minh. Bạn có vẻ ngoài chỉn chu, lịch sự, quan sát kỹ. Người khác thấy bạn đáng tin cậy và có hiểu biết.",
  libra: "Ấn tượng đầu tiên: duyên dáng, hòa nhã, đẹp. Bạn tạo ấn tượng hài hòa, dễ mến. Phong thái ngoại giao, luôn biết cách ứng xử. Người khác thấy bạn quyến rũ.",
  scorpio: "Ấn tượng đầu tiên: bí ẩn, mãnh liệt, thu hút. Bạn có ánh mắt xuyên thấu, ít nói nhưng đầy sức hút. Người khác cảm thấy bạn sâu sắc và không thể đoán được.",
  sagittarius: "Ấn tượng đầu tiên: vui vẻ, cởi mở, phiêu lưu. Bạn toát ra năng lượng lạc quan, nụ cười rộng, cử chỉ phóng khoáng. Người khác muốn đi theo bạn khám phá.",
  capricorn: "Ấn tượng đầu tiên: nghiêm túc, trưởng thành, đáng kính. Bạn có phong thái chuyên nghiệp, lịch lãm. Người khác thấy bạn có uy quyền và đáng tin cậy.",
  aquarius: "Ấn tượng đầu tiên: độc đáo, thú vị, khác biệt. Bạn có phong cách riêng, không giống ai. Người khác thấy bạn trí tuệ, tiến bộ và hơi bí ẩn.",
  pisces: "Ấn tượng đầu tiên: dịu dàng, mơ mộng, nhạy cảm. Bạn có đôi mắt sâu, vẻ ngoài thanh thoát. Người khác cảm thấy bạn dễ gần và đầy cảm thông.",
};

// Phân tích kết hợp nguyên tố Big 3
// Key: "sun_element-moon_element" hoặc "sun-moon-rising"
export const ELEMENT_COMBO_ANALYSIS: Record<string, string> = {
  // Sun + Moon cùng nguyên tố
  "fire-fire": "Đôi Hỏa: Bạn sống rất mãnh liệt — bên ngoài và bên trong đều tràn đầy năng lượng, đam mê. Có thể thiếu sự cân bằng cảm xúc.",
  "earth-earth": "Đôi Thổ: Bạn là người cực kỳ thực tế và ổn định. Đáng tin cậy từ trong ra ngoài. Đôi khi cần linh hoạt và mạo hiểm hơn.",
  "air-air": "Đôi Khí: Bạn sống trong thế giới ý tưởng và giao tiếp. Trí tuệ sắc bén, xã giao giỏi. Có thể tách rời khỏi cảm xúc sâu sắc.",
  "water-water": "Đôi Nước: Bạn là người cảm xúc sâu sắc phi thường. Trực giác cực mạnh, đồng cảm cao. Cần học cách tự bảo vệ khỏi năng lượng tiêu cực.",

  // Bổ trợ
  "fire-air": "Hỏa + Khí: Sự kết hợp mạnh mẽ — năng lượng hành động kết hợp trí tuệ. Bạn vừa quyết đoán vừa linh hoạt. Lạc quan và đầy sáng tạo.",
  "air-fire": "Khí + Hỏa: Trí tuệ được tiếp sức bởi đam mê. Bạn có ý tưởng hay và can đảm thực hiện. Giao tiếp cuốn hút, truyền cảm hứng.",
  "earth-water": "Thổ + Nước: Thực tế bên ngoài, cảm xúc sâu bên trong. Sự kết hợp hài hòa — bạn vừa đáng tin vừa thấu hiểu. Kiên nhẫn và trung thành.",
  "water-earth": "Nước + Thổ: Cảm xúc phong phú được neo giữ bởi sự thực tế. Bạn đồng cảm nhưng không mất lý trí. Chăm sóc người khác bằng hành động cụ thể.",

  // Đối lập
  "fire-water": "Hỏa + Nước: Sự tương phản thú vị — bên ngoài mạnh mẽ, quyết đoán nhưng bên trong nhạy cảm và sâu sắc. Đôi khi xung đột giữa muốn hành động và cảm xúc.",
  "water-fire": "Nước + Hỏa: Bạn cảm nhận sâu sắc nhưng được thúc đẩy bởi đam mê mãnh liệt. Trực giác kết hợp hành động tạo nên sức mạnh đặc biệt.",
  "earth-air": "Thổ + Khí: Thực tế bên ngoài nhưng suy nghĩ phóng khoáng bên trong. Bạn cân bằng giữa ổn định và đổi mới. Đôi khi giằng xé giữa logic và cảm nhận.",
  "air-earth": "Khí + Thổ: Trí tuệ linh hoạt được neo giữ bởi cảm xúc thực tế. Bạn có ý tưởng sáng tạo và biết cách hiện thực hóa chúng.",
  "fire-earth": "Hỏa + Thổ: Hành động mạnh mẽ bên ngoài, cảm xúc kiên định bên trong. Bạn tham vọng và kiên nhẫn — sự kết hợp dẫn đến thành công lâu dài.",
  "earth-fire": "Thổ + Hỏa: Ổn định bên ngoài nhưng bên trong đầy đam mê. Bạn trông điềm tĩnh nhưng có ngọn lửa mạnh mẽ thúc đẩy.",
  "air-water": "Khí + Nước: Trí tuệ bên ngoài, cảm xúc sâu bên trong. Bạn giao tiếp giỏi và thấu hiểu người khác. Đôi khi khó quyết định vì cả lý trí và cảm xúc đều mạnh.",
  "water-air": "Nước + Khí: Cảm xúc phong phú được diễn đạt qua ngôn từ. Bạn vừa đồng cảm vừa phân tích — hiểu người khác ở cả hai mức độ.",
};

/**
 * Tạo phân tích Big 3 dựa trên nguyên tố
 */
export function getBig3Analysis(
  sunElement: Element,
  moonElement: Element | null,
  risingElement: Element | null,
): string {
  if (!moonElement) return '';

  const key = `${sunElement}-${moonElement}`;
  const baseAnalysis = ELEMENT_COMBO_ANALYSIS[key] || '';

  if (!risingElement) return baseAnalysis;

  // Thêm mô tả Rising
  const risingNote = risingElement === sunElement
    ? `Rising cùng nguyên tố với Sun (${ELEMENT_NAMES[risingElement]}) — ấn tượng bên ngoài phản ánh đúng con người thật.`
    : risingElement === moonElement
      ? `Rising cùng nguyên tố với Moon (${ELEMENT_NAMES[risingElement]}) — ấn tượng bên ngoài phản ánh thế giới cảm xúc bên trong.`
      : `Rising ${ELEMENT_NAMES[risingElement]} tạo thêm lớp phức tạp — cách người khác nhìn bạn có thể khác với con người thật và cảm xúc bên trong.`;

  return baseAnalysis + ' ' + risingNote;
}

const ELEMENT_NAMES: Record<Element, string> = {
  fire: 'Hỏa',
  earth: 'Thổ',
  air: 'Khí',
  water: 'Nước',
};
