#!/usr/bin/env tsx
/**
 * Quick Check CLI — compute and display a full chart for a single birth case.
 *
 * Usage:
 *   npm run quickcheck -- --solar 1988-04-15 --hour 6 --gender male
 *   npx tsx tests/validation/quickCheck.ts --solar 1988-04-15 --hour 6 --gender male
 */

import { solarToLunar } from '../../src/core/calendar/solarToLunar.ts';
import { calculateFourPillars } from '../../src/core/battu/fourPillars.ts';
import { getMenhCung } from '../../src/core/tuvi/menhCung.ts';
import { getThanCung } from '../../src/core/tuvi/thanCung.ts';
import { getCuc } from '../../src/core/tuvi/cuc.ts';
import { placeMainStars } from '../../src/core/tuvi/mainStars.ts';
import { placeAuxStars } from '../../src/core/tuvi/auxStars.ts';
import { arrangePalaces } from '../../src/core/tuvi/twelvePalaces.ts';
import { getFourTransforms, getStarTransform } from '../../src/core/tuvi/fourTransforms.ts';
import { getBrightness } from '../../src/core/tuvi/brightness.ts';
import type { Star, Palace } from '../../src/core/types/index.ts';

const DIA_CHI_HOURS = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// ── ANSI colors ──
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

// ── Parse CLI args ──
function parseArgs(): { solarYear: number; solarMonth: number; solarDay: number; hourIndex: number; gender: 'male' | 'female' } {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
${BOLD}Quick Check — Tử Vi Chart Inspector${RESET}

Usage:
  npm run quickcheck -- --solar YYYY-MM-DD --hour N --gender male|female

Options:
  --solar    Solar birth date (YYYY-MM-DD)
  --hour     Hour index 0-11 (0=Tý, 1=Sửu, ..., 6=Ngọ, ..., 11=Hợi)
  --gender   male or female

Example:
  npm run quickcheck -- --solar 1988-04-15 --hour 6 --gender male
`);
    process.exit(0);
  }

  let solar = '', hour = -1, gender: 'male' | 'female' = 'male';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--solar' && args[i + 1]) solar = args[++i];
    else if (args[i] === '--hour' && args[i + 1]) hour = parseInt(args[++i]);
    else if (args[i] === '--gender' && args[i + 1]) gender = args[++i] as 'male' | 'female';
  }

  if (!solar || hour < 0 || hour > 11) {
    console.error('Error: --solar YYYY-MM-DD and --hour 0-11 are required.');
    process.exit(1);
  }

  const [y, m, d] = solar.split('-').map(Number);
  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) {
    console.error(`Error: Invalid date "${solar}". Use YYYY-MM-DD format.`);
    process.exit(1);
  }

  return { solarYear: y, solarMonth: m, solarDay: d, hourIndex: hour, gender };
}

// ── Main ──
const input = parseArgs();
const { solarYear, solarMonth, solarDay, hourIndex, gender } = input;

// Calendar
const lunar = solarToLunar(solarYear, solarMonth, solarDay);

// Four Pillars
const fourPillars = calculateFourPillars(solarYear, solarMonth, solarDay, hourIndex);

// Core chart
const menh = getMenhCung(lunar.month, hourIndex);
const than = getThanCung(lunar.month, hourIndex);
const cuc = getCuc(lunar.yearCan, menh);
const palacePositions = arrangePalaces(menh);

// Stars
const mainStarPositions = placeMainStars(cuc.value, lunar.day);
const auxStarPositions = placeAuxStars(lunar.yearCan, lunar.yearChi, lunar.month, lunar.day, hourIndex);
const tuHoa = getFourTransforms(lunar.yearCan);

// Build palaces with stars
const palaces: Palace[] = palacePositions.map((pp) => {
  const stars: Star[] = [];
  for (const ms of mainStarPositions) {
    if (ms.position === pp.position) {
      stars.push({
        name: ms.star,
        type: 'chinh',
        brightness: getBrightness(ms.star, pp.position),
        transform: getStarTransform(lunar.yearCan, ms.star) as any,
      });
    }
  }
  for (const as_ of auxStarPositions) {
    if (as_.position === pp.position) {
      stars.push({
        name: as_.star,
        type: 'phu',
        transform: getStarTransform(lunar.yearCan, as_.star) as any,
      });
    }
  }
  return { name: pp.palace, position: pp.position, stars };
});

// Find palace for a star
function findStarPalace(starName: string): string {
  for (const p of palaces) {
    if (p.stars.some(s => s.name === starName)) return `${p.name} (${p.position})`;
  }
  return '?';
}

// ── Output ──
const hourName = DIA_CHI_HOURS[hourIndex];
const genderVi = gender === 'male' ? 'Nam' : 'Nữ';
const leapTag = lunar.isLeapMonth ? ' [NHUẬN]' : '';

console.log(`
${BOLD}${CYAN}═══════════════════════════════════════════════════${RESET}
${BOLD}${CYAN}    KIỂM TRA NHANH — Kết quả Engine${RESET}
${BOLD}${CYAN}═══════════════════════════════════════════════════${RESET}
${BOLD}Dương lịch:${RESET}   ${solarDay}/${String(solarMonth).padStart(2, '0')}/${solarYear}
${BOLD}Âm lịch:${RESET}      ${lunar.day}/${String(lunar.month).padStart(2, '0')}/${lunar.yearCan} ${lunar.yearChi}${leapTag}
${BOLD}Nạp âm:${RESET}       ${lunar.napAm}
${BOLD}Giờ sinh:${RESET}     ${hourName} (${hourIndex})
${BOLD}Giới tính:${RESET}    ${genderVi}

${BOLD}${YELLOW}BÁT TỰ:${RESET}
  Năm:   ${fourPillars.year.can} ${fourPillars.year.chi}
  Tháng: ${fourPillars.month.can} ${fourPillars.month.chi}
  Ngày:  ${fourPillars.day.can} ${fourPillars.day.chi}
  Giờ:   ${fourPillars.hour.can} ${fourPillars.hour.chi}

${BOLD}${YELLOW}TỬ VI:${RESET}
  Mệnh:   ${GREEN}${menh}${RESET}
  Thân:    ${GREEN}${than}${RESET}
  Cục:     ${GREEN}${cuc.name} (${cuc.value})${RESET}

${BOLD}${YELLOW}TỨ HÓA (${lunar.yearCan}):${RESET}
  Hóa Lộc:   ${tuHoa.loc} → ${findStarPalace(tuHoa.loc)}
  Hóa Quyền: ${tuHoa.quyen} → ${findStarPalace(tuHoa.quyen)}
  Hóa Khoa:  ${tuHoa.khoa} → ${findStarPalace(tuHoa.khoa)}
  Hóa Kỵ:    ${tuHoa.ky} → ${findStarPalace(tuHoa.ky)}

${BOLD}${YELLOW}14 CHÍNH TINH:${RESET}`);

// Tu Vi system
const tuViStars = mainStarPositions.filter(s => s.system === 'tuViHe');
const thienPhuStars = mainStarPositions.filter(s => s.system === 'thienPhuHe');

const maxLen = Math.max(tuViStars.length, thienPhuStars.length);
for (let i = 0; i < maxLen; i++) {
  const left = tuViStars[i] ? `${tuViStars[i].star.padEnd(10)} → ${tuViStars[i].position}` : ''.padEnd(20);
  const right = thienPhuStars[i] ? `${thienPhuStars[i].star.padEnd(10)} → ${thienPhuStars[i].position}` : '';
  console.log(`  ${left.padEnd(24)}| ${right}`);
}

console.log(`\n${BOLD}${YELLOW}12 CUNG:${RESET}`);
for (const palace of palaces) {
  const mainStars = palace.stars.filter(s => s.type === 'chinh');
  const auxStars = palace.stars.filter(s => s.type !== 'chinh');

  const mainStr = mainStars.map(s => {
    let label = s.name;
    if (s.brightness) label += `[${s.brightness}]`;
    if (s.transform) label += `(${s.transform})`;
    return label;
  }).join(', ');

  const auxStr = auxStars.map(s => {
    let label = s.name;
    if (s.transform) label += `(${s.transform})`;
    return label;
  }).join(', ');

  const isMenh = palace.position === menh;
  const isThan = palace.position === than;
  const tag = isMenh && isThan ? ' ★命身' : isMenh ? ' ★命' : isThan ? ' ★身' : '';

  console.log(`  ${BOLD}${palace.name}${RESET} (${palace.position})${tag}`);
  if (mainStr) console.log(`    ${GREEN}Chính: ${mainStr}${RESET}`);
  if (auxStr) console.log(`    ${DIM}Phụ:   ${auxStr}${RESET}`);
}

const totalMain = palaces.reduce((sum, p) => sum + p.stars.filter(s => s.type === 'chinh').length, 0);
const totalAux = palaces.reduce((sum, p) => sum + p.stars.filter(s => s.type !== 'chinh').length, 0);

console.log(`
${BOLD}${CYAN}═══════════════════════════════════════════════════${RESET}
${DIM}Tổng: ${totalMain} chính tinh, ${totalAux} phụ tinh, ${palaces.length} cung${RESET}
${DIM}→ Đối chiếu kết quả trên với tuvilyso.net${RESET}
${BOLD}${CYAN}═══════════════════════════════════════════════════${RESET}
`);
