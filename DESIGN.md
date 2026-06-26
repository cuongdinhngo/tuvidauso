# DESIGN.md — tuvidauso

> Đọc file này ở đầu MỖI session refactor UI trước khi sửa bất cứ thứ gì.

## Direction
Vũ trụ huyền bí (cosmic mystical). Trời đêm tím-chàm + sao vàng. "Tử Vi" = Sao Tím, nên
tím/chàm là màu nền chủ đạo (KHÔNG phải "AI purple slop" - tím sâu, trầm, dùng cho khí
quyển/glow, KHÔNG dùng làm nền nút). Gold là accent chính (sao + tương tác), jade phụ,
iris (thạch anh tím) cho glow. Vỏ giàu không khí (gradient nền, starfield, ring chiêm tinh,
glow tiết chế). Lõi dữ liệu vẫn tĩnh, đối xứng, dễ đọc.
(Muốn đổi hướng khác chỉ cần sửa Color tokens + nền body trong index.css.)

## Hai vùng, hai bộ núm (design-taste-frontend dials)
- VỎ (HomePage, InputPage, header, footer, modal, AI shell): VARIANCE 4 / MOTION 3 / DENSITY 3.
- LÕI dữ liệu (TuViChart, CungDetail, LuanGiai, timeline, BatTu, compare grid, calendar grid,
  các tab ResultPage): VARIANCE 2 / MOTION 1 / DENSITY 7. Đây là "dense product UI" — bỏ
  qua phần thẩm mỹ marketing của skill, ưu tiên READABILITY tuyệt đối, KHÔNG animation,
  layout đối xứng.

## Color tokens (cosmic night)
- bg/base:#0B0A14  bg/surface:#14121F  bg/raised:#1C1930  (tím-chàm rất tối)
- ink/primary:#ECEAF2  ink/muted:#9E98B0
- accent/gold:#E2B84A (chính)  accent/jade:#45C2B1 (phụ)  accent/iris:#8E80D8 (glow/tím sao)
- body có gradient khí quyển (radial tím + jade + gold rất mờ), background-attachment: fixed.
- Ngũ hành: Kim #D9D2C5 · Mộc #5FB87A · Thủy #5C97E6 · Hỏa #E0604F · Thổ #C9A24B
- state: good #5FB87A · warn #E0A23F · bad #E0604F
- shadow-glow: quầng vàng quanh CTA/medallion (tiết chế, chỉ ở vỏ).

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
