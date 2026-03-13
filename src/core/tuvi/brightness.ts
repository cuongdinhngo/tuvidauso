import type { BrightnessLevel } from '../types';

/**
 * Brightness levels for 14 main stars at each of the 12 positions.
 * Mieu > Vuong > Dac > Binh > Ham
 *
 * This table follows the mainstream/Northern school (Bac phai).
 * Key = star name, Value = Record<Dia Chi, BrightnessLevel>
 */
const BRIGHTNESS_TABLE: Record<string, Record<string, BrightnessLevel>> = {
  'Tử Vi': {
    'Tý': 'Vượng', 'Sửu': 'Đắc', 'Dần': 'Miếu', 'Mão': 'Đắc',
    'Thìn': 'Đắc', 'Tị': 'Miếu', 'Ngọ': 'Miếu', 'Mùi': 'Miếu',
    'Thân': 'Đắc', 'Dậu': 'Bình', 'Tuất': 'Đắc', 'Hợi': 'Đắc',
  },
  'Thiên Cơ': {
    'Tý': 'Miếu', 'Sửu': 'Hãm', 'Dần': 'Miếu', 'Mão': 'Miếu',
    'Thìn': 'Vượng', 'Tị': 'Bình', 'Ngọ': 'Đắc', 'Mùi': 'Hãm',
    'Thân': 'Đắc', 'Dậu': 'Miếu', 'Tuất': 'Vượng', 'Hợi': 'Đắc',
  },
  'Thái Dương': {
    'Tý': 'Hãm', 'Sửu': 'Hãm', 'Dần': 'Vượng', 'Mão': 'Miếu',
    'Thìn': 'Vượng', 'Tị': 'Miếu', 'Ngọ': 'Miếu', 'Mùi': 'Đắc',
    'Thân': 'Đắc', 'Dậu': 'Bình', 'Tuất': 'Hãm', 'Hợi': 'Hãm',
  },
  'Vũ Khúc': {
    'Tý': 'Vượng', 'Sửu': 'Miếu', 'Dần': 'Đắc', 'Mão': 'Bình',
    'Thìn': 'Miếu', 'Tị': 'Đắc', 'Ngọ': 'Vượng', 'Mùi': 'Miếu',
    'Thân': 'Miếu', 'Dậu': 'Đắc', 'Tuất': 'Miếu', 'Hợi': 'Bình',
  },
  'Thiên Đồng': {
    'Tý': 'Đắc', 'Sửu': 'Hãm', 'Dần': 'Miếu', 'Mão': 'Đắc',
    'Thìn': 'Bình', 'Tị': 'Miếu', 'Ngọ': 'Hãm', 'Mùi': 'Hãm',
    'Thân': 'Đắc', 'Dậu': 'Bình', 'Tuất': 'Bình', 'Hợi': 'Miếu',
  },
  'Liêm Trinh': {
    'Tý': 'Bình', 'Sửu': 'Miếu', 'Dần': 'Miếu', 'Mão': 'Hãm',
    'Thìn': 'Đắc', 'Tị': 'Hãm', 'Ngọ': 'Bình', 'Mùi': 'Miếu',
    'Thân': 'Miếu', 'Dậu': 'Hãm', 'Tuất': 'Đắc', 'Hợi': 'Hãm',
  },
  'Thiên Phủ': {
    'Tý': 'Đắc', 'Sửu': 'Miếu', 'Dần': 'Miếu', 'Mão': 'Đắc',
    'Thìn': 'Miếu', 'Tị': 'Miếu', 'Ngọ': 'Miếu', 'Mùi': 'Đắc',
    'Thân': 'Đắc', 'Dậu': 'Miếu', 'Tuất': 'Miếu', 'Hợi': 'Vượng',
  },
  'Thái Âm': {
    'Tý': 'Miếu', 'Sửu': 'Miếu', 'Dần': 'Bình', 'Mão': 'Hãm',
    'Thìn': 'Hãm', 'Tị': 'Hãm', 'Ngọ': 'Hãm', 'Mùi': 'Bình',
    'Thân': 'Đắc', 'Dậu': 'Miếu', 'Tuất': 'Miếu', 'Hợi': 'Miếu',
  },
  'Tham Lang': {
    'Tý': 'Miếu', 'Sửu': 'Đắc', 'Dần': 'Miếu', 'Mão': 'Đắc',
    'Thìn': 'Vượng', 'Tị': 'Bình', 'Ngọ': 'Miếu', 'Mùi': 'Đắc',
    'Thân': 'Vượng', 'Dậu': 'Bình', 'Tuất': 'Miếu', 'Hợi': 'Bình',
  },
  'Cự Môn': {
    'Tý': 'Miếu', 'Sửu': 'Hãm', 'Dần': 'Miếu', 'Mão': 'Miếu',
    'Thìn': 'Đắc', 'Tị': 'Bình', 'Ngọ': 'Miếu', 'Mùi': 'Hãm',
    'Thân': 'Đắc', 'Dậu': 'Bình', 'Tuất': 'Đắc', 'Hợi': 'Bình',
  },
  'Thiên Tướng': {
    'Tý': 'Đắc', 'Sửu': 'Miếu', 'Dần': 'Miếu', 'Mão': 'Hãm',
    'Thìn': 'Đắc', 'Tị': 'Đắc', 'Ngọ': 'Đắc', 'Mùi': 'Miếu',
    'Thân': 'Miếu', 'Dậu': 'Hãm', 'Tuất': 'Đắc', 'Hợi': 'Bình',
  },
  'Thiên Lương': {
    'Tý': 'Miếu', 'Sửu': 'Đắc', 'Dần': 'Miếu', 'Mão': 'Đắc',
    'Thìn': 'Đắc', 'Tị': 'Miếu', 'Ngọ': 'Miếu', 'Mùi': 'Đắc',
    'Thân': 'Bình', 'Dậu': 'Đắc', 'Tuất': 'Hãm', 'Hợi': 'Miếu',
  },
  'Thất Sát': {
    'Tý': 'Miếu', 'Sửu': 'Miếu', 'Dần': 'Miếu', 'Mão': 'Bình',
    'Thìn': 'Đắc', 'Tị': 'Đắc', 'Ngọ': 'Miếu', 'Mùi': 'Miếu',
    'Thân': 'Miếu', 'Dậu': 'Bình', 'Tuất': 'Đắc', 'Hợi': 'Đắc',
  },
  'Phá Quân': {
    'Tý': 'Miếu', 'Sửu': 'Đắc', 'Dần': 'Bình', 'Mão': 'Hãm',
    'Thìn': 'Đắc', 'Tị': 'Miếu', 'Ngọ': 'Miếu', 'Mùi': 'Đắc',
    'Thân': 'Bình', 'Dậu': 'Hãm', 'Tuất': 'Đắc', 'Hợi': 'Miếu',
  },
};

/** Get brightness level for a star at a given position */
export function getBrightness(starName: string, position: string): BrightnessLevel {
  return BRIGHTNESS_TABLE[starName]?.[position] || '';
}
