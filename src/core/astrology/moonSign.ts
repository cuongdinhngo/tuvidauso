import type { ZodiacSign, MoonSignResult } from './types';
import { ZODIAC_SIGNS } from '../../data/zodiacData';

const ZODIAC_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

/**
 * Chuyển đổi ngày Dương lịch → Julian Day Number
 */
export function gregorianToJD(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

/**
 * Thuật toán rút gọn Jean Meeus (Astronomical Algorithms, Chapter 47)
 * Tính longitude Mặt Trăng tại 0h UTC ngày đã cho.
 * Sai số ~1-2° — đủ chính xác cho Moon Sign.
 */
export function approximateMoonLongitude(year: number, month: number, day: number): number {
  const jd = gregorianToJD(year, month, day);
  const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000

  // Mean longitude
  const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;

  // Mean anomaly
  const M = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;

  // Mean elongation
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;

  // Argument of latitude
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;

  // Sun's mean anomaly
  const Ms = 357.5291092 + 35999.0502909 * T;

  // Convert to radians for trig
  const Mr = toRad(M);
  const Dr = toRad(D);
  const Fr = toRad(F);
  const Msr = toRad(Ms);

  // Corrections (simplified — top 10 terms from Meeus)
  let longitude = L0
    + 6.288774 * Math.sin(Mr)
    + 1.274027 * Math.sin(2 * Dr - Mr)
    + 0.658314 * Math.sin(2 * Dr)
    + 0.213618 * Math.sin(2 * Mr)
    - 0.185116 * Math.sin(Msr)
    - 0.114332 * Math.sin(2 * Fr)
    + 0.058793 * Math.sin(2 * (Dr - Mr))
    + 0.057066 * Math.sin(2 * Dr - Msr - Mr)
    + 0.053322 * Math.sin(2 * Dr + Mr)
    + 0.045758 * Math.sin(2 * Dr - Msr);

  return ((longitude % 360) + 360) % 360;
}

/**
 * Chuyển đổi index giờ Địa Chi (0-11) → giờ thực (midpoint).
 * Tý (0) = 00:00, Sửu (1) = 02:00, Dần (2) = 04:00, ...
 */
export function diaChiToHour(hourIndex: number): number {
  return (hourIndex * 2) % 24;
}

/**
 * Tính Moon Sign từ ngày giờ sinh.
 * Mặt Trăng di chuyển ~13°/ngày, đổi cung mỗi ~2.5 ngày.
 */
export function getMoonSign(
  year: number, month: number, day: number,
  hour: number, minute: number,
  timezone: number,
): MoonSignResult {
  // 1. Convert local time to actual UTC date/time (handles day rollover)
  // Use Date.UTC to avoid dependency on JS runtime timezone
  const utcHourRaw = hour - timezone + minute / 60;
  const utcMs = Date.UTC(year, month - 1, day) + utcHourRaw * 3600000;
  const utcDate = new Date(utcMs);

  const utcYear = utcDate.getUTCFullYear();
  const utcMonth = utcDate.getUTCMonth() + 1;
  const utcDay = utcDate.getUTCDate();
  const fraction = (utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60) / 24;

  // 2. Longitude Mặt Trăng đầu ngày UTC
  const startLong = approximateMoonLongitude(utcYear, utcMonth, utcDay);

  // 3. Longitude Mặt Trăng ngày tiếp theo (0h UTC)
  const nextDate = new Date(utcYear, utcMonth - 1, utcDay + 1);
  const endLong = approximateMoonLongitude(
    nextDate.getFullYear(),
    nextDate.getMonth() + 1,
    nextDate.getDate(),
  );

  // 4. Xử lý trường hợp longitude vượt 360° (Pisces → Aries)
  let longitude: number;
  if (Math.abs(endLong - startLong) > 180) {
    const adjustedEnd = endLong < startLong ? endLong + 360 : endLong;
    longitude = (startLong + (adjustedEnd - startLong) * fraction) % 360;
  } else {
    longitude = startLong + (endLong - startLong) * fraction;
  }
  longitude = ((longitude % 360) + 360) % 360;

  // 5. Convert longitude → sign
  const signIndex = Math.floor(longitude / 30);
  const degree = longitude % 30;

  return {
    sign: ZODIAC_SIGNS[ZODIAC_ORDER[signIndex]],
    degree,
  };
}
