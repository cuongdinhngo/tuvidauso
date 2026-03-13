export interface CacheCuc {
  name: string;
  conditions: { stars: string[]; palace?: string; position?: string }[];
  rating: 1 | 2 | 3 | 4 | 5;
  description: string;
}

export const CACHE_PATTERNS: CacheCuc[] = [
  {
    name: 'Tử Phủ Đồng Cung',
    conditions: [{ stars: ['Tử Vi', 'Thiên Phủ'] }],
    rating: 5,
    description: 'Tử Vi và Thiên Phủ cùng cung, quyền quý song toàn, phú quý vinh hoa.',
  },
  {
    name: 'Cự Nhật Dần Cung',
    conditions: [{ stars: ['Cự Môn', 'Thái Dương'], position: 'Dần' }],
    rating: 5,
    description: 'Cự Môn và Thái Dương cùng ở cung Dần, sự nghiệp sáng sủa, có danh tiếng.',
  },
  {
    name: 'Cơ Nguyệt Đồng Lương',
    conditions: [{ stars: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'] }],
    rating: 4,
    description: 'Bốn sao cùng hội, thích hợp công chức, ổn định, cuộc sống an nhàn.',
  },
  {
    name: 'Sát Phá Tham',
    conditions: [{ stars: ['Thất Sát', 'Phá Quân', 'Tham Lang'] }],
    rating: 3,
    description: 'Ba sao sát cùng hội, cuộc đời nhiều biến động nhưng có thể thành đạt lớn nếu biết nắm bắt cơ hội.',
  },
  {
    name: 'Nhật Nguyệt Tịnh Minh',
    conditions: [{ stars: ['Thái Dương'], position: 'Ngọ' }, { stars: ['Thái Âm'], position: 'Tý' }],
    rating: 5,
    description: 'Thái Dương ở Ngọ, Thái Âm ở Tý, nhật nguyệt đều sáng, phú quý song toàn.',
  },
  {
    name: 'Tử Phủ Vũ Tướng',
    conditions: [{ stars: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'] }],
    rating: 5,
    description: 'Bốn sao đế tinh hội tụ, quyền quý phi thường.',
  },
  {
    name: 'Quân Thần Khánh Hội',
    conditions: [{ stars: ['Tử Vi', 'Tả Phụ', 'Hữu Bật'] }],
    rating: 5,
    description: 'Tử Vi có Tả Phụ Hữu Bật hội hợp, như vua có bề tôi phò tá, quyền uy lớn.',
  },
  {
    name: 'Phủ Tướng Triều Viên',
    conditions: [{ stars: ['Thiên Phủ', 'Thiên Tướng'] }],
    rating: 4,
    description: 'Thiên Phủ và Thiên Tướng hội hợp, phú quý bền vững.',
  },
  {
    name: 'Tài Ấm Giáp Ấn',
    conditions: [{ stars: ['Thiên Cơ'] }],
    rating: 4,
    description: 'Có Thiên Lương và Thiên Đồng kẹp, được che chở phù trợ từ nhiều phía.',
  },
  {
    name: 'Lục Sát Triều Viên',
    conditions: [{ stars: ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'] }],
    rating: 1,
    description: 'Nhiều sao sát hội tụ, cuộc đời nhiều trắc trở, tai họa.',
  },
  {
    name: 'Nhật Nguyệt Phản Bối',
    conditions: [{ stars: ['Thái Dương'], position: 'Tuất' }, { stars: ['Thái Âm'], position: 'Thìn' }],
    rating: 1,
    description: 'Thái Dương hãm ở Tuất, Thái Âm hãm ở Thìn, bất lợi cha mẹ, sự nghiệp khó khăn.',
  },
  {
    name: 'Mã Đầu Đái Kiếm',
    conditions: [{ stars: ['Thiên Mã', 'Kình Dương'] }],
    rating: 2,
    description: 'Thiên Mã gặp Kình Dương, di chuyển gặp nguy hiểm, tai nạn giao thông.',
  },
  {
    name: 'Lộc Mã Giao Trì',
    conditions: [{ stars: ['Lộc Tồn', 'Thiên Mã'] }],
    rating: 5,
    description: 'Lộc Tồn gặp Thiên Mã, tài lộc dồn dập, kinh doanh phát đạt.',
  },
  {
    name: 'Xương Khúc Giáp',
    conditions: [{ stars: ['Văn Xương', 'Văn Khúc'] }],
    rating: 4,
    description: 'Văn Xương Văn Khúc hội hợp, học vấn xuất sắc, thành đạt về văn hóa.',
  },
  {
    name: 'Khôi Việt Giáp',
    conditions: [{ stars: ['Thiên Khôi', 'Thiên Việt'] }],
    rating: 4,
    description: 'Thiên Khôi Thiên Việt hội hợp, luôn có quý nhân phù trợ, thi cử đỗ đạt.',
  },
  {
    name: 'Song Lộc Triều Viên',
    conditions: [{ stars: ['Lộc Tồn', 'Hóa Lộc'] }],
    rating: 5,
    description: 'Lộc Tồn và sao Hóa Lộc cùng cung, tài lộc cực vượng, giàu có bền vững.',
  },
  {
    name: 'Tả Hữu Đồng Cung',
    conditions: [{ stars: ['Tả Phụ', 'Hữu Bật'] }],
    rating: 4,
    description: 'Tả Phụ Hữu Bật đồng cung, được nhiều người phò trợ, sự nghiệp thuận lợi.',
  },
  {
    name: 'Không Kiếp Đồng Cung',
    conditions: [{ stars: ['Địa Không', 'Địa Kiếp'] }],
    rating: 1,
    description: 'Địa Không Địa Kiếp đồng cung, tài lộc hay hao tán, cuộc đời nhiều bất ngờ.',
  },
  {
    name: 'Tứ Sát Đồng Cung',
    conditions: [{ stars: ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'] }],
    rating: 1,
    description: 'Bốn sát tinh đồng cung, cuộc đời cực kỳ gian nan, nhiều tai họa.',
  },
  {
    name: 'Đào Hồng Đồng Cung',
    conditions: [{ stars: ['Đào Hoa', 'Hồng Loan'] }],
    rating: 3,
    description: 'Đào Hoa và Hồng Loan cùng cung, đời sống tình cảm phong phú, thu hút người khác. Tốt cho ngành nghệ thuật, giải trí.',
  },
  {
    name: 'Kình Đà Hiệp',
    conditions: [{ stars: ['Kình Dương', 'Đà La'] }],
    rating: 2,
    description: 'Kình Dương Đà La cùng cung hoặc kẹp, gặp nhiều trở ngại, hay bị người hại.',
  },
  {
    name: 'Hỏa Linh Đồng Cung',
    conditions: [{ stars: ['Hỏa Tinh', 'Linh Tinh'] }],
    rating: 2,
    description: 'Hỏa Tinh Linh Tinh cùng cung, tính nóng nảy, dễ gặp tai họa bất ngờ, nhưng cũng có thể bùng phát thành công đột ngột.',
  },
  {
    name: 'Nhật Nguyệt Giáp Mệnh',
    conditions: [{ stars: ['Thái Dương'] }, { stars: ['Thái Âm'] }],
    rating: 5,
    description: 'Thái Dương và Thái Âm kẹp cung Mệnh, được nhật nguyệt che chở, cuộc đời sáng sủa.',
  },
  {
    name: 'Tam Kỳ Gia Hội',
    conditions: [{ stars: ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'] }],
    rating: 5,
    description: 'Lộc, Quyền, Khoa hội tụ, tam kỳ cực tốt — quyền quý, phú quý, danh tiếng song toàn.',
  },
];
