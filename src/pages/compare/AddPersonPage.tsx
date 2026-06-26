import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useCompareStore } from '../../store/compareStore';
import { solarToLunar } from '../../core/calendar/solarToLunar';
import { DIA_CHI_HOURS } from '../../core/types';
import type { BirthInfo } from '../../core/types';
import type { RelationType } from '../../core/types/compare';
import { RELATION_LABELS } from '../../data/compareData';

const CON_GIAP: Record<string, string> = {
  'Tý': 'Chuột', 'Sửu': 'Trâu', 'Dần': 'Hổ', 'Mão': 'Mèo',
  'Thìn': 'Rồng', 'Tị': 'Rắn', 'Ngọ': 'Ngựa', 'Mùi': 'Dê',
  'Thân': 'Khỉ', 'Dậu': 'Gà', 'Tuất': 'Chó', 'Hợi': 'Lợn',
};

const RELATION_OPTIONS: { value: RelationType; label: string }[] = [
  { value: 'lover', label: RELATION_LABELS.lover },
  { value: 'business', label: RELATION_LABELS.business },
  { value: 'child', label: RELATION_LABELS.child },
  { value: 'parent', label: RELATION_LABELS.parent },
  { value: 'sibling', label: RELATION_LABELS.sibling },
  { value: 'friend', label: RELATION_LABELS.friend },
];

export default function AddPersonPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMain = searchParams.get('main') === 'true';

  const { setMainProfile, addPerson, mainProfile } = useCompareStore();

  const [name, setName] = useState('');
  const [day, setDay] = useState<number | ''>('');
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');
  const [hour, setHour] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unknownHour, setUnknownHour] = useState(false);
  const [relationType, setRelationType] = useState<RelationType>('lover');
  const [error, setError] = useState('');

  const preview = useMemo(() => {
    if (year === '' || month === '' || day === '') return null;
    try {
      return solarToLunar(year, month, day);
    } catch {
      return null;
    }
  }, [year, month, day]);

  const isFutureDate = useMemo(() => {
    if (year === '' || month === '' || day === '') return false;
    const selected = new Date(year, (month as number) - 1, day as number);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today;
  }, [year, month, day]);

  const isComplete = name.trim() !== '' && day !== '' && month !== '' && year !== '' && (unknownHour || hour !== '') && !isFutureDate;
  const daysInMonth = (year !== '' && month !== '') ? new Date(year, month, 0).getDate() : 31;

  function handleSubmit() {
    if (!isComplete) return;
    setError('');

    const birthInfo: BirthInfo = {
      name: name.trim(),
      solarDate: { year: year as number, month: month as number, day: day as number },
      hour: unknownHour ? 0 : hour as number,
      gender,
    };

    try {
      if (isMain) {
        setMainProfile(name.trim(), birthInfo);
      } else {
        if (!mainProfile) {
          setError('Chưa có hồ sơ chính. Vui lòng thiết lập hồ sơ bản thân trước.');
          return;
        }
        addPerson(name.trim(), birthInfo, relationType);
      }
      navigate('/compare');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <UserPlus className="w-10 h-10 text-gold mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-gold">
          {isMain ? 'Hồ Sơ Bản Thân' : 'Thêm Người Mới'}
        </h1>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm text-ink-muted mb-1">Họ tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-ink focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            placeholder="Nhập họ tên…"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm text-ink-muted mb-1">Ngày sinh (Dương lịch)</label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-ink focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <option value="" disabled>Ngày</option>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>Ngày {d}</option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-ink focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <option value="" disabled>Tháng</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-ink focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <option value="" disabled>Năm</option>
              {Array.from({ length: new Date().getFullYear() - 1939 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hour */}
        <div>
          <label className="block text-sm text-ink-muted mb-1">Giờ sinh</label>
          {!unknownHour && (
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-ink focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
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
              className="rounded border-white/10"
            />
            Không biết giờ sinh
          </label>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm text-ink-muted mb-1">Giới tính</label>
          <div className="flex gap-4">
            {(['male', 'female'] as const).map(g => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} className="text-gold" />
                <span className="text-ink">{g === 'male' ? 'Nam' : 'Nữ'}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Relation type */}
        {!isMain && (
          <div>
            <label className="block text-sm text-ink-muted mb-1">Mối quan hệ</label>
            <select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value as RelationType)}
              className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-ink focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              {RELATION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Lunar preview */}
        {preview && (
          <div className="bg-surface border border-gold/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gold mb-2">Thông tin âm lịch</h3>
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
          </div>
        )}

        {/* Future date error */}
        {isFutureDate && (
          <div className="bg-bad/30 border border-bad rounded-lg p-3 text-bad text-sm">
            Ngày sinh không thể là ngày trong tương lai.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-bad/30 border border-bad rounded-lg p-3 text-bad text-sm">{error}</div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] font-semibold rounded-md transition-colors ${
            isComplete
              ? 'bg-gold text-base hover:bg-gold/90'
              : 'bg-raised text-ink-muted opacity-50 cursor-not-allowed'
          }`}
        >
          <UserPlus className="w-5 h-5" />
          {isMain ? 'Lưu Hồ Sơ' : 'Lưu & So Sánh'}
        </button>
      </div>
    </div>
  );
}
