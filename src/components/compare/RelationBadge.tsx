import type { RelationType } from '../../core/types/compare';

const RELATION_CONFIG: Record<RelationType, { label: string; color: string }> = {
  lover: { label: 'Tình duyên', color: 'bg-bad/50 text-bad border-bad/50' },
  business: { label: 'Kinh doanh', color: 'bg-thuy/50 text-thuy border-thuy/50' },
  child: { label: 'Con cái', color: 'bg-good/50 text-good border-good/50' },
  parent: { label: 'Cha mẹ', color: 'bg-warn/50 text-warn border-warn/50' },
  sibling: { label: 'Anh em', color: 'bg-gold/50 text-gold border-gold/50' },
  friend: { label: 'Bạn bè', color: 'bg-good/50 text-good border-good/50' },
};

interface RelationBadgeProps {
  type: RelationType;
}

export default function RelationBadge({ type }: RelationBadgeProps) {
  const config = RELATION_CONFIG[type];
  return (
    <span className={`inline-block shrink-0 whitespace-nowrap px-2 py-0.5 text-xs rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
}
