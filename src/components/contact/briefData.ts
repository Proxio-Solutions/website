import {
  BarChart3,
  Bell,
  Bot,
  CalendarClock,
  CreditCard,
  FileText,
  FolderUp,
  Globe,
  Languages,
  LayoutDashboard,
  Lightbulb,
  MapPin,
  MessagesSquare,
  Palette,
  PanelsTopLeft,
  Plug,
  ShoppingBag,
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
  { id: 'shop', icon: ShoppingBag, weeks: [2, 3] },
  { id: 'backoffice', icon: PanelsTopLeft, weeks: [2, 3] },
  { id: 'cms', icon: FileText, weeks: [1, 1] },
  { id: 'booking', icon: CalendarClock, weeks: [1, 2] },
  { id: 'notifications', icon: Bell, weeks: [0, 1] },
  { id: 'messaging', icon: MessagesSquare, weeks: [1, 2] },
  { id: 'maps', icon: MapPin, weeks: [1, 2] },
  { id: 'files', icon: FolderUp, weeks: [0, 1] },
  { id: 'reports', icon: BarChart3, weeks: [1, 2] },
  { id: 'ai', icon: Bot, weeks: [1, 3] },
  { id: 'integrations', icon: Plug, weeks: [1, 3] },
  { id: 'multilang', icon: Languages, weeks: [0, 1] },
  { id: 'design', icon: Palette, weeks: [1, 2] },
] as const satisfies readonly { id: string; icon: LucideIcon; weeks: Weeks }[];

/** The `custom` timeline opens a date field; the `custom` budget opens a free amount field. */
export const TIMELINES = ['urgent', 'short', 'medium', 'flexible', 'custom'] as const;
export const BUDGETS = ['lt5', 'from5to15', 'from15to40', 'gt40', 'unsure', 'custom'] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]['id'];
export type Feature = (typeof FEATURES)[number]['id'];
export type Timeline = (typeof TIMELINES)[number];
export type Budget = (typeof BUDGETS)[number];

export interface Brief {
  type: ProjectType | null;
  features: Feature[];
  timeline: Timeline | null;
  /** The deadline as `YYYY-MM-DD`, when the timeline is `custom`. */
  deadline: string;
  budget: Budget | null;
  /** What the visitor wrote, when the budget is `custom`. */
  budgetText: string;
}

/* Free deadline: a real date, from next week up to a few years ahead */

const DAY = 24 * 60 * 60 * 1000;
const DEADLINE_MIN_DAYS = 7;
export const DEADLINE_MAX_YEARS = 3;

const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** The range the date field allows, as `YYYY-MM-DD`. */
export function deadlineBounds(today = new Date()) {
  const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() + DEADLINE_MIN_DAYS);
  const max = new Date(today.getFullYear() + DEADLINE_MAX_YEARS, today.getMonth(), today.getDate());
  return { min: isoDate(min), max: isoDate(max) };
}

export type DeadlineError = 'empty' | 'invalid' | 'tooSoon' | 'tooFar';

/** Weeks from today to the deadline, or why the date cannot be used. */
export function checkDeadline(
  value: string,
  today = new Date(),
): { weeks: number } | { error: DeadlineError } {
  if (!value.trim()) return { error: 'empty' };
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return { error: 'invalid' };
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  // Rejects 2027-02-31 and the like, which Date would quietly roll over
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)
    return { error: 'invalid' };
  const { min, max } = deadlineBounds(today);
  if (value < min) return { error: 'tooSoon' };
  if (value > max) return { error: 'tooFar' };
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return { weeks: Math.round((date.getTime() - start.getTime()) / DAY / 7) };
}

/* Free budget: an amount or a range in euros, written the way people write it */

/** Below this nothing can be built; above it the visitor almost certainly mistyped. */
export const BUDGET_MIN = 500;
const BUDGET_MAX = 5_000_000;

export type BudgetError = 'empty' | 'invalid' | 'tooLow' | 'tooHigh' | 'range';

/** A number as typed: "12000", "12 000", "12.000", "12,000", "2,5" or "2.5". */
function parseAmount(raw: string): number {
  const digits = raw.replace(/\s/g, '');
  // Separators followed by exactly three digits group thousands; any other one is decimal
  if (/^\d{1,3}([.,]\d{3})+$/.test(digits)) return Number(digits.replace(/[.,]/g, ''));
  return Number(digits.replace(',', '.'));
}

const MULTIPLIERS: Record<string, number> = {
  k: 1_000,
  mil: 1_000,
  m: 1_000_000,
  milhão: 1_000_000,
  milhões: 1_000_000,
  million: 1_000_000,
  millions: 1_000_000,
};

const AMOUNT =
  /(\d{1,3}(?:[ .,]\d{3})+|\d+(?:[.,]\d+)?)\s*(k|mil|milhão|milhões|millions?|m)?(?![\p{L}\d])/gu;

/** Currency, connecting words ("entre … e …", "up to", "about") and separators. */
const FILLER =
  /€|(?<!\p{L})(?:eur|euros?|entre|de|e|a|até|cerca|aprox|aproximadamente|máx|máximo|between|and|to|from|up|about|around|max|maximum)(?!\p{L})|[~≈±\-–—/.,:+]/gu;

/**
 * Reads a budget written freely ("12 000 €", "8k", "10–20 mil", "entre 5 e 10 mil euros") into a
 * range in euros. Any other word makes it invalid, so "asdf" or "o mais barato possível" cannot
 * be sent as a budget, and neither can amounts no project could have.
 */
export function parseBudget(text: string): { min: number; max: number } | { error: BudgetError } {
  const value = text.trim().toLowerCase();
  if (!value) return { error: 'empty' };

  const matches = [...value.matchAll(AMOUNT)];
  if (matches.length === 0 || matches.length > 2) return { error: 'invalid' };
  const rest = value.replace(AMOUNT, ' ').replace(FILLER, ' ').trim();
  if (rest) return { error: 'invalid' };

  // In "10-20 mil" the unit written once applies to both numbers
  const units = matches.map((m) => m[2]);
  const shared = units[units.length - 1];
  const amounts = matches.map((m, i) => {
    const unit = units[i] ?? shared;
    return parseAmount(m[1]) * (unit ? MULTIPLIERS[unit] : 1);
  });
  if (amounts.some((n) => !Number.isFinite(n))) return { error: 'invalid' };

  const [min, max = min] = amounts;
  if (min > max) return { error: 'range' };
  if (min < BUDGET_MIN) return { error: 'tooLow' };
  if (max > BUDGET_MAX) return { error: 'tooHigh' };
  return { min, max };
}

/** "12 000 €" or "10 000 € – 20 000 €", in the reader's language. */
export function formatBudget({ min, max }: { min: number; max: number }, language: string) {
  const format = new Intl.NumberFormat(language === 'en' ? 'en-IE' : 'pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
  return min === max ? format.format(min) : `${format.format(min)} – ${format.format(max)}`;
}

/* Internal estimate */

export interface Estimate {
  min: number;
  max: number;
  /** 1 simple, 2 medium, 3 complex. */
  level: 1 | 2 | 3;
  /** The chosen deadline is shorter than the smallest estimate. */
  tight: boolean;
}

/** Weeks a deadline allows, used to flag briefs that will not fit. */
const TIMELINE_WEEKS: Record<Exclude<Timeline, 'custom'>, number> = {
  urgent: 4,
  short: 13,
  medium: 26,
  flexible: Infinity,
};

function weeksAllowed({ timeline, deadline }: Brief): number | null {
  if (timeline === null) return null;
  if (timeline !== 'custom') return TIMELINE_WEEKS[timeline];
  const result = checkDeadline(deadline);
  return 'weeks' in result ? result.weeks : null;
}

export function estimate(brief: Brief): Estimate | null {
  const { type, features } = brief;
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
  const allowed = weeksAllowed(brief);
  const tight = allowed !== null && min > allowed;
  return { min, max, level, tight };
}
