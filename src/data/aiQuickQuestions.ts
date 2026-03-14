export const NUMEROLOGY_QUICK_QUESTIONS = [
  'Phân tích kết hợp tất cả các số của tôi',
  'Nghề nào phù hợp nhất với bộ số của tôi?',
  'Năm cá nhân hiện tại nên làm gì?',
  'Tôi hợp với người Life Path nào?',
  'Nợ nghiệp ảnh hưởng thế nào?',
  'Tại sao tôi hay mâu thuẫn nội tâm?',
  'Đỉnh cao hiện tại nghĩa là gì?',
  'Phân tích biểu đồ Inclusion của tôi',
];

export const ASTROLOGY_QUICK_QUESTIONS = [
  'Phân tích Big 3 của tôi chi tiết',
  'Decan của tôi khác gì các decan khác?',
  'Tôi thu hút kiểu người nào?',
  'Rising ảnh hưởng sự nghiệp thế nào?',
  'Cung nào hợp nhất trong tình yêu?',
  'Nguyên tố chi phối tôi thế nào?',
  'Tại sao tôi mâu thuẫn nội tâm?',
  'Sức khỏe cần lưu ý gì?',
];

import type { RelationType } from '../core/types/compare';

export const COMPARE_QUICK_QUESTIONS: Record<RelationType, string[]> = {
  lover: [
    'Khi nào thời điểm tốt để kết hôn?',
    'Kiểu xung đột 2 người hay gặp?',
    'Làm sao giữ lửa tình yêu?',
    'Ai nên nhường nhịn hơn?',
  ],
  business: [
    'Ai nên quản lý tài chính?',
    'Lĩnh vực nào hợp tác tốt nhất?',
    'Rủi ro lớn nhất khi hợp tác?',
    'Nên bắt đầu hợp tác lúc nào?',
  ],
  child: [
    'Phong cách dạy con phù hợp?',
    'Con nên học ngành gì?',
    'Giai đoạn nào con cần mình nhất?',
    'Cách khuyến khích con phát triển?',
  ],
  parent: [
    'Cách giao tiếp hiệu quả với cha/mẹ?',
    'Cha/mẹ kỳ vọng gì ở mình?',
    'Cách cải thiện mối quan hệ?',
    'Tại sao hay mâu thuẫn?',
  ],
  sibling: [
    'Cách hỗ trợ nhau tốt nhất?',
    'Điểm giống nhau giữa 2 người?',
    'Nên hợp tác kinh doanh không?',
    'Cách xử lý bất đồng?',
  ],
  friend: [
    'Nên hợp tác công việc không?',
    'Điểm cần tránh khi làm việc chung?',
    'Tại sao 2 người thu hút nhau?',
    'Cách giữ tình bạn bền lâu?',
  ],
};

export const COMBINED_QUICK_QUESTIONS = [
  'Phân tích kết hợp cả 3 hệ thống',
  'Nghề nào được cả 3 hệ thống ủng hộ?',
  'Năm nay Đông và Tây nói gì?',
  'Tại sao tôi hay mâu thuẫn nội tâm? (cả 3 góc nhìn)',
  'Người phù hợp nhất theo cả 3 hệ thống?',
  'Sức khỏe: cả 3 hệ thống cảnh báo gì?',
  'Điểm mạnh lớn nhất mà cả 3 đồng ý?',
  'Điểm cần cải thiện mà cả 3 chỉ ra?',
];
