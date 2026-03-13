import type { CategoryScore, CompatibilityResult, RelationType } from '../types/compare';
import { RELATION_WEIGHTS, getRatingLabel, scoreToRating } from '../../data/compareData';

export function buildCompatibilityResult(
  categories: CategoryScore[],
  relationType: RelationType
): CompatibilityResult {
  const weights = RELATION_WEIGHTS[relationType];
  const weightKeys = ['napAm', 'conGiap', 'cungMenh', 'cungLienQuan', 'tuHoa', 'batTu', 'tuanTriet'];

  // Weighted average
  let totalWeight = 0;
  let weightedSum = 0;
  for (let i = 0; i < categories.length && i < weightKeys.length; i++) {
    const w = weights[weightKeys[i]] || 0;
    weightedSum += categories[i].score * w;
    totalWeight += w;
  }
  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;

  // Extract strengths and challenges
  const strengths: string[] = [];
  const challenges: string[] = [];
  for (const cat of categories) {
    if (cat.score >= 75) {
      strengths.push(`${cat.name}: ${cat.analysis}`);
    }
    if (cat.score < 40) {
      challenges.push(`${cat.name}: ${cat.analysis}`);
    }
  }

  // Generate advice
  const advice = generateAdvice(categories, relationType);

  // Relation-specific analysis
  const relationSpecific = generateRelationSpecific(categories, relationType);

  return {
    overallScore,
    overallRating: scoreToRating(overallScore),
    ratingLabel: getRatingLabel(overallScore),
    categories,
    strengths,
    challenges,
    advice,
    relationSpecific,
  };
}

function generateAdvice(categories: CategoryScore[], relationType: RelationType): string[] {
  const advice: string[] = [];
  const weakCategories = categories.filter(c => c.score < 50);
  const strongCategories = categories.filter(c => c.score >= 75);

  if (weakCategories.some(c => c.name === 'Nạp Âm')) {
    advice.push('Nạp Âm tương khắc — cần tôn trọng sự khác biệt về bản chất, tránh áp đặt quan điểm.');
  }
  if (weakCategories.some(c => c.name === 'Con Giáp')) {
    advice.push('Con Giáp xung/hại — hạn chế tranh cãi khi nóng giận, nên nhường nhịn và lắng nghe.');
  }
  if (weakCategories.some(c => c.name.includes('Cung'))) {
    if (relationType === 'lover') {
      advice.push('Cung Phu Thê có thử thách — nên tăng cường giao tiếp, dành thời gian chất lượng bên nhau.');
    } else if (relationType === 'business') {
      advice.push('Cung Quan Lộc/Tài Bạch cần lưu ý — nên phân định rõ trách nhiệm và tài chính từ đầu.');
    }
  }
  if (weakCategories.some(c => c.name === 'Tứ Hóa Chéo')) {
    advice.push('Tứ Hóa chiếu chéo không thuận — cần kiên nhẫn, tránh đổ lỗi khi gặp khó khăn.');
  }

  if (strongCategories.length > 0) {
    advice.push(`Điểm mạnh lớn nhất là ${strongCategories[0].name} — hãy phát huy thế mạnh này.`);
  }

  if (advice.length === 0) {
    advice.push('Mối quan hệ ở mức trung bình — cần nỗ lực từ cả hai phía để phát triển.');
  }

  return advice;
}

function generateRelationSpecific(
  categories: CategoryScore[], relationType: RelationType
): Record<string, string> {
  const result: Record<string, string> = {};

  switch (relationType) {
    case 'lover':
      result['Phong cách yêu'] = 'Dựa trên cung Phu Thê, mỗi người có cách thể hiện tình yêu riêng. Hãy tìm hiểu ngôn ngữ tình yêu của đối phương.';
      result['Lời khuyên hôn nhân'] = categories.some(c => c.score >= 70)
        ? 'Nền tảng mối quan hệ tốt, thuận lợi cho hôn nhân nếu cả hai cùng nỗ lực.'
        : 'Cần thời gian tìm hiểu kỹ trước khi đưa ra quyết định lớn.';
      break;
    case 'business':
      result['Phân công vai trò'] = 'Nên phân định rõ ai phụ trách chiến lược, ai quản lý vận hành dựa trên thế mạnh mỗi người.';
      result['Lĩnh vực hợp tác'] = 'Xem xét Ngũ Hành chung để chọn lĩnh vực kinh doanh phù hợp.';
      break;
    case 'child':
      result['Cách nuôi dạy'] = 'Hiểu tính cách con qua lá số để điều chỉnh phương pháp giáo dục phù hợp.';
      result['Giao tiếp'] = 'Dựa trên cung Tử Tức và Phụ Mẫu, tìm cách kết nối phù hợp với con.';
      break;
    case 'parent':
      result['Hiểu cha mẹ'] = 'Cung Phụ Mẫu cho biết kỳ vọng và cách thể hiện tình thương của cha mẹ.';
      result['Giao tiếp'] = 'Kiên nhẫn lắng nghe, thể hiện sự tôn trọng dù có bất đồng quan điểm.';
      break;
    case 'sibling':
      result['Mối quan hệ'] = 'Cung Huynh Đệ phản ánh mối quan hệ anh chị em, sự hỗ trợ lẫn nhau.';
      break;
    case 'friend':
      result['Tình bạn'] = 'Cung Nô Bộc (Giao Hữu) thể hiện chất lượng tình bạn và sự tin tưởng.';
      break;
  }

  return result;
}
