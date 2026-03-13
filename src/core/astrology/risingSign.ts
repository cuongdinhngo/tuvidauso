import type { ZodiacSign, RisingSignResult } from './types';
import { ZODIAC_SIGNS } from '../../data/zodiacData';
import { gregorianToJD } from './moonSign';

const ZODIAC_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

function toDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

/**
 * Rising Sign (Ascendant) = cung đang mọc ở đường chân trời phía Đông tại thời điểm sinh.
 * Phụ thuộc: giờ sinh + vĩ độ/kinh độ nơi sinh.
 * Ascendant thay đổi cung khoảng mỗi 2 giờ.
 */
export function getRisingSign(
  year: number, month: number, day: number,
  hour: number, minute: number,
  timezone: number,
  latitude: number,
  longitudeGeo: number,
): RisingSignResult {
  // 1. Tính Julian Day Number (tại thời điểm UTC)
  const utcHour = hour - timezone + minute / 60;
  const jd = gregorianToJD(year, month, day) + utcHour / 24;

  // 2. Tính Julian centuries từ J2000.0
  const T = (jd - 2451545.0) / 36525;

  // 3. Greenwich Mean Sidereal Time (GMST) tại 0h UTC
  // Meeus, Astronomical Algorithms, eq. 12.4
  const GMST0 = 280.46061837
    + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T
    - T * T * T / 38710000;

  // 4. Local Sidereal Time (LST) — thêm kinh độ
  let LST = ((GMST0 + longitudeGeo) % 360 + 360) % 360;

  // 5. Obliquity of the Ecliptic
  const obliquity = 23.4393 - 0.0130 * T;
  const oblRad = toRad(obliquity);
  const latRad = toRad(latitude);

  // 6. Tính Ascendant
  // Formula: tan(ASC) = cos(RAMC) / -(sin(RAMC) * cos(ε) + tan(φ) * sin(ε))
  const ramcRad = toRad(LST);

  const y = Math.cos(ramcRad);
  const x = -(Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad));

  let ascDeg = toDeg(Math.atan2(y, x));
  ascDeg = ((ascDeg % 360) + 360) % 360;

  // 7. Convert to sign
  const signIndex = Math.floor(ascDeg / 30);
  const degree = ascDeg % 30;

  return {
    sign: ZODIAC_SIGNS[ZODIAC_ORDER[signIndex % 12]],
    degree,
  };
}
