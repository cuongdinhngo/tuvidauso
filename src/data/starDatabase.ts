export interface StarData {
  name: string;
  system: string;
  element: string;
  yinYang: string;
  nature: string;
  keywords: string[];
}

export const STAR_DATABASE: Record<string, StarData> = {
  'Tử Vi': {
    name: 'Tử Vi', system: 'Tử Vi hệ', element: 'Thổ', yinYang: 'Dương',
    nature: 'Đế tinh, chủ về quyền uy, lãnh đạo, cao quý. Là sao chủ của lá số, tượng trưng cho bậc đế vương.',
    keywords: ['quyền uy', 'lãnh đạo', 'cao quý', 'đế vương', 'tự trọng'],
  },
  'Thiên Cơ': {
    name: 'Thiên Cơ', system: 'Tử Vi hệ', element: 'Mộc', yinYang: 'Âm',
    nature: 'Sao trí tuệ, mưu lược, khéo léo. Chủ về sự thay đổi, di chuyển, tính toán.',
    keywords: ['trí tuệ', 'mưu lược', 'thay đổi', 'di chuyển', 'tính toán'],
  },
  'Thái Dương': {
    name: 'Thái Dương', system: 'Tử Vi hệ', element: 'Hỏa', yinYang: 'Dương',
    nature: 'Sao quý nhân, bác ái, quang minh. Tượng cha, chồng. Miếu vượng thì rực rỡ, hãm địa thì mờ nhạt.',
    keywords: ['quý nhân', 'bác ái', 'quang minh', 'danh tiếng', 'cha'],
  },
  'Vũ Khúc': {
    name: 'Vũ Khúc', system: 'Tử Vi hệ', element: 'Kim', yinYang: 'Dương',
    nature: 'Tài tinh, chủ về tài lộc, quyết đoán, cương nghị. Giỏi kinh doanh, tài chính.',
    keywords: ['tài lộc', 'quyết đoán', 'cương nghị', 'kinh doanh', 'tài chính'],
  },
  'Thiên Đồng': {
    name: 'Thiên Đồng', system: 'Tử Vi hệ', element: 'Thủy', yinYang: 'Dương',
    nature: 'Phúc tinh, chủ về phúc đức, an nhàn, hiền lành. Thích hưởng thụ, ít chí tiến thủ.',
    keywords: ['phúc đức', 'an nhàn', 'hiền lành', 'hưởng thụ', 'nghệ thuật'],
  },
  'Liêm Trinh': {
    name: 'Liêm Trinh', system: 'Tử Vi hệ', element: 'Hỏa', yinYang: 'Âm',
    nature: 'Sao thứ phi, đa tài đa nghệ nhưng hay gặp thị phi. Tính cách phức tạp, đa dạng.',
    keywords: ['thị phi', 'đa tài', 'phức tạp', 'tình cảm', 'pháp luật'],
  },
  'Thiên Phủ': {
    name: 'Thiên Phủ', system: 'Thiên Phủ hệ', element: 'Thổ', yinYang: 'Dương',
    nature: 'Lệnh tinh, chủ về tài lộc dồi dào, phúc hậu, ổn định. Như kho tàng, giữ của giỏi.',
    keywords: ['tài lộc', 'phúc hậu', 'ổn định', 'kho tàng', 'bảo thủ'],
  },
  'Thái Âm': {
    name: 'Thái Âm', system: 'Thiên Phủ hệ', element: 'Thủy', yinYang: 'Âm',
    nature: 'Sao nữ quý, tượng mẹ, vợ. Chủ về điền sản, bất động sản, tình cảm tinh tế.',
    keywords: ['điền sản', 'tình cảm', 'nghệ thuật', 'mẹ', 'bất động sản'],
  },
  'Tham Lang': {
    name: 'Tham Lang', system: 'Thiên Phủ hệ', element: 'Thủy/Mộc', yinYang: 'Dương',
    nature: 'Đào hoa tinh, đa tài đa nghệ, tham vọng. Giỏi giao tiếp, ham học hỏi nhưng dễ sa đà.',
    keywords: ['đào hoa', 'đa tài', 'tham vọng', 'giao tiếp', 'nghệ thuật'],
  },
  'Cự Môn': {
    name: 'Cự Môn', system: 'Thiên Phủ hệ', element: 'Thủy', yinYang: 'Âm',
    nature: 'Ám tinh, chủ về khẩu tài, tranh luận, thị phi. Giỏi phân tích nhưng hay gặp rắc rối miệng lưỡi.',
    keywords: ['khẩu tài', 'tranh luận', 'thị phi', 'phân tích', 'luật sư'],
  },
  'Thiên Tướng': {
    name: 'Thiên Tướng', system: 'Thiên Phủ hệ', element: 'Thủy', yinYang: 'Dương',
    nature: 'Ấn tinh, chủ về quý nhân phù trợ, y phục, diện mạo. Thích giúp người, có uy tín.',
    keywords: ['quý nhân', 'uy tín', 'giúp người', 'diện mạo', 'y phục'],
  },
  'Thiên Lương': {
    name: 'Thiên Lương', system: 'Thiên Phủ hệ', element: 'Mộc', yinYang: 'Dương',
    nature: 'Ấm tinh, chủ về che chở, bảo vệ, y dược. Lòng nhân từ, hay giúp đỡ, thọ.',
    keywords: ['che chở', 'nhân từ', 'y dược', 'thọ', 'giáo dục'],
  },
  'Thất Sát': {
    name: 'Thất Sát', system: 'Thiên Phủ hệ', element: 'Kim', yinYang: 'Âm',
    nature: 'Tướng tinh, chủ về uy quyền, quả cảm, hành động. Tính cách mạnh mẽ, dám nghĩ dám làm.',
    keywords: ['uy quyền', 'quả cảm', 'hành động', 'quân sự', 'quyết liệt'],
  },
  'Phá Quân': {
    name: 'Phá Quân', system: 'Thiên Phủ hệ', element: 'Thủy', yinYang: 'Âm',
    nature: 'Hao tinh, chủ về phá cũ lập mới, biến động. Thích cách mạng, đổi mới nhưng hay hao tốn.',
    keywords: ['phá cũ', 'đổi mới', 'biến động', 'cách mạng', 'hao tốn'],
  },
  'Tả Phụ': {
    name: 'Tả Phụ', system: 'Phụ tinh', element: 'Thổ', yinYang: 'Dương',
    nature: 'Quý nhân trợ giúp, bên trái. Chủ được nhiều người giúp đỡ, nhân duyên tốt.',
    keywords: ['quý nhân', 'trợ giúp', 'nhân duyên', 'bạn bè'],
  },
  'Hữu Bật': {
    name: 'Hữu Bật', system: 'Phụ tinh', element: 'Thủy', yinYang: 'Âm',
    nature: 'Quý nhân trợ giúp, bên phải. Giống Tả Phụ nhưng âm tính hơn, kín đáo hơn.',
    keywords: ['quý nhân', 'trợ giúp', 'kín đáo', 'tinh tế'],
  },
  'Văn Xương': {
    name: 'Văn Xương', system: 'Phụ tinh', element: 'Kim', yinYang: 'Dương',
    nature: 'Văn tinh, chủ về học vấn, thi cử, văn chương. Thông minh, giỏi học.',
    keywords: ['học vấn', 'thi cử', 'văn chương', 'thông minh'],
  },
  'Văn Khúc': {
    name: 'Văn Khúc', system: 'Phụ tinh', element: 'Thủy', yinYang: 'Âm',
    nature: 'Văn tinh, thiên về nghệ thuật, âm nhạc, sáng tạo hơn Văn Xương.',
    keywords: ['nghệ thuật', 'âm nhạc', 'sáng tạo', 'tài hoa'],
  },
  'Lộc Tồn': {
    name: 'Lộc Tồn', system: 'Phụ tinh', element: 'Thổ', yinYang: 'Dương',
    nature: 'Tài tinh, chủ về tiền bạc, tài sản. Giữ của giỏi nhưng có phần keo kiệt.',
    keywords: ['tiền bạc', 'tài sản', 'tiết kiệm', 'ổn định'],
  },
  'Kình Dương': {
    name: 'Kình Dương', system: 'Phụ tinh', element: 'Kim', yinYang: 'Dương',
    nature: 'Sát tinh, chủ về tranh đấu, quyết liệt, tai nạn. Tính cách nóng nảy, dũng cảm.',
    keywords: ['tranh đấu', 'quyết liệt', 'nóng nảy', 'tai nạn'],
  },
  'Đà La': {
    name: 'Đà La', system: 'Phụ tinh', element: 'Kim', yinYang: 'Âm',
    nature: 'Sát tinh, chủ về trì trệ, dằng dai, thị phi. Âm tính hơn Kình Dương.',
    keywords: ['trì trệ', 'dằng dai', 'thị phi', 'trở ngại'],
  },
  'Hỏa Tinh': {
    name: 'Hỏa Tinh', system: 'Phụ tinh', element: 'Hỏa', yinYang: 'Dương',
    nature: 'Sát tinh, chủ về nóng vội, bùng nổ, tai họa bất ngờ. Tính nóng nảy.',
    keywords: ['nóng vội', 'bùng nổ', 'bất ngờ', 'tai họa'],
  },
  'Linh Tinh': {
    name: 'Linh Tinh', system: 'Phụ tinh', element: 'Hỏa', yinYang: 'Âm',
    nature: 'Sát tinh, giống Hỏa Tinh nhưng âm hơn. Hay lo lắng, bồn chồn.',
    keywords: ['lo lắng', 'bồn chồn', 'bất an', 'biến động'],
  },
  'Cô Thần': {
    name: 'Cô Thần', system: 'Phụ tinh', element: 'Hỏa', yinYang: 'Dương',
    nature: 'Cô đơn, độc lập, tự lực. Ở Mệnh: tính cách cô độc. Ở Phu Thê: hôn nhân trắc trở, dễ chia ly.',
    keywords: ['cô đơn', 'độc lập', 'ly biệt'],
  },
  'Quả Tú': {
    name: 'Quả Tú', system: 'Phụ tinh', element: 'Hỏa', yinYang: 'Âm',
    nature: 'Cô quả, góa bụa. Ở Mệnh: tính cách lẻ loi. Ở Phu Thê: hôn nhân không bền.',
    keywords: ['cô quả', 'lẻ loi', 'ly biệt'],
  },
  'Phá Toái': {
    name: 'Phá Toái', system: 'Phụ tinh', element: 'Hỏa', yinYang: 'Dương',
    nature: 'Phá tan, hao tổn. Gây trở ngại, làm hỏng việc.',
    keywords: ['phá hoại', 'hao tổn', 'trở ngại'],
  },
  'Thiên Không': {
    name: 'Thiên Không', system: 'Phụ tinh', element: 'Hỏa', yinYang: 'Dương',
    nature: 'Trống rỗng, hư vô. Khác Địa Không — thiên về tinh thần, lý tưởng. Gặp cát tinh thì hóa tốt, gặp hung thì xấu hơn.',
    keywords: ['trống rỗng', 'hư vô', 'lý tưởng', 'tôn giáo'],
  },
  'Đại Hao': {
    name: 'Đại Hao', system: 'Phụ tinh', element: 'Hỏa', yinYang: 'Dương',
    nature: 'Hao tổn lớn, tốn kém tiền bạc, sức lực. Gây trở ngại về tài chính.',
    keywords: ['hao tổn', 'tốn kém', 'mất mát'],
  },
  'Tiểu Hao': {
    name: 'Tiểu Hao', system: 'Phụ tinh', element: 'Hỏa', yinYang: 'Âm',
    nature: 'Hao tổn nhỏ, chi tiêu vặt. Nhẹ hơn Đại Hao nhưng vẫn gây phiền phức.',
    keywords: ['hao tổn nhỏ', 'chi tiêu', 'phiền phức'],
  },
  'Thiên Quan': {
    name: 'Thiên Quan', system: 'Phụ tinh', element: 'Thổ', yinYang: 'Dương',
    nature: 'Quý nhân phù hộ đường công danh. Tốt cho quan lộc, sự nghiệp.',
    keywords: ['quan lộc', 'công danh', 'quý nhân'],
  },
  'Thiên Phúc': {
    name: 'Thiên Phúc', system: 'Phụ tinh', element: 'Thổ', yinYang: 'Dương',
    nature: 'Phúc đức từ trời, may mắn, hóa giải tai họa. Tốt cho phúc đức, tâm linh.',
    keywords: ['phúc đức', 'may mắn', 'hóa giải'],
  },
  'Thiên Trù': {
    name: 'Thiên Trù', system: 'Phụ tinh', element: 'Thổ', yinYang: 'Dương',
    nature: 'Thiên Bếp — liên quan ẩm thực, hưởng thụ vật chất. Tốt về đời sống, ăn uống.',
    keywords: ['ẩm thực', 'hưởng thụ', 'vật chất'],
  },
  'Quốc Ấn': {
    name: 'Quốc Ấn', system: 'Phụ tinh', element: 'Thổ', yinYang: 'Dương',
    nature: 'Ấn tín quốc gia. Tốt cho quan chức, công quyền, danh vọng.',
    keywords: ['ấn tín', 'công quyền', 'danh vọng'],
  },
  'Đường Phù': {
    name: 'Đường Phù', system: 'Phụ tinh', element: 'Mộc', yinYang: 'Dương',
    nature: 'Phù hiệu đường triều. Hỗ trợ đường công danh, phù hợp công chức.',
    keywords: ['công danh', 'công chức', 'phù hiệu'],
  },
  'Thiên Hình': {
    name: 'Thiên Hình', system: 'Phụ tinh', element: 'Kim', yinYang: 'Dương',
    nature: 'Hình phạt, pháp luật, phẫu thuật. Ở Mệnh: cứng rắn, công minh. Ở Tật Ách: có thể phẫu thuật.',
    keywords: ['pháp luật', 'hình phạt', 'phẫu thuật', 'công minh'],
  },
  'Thiên Riêu': {
    name: 'Thiên Riêu', system: 'Phụ tinh', element: 'Thủy', yinYang: 'Âm',
    nature: 'Đào hoa, sắc đẹp, quyến rũ. Tốt cho nghệ thuật, xấu cho hôn nhân nếu nhiều đào hoa tinh khác.',
    keywords: ['đào hoa', 'sắc đẹp', 'quyến rũ', 'nghệ thuật'],
  },
  'Tam Thai': {
    name: 'Tam Thai', system: 'Phụ tinh', element: 'Thổ', yinYang: 'Dương',
    nature: 'Cát tinh nhỏ, hỗ trợ học vấn, thi cử. Đi cùng Bát Tọa thì tốt hơn.',
    keywords: ['học vấn', 'thi cử', 'văn chương'],
  },
  'Bát Tọa': {
    name: 'Bát Tọa', system: 'Phụ tinh', element: 'Thổ', yinYang: 'Âm',
    nature: 'Cát tinh nhỏ, hỗ trợ danh vọng, vị trí. Đi cùng Tam Thai thì tốt hơn.',
    keywords: ['danh vọng', 'vị trí', 'quý nhân'],
  },
  'Thiên La': {
    name: 'Thiên La', system: 'Phụ tinh', element: 'Thổ', yinYang: 'Dương',
    nature: 'Lưới trời, trở ngại, ràng buộc. Cố định tại Thìn. Gặp sát tinh thì xấu.',
    keywords: ['trở ngại', 'ràng buộc', 'lưới trời'],
  },
  'Địa Võng': {
    name: 'Địa Võng', system: 'Phụ tinh', element: 'Thổ', yinYang: 'Âm',
    nature: 'Lưới đất, trở ngại, ràng buộc. Cố định tại Tuất. Gặp sát tinh thì xấu.',
    keywords: ['trở ngại', 'ràng buộc', 'lưới đất'],
  },
  'Thiên Thương': {
    name: 'Thiên Thương', system: 'Phụ tinh', element: 'Hỏa', yinYang: 'Dương',
    nature: 'Thương tích, tổn hại. Ở Tật Ách: hay bệnh, dễ bị thương.',
    keywords: ['thương tích', 'tổn hại', 'bệnh tật'],
  },
  'Thiên Sứ': {
    name: 'Thiên Sứ', system: 'Phụ tinh', element: 'Thủy', yinYang: 'Âm',
    nature: 'Sứ giả, truyền tin. Ở Tật Ách: bệnh tật, ở Thiên Di: gặp trở ngại khi di chuyển.',
    keywords: ['sứ giả', 'truyền tin', 'trở ngại'],
  },
};
