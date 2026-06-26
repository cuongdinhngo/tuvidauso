# DESIGN.md — tuvidauso

> Đọc file này ở đầu MỖI session refactor UI trước khi sửa bất cứ thứ gì.

## Direction
Cổ điển tân thời (modern mystical). Dark-first (khoá 1 theme, không lật sáng/tối giữa trang).
Sang, tĩnh, dễ đọc ở vùng dữ liệu.
(Muốn đổi sang thuần truyền thống giấy dó/mực tàu/đỏ-vàng thì chỉ sửa Color tokens bên dưới.)

## Hai vùng, hai bộ núm (design-taste-frontend dials)
- VỎ (HomePage, InputPage, header, footer, modal, AI shell): VARIANCE 4 / MOTION 3 / DENSITY 3.
- LÕI dữ liệu (TuViChart, CungDetail, LuanGiai, timeline, BatTu, compare grid, calendar grid,
  các tab ResultPage): VARIANCE 2 / MOTION 1 / DENSITY 7. Đây là "dense product UI" — bỏ
  qua phần thẩm mỹ marketing của skill, ưu tiên READABILITY tuyệt đối, KHÔNG animation,
  layout đối xứng.

## Color tokens
- bg/base:#0F1115  bg/surface:#171A21  bg/raised:#1F2430
- ink/primary:#ECECEC  ink/muted:#9AA0AB
- accent/gold:#D4AF37  accent/jade:#3FB6A8   (accent KHOÁ: chỉ gold + jade toàn app, KHÔNG tím)
- Ngũ hành (giữ ý nghĩa, chỉnh sắc cho nền tối):
  Kim #D9D2C5 · Mộc #5FB87A · Thủy #4F8FE0 · Hỏa #E0604F · Thổ #C9A24B
- state: good #5FB87A · warn #E0A23F · bad #E0604F

## Typography
- display: "Noto Serif" (self-host qua @fontsource/noto-serif, đủ dấu tiếng Việt) — dùng cho
  tiêu đề/heading vùng vỏ. Serif hợp lệ vì brand là tử vi/almanac truyền thống (heritage).
- body: "Be Vietnam Pro" (self-host qua @fontsource/be-vietnam-pro) — body + số/canchi.
- Import font ở src/main.tsx (KHÔNG <link> Google Fonts trong production).
- type scale: 12/14/16/20/28/40 — body thoáng, bảng số chặt.
- CẤM font generic Inter/Roboto/Arial.

## Spacing & radius
- scale 4px (giữ scale gốc Tailwind, 1=4px); radius: sm 6 / md 10 / lg 16;
  shadow tinh tế, không đổ bóng nặng.
- SHAPE LOCK: dùng đúng 1 hệ bo góc — card/panel = md(10); chip/badge = sm(6);
  nút bấm = md(10). Không trộn pill loè loẹt với vuông sắc.

## Component rules
- Card (vỏ): bg/surface, border 1px rgba(212,175,55,.12), radius md, shadow-card.
- Panel (lõi): bg/raised, viền mảnh rgba(255,255,255,.06), radius md, KHÔNG shadow nặng.
- Tab: underline accent/gold, không pill loè loẹt.
- Lá số (LÕI): bg/raised, viền mảnh, chữ sao cỡ ổn định theo độ sáng, KHÔNG animation,
  KHÔNG layout lệch. Tam hợp/đối cung = nền/viền sáng, KHÔNG màu chữ rực.
- Button: primary = nền gold + chữ tối (đủ tương phản), secondary = viền gold mờ, ghost = chữ mờ.

## Motion
Chỉ ở vỏ: page-load stagger nhẹ (CSS, transform/opacity), hover tinh tế.
Vùng dữ liệu: tắt motion. Mọi motion tôn trọng prefers-reduced-motion.

## A11y (cổng cuối: skill web-design-guidelines / Vercel)
Contrast >= 4.5:1; focus ring rõ (gold); touch target >= 44px; semantic HTML; reduced-motion.

## Quy tắc bất biến
- KHÔNG sửa src/core/, src/data/. 201 tests phải xanh.
- Token là nguồn sự thật duy nhất (tailwind.config.js + biến CSS index.css).
  Cấm hex/px hard-code rải rác trong component.
- KHÔNG em-dash (—) ở bất kỳ chuỗi UI nào. Dùng gạch nối thường (-).
- Refactor theo phase, build + test + commit sau mỗi phase.
