import {
  Anchor,
  Bell,
  Bug,
  Car,
  Cloud,
  Fish,
  FlaskConical,
  Hand,
  Heart,
  Leaf,
  Moon,
  Rocket,
  Snowflake,
  Star,
  Sun,
  Zap,
} from 'lucide-react';

import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

type IconComponent = ComponentType<LucideProps>;

interface SimpleIconProps {
  size?: number | string;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

function IconLira({ size = 20, className, ...props }: SimpleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <path
        d="M7 4v12.5c0 2.5 1.8 4.5 5 4.5s5-2 5-4.5M7 10h8M7 14h6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSoccer({ size = 20, className, ...props }: SimpleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 3.5 14.2 8H9.8L12 3.5ZM7.2 7.5l3 1-1.2 3.5-3.2-1.5 1.4-3ZM16.8 7.5l1.4 3-3.2 1.5-1.2-3.5 3-1ZM5.5 13.5l2.8 1.2.9 3.5-2.5 2-2.5-.9 1.3-5.8ZM18.5 13.5l1.3 5.8-2.5.9-2.5-2 .9-3.5 2.8-1.2ZM9.5 18h5l1 2.2H8.5L9.5 18Z" />
    </svg>
  );
}

const TILE_ICONS: IconComponent[] = [
  IconSoccer as IconComponent,
  Anchor,
  FlaskConical,
  Sun,
  Hand,
  Bug,
  Moon,
  Snowflake,
  IconLira as IconComponent,
  Car,
  Star,
  Heart,
  Cloud,
  Fish,
  Leaf,
  Rocket,
  Zap,
  Bell,
];

interface TileIconProps {
  value: number;
  size?: number;
  className?: string;
}

export function TileIcon({ value, size = 40, className }: TileIconProps) {
  const Icon = TILE_ICONS[value % TILE_ICONS.length] ?? Star;
  return <Icon size={size} className={className} aria-hidden />;
}

export const TILE_ICON_COUNT = TILE_ICONS.length;
