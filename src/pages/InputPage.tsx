import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useTuViStore } from '../store/tuViStore';
import { solarToLunar } from '../core/calendar/solarToLunar';
import { DIA_CHI_HOURS } from '../core/types';
import type { BirthInfo } from '../core/types';
import { VIETNAM_CITIES } from '../data/vietnamCities';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';

const fieldClass =
  'w-full bg-surface border border-white/10 rounded-md px-3 py-2 min-h-[44px] text-ink ' +
  'focus:border-gold focus:outline-none transition-colors';
const labelClass = 'block text-sm text-ink-muted mb-1';

export default function InputPage() {
  const navigate = useNavigate();
  const calculate = useTuViStore((s) => s.calculate);
  const error = useTuViStore((s) => s.error);

  const [name, setName] = useState('');
  const [day, setDay] = useState<number | ''>('');
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');
  const [hour, setHour] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unknownHour, setUnknownHour] = useState(false);
  const [birthplaceIndex, setBirthplaceIndex] = useState<number | ''>('');
  const [unknownBirthplace, setUnknownBirthplace] = useState(true);

  // Real-time lunar preview
  const preview = useMemo(() => {
    if (year === '' || month === '' || day === '') return null;
    try {
      return solarToLunar(year, month, day);
    } catch {
      return null;
    }
  }, [year, month, day]);

  const CON_GIAP: Record<string, string> = {
    'Tý': 'Chuột', 'Sửu': 'Trâu', 'Dần': 'Hổ', 'Mão': 'Mèo',
    'Thìn': 'Rồng', 'Tị': 'Rắn', 'Ngọ': 'Ngựa', 'Mùi': 'Dê',
    'Thân': 'Khỉ', 'Dậu': 'Gà', 'Tuất': 'Chó', 'Hợi': 'Lợn',
  };

  const isFutureDate = useMemo(() => {
    if (year === '' || month === '' || day === '') return false;
    const selected = new Date(year, (month as number) - 1, day as number);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today;
  }, [year, month, day]);

  const isComplete = day !== '' && month !== '' && year !== '' && (unknownHour || hour !== '') && !isFutureDate;

  function handleSubmit() {
    if (!isComplete) return;
    const selectedCity = !unknownBirthplace && birthplaceIndex !== '' ? VIETNAM_CITIES[birthplaceIndex] : undefined;
    const info: BirthInfo = {
      name: name || undefined,
      solarDate: { year: year as number, month: month as number, day: day as number },
      hour: unknownHour ? 0 : hour as number,
      unknownHour: unknownHour || undefined,
      gender,
      birthplace: selectedCity ? { name: selectedCity.name, lat: selectedCity.lat, lng: selectedCity.lng } : undefined,
    };
    calculate(info);
    navigate('/result');
  }

  const daysInMonth = (year !== '' && month !== '') ? new Date(year, month, 0).getDate() : 31;

  return (
    <div className="stagger-in max-w-lg mx-auto px-4 py-8">
      <div style={{ ['--i' as string]: 0 }} className="text-center mb-8">
        <Sparkles className="w-10 h-10 text-gold mx-auto mb-2" />
        <h1 className="font-display text-2xl font-bold text-ink">Lập Lá Số Tử Vi</h1>
      </div>

      <div style={{ ['--i' as string]: 1 }} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="f-name" className={labelClass}>Họ tên (tùy chọn)</label>
          <input
            id="f-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${fieldClass} placeholder-ink-muted/60`}
            placeholder="Nhập họ tên đầy đủ để xem Thần Số Học"
          />
        </div>

        {/* Date of birth */}
        <div>
          <label className={labelClass}>Ngày sinh (Dương lịch)</label>
          <div className="grid grid-cols-3 gap-2">
            <select value={day} onChange={(e) => setDay(Number(e.target.value))} className={fieldClass} aria-label="Ngày">
              <option value="" disabled>Chọn ngày</option>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>Ngày {d}</option>
              ))}
            </select>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={fieldClass} aria-label="Tháng">
              <option value="" disabled>Chọn tháng</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={fieldClass} aria-label="Năm">
              <option value="" disabled>Chọn năm</option>
              {Array.from({ length: new Date().getFullYear() - 1939 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Birth hour */}
        <div>
          <label htmlFor="f-hour" className={labelClass}>Giờ sinh</label>
          {!unknownHour && (
            <select id="f-hour" value={hour} onChange={(e) => setHour(Number(e.target.value))} className={fieldClass}>
              <option value="" disabled>Chọn giờ</option>
              {DIA_CHI_HOURS.map((h, i) => (
                <option key={i} value={i}>{h.name} ({h.time})</option>
              ))}
            </select>
          )}
          <label className="flex items-center gap-2 mt-2 text-sm text-ink-muted cursor-pointer">
            <input
              type="checkbox"
              checked={unknownHour}
              onChange={(e) => setUnknownHour(e.target.checked)}
              className="rounded border-white/25 accent-gold"
            />
            Không biết giờ sinh
          </label>
        </div>

        {/* Gender */}
        <div>
          <label className={labelClass}>Giới tính</label>
          <div className="flex gap-4">
            {(['male', 'female'] as const).map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === g}
                  onChange={() => setGender(g)}
                  className="accent-gold"
                />
                <span className="text-ink">{g === 'male' ? 'Nam' : 'Nữ'}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Birthplace */}
        <div>
          <label htmlFor="f-place" className={labelClass}>Nơi sinh (cho Rising Sign)</label>
          {!unknownBirthplace && (
            <select id="f-place" value={birthplaceIndex} onChange={(e) => setBirthplaceIndex(Number(e.target.value))} className={fieldClass}>
              <option value="" disabled>Chọn tỉnh/thành</option>
              {VIETNAM_CITIES.map((city, i) => (
                <option key={city.name} value={i}>{city.name}</option>
              ))}
            </select>
          )}
          <label className="flex items-center gap-2 mt-2 text-sm text-ink-muted cursor-pointer">
            <input
              type="checkbox"
              checked={unknownBirthplace}
              onChange={(e) => setUnknownBirthplace(e.target.checked)}
              className="rounded border-white/25 accent-gold"
            />
            Không biết / không cần Rising Sign
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <Card>
            <h3 className="font-display text-sm font-semibold text-gold mb-2">Thông tin âm lịch</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-ink-muted">Ngày âm lịch:</span>
              <span className="text-ink">
                {preview.day}/{preview.month < 10 ? '0' : ''}{preview.month}/{preview.yearCan} {preview.yearChi}
                {preview.isLeapMonth && ' (nhuận)'}
              </span>
              <span className="text-ink-muted">Con giáp:</span>
              <span className="text-ink">{preview.yearChi} ({CON_GIAP[preview.yearChi]})</span>
              <span className="text-ink-muted">Nạp âm:</span>
              <span className="text-ink">{preview.napAm}</span>
            </div>
          </Card>
        )}

        {/* Future date error */}
        {isFutureDate && (
          <div className="bg-bad/15 border border-bad/40 rounded-md p-3 text-bad text-sm">
            Ngày sinh không thể là ngày trong tương lai.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-bad/15 border border-bad/40 rounded-md p-3 text-bad text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button onClick={handleSubmit} disabled={!isComplete} className="w-full">
          <Sparkles className="w-5 h-5" />
          Lập Lá Số
        </Button>
      </div>
    </div>
  );
}
