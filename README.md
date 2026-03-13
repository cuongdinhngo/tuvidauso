# Tử Vi Đẩu Số Online

Ứng dụng lập lá số Tử Vi Đẩu Số miễn phí — tính toán hoàn toàn trên trình duyệt, không cần máy chủ.

## Tính Năng

- **Chuyển đổi lịch** — Dương lịch sang Âm lịch (1900–2100), Thiên Can Địa Chi, Nạp Âm
- **Bát Tự (Tứ Trụ)** — Trụ Năm, Tháng, Ngày, Giờ với Tàng Can, Ngũ Hành, Thập Thần, Nhật Chủ phân tích, Đại Vận timeline
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
- **Lịch sử** — Lưu 5 lá số gần nhất (localStorage)
- **Xem trước Âm lịch** — Hiển thị ngay khi nhập ngày Dương lịch

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
│   ├── calendar/   # Chuyển đổi lịch, Can Chi, Tiết Khí
│   ├── battu/      # Bát Tự: Tứ Trụ, Ngũ Hành, Thập Thần, Đại Vận
│   ├── tuvi/       # Tử Vi: An sao, Tứ Hóa, Độ sáng, Đại/Tiểu Hạn,
│   │               # Tuần Triệt, Tam hợp, Đánh giá cung, 3-layer Tứ Hóa
│   └── types/      # TypeScript types & constants
├── data/           # Star database, palace meanings, 25 cách cục,
│                   # 210 interpretation rules, career/health maps
├── pages/          # HomePage, InputPage, ResultPage
├── components/
│   ├── tuvi/       # TuViChart, CungDetail, LuanGiaiTab, DaiHanTimeline,
│   │               # TieuHanCards, StarFilterBar, YearlyDetailPanel
│   ├── battu/      # BatTuTab (enhanced Bát Tự with element colors)
│   ├── layout/     # Header, Layout
│   └── shared/     # Tabs, ErrorBoundary
├── hooks/          # useStarFilter (star filter state)
├── store/          # Zustand store
└── App.tsx         # Router setup

tests/              # 49 tests across 6 files (calendar, bát tự, tử vi,
                    # tuần triệt, palace relations, integration)
```

## Giao Diện

Ứng dụng có 5 tab chính:

1. **Tổng Quan** — Thông tin cơ bản, Bát Tự mini, biểu đồ Ngũ Hành, Tứ Hóa với cung vị trí
2. **Lá Số** — Bảng 4×4 với 12 cung, lọc sao 4 chế độ, tam hợp/đối cung highlight, panel chi tiết cung với đánh giá sao
3. **Luận Giải** — 9 mục phân tích (Tính Cách, Sự Nghiệp, Tài Lộc, Tình Duyên, Sức Khỏe, Gia Đình, Cách Cục, Lời Khuyên), 210 quy tắc, tư vấn nghề nghiệp/sức khỏe
4. **Vận Hạn** — Timeline Đại Hạn clickable, Tiểu Hạn cards, Tứ Hóa 3 tầng (bản mệnh + đại hạn + lưu niên), chọn năm, nhận diện Song Kỵ/Song Lộc
5. **Bát Tự** — Tứ Trụ với màu Ngũ Hành, highlight Nhật Chủ, Tàng Can, Thập Thần, Đại Vận timeline

## Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Dev server (hot reload) |
| `npm run build` | TypeScript check + Vite build |
| `npm test` | Chạy 49 tests |
| `npm run preview` | Preview bản build |
| `npm run deploy` | Build + deploy GitHub Pages |
| `npm run lint` | ESLint |
| `npm run validate` | Full validation suite |
| `npm run quickcheck` | Quick chart check (CLI) |

## License

MIT
