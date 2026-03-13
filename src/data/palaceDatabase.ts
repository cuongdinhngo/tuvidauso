export interface PalaceData {
  name: string;
  meaning: string;
  governs: string[];
}

export const PALACE_DATABASE: Record<string, PalaceData> = {
  'Mệnh': {
    name: 'Mệnh',
    meaning: 'Cung quan trọng nhất, quyết định tính cách, diện mạo, và xu hướng cuộc đời.',
    governs: ['Tính cách', 'Diện mạo', 'Tố chất bẩm sinh', 'Xu hướng cuộc đời'],
  },
  'Huynh Đệ': {
    name: 'Huynh Đệ',
    meaning: 'Quan hệ anh chị em, bạn bè thân, đồng nghiệp cùng cấp.',
    governs: ['Anh chị em', 'Bạn bè thân', 'Đồng nghiệp', 'Hợp tác'],
  },
  'Phu Thê': {
    name: 'Phu Thê',
    meaning: 'Hôn nhân, tình duyên, quan hệ vợ chồng.',
    governs: ['Hôn nhân', 'Tình duyên', 'Đối tác', 'Nửa kia'],
  },
  'Tử Tức': {
    name: 'Tử Tức',
    meaning: 'Con cái, hậu duệ, khả năng sinh sản.',
    governs: ['Con cái', 'Hậu duệ', 'Sinh sản', 'Giáo dục con'],
  },
  'Tài Bạch': {
    name: 'Tài Bạch',
    meaning: 'Tiền bạc, thu nhập, khả năng kiếm tiền.',
    governs: ['Tiền bạc', 'Thu nhập', 'Kiếm tiền', 'Đầu tư'],
  },
  'Tật Ách': {
    name: 'Tật Ách',
    meaning: 'Sức khỏe, bệnh tật, tai nạn.',
    governs: ['Sức khỏe', 'Bệnh tật', 'Tai nạn', 'Thể chất'],
  },
  'Thiên Di': {
    name: 'Thiên Di',
    meaning: 'Di chuyển, xuất ngoại, hoạt động bên ngoài, quan hệ xã hội.',
    governs: ['Di chuyển', 'Xuất ngoại', 'Quan hệ xã hội', 'Hoạt động ngoài'],
  },
  'Nô Bộc': {
    name: 'Nô Bộc',
    meaning: 'Bạn bè, cấp dưới, nhân viên, mối giao du.',
    governs: ['Bạn bè', 'Cấp dưới', 'Nhân viên', 'Giao du'],
  },
  'Quan Lộc': {
    name: 'Quan Lộc',
    meaning: 'Sự nghiệp, công danh, chức vụ, thành tựu nghề nghiệp.',
    governs: ['Sự nghiệp', 'Công danh', 'Chức vụ', 'Nghề nghiệp'],
  },
  'Điền Trạch': {
    name: 'Điền Trạch',
    meaning: 'Nhà cửa, bất động sản, tài sản cố định.',
    governs: ['Nhà cửa', 'Bất động sản', 'Tài sản cố định', 'Gia đình'],
  },
  'Phúc Đức': {
    name: 'Phúc Đức',
    meaning: 'Phúc đức tổ tiên, phúc phận, đời sống tinh thần.',
    governs: ['Phúc đức', 'Tổ tiên', 'Tinh thần', 'Tâm linh'],
  },
  'Phụ Mẫu': {
    name: 'Phụ Mẫu',
    meaning: 'Cha mẹ, học vấn, ấn tín, giấy tờ.',
    governs: ['Cha mẹ', 'Học vấn', 'Ấn tín', 'Giấy tờ'],
  },
};
