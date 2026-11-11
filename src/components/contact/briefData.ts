import {
  CreditCard,
  Globe,
  Languages,
  LayoutDashboard,
  Lightbulb,
  Palette,
  PanelsTopLeft,
  Plug,
  Smartphone,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

/** [min, max] in weeks. Indicative only: tune these to how the team actually quotes. */
type Weeks = readonly [number, number];

export const PROJECT_TYPES = [
  { id: 'website', icon: Globe, weeks: [2, 4] },
  { id: 'webapp', icon: LayoutDashboard, weeks: [6, 10] },
  { id: 'mobile', icon: Smartphone, weeks: [8, 12] },
  { id: 'consulting', icon: Lightbulb, weeks: [1, 3] },
] as const satisfies readonly { id: string; icon: LucideIcon; weeks: Weeks }[];

export const FEATURES = [
  { id: 'accounts', icon: UserRound, weeks: [1, 1] },
  { id: 'payments', icon: CreditCard, weeks: [1, 2] },
  { id: 'backoffice', icon: PanelsTopLeft, weeks: [2, 3] },
  { id: 'integrations', icon: Plug, weeks: [1, 3] },
  { id: 'multilang', icon: Languages, weeks: [0, 1] },
  { id: 'design', icon: Palette, weeks: [1, 2] },
] as const satisfies readonly { id: string; icon: LucideIcon; weeks: Weeks }[];

export const TIMELINES = ['urgent', 'short', 'medium', 'flexible'] as const;
export const BUDGETS = ['lt5', 'from5to15', 'from15to40', 'gt40', 'unsure'] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]['id'];
export type Feature = (typeof FEATURES)[number]['id'];
export type Timeline = (typeof TIMELINES)[number];
export type Budget = (typeof BUDGETS)[number];

export interface Brief {
  type: ProjectType | null;
  features: Feature[];
  timeline: Timeline | null;
  budget: Budget | null;
}

export interface Estimate {
  min: number;
  max: number;
  /** 1 simple, 2 medium, 3 complex. */
  level: 1 | 2 | 3;
  /** The chosen deadline is shorter than the smallest estimate. */
  tight: boolean;
}

/** Weeks a deadline allows, used to flag briefs that will not fit. */
const TIMELINE_WEEKS: Record<Timeline, number> = {
  urgent: 4,
  short: 13,
  medium: 26,
  flexible: Infinity,
};

export function estimate({ type, features, timeline }: Brief): Estimate | null {
  const base = PROJECT_TYPES.find((p) => p.id === type);
  if (!base) return null;

  let [min, max] = base.weeks as Weeks;
  // Consulting has no build features, so extras do not stretch it
  if (type !== 'consulting') {
    for (const f of FEATURES) {
      if (features.includes(f.id)) {
        min += f.weeks[0];
        max += f.weeks[1];
      }
    }
  }

  const level = max <= 5 ? 1 : max <= 12 ? 2 : 3;
  const tight = timeline !== null && min > TIMELINE_WEEKS[timeline];
  return { min, max, level, tight };
}
