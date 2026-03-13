// ============================================
// LIFE PATH MEANINGS (1-9, 11, 22, 33)
// ============================================

export const LIFE_PATH_MEANINGS: Record<number, {
  title: string;
  keywords: string[];
  personality: string;
  career: string;
  love: string;
  challenge: string;
  celebrities: string[];
}> = {
  1: {
    title: 'Người Tiên Phong',
    keywords: ['Lãnh đạo', 'Độc lập', 'Sáng tạo', 'Tham vọng', 'Quyết đoán'],
    personality: 'Bạn là người tiên phong, thích dẫn đầu và không ngại đi con đường riêng. Tính cách độc lập, tự tin, có năng lực lãnh đạo bẩm sinh. Bạn ghét bị kiểm soát và luôn muốn làm chủ cuộc đời mình. Tuy nhiên, đôi khi bạn quá cứng đầu và khó lắng nghe ý kiến người khác.',
    career: 'Phù hợp: Khởi nghiệp, CEO, quản lý, phát minh, nghệ sĩ độc lập, freelancer, lĩnh vực tiên phong. Bạn làm tốt nhất khi được tự quyết định, không bị ràng buộc bởi quy trình cứng nhắc.',
    love: 'Trong tình yêu, bạn cần đối phương tôn trọng sự độc lập của mình. Bạn không hợp với người quá kiểm soát. Đối phương lý tưởng là người vừa mạnh mẽ vừa biết cho bạn không gian.',
    challenge: 'Thử thách lớn nhất là học cách hợp tác, lắng nghe và chia sẻ quyền lực. Tránh xu hướng ích kỷ hoặc áp đặt.',
    celebrities: ['Steve Jobs', 'Martin Luther King Jr.', 'Lady Gaga'],
  },
  2: {
    title: 'Người Hòa Giải',
    keywords: ['Hòa bình', 'Nhạy cảm', 'Hợp tác', 'Ngoại giao', 'Kiên nhẫn'],
    personality: 'Bạn là người nhạy cảm, giỏi thấu hiểu cảm xúc người khác. Có khả năng hòa giải, kết nối mọi người. Bạn không thích xung đột và luôn tìm cách tạo sự hài hòa. Tuy nhiên, bạn dễ bị tổn thương và đôi khi thiếu quyết đoán.',
    career: 'Phù hợp: Tư vấn, ngoại giao, HR, tâm lý, nghệ thuật, âm nhạc, dịch vụ xã hội, làm việc nhóm. Bạn tỏa sáng khi hỗ trợ người khác.',
    love: 'Bạn là đối tác tuyệt vời — chu đáo, lãng mạn, biết lắng nghe. Nhưng cần tránh hy sinh bản thân quá mức. Hợp với người nhẹ nhàng, trân trọng cảm xúc.',
    challenge: 'Học cách nói "không", đặt giới hạn, và không phụ thuộc quá nhiều vào sự công nhận của người khác.',
    celebrities: ['Barack Obama', 'Jennifer Aniston', 'Shakira'],
  },
  3: {
    title: 'Người Sáng Tạo',
    keywords: ['Sáng tạo', 'Giao tiếp', 'Lạc quan', 'Nghệ thuật', 'Biểu đạt'],
    personality: 'Bạn là linh hồn của buổi tiệc — vui vẻ, hài hước, đầy sáng tạo. Có khả năng giao tiếp và biểu đạt xuất sắc. Bạn nhìn cuộc đời qua lăng kính đầy màu sắc. Tuy nhiên, dễ phân tán, bỏ dở giữa chừng nếu mất hứng thú.',
    career: 'Phù hợp: Nghệ thuật, viết lách, MC, diễn xuất, marketing, thiết kế, giảng dạy, truyền thông. Bất cứ gì cho phép bạn biểu đạt bản thân.',
    love: 'Bạn lãng mạn, vui nhộn, và là người yêu thú vị. Cần đối phương hiểu và chấp nhận bản chất tự do của bạn. Cẩn thận với xu hướng hời hợt trong tình cảm.',
    challenge: 'Tập trung, kỷ luật, hoàn thành những gì đã bắt đầu. Tránh nói nhiều làm ít.',
    celebrities: ['Snoop Dogg', 'John Travolta', 'Christina Aguilera'],
  },
  4: {
    title: 'Người Xây Dựng',
    keywords: ['Ổn định', 'Kỷ luật', 'Chăm chỉ', 'Thực tế', 'Đáng tin'],
    personality: 'Bạn là nền tảng vững chắc — đáng tin cậy, có kế hoạch, chăm chỉ và kiên nhẫn. Bạn xây dựng mọi thứ từ từ nhưng bền vững. Tuy nhiên, đôi khi quá cứng nhắc, bảo thủ, và khó thích nghi với thay đổi.',
    career: 'Phù hợp: Kỹ sư, kiến trúc, kế toán, quản lý dự án, bất động sản, ngân hàng, công chức. Bạn giỏi xây dựng hệ thống và quy trình.',
    love: 'Bạn là đối tác trung thành, ổn định. Biểu đạt tình yêu qua hành động hơn lời nói. Cần đối phương kiên nhẫn và trân trọng sự chung thủy.',
    challenge: 'Linh hoạt hơn, chấp nhận thay đổi, và đừng quên enjoy cuộc sống giữa những deadline.',
    celebrities: ['Oprah Winfrey', 'Elton John', 'Bill Gates'],
  },
  5: {
    title: 'Người Tự Do',
    keywords: ['Tự do', 'Phiêu lưu', 'Thay đổi', 'Linh hoạt', 'Năng động'],
    personality: 'Bạn là cơn gió — tự do, năng động, luôn khao khát trải nghiệm mới. Bạn thích du lịch, khám phá, và ghét sự đơn điệu. Có sức hút tự nhiên và thích nghi nhanh. Tuy nhiên, dễ bồn chồn, thiếu kiên nhẫn, và sợ cam kết.',
    career: 'Phù hợp: Du lịch, truyền thông, sales, marketing, startup, nghệ sĩ biểu diễn, phóng viên, công việc đa dạng. Tránh công việc lặp lại đơn điệu.',
    love: 'Bạn cần đối phương không giam cầm mình. Tình yêu với bạn phải luôn mới mẻ, thú vị. Hợp với người có tinh thần phiêu lưu tương tự.',
    challenge: 'Cam kết, kỷ luật, và hoàn thành mục tiêu dài hạn thay vì nhảy từ thứ này sang thứ khác.',
    celebrities: ['Angelina Jolie', 'Steven Spielberg', 'Mick Jagger'],
  },
  6: {
    title: 'Người Chăm Sóc',
    keywords: ['Trách nhiệm', 'Gia đình', 'Yêu thương', 'Phục vụ', 'Hài hòa'],
    personality: 'Bạn là trái tim của gia đình — yêu thương, chăm sóc, có trách nhiệm cao. Bạn luôn đặt người thân lên đầu và sẵn sàng hy sinh. Có khiếu thẩm mỹ và thích tạo không gian đẹp. Tuy nhiên, dễ lo lắng quá mức và can thiệp vào chuyện người khác.',
    career: 'Phù hợp: Y tế, giáo dục, tư vấn gia đình, thiết kế nội thất, ẩm thực, dịch vụ chăm sóc, nhân sự. Bạn giỏi khi phục vụ và giúp đỡ.',
    love: 'Bạn là đối tác chung thủy, chu đáo nhất. Tình yêu và gia đình là ưu tiên số 1. Cần đối phương biết trân trọng sự hy sinh của bạn.',
    challenge: 'Đừng quên chăm sóc bản thân. Tránh kiểm soát quá mức dưới danh nghĩa "lo lắng". Học cách buông bỏ.',
    celebrities: ['John Lennon', 'Michael Jackson', 'Albert Einstein'],
  },
  7: {
    title: 'Người Tìm Kiếm',
    keywords: ['Trí tuệ', 'Tâm linh', 'Phân tích', 'Nội tâm', 'Bí ẩn'],
    personality: 'Bạn là nhà tư tưởng — sâu sắc, thích tìm hiểu bản chất sự việc, hướng nội và có chiều sâu tâm linh. Bạn cần thời gian một mình để suy ngẫm. Có trực giác mạnh. Tuy nhiên, dễ xa cách, khó mở lòng, và đôi khi hoài nghi quá mức.',
    career: 'Phù hợp: Nghiên cứu, khoa học, triết học, IT, phân tích dữ liệu, tâm linh, viết lách chuyên sâu. Bạn giỏi khi được làm việc sâu, không bị gián đoạn.',
    love: 'Bạn cần đối phương tôn trọng không gian riêng. Tình yêu của bạn sâu sắc nhưng biểu đạt kín đáo. Hợp với người trí tuệ, hiểu biết.',
    challenge: 'Mở lòng hơn, tin tưởng người khác, và đừng sống quá trong thế giới riêng.',
    celebrities: ['Elon Musk', 'Princess Diana', 'Leonardo DiCaprio'],
  },
  8: {
    title: 'Người Quyền Lực',
    keywords: ['Thành công', 'Quyền lực', 'Tài chính', 'Tham vọng', 'Quản lý'],
    personality: 'Bạn là nhà lãnh đạo tài chính — có tầm nhìn lớn, tham vọng cao, giỏi quản lý và tạo ra của cải. Bạn hiểu luật chơi của tiền bạc và quyền lực. Tuy nhiên, dễ workaholic, coi trọng vật chất quá mức, và đôi khi lạnh lùng.',
    career: 'Phù hợp: CEO, tài chính, đầu tư, bất động sản, luật, quản lý cấp cao, chính trị. Bạn sinh ra để xây dựng đế chế.',
    love: 'Bạn cần đối phương hiểu tham vọng của mình. Biểu đạt tình yêu qua sự chu cấp và bảo vệ. Cẩn thận đừng để công việc phá hủy tình cảm.',
    challenge: 'Cân bằng vật chất và tinh thần. Học cách buông bỏ kiểm soát và trân trọng những giá trị phi vật chất.',
    celebrities: ['Nelson Mandela', 'Pablo Picasso', 'Sandra Bullock'],
  },
  9: {
    title: 'Người Nhân Đạo',
    keywords: ['Nhân đạo', 'Bác ái', 'Trí tuệ', 'Lý tưởng', 'Bao dung'],
    personality: 'Bạn là linh hồn già — giàu lòng trắc ẩn, có tầm nhìn rộng, muốn đóng góp cho nhân loại. Bạn hiểu sâu sắc về cuộc sống và có khả năng truyền cảm hứng. Tuy nhiên, dễ mơ mộng, hay thất vọng khi thực tế không đẹp như lý tưởng.',
    career: 'Phù hợp: Từ thiện, nghệ thuật, y tế, giáo dục, viết lách, tư vấn, ngoại giao, công tác xã hội. Bạn cần cảm giác cuộc sống có ý nghĩa.',
    love: 'Bạn yêu sâu sắc nhưng hướng đến tình yêu lớn hơn cá nhân. Cần đối phương chia sẻ lý tưởng. Cẩn thận đừng hy sinh quá nhiều.',
    challenge: 'Thực tế hơn, chấp nhận sự không hoàn hảo của con người và thế giới.',
    celebrities: ['Mahatma Gandhi', 'Mother Teresa', 'Jim Carrey'],
  },
  11: {
    title: 'Master Number — Người Truyền Cảm Hứng',
    keywords: ['Trực giác', 'Tâm linh', 'Sáng tạo', 'Nhạy cảm', 'Tầm nhìn'],
    personality: 'Bạn mang năng lượng đặc biệt — trực giác cực mạnh, có khả năng truyền cảm hứng và kết nối với chiều sâu tâm linh. Bạn nhìn thấy những gì người khác không thấy. Đây là con số Master — tiềm năng rất lớn nhưng áp lực cũng rất lớn. Bạn dễ bị overwhelm bởi cảm xúc và năng lượng xung quanh.',
    career: 'Phù hợp: Nghệ sĩ, nhà tâm linh, tư vấn, giảng viên, truyền thông, lãnh đạo tầm nhìn, nhà phát minh. Bạn cần một sứ mệnh, không chỉ một công việc.',
    love: 'Mối quan hệ sâu sắc, tâm linh. Cần đối phương hiểu và chấp nhận sự nhạy cảm đặc biệt của bạn.',
    challenge: 'Quản lý năng lượng, tránh lo âu quá mức, và biến tầm nhìn thành hành động thực tế.',
    celebrities: ['Barack Obama', 'David Beckham', 'Mozart'],
  },
  22: {
    title: 'Master Number — Người Kiến Tạo',
    keywords: ['Tầm nhìn', 'Xây dựng', 'Quyền lực', 'Di sản', 'Thực tế'],
    personality: 'Bạn là Master Builder — có khả năng biến ước mơ lớn thành hiện thực. Kết hợp trực giác của số 11 với kỷ luật của số 4. Bạn nghĩ lớn VÀ làm được lớn. Đây là con số quyền lực nhất trong Thần số học. Áp lực tương ứng cũng khổng lồ.',
    career: 'Phù hợp: CEO tập đoàn lớn, kiến trúc sư, chính trị gia, nhà sáng lập, dự án quy mô lớn. Bạn xây dựng di sản.',
    love: 'Cần đối phương vừa hỗ trợ tham vọng vừa giữ bạn nối đất. Cẩn thận đừng hy sinh gia đình vì sự nghiệp.',
    challenge: 'Áp lực tự đặt ra rất lớn. Cần cân bằng và đừng sợ thất bại.',
    celebrities: ['Bill Gates', 'Dalai Lama', 'Paul McCartney'],
  },
  33: {
    title: 'Master Number — Người Dẫn Dắt Tâm Linh',
    keywords: ['Phục vụ', 'Tâm linh', 'Chữa lành', 'Hy sinh', 'Yêu thương'],
    personality: 'Con số hiếm nhất và cao nhất. Bạn mang sứ mệnh phục vụ nhân loại ở cấp độ tâm linh. Kết hợp sáng tạo của số 3 với lòng nhân ái của số 6. Áp lực và trách nhiệm cực lớn — không phải ai cũng "sống được" ở tần số này.',
    career: 'Phù hợp: Nhà tâm linh, chữa lành, giáo dục, từ thiện quy mô lớn, nghệ thuật truyền cảm hứng.',
    love: 'Tình yêu vô điều kiện. Bạn yêu cả thế giới, đôi khi quên yêu bản thân và người bên cạnh.',
    challenge: 'Sống thực tế, chấp nhận bản thân là con người — không phải thánh nhân.',
    celebrities: ['Albert Einstein', 'Stephen King', 'Meryl Streep'],
  },
};

// ============================================
// NUMBER MEANINGS (brief, for Expression/SoulUrge/Personality)
// ============================================

export const NUMBER_MEANINGS: Record<number, {
  title: string;
  brief: string;
}> = {
  1: { title: 'Người Tiên Phong', brief: 'Độc lập, lãnh đạo, sáng tạo, quyết đoán. Luôn muốn dẫn đầu và đi con đường riêng.' },
  2: { title: 'Người Hòa Giải', brief: 'Nhạy cảm, hợp tác, ngoại giao, kiên nhẫn. Giỏi kết nối và tạo sự hài hòa.' },
  3: { title: 'Người Sáng Tạo', brief: 'Vui vẻ, giao tiếp tốt, nghệ thuật, biểu đạt. Nhìn cuộc đời đầy màu sắc.' },
  4: { title: 'Người Xây Dựng', brief: 'Ổn định, kỷ luật, chăm chỉ, thực tế. Xây dựng nền tảng vững chắc.' },
  5: { title: 'Người Tự Do', brief: 'Năng động, phiêu lưu, linh hoạt, thay đổi. Khao khát trải nghiệm mới.' },
  6: { title: 'Người Chăm Sóc', brief: 'Yêu thương, trách nhiệm, gia đình, phục vụ. Luôn đặt người thân lên đầu.' },
  7: { title: 'Người Tìm Kiếm', brief: 'Sâu sắc, trí tuệ, tâm linh, phân tích. Thích tìm hiểu bản chất sự việc.' },
  8: { title: 'Người Quyền Lực', brief: 'Tham vọng, tài chính, quản lý, thành công. Hiểu luật chơi của tiền bạc.' },
  9: { title: 'Người Nhân Đạo', brief: 'Bác ái, trí tuệ, lý tưởng, bao dung. Muốn đóng góp cho nhân loại.' },
  11: { title: 'Người Truyền Cảm Hứng', brief: 'Trực giác mạnh, tâm linh, nhạy cảm. Master Number với tiềm năng đặc biệt.' },
  22: { title: 'Người Kiến Tạo', brief: 'Tầm nhìn lớn, xây dựng di sản, quyền lực. Master Builder biến ước mơ thành hiện thực.' },
  33: { title: 'Người Dẫn Dắt Tâm Linh', brief: 'Phục vụ, chữa lành, yêu thương vô điều kiện. Con số hiếm nhất và cao nhất.' },
};

// ============================================
// PERSONAL YEAR MEANINGS (1-9)
// ============================================

export const PERSONAL_YEAR_MEANINGS: Record<number, {
  theme: string;
  description: string;
  doList: string[];
  dontList: string[];
}> = {
  1: {
    theme: 'Khởi Đầu Mới',
    description: 'Năm bắt đầu chu kỳ 9 năm mới. Thời điểm lý tưởng để khởi nghiệp, bắt đầu dự án, thay đổi lớn. Năng lượng mạnh, tự tin, độc lập.',
    doList: ['Bắt đầu dự án mới', 'Khởi nghiệp', 'Đổi việc nếu cần', 'Đặt mục tiêu lớn'],
    dontList: ['Trì hoãn', 'Phụ thuộc người khác', 'Sợ rủi ro'],
  },
  2: {
    theme: 'Kiên Nhẫn & Hợp Tác',
    description: 'Năm chậm lại sau sự bùng nổ của năm 1. Tập trung vào các mối quan hệ, hợp tác, và xây dựng nền tảng. Kiên nhẫn là chìa khóa — mọi thứ cần thời gian để nảy mầm.',
    doList: ['Xây dựng mối quan hệ', 'Hợp tác kinh doanh', 'Lắng nghe và học hỏi', 'Chăm sóc sức khỏe tinh thần'],
    dontList: ['Vội vàng quyết định lớn', 'Bỏ cuộc vì thiếu kiên nhẫn', 'Bỏ qua cảm xúc người khác'],
  },
  3: {
    theme: 'Sáng Tạo & Giao Tiếp',
    description: 'Năm tỏa sáng — sáng tạo bùng nổ, giao lưu xã hội mở rộng, cơ hội thể hiện bản thân. Đây là lúc để bạn bước ra ánh sáng, chia sẻ ý tưởng và kết nối.',
    doList: ['Theo đuổi dự án sáng tạo', 'Mở rộng mạng lưới xã hội', 'Viết lách, nghệ thuật, biểu diễn', 'Du lịch và trải nghiệm'],
    dontList: ['Thu mình lại', 'Phân tán quá nhiều hướng', 'Chi tiêu thiếu kiểm soát'],
  },
  4: {
    theme: 'Xây Dựng Nền Tảng',
    description: 'Năm làm việc chăm chỉ, xây nền móng vững chắc cho tương lai. Kỷ luật, tổ chức, và sự kiên trì sẽ mang lại thành quả. Đây không phải năm để mạo hiểm lớn.',
    doList: ['Lên kế hoạch dài hạn', 'Tiết kiệm và đầu tư an toàn', 'Sửa chữa, cải tạo nhà cửa', 'Chăm sóc sức khỏe thể chất'],
    dontList: ['Mạo hiểm tài chính', 'Bỏ dở công việc', 'Lười biếng hoặc đi đường tắt'],
  },
  5: {
    theme: 'Thay Đổi & Tự Do',
    description: 'Năm đầy biến động — thay đổi lớn trong công việc, nơi ở, hoặc mối quan hệ. Cơ hội bất ngờ xuất hiện. Thích nghi nhanh và sẵn sàng đón nhận cái mới là chìa khóa.',
    doList: ['Đón nhận thay đổi', 'Du lịch và khám phá', 'Thử nghiệm điều mới', 'Mở rộng tầm nhìn'],
    dontList: ['Bám víu vào cái cũ', 'Sợ thay đổi', 'Thiếu kỷ luật giữa tự do'],
  },
  6: {
    theme: 'Gia Đình & Trách Nhiệm',
    description: 'Năm tập trung vào gia đình, hôn nhân, và trách nhiệm. Có thể kết hôn, sinh con, hoặc chăm sóc người thân. Tình yêu và sự hài hòa trong gia đình là ưu tiên.',
    doList: ['Chăm sóc gia đình', 'Kết hôn hoặc củng cố tình cảm', 'Trang trí, cải tạo nhà', 'Phục vụ cộng đồng'],
    dontList: ['Bỏ bê gia đình vì công việc', 'Kiểm soát người khác', 'Hy sinh bản thân quá mức'],
  },
  7: {
    theme: 'Nội Tâm & Tìm Kiếm',
    description: 'Năm suy ngẫm, học hỏi, và phát triển tâm linh. Thời gian một mình rất quan trọng. Nghiên cứu, đọc sách, thiền định — tìm kiếm câu trả lời bên trong.',
    doList: ['Học hỏi và nghiên cứu', 'Thiền định, yoga', 'Viết nhật ký nội tâm', 'Nghỉ ngơi và nạp năng lượng'],
    dontList: ['Quyết định vội vàng', 'Ép mình vào đám đông', 'Bỏ qua trực giác'],
  },
  8: {
    theme: 'Thu Hoạch & Thành Công',
    description: 'Năm gặt hái — tài chính tốt, quyền lực tăng, thăng tiến trong sự nghiệp. Những nỗ lực từ các năm trước bắt đầu cho thành quả. Tự tin đàm phán và nắm bắt cơ hội.',
    doList: ['Đầu tư và kinh doanh', 'Đàm phán lương, hợp đồng', 'Mua bất động sản', 'Mở rộng sự nghiệp'],
    dontList: ['Phung phí thành quả', 'Kiêu ngạo', 'Bỏ qua sức khỏe vì công việc'],
  },
  9: {
    theme: 'Kết Thúc & Buông Bỏ',
    description: 'Năm cuối chu kỳ 9 năm — buông bỏ cái cũ, chuẩn bị cho chu kỳ mới. Hoàn thành những gì dang dở, tha thứ, và giải phóng. Năm cho từ thiện và đóng góp.',
    doList: ['Hoàn thành dự án dang dở', 'Tha thứ và buông bỏ', 'Từ thiện và giúp đỡ', 'Dọn dẹp và sắp xếp lại'],
    dontList: ['Bắt đầu dự án lớn mới', 'Bám víu vào quá khứ', 'Trốn tránh thực tế'],
  },
};

// ============================================
// KARMIC DEBT MEANINGS
// ============================================

export const KARMIC_DEBT_MEANINGS: Record<number, {
  title: string;
  description: string;
}> = {
  13: {
    title: 'Nợ Nghiệp Số 13 — Lười biếng',
    description: 'Kiếp trước bạn đã lười biếng, trốn tránh trách nhiệm. Kiếp này cần học cách làm việc chăm chỉ, kiên trì, và hoàn thành mục tiêu. Con đường không dễ dàng nhưng phần thưởng rất xứng đáng.',
  },
  14: {
    title: 'Nợ Nghiệp Số 14 — Lạm dụng tự do',
    description: 'Kiếp trước bạn đã lạm dụng tự do, thiếu kỷ luật. Kiếp này cần học cách cân bằng tự do và trách nhiệm. Dễ gặp cám dỗ về rượu, ma túy, hoặc quan hệ. Kỷ luật bản thân là bài học lớn.',
  },
  16: {
    title: 'Nợ Nghiệp Số 16 — Ego quá lớn',
    description: 'Kiếp trước ego quá lớn, phá hủy mối quan hệ. Kiếp này cần học cách khiêm tốn và kết nối tâm linh. Có thể trải qua sự sụp đổ bất ngờ để tái sinh. "Tháp" phải đổ để xây lại vững hơn.',
  },
  19: {
    title: 'Nợ Nghiệp Số 19 — Lạm dụng quyền lực',
    description: 'Kiếp trước đã lạm dụng quyền lực, bỏ rơi người khác. Kiếp này cần học cách độc lập nhưng không cô lập, dẫn dắt nhưng không áp đặt. Bài học: cho đi nhiều hơn nhận lại.',
  },
};

// ============================================
// INCLUSION CHART MEANINGS
// ============================================

export const INCLUSION_MEANINGS: Record<number, {
  present: string;
  missing: string;
}> = {
  1: { present: 'Tự tin, lãnh đạo, độc lập', missing: 'Cần phát triển sự tự tin và khả năng đứng một mình' },
  2: { present: 'Nhạy cảm, hợp tác, ngoại giao', missing: 'Cần học cách hợp tác và thấu hiểu người khác' },
  3: { present: 'Sáng tạo, giao tiếp, lạc quan', missing: 'Cần phát triển khả năng biểu đạt và sáng tạo' },
  4: { present: 'Kỷ luật, tổ chức, chăm chỉ', missing: 'Cần rèn luyện tính kỷ luật và sự kiên nhẫn' },
  5: { present: 'Tự do, linh hoạt, thích nghi', missing: 'Cần học cách đón nhận thay đổi và mạo hiểm' },
  6: { present: 'Yêu thương, trách nhiệm, gia đình', missing: 'Cần phát triển trách nhiệm với gia đình và cộng đồng' },
  7: { present: 'Trí tuệ, tâm linh, phân tích', missing: 'Cần phát triển tư duy phản biện và chiều sâu nội tâm' },
  8: { present: 'Tham vọng, tài chính, quyền lực', missing: 'Cần học cách quản lý tài chính và theo đuổi thành công' },
  9: { present: 'Nhân đạo, bao dung, trí tuệ', missing: 'Cần mở rộng tầm nhìn và lòng trắc ẩn với thế giới' },
};

// ============================================
// LIFE PATH COMPATIBILITY MATRIX
// ============================================

export const LP_COMPAT: Record<string, number> = {
  '1-1': 60, '1-2': 80, '1-3': 85, '1-4': 55, '1-5': 90, '1-6': 65, '1-7': 70, '1-8': 75, '1-9': 80,
  '2-2': 70, '2-3': 75, '2-4': 85, '2-5': 50, '2-6': 90, '2-7': 65, '2-8': 80, '2-9': 75,
  '3-3': 70, '3-4': 45, '3-5': 90, '3-6': 85, '3-7': 60, '3-8': 55, '3-9': 85,
  '4-4': 65, '4-5': 40, '4-6': 80, '4-7': 75, '4-8': 90, '4-9': 50,
  '5-5': 70, '5-6': 50, '5-7': 85, '5-8': 60, '5-9': 80,
  '6-6': 75, '6-7': 55, '6-8': 65, '6-9': 90,
  '7-7': 65, '7-8': 50, '7-9': 70,
  '8-8': 75, '8-9': 55,
  '9-9': 70,
};

/** Get compatibility score between two Life Path numbers (order independent) */
export function getLifePathCompat(lp1: number, lp2: number): number {
  const a = Math.min(lp1, lp2);
  const b = Math.max(lp1, lp2);
  return LP_COMPAT[`${a}-${b}`] ?? 50;
}
