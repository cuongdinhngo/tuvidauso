# Tử Vi Đẩu Số Online

Ứng dụng lập lá số Tử Vi Đẩu Số miễn phí — tính toán hoàn toàn trên trình duyệt, không cần máy chủ.

## Tính Năng

### Tử Vi Đẩu Số
- **Chuyển đổi lịch** — Dương lịch sang Âm lịch (1900–2100), Thiên Can Địa Chi, Nạp Âm
- **14 Chính Tinh** — Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh, Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân
- **36 Phụ Tinh** — Lộc Tồn, Kình Dương, Đà La, Tả Phụ, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt, Hỏa Tinh, Linh Tinh, Đào Hoa, Hồng Loan, Thiên Mã, Cô Thần, Quả Tú, Thiên Hình, Thiên Riêu, và nhiều sao khác
- **Tứ Hóa 3 tầng** — Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ cho bản mệnh + đại hạn + lưu niên
- **Độ sáng** — Miếu, Vượng, Đắc, Bình, Hãm cho 14 chính tinh
- **Tuần Không & Triệt Lộ** — Vùng ảnh hưởng giảm lực các sao
- **Tam hợp / Đối cung / Giáp cung** — Phân tích quan hệ cung, sao chiếu
- **Đại Hạn & Tiểu Hạn** — Chu kỳ 10 năm, vận hạn hàng năm, Tứ Hóa đại hạn + lưu niên
- **210 quy tắc luận giải** — 14 sao × 5 cung × 3 cấp độ sáng, đánh giá cung 1-5 sao
- **25 cách cục** — Nhận diện cách cục đặc biệt (Tử Phủ Đồng Cung, Sát Phá Tham, Tam Kỳ Gia Hội, ...)
- **Lọc sao** — 4 chế độ hiển thị: tất cả, chính tinh, chính+cát+sát, tùy chọn

### Bát Tự (Tứ Trụ)
- **Tứ Trụ** — Trụ Năm, Tháng, Ngày, Giờ với Tàng Can, Ngũ Hành, Thập Thần, Nhật Chủ phân tích
- **Đại Vận** — Timeline đại vận với phân tích chi tiết

### Chiêm Tinh Phương Tây
- **Big 3** — Cung Mặt Trời, Mặt Trăng, Mệnh Chủ (Rising Sign)
- **12 cung Hoàng Đạo** — Nguyên tố, tính chất, đặc điểm, tương hợp
- **Hỗ trợ nơi sinh** — Tính Rising Sign dựa trên tọa độ thành phố Việt Nam

### Thần Số Học
- **Số Chủ Đạo (Life Path)** — Ý nghĩa và phân tích
- **Số Biểu Đạt (Expression)** — Phân tích từ tên đầy đủ
- **Số Năm Cá Nhân (Personal Year)** — Chu kỳ hàng năm 1-9
- **Cầu nối Đông-Tây** — Tích hợp Thần Số Học với Tử Vi/Bát Tự

### Lịch & Chọn Ngày Tốt
- **Hoàng Đạo** — Giờ hoàng đạo theo ngày
- **Sao 28 (Nhị Thập Bát Tú)** — 28 sao hàng ngày
- **12 Trực** — Giai đoạn ngày (Kiến, Trừ, Mãn, Bình, ...)
- **15 mục đích** — Cưới hỏi, khai trương, dọn nhà, động thổ, ...
- **Cá nhân hóa** — Đánh giá ngày dựa trên lá số cá nhân
- **Lịch tháng** — Tổng quan chất lượng ngày trong tháng

### Hợp Duyên (So Tuổi)
- **So sánh đa chiều** — Hoàng Đạo, Bát Tự, Mệnh cung, Nạp Âm, Tứ Hóa, Tuần/Triệt, quan hệ cung
- **Nhiều người** — So sánh và xếp hạng nhiều người cùng lúc
- **Mini lá số** — Lá số Tử Vi thu nhỏ cho so sánh trực quan

### Phân Tích AI
- **Đa nhà cung cấp** — OpenAI, Google Gemini, Anthropic Claude, Groq
- **Hội thoại** — Chat tới 10 lượt hỏi đáp
- **Gợi ý follow-up** — AI tự đề xuất 3 câu hỏi tiếp theo, hiển thị dạng nút bấm
- **Câu hỏi nhanh** — Câu hỏi gợi ý cho từng mục phân tích
- **Phân tích kết hợp** — AI tổng hợp Tử Vi + Bát Tự + Chiêm Tinh + Thần Số Học

### Tính Năng Chung
- **Lịch sử** — Lưu 10 lá số gần nhất (localStorage)
- **Xem trước Âm lịch** — Hiển thị ngay khi nhập ngày Dương lịch
- **Lazy loading** — Trang Lịch và Hợp Duyên tải theo yêu cầu

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Styling | TailwindCSS 3 |
| State | Zustand 5 |
| Routing | React Router 7 (HashRouter) |
| Testing | Vitest 4 |
| Deploy | GitHub Pages (gh-pages) |

## Bắt Đầu

```bash
# Clone
git clone https://github.com/cuong-ngo/tuvidauso.git
cd tuvidauso

# Cài đặt
npm install

# Chạy dev server
npm run dev

# Chạy tests
npm test

# Build production
npm run build

# Deploy lên GitHub Pages
npm run deploy
```

## Cấu Trúc Dự Án

```
src/
├── core/           # Engine tính toán (không phụ thuộc React)
│   ├── calendar/   # Chuyển đổi lịch, Can Chi, Tiết Khí, Hoàng Đạo,
│   │               # Sao 28, Trực, Chọn ngày tốt, Cá nhân hóa ngày
│   ├── battu/      # Bát Tự: Tứ Trụ, Ngũ Hành, Thập Thần, Đại Vận
│   ├── tuvi/       # Tử Vi: An sao, Tứ Hóa, Độ sáng, Đại/Tiểu Hạn,
│   │               # Tuần Triệt, Tam hợp, Đánh giá cung, 3-layer Tứ Hóa
│   ├── astrology/  # Chiêm tinh phương Tây: Sun/Moon/Rising sign
│   ├── numerology/ # Thần Số Học: Life Path, Expression, Personal Year
│   ├── compare/    # Hợp duyên: So sánh đa chiều, xếp hạng
│   ├── ai/         # AI: Multi-provider, prompts, conversation, suggestions
│   │   ├── prompts/    # Prompt templates (system, astrology, numerology, combined, suggestion instruction)
│   │   └── providers/  # Provider implementations (OpenAI, Google, Anthropic, Groq)
│   └── types/      # TypeScript types & constants
├── data/           # Star database, palace meanings, 25 cách cục,
│                   # 210 interpretation rules, zodiac data, numerology data,
│                   # calendar data, comparison data, AI quick questions
├── pages/
│   ├── HomePage.tsx        # Trang chủ + feature cards + lịch sử
│   ├── InputPage.tsx       # Form nhập thông tin
│   ├── ResultPage.tsx      # 8 tab kết quả
│   ├── calendar/           # Trang Lịch & Chọn Ngày Tốt
│   └── compare/            # Trang Hợp Duyên (ComparePage, AddPerson, Result, Ranking)
├── components/
│   ├── tuvi/       # TuViChart, CungDetail, LuanGiaiTab, DaiHanTimeline,
│   │               # TieuHanCards, StarFilterBar, YearlyDetailPanel
│   ├── battu/      # BatTuTab (Bát Tự với màu Ngũ Hành)
│   ├── astrology/  # ZodiacTab, Big3Card
│   ├── numerology/ # NumerologyTab
│   ├── combined/   # CombinedTab (phân tích kết hợp đa hệ thống)
│   ├── calendar/   # GoodDayPicker, MonthlyCalendar, DayDetail,
│   │               # HoangDaoGrid, TodayDigest
│   ├── compare/    # PersonCard, MiniTuViChart, CategoryBar,
│   │               # ScoreGauge, RelationBadge
│   ├── layout/     # Header, Layout
│   └── shared/     # Tabs, ErrorBoundary, AIAnalysisSection, AISettingsModal
├── utils/          # parseSuggestions (AI response parsing)
├── hooks/          # useStarFilter, useAIAnalysis
├── store/          # tuViStore, aiStore, calendarStore, compareStore
└── App.tsx         # Router setup (8 routes)

tests/              # 188 tests across 12 files (calendar, bát tự, tử vi,
                    # tuần triệt, palace relations, integration, astrology,
                    # numerology, compare, AI prompts, provider routing)
```

## Giao Diện

Ứng dụng có 8 tab kết quả chính:

1. **Tổng Quan** — Thông tin cơ bản, Bát Tự mini, biểu đồ Ngũ Hành, Tứ Hóa với cung vị trí
2. **Bát Tự** — Tứ Trụ với màu Ngũ Hành, highlight Nhật Chủ, Tàng Can, Thập Thần, Đại Vận timeline
3. **Lá Số** — Bảng 4×4 với 12 cung, lọc sao 4 chế độ, tam hợp/đối cung highlight, panel chi tiết cung với đánh giá sao
4. **Luận Giải** — 9 mục phân tích (Tính Cách, Sự Nghiệp, Tài Lộc, Tình Duyên, Sức Khỏe, Gia Đình, Cách Cục, Lời Khuyên), 210 quy tắc, tư vấn nghề nghiệp/sức khỏe
5. **Vận Hạn** — Timeline Đại Hạn clickable, Tiểu Hạn cards, Tứ Hóa 3 tầng (bản mệnh + đại hạn + lưu niên), chọn năm, nhận diện Song Kỵ/Song Lộc
6. **Số Học** — Số Chủ Đạo, Số Biểu Đạt, Số Năm Cá Nhân, phân tích AI chuyên sâu
7. **Chiêm Tinh** — Big 3 (Mặt Trời, Mặt Trăng, Mệnh Chủ), chi tiết cung Hoàng Đạo, tương hợp
8. **Kết Hợp** — Tổng hợp Tử Vi + Bát Tự + Chiêm Tinh + Thần Số Học, phân tích AI toàn diện

Ngoài ra có các trang riêng:
- **Lịch & Chọn Ngày Tốt** — Lịch tháng, giờ Hoàng Đạo, chọn ngày theo 15 mục đích, cá nhân hóa
- **Hợp Duyên** — So tuổi đa chiều, thêm nhiều người, xếp hạng tương hợp

## Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Dev server (hot reload) |
| `npm run build` | TypeScript check + Vite build |
| `npm test` | Chạy 188 tests |
| `npm run preview` | Preview bản build |
| `npm run deploy` | Build + deploy GitHub Pages |
| `npm run lint` | ESLint |
| `npm run validate` | Full validation suite |
| `npm run quickcheck` | Quick chart check (CLI) |

## License

MIT
