import potholeClose from '@/assets/urbi/pothole-close.jpg';
import potholeStreet from '@/assets/urbi/pothole-street.jpg';
import urbiLogo from '@/assets/urbi-logo.svg';
import {
  Bell,
  Camera,
  Check,
  ChevronLeft,
  ClipboardList,
  Copy,
  Inbox,
  LayoutDashboard,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  Plus,
  Send,
  TrafficCone,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/*
 * Recreations of real Urbi screens (urbi-client), using its tokens:
 * brand #224FB4, canvas #EEF2F8, white borderless cards, the app's status
 * and priority colours, and its own copy. Decorative: hidden from assistive tech by the caller.
 */

type Status = 'submitted' | 'inAnalysis' | 'inProgress' | 'concluded';
type Priority = 'high' | 'medium' | 'low';

const statusStyles: Record<Status, string> = {
  submitted: 'bg-slate-100 text-slate-600',
  inAnalysis: 'bg-amber-50 text-amber-700',
  inProgress: 'bg-[#EEF3FF] text-[#224FB4]',
  concluded: 'bg-emerald-50 text-emerald-700',
};

const statusDots: Record<Status, string> = {
  submitted: 'bg-slate-400',
  inAnalysis: 'bg-amber-500',
  inProgress: 'bg-[#224FB4]',
  concluded: 'bg-emerald-500',
};

const priorityStyles: Record<Priority, string> = {
  high: 'bg-[#FEF2F2] text-[#C81E1E]',
  medium: 'bg-[#FFFBEB] text-[#92400E]',
  low: 'bg-slate-100 text-slate-600',
};

function StatusPill({ status }: { status: Status }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex w-max shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDots[status]}`} />
      {t(`home.urbi.mock.status.${status}`)}
    </span>
  );
}

function PriorityPill({ priority }: { priority: Priority }) {
  const { t } = useTranslation();
  return (
    <span
      className={`w-max shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${priorityStyles[priority]}`}
    >
      {t(`home.urbi.mock.priority.${priority}`)}
    </span>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-[268px] rounded-[2.6rem] border border-white/15 bg-slate-900 p-2.5 shadow-2xl shadow-blue-950/60">
      <div className="relative h-[520px] overflow-hidden rounded-[2.1rem] bg-[#EEF2F8] text-[#0F1D3E]">
        <div className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900" />
        <div className="h-full pt-9">{children}</div>
      </div>
    </div>
  );
}

function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  // Laid out at desktop width and scaled down as a whole on narrow screens, like a screenshot
  return (
    <div className="w-[520px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl shadow-blue-950/60 max-[560px]:[zoom:0.64] max-[380px]:[zoom:0.54]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-3 truncate rounded-md bg-white/5 px-3 py-0.5 font-mono text-[11px] text-white/50">
          {url}
        </span>
      </div>
      <div className="text-[#0F1D3E]">{children}</div>
    </div>
  );
}

function ScreenHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-4 pb-2">
      <ChevronLeft className="h-4 w-4 text-[#5E6B80]" />
      <span className="truncate text-[13px] font-bold">{children}</span>
    </div>
  );
}

/** Area/subject chip, in the default taxonomy's colour for "Buraco na via". */
function SubjectIcon({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg bg-[#f97316]/10 text-[#f97316] ${size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'}`}
    >
      <TrafficCone className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
    </span>
  );
}

/* 1 — Resident reports: the 3-step wizard (Localização → Categoria → Detalhes), on its last step */
export function ReportScreen() {
  const { t } = useTranslation();
  const m = 'home.urbi.mock.report';
  const steps = t(`${m}.steps`, { returnObjects: true }) as string[];

  return (
    <PhoneFrame>
      <ScreenHeader>{t(`${m}.header`)}</ScreenHeader>
      <div className="space-y-2 px-3.5">
        {/* Step indicator */}
        <div className="flex items-start px-1">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-start last:flex-none">
              <div className="flex min-w-[52px] flex-col items-center gap-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#224FB4] text-[10px] font-bold text-white">
                  {i < steps.length - 1 ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className="text-[9px] font-semibold text-[#224FB4]">{label}</span>
              </div>
              {i < steps.length - 1 && (
                <span className="mx-0.5 mt-2.5 h-0.5 flex-1 rounded bg-[#224FB4]" />
              )}
            </div>
          ))}
        </div>

        {/* Summary of the previous steps */}
        <div className="space-y-2 rounded-xl bg-white p-2.5">
          <div className="flex items-center gap-2">
            <SubjectIcon size="sm" />
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold">{t(`${m}.subject`)}</p>
              <p className="truncate text-[9px] text-[#5E6B80]">{t(`${m}.area`)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-slate-100 pt-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#224FB4]">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <p className="truncate text-[11px] font-bold">{t(`${m}.location`)}</p>
          </div>
        </div>

        {/* Possible duplicate nearby (never blocks, suggests supporting instead) */}
        <div className="urbi-duplicate rounded-xl border border-amber-200 bg-amber-50 p-2.5">
          <div className="flex items-start gap-1.5 text-[10.5px] leading-snug font-bold text-amber-900">
            <Copy className="mt-px h-3.5 w-3.5 shrink-0" />
            <span>{t(`${m}.duplicateTitle`)}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2 rounded-lg bg-white px-2 py-1.5">
            <div className="min-w-0">
              <p className="truncate font-mono text-[10px] font-semibold">
                {t(`${m}.duplicateRef`)}
              </p>
              <p className="truncate text-[9px] text-[#5E6B80]">{t(`${m}.duplicateMeta`)}</p>
            </div>
            <span className="shrink-0 rounded-md bg-[#224FB4] px-2 py-1 text-[9.5px] font-bold text-white">
              {t(`${m}.support`)}
            </span>
          </div>
        </div>

        {/* Photos */}
        <div>
          <p className="mb-1 text-[9px] font-bold tracking-wide text-[#5E6B80] uppercase">
            {t(`${m}.photos`)}
          </p>
          <div className="flex gap-1.5">
            {[potholeClose, potholeStreet].map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                className="h-14 w-14 rounded-lg object-cover"
              />
            ))}
            <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400">
              <Plus className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[10px] leading-relaxed text-[#0F1D3E]/80">
          {t(`${m}.description`)}
        </div>

        <div className="flex gap-1.5 pt-0.5">
          <span className="flex-1 rounded-xl bg-white py-2 text-center text-[11px] font-bold text-[#5E6B80]">
            {t(`${m}.back`)}
          </span>
          <span className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-[#224FB4] py-2 text-[11px] font-bold text-white shadow-md shadow-[#224FB4]/40">
            {t(`${m}.submit`)}
            <Send className="h-3 w-3" />
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}

const triageRows: { status: Status; priority: Priority | null; origin: number }[] = [
  { status: 'submitted', priority: null, origin: 0 },
  { status: 'inAnalysis', priority: 'medium', origin: 1 },
  { status: 'inProgress', priority: 'low', origin: 2 },
  { status: 'inProgress', priority: 'high', origin: 3 },
];

/* 2 — Back office: every channel in one list, triage of the new occurrence */
export function TriageScreen() {
  const { t } = useTranslation();
  const m = 'home.urbi.mock.triage';
  const rows = t(`${m}.rows`, { returnObjects: true }) as { ref: string; subject: string }[];
  const origins = t(`${m}.origins`, { returnObjects: true }) as string[];
  const navIcons = [LayoutDashboard, Inbox, MapIcon, Users, ClipboardList];

  return (
    <BrowserFrame url={t(`${m}.url`)}>
      <div className="flex h-[400px]">
        {/* Sidebar, in the app's primary → navy gradient */}
        <div className="flex w-12 shrink-0 flex-col items-center gap-2 bg-gradient-to-b from-[#224FB4] to-[#0D1B3E] py-3">
          <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1">
            <img src={urbiLogo} alt="" className="h-full w-full object-contain" />
          </span>
          {navIcons.map((Icon, i) => (
            <span
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${i === 1 ? 'bg-white/15 text-white' : 'text-white/50'}`}
            >
              <Icon className="h-4 w-4" />
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1 bg-[#EEF2F8] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[15px] font-extrabold">{t(`${m}.title`)}</p>
              <p className="truncate text-[10px] text-[#5E6B80]">{t(`${m}.subtitle`)}</p>
            </div>
            <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#C81E1E] ring-2 ring-[#EEF2F8]" />
            </span>
          </div>

          {/* Occurrence list: one white card, rows split by hairlines */}
          <div className="mt-3 overflow-hidden rounded-xl bg-white">
            <div className="grid grid-cols-[minmax(0,1fr)_68px_84px_54px] gap-2 border-b border-slate-100 bg-[#F8FAFF] px-3 py-1.5 text-[9px] font-bold tracking-wide text-[#5E6B80] uppercase">
              <span>{t(`${m}.columns.subject`)}</span>
              <span>{t(`${m}.columns.origin`)}</span>
              <span>{t(`${m}.columns.status`)}</span>
              <span>{t(`${m}.columns.priority`)}</span>
            </div>
            {rows.map((row, i) => {
              const meta = triageRows[i];
              return (
                <div
                  key={row.ref}
                  className={`grid grid-cols-[minmax(0,1fr)_68px_84px_54px] items-center gap-2 border-b border-slate-100 px-3 py-2 last:border-b-0 ${i === 0 ? 'bg-[#EEF3FF]/60' : ''}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold">{row.subject}</p>
                    <p className="font-mono text-[9px] text-[#5E6B80]">{row.ref}</p>
                  </div>
                  <span className="truncate rounded-md border border-slate-200 px-1.5 py-0.5 text-center text-[9.5px] font-medium text-[#5E6B80]">
                    {origins[meta.origin]}
                  </span>
                  <StatusPill status={meta.status} />
                  {meta.priority ? (
                    <PriorityPill priority={meta.priority} />
                  ) : (
                    <span className="text-[10px] text-slate-400">—</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Management panel of the selected occurrence */}
          <div className="absolute right-4 bottom-4 left-16 rounded-xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10">
            <div className="flex items-center gap-2">
              <SubjectIcon size="sm" />
              <p className="min-w-0 flex-1 truncate text-[11px] font-bold">{rows[0]?.subject}</p>
              <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[9.5px] font-semibold text-amber-700">
                {t(`${m}.duplicateBadge`)}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold tracking-wide text-[#5E6B80] uppercase">
                  {t(`${m}.priorityLabel`)}
                </p>
                <div className="mt-1 flex rounded-lg border border-slate-200 p-0.5">
                  {(['high', 'medium', 'low'] as const).map((p) => (
                    <span
                      key={p}
                      className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${p === 'high' ? 'bg-[#C81E1E] text-white' : 'text-[#5E6B80]'}`}
                    >
                      {t(`home.urbi.mock.priority.${p}`)}
                    </span>
                  ))}
                </div>
              </div>
              <span className="rounded-lg bg-[#224FB4] px-3 py-2 text-[10.5px] font-bold text-white">
                {t(`${m}.advance`)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* 3 — Field team: "O meu trabalho" on the phone, with the proof of resolution */
export function FieldScreen() {
  const { t } = useTranslation();
  const m = 'home.urbi.mock.field';
  const tabs = t(`${m}.tabs`, { returnObjects: true }) as string[];

  return (
    <PhoneFrame>
      <div className="space-y-2 px-3.5">
        <p className="px-0.5 text-[17px] font-extrabold">{t(`${m}.header`)}</p>
        <div className="flex gap-1.5">
          {tabs.map((tab, i) => (
            <span
              key={tab}
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${i === 0 ? 'bg-[#224FB4] text-white' : 'bg-white text-[#5E6B80]'}`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* The assigned job */}
        <div className="overflow-hidden rounded-xl bg-white">
          <img src={potholeStreet} alt="" loading="lazy" className="h-20 w-full object-cover" />
          <div className="space-y-1 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[9.5px] text-[#5E6B80]">{t(`${m}.ref`)}</span>
              <div className="flex gap-1">
                <PriorityPill priority="high" />
                <StatusPill status="inProgress" />
              </div>
            </div>
            <p className="text-[12px] font-bold">{t(`${m}.subject`)}</p>
            <p className="flex items-center gap-1 text-[10px] text-[#5E6B80]">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{t(`${m}.location`)}</span>
            </p>
            <p className="text-[10px] font-semibold text-[#C81E1E]">{t(`${m}.deadline`)}</p>
          </div>
        </div>

        {/* Records the team keeps on the job */}
        <div className="divide-y divide-slate-100 rounded-xl bg-white">
          <div className="flex items-center gap-2 px-2.5 py-2">
            <MessageSquare className="h-3.5 w-3.5 text-[#5E6B80]" />
            <span className="flex-1 text-[10.5px] font-semibold">{t(`${m}.notes`)}</span>
            <span className="text-[10px] text-[#5E6B80]">2</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-2">
            <ClipboardList className="h-3.5 w-3.5 text-[#5E6B80]" />
            <span className="flex-1 text-[10.5px] font-semibold">{t(`${m}.workSheet`)}</span>
            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
              {t(`${m}.workSheetStatus`)}
            </span>
          </div>
        </div>

        {/* Proof of resolution */}
        <div className="rounded-xl bg-white p-2.5">
          <p className="text-[10.5px] font-bold">{t(`${m}.proofTitle`)}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="urbi-proof flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#224FB4]/40 bg-[#EEF3FF] text-[#224FB4]">
              <Camera className="h-4 w-4" />
            </span>
            <p className="text-[9.5px] leading-snug text-[#5E6B80]">{t(`${m}.proofHint`)}</p>
          </div>
        </div>

        <span className="block rounded-xl bg-[#224FB4] py-2 text-center text-[11px] font-bold text-white shadow-md shadow-[#224FB4]/40">
          {t(`${m}.submitProof`)}
        </span>
      </div>
    </PhoneFrame>
  );
}

const followStatuses: Status[] = ['submitted', 'inAnalysis', 'inProgress', 'concluded'];

/* 4 — Resident follows the status history, reads the junta's reply and evaluates */
export function FollowScreen() {
  const { t } = useTranslation();
  const m = 'home.urbi.mock.follow';
  const times = t(`${m}.times`, { returnObjects: true }) as string[];

  return (
    <PhoneFrame>
      <ScreenHeader>{t(`${m}.header`)}</ScreenHeader>
      <div className="space-y-2 px-3.5">
        <div className="rounded-xl bg-white p-2.5">
          <div className="flex items-center gap-2">
            <SubjectIcon />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold">{t(`${m}.subject`)}</p>
              <p className="truncate text-[9.5px] text-[#5E6B80]">{t(`${m}.meta`)}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <StatusPill status="concluded" />
            <span className="text-[9.5px] font-semibold text-[#224FB4]">{t(`${m}.supports`)}</span>
          </div>
        </div>

        {/* Status history */}
        <div className="rounded-xl bg-white p-2.5">
          <p className="mb-2 text-[9px] font-bold tracking-wide text-[#5E6B80] uppercase">
            {t(`${m}.historyTitle`)}
          </p>
          <ol>
            {followStatuses.map((status, i) => (
              <li key={status} className="relative flex gap-2.5 pb-2 last:pb-0">
                {i < followStatuses.length - 1 && (
                  <span className="absolute top-4 left-[7px] h-full w-0.5 bg-slate-200" />
                )}
                <span
                  className={`relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${statusDots[status]}`}
                >
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </span>
                <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
                  <span className="text-[10.5px] font-semibold">
                    {t(`home.urbi.mock.status.${status}`)}
                  </span>
                  <span className="shrink-0 text-[9px] text-[#5E6B80]">{times[i]}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* The junta's reply */}
        <div className="rounded-xl bg-white p-2.5">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#224FB4] text-[8px] font-bold text-white">
              JF
            </span>
            <span className="text-[10px] font-bold">{t(`${m}.replyAuthor`)}</span>
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-[#0F1D3E]/80">{t(`${m}.reply`)}</p>
        </div>

        {/* Post-conclusion evaluation */}
        <div className="urbi-evaluate rounded-xl bg-[#224FB4] p-2.5 text-white">
          <p className="text-[11px] font-bold">{t(`${m}.evaluationTitle`)}</p>
          <p className="mt-0.5 text-[9.5px] leading-snug text-white/75">
            {t(`${m}.evaluationBody`)}
          </p>
          <span className="mt-2 block rounded-lg bg-white py-1.5 text-center text-[10.5px] font-bold text-[#224FB4]">
            {t(`${m}.evaluationCta`)}
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}

export const urbiScreens = [ReportScreen, TriageScreen, FieldScreen, FollowScreen];
