export const SUGGESTION_INSTRUCTION = `

Cuối cùng, LUÔN kết thúc response bằng ĐÚNG 3 câu hỏi gợi ý follow-up, format như sau:
[SUGGESTIONS]
1. (câu hỏi liên quan đến nội dung vừa phân tích)
2. (câu hỏi đào sâu hơn 1 điểm thú vị)
3. (câu hỏi về khía cạnh chưa được đề cập)
[/SUGGESTIONS]

Các câu hỏi phải NGẮN (dưới 40 ký tự), cụ thể, và liên quan trực tiếp đến nội dung vừa trả lời.`;
