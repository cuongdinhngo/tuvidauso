import type { RelationType } from '../../core/types/compare';

const RELATION_CONFIG: Record<RelationType, { label: string; color: string }> = {
  lover: { label: 'Tình duyên', color: 'bg-pink-900/50 text-pink-300 border-pink-700/50' },
  business: { label: 'Kinh doanh', color: 'bg-blue-900/50 text-blue-300 border-blue-700/50' },
  child: { label: 'Con cái', color: 'bg-green-900/50 text-green-300 border-green-700/50' },
  parent: { label: 'Cha mẹ', color: 'bg-orange-900/50 text-orange-300 border-orange-700/50' },
  sibling: { label: 'Anh em', color: 'bg-purple-900/50 text-purple-300 border-purple-700/50' },
  friend: { label: 'Bạn bè', color: 'bg-teal-900/50 text-teal-300 border-teal-700/50' },
};

interface RelationBadgeProps {
  type: RelationType;
}

export default function RelationBadge({ type }: RelationBadgeProps) {
  const config = RELATION_CONFIG[type];
  return (
    <span className={`inline-block px-2 py-0.5 text-xs rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
}
