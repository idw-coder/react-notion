import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ItemProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  onIconClick?: (event: React.MouseEvent) => void;
  isActive?: boolean;
  trailingItem?: React.ReactElement;
  tags?: string[];
}

export function Item({
  label,
  onClick,
  onIconClick,
  icon: Icon,
  isActive = false,
  trailingItem,
  tags,
}: ItemProps) {
  const MAX_LABEL_LENGTH = 10;
  const displayLabel = label.length > MAX_LABEL_LENGTH
    ? `${label.slice(0, MAX_LABEL_LENGTH)}…`
    : label;
  return (
    <div
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full flex items-center flex-wrap text-muted-foreground font-medium',
        isActive && 'bg-neutral-200'
      )}
      onClick={onClick}
      role="button"
      style={{ paddingLeft: '12px' }}
    >
      <Icon
        onClick={onIconClick}
        className="shrink-0 w-[18px] h-[18px] mr-2 text-muted-foreground"
      />
      <span className="truncate flex-1 min-w-0" title={label}>{displayLabel}</span>
      {/* タグ表示 */}
        {/* {tags && tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )} */}

      {/* メニュー表示 */}
      {trailingItem}
    </div>
  );
}
