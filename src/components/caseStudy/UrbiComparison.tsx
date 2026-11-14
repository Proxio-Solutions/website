import BeforeAfter from '@components/motion/BeforeAfter';
import {
  Armchair,
  Bell,
  FileSpreadsheet,
  Lightbulb,
  Mail,
  MessageCircle,
  Phone,
  Ticket,
  TrafficCone,
  Trash2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const c = 'caseStudies.urbi.compare';

/* Before: the same issues scattered across notes, inboxes, posts and spreadsheets */
function BeforePanel() {
  const { t } = useTranslation();

  return (
    <div className="relative h-full w-full bg-[#efece6] [background-image:radial-gradient(rgb(15_23_42/0.06)_1px,transparent_1px)] [background-size:18px_18px]">
      {/* Phone call scribbled on a sticky note */}
      <div className="absolute top-[18%] left-[4%] w-[34%] max-w-[230px] -rotate-3 bg-[#fde68a] p-3 text-slate-800 shadow-md sm:p-4">
        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase opacity-70 sm:text-[11px]">
          <Phone className="h-3 w-3" />
          {t(`${c}.before.phoneMeta`)}
        </p>
        <p className="mt-1.5 text-xs leading-snug font-medium sm:text-sm">
          {t(`${c}.before.phone`)}
        </p>
      </div>

      {/* Email thread nobody owns */}
      <div className="absolute top-[10%] left-[34%] w-[36%] max-w-[280px] rotate-2 rounded-lg bg-white p-3 shadow-md sm:p-4">
        <p className="flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-xs">
          <Mail className="h-3.5 w-3.5" />
          {t(`${c}.before.emailMeta`)}
        </p>
        <p className="mt-1 truncate text-xs font-bold text-slate-800 sm:text-sm">
          {t(`${c}.before.email`)}
        </p>
        <span className="mt-2 inline-block -rotate-2 rounded border-2 border-red-500/80 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-red-600/90 uppercase sm:text-[10px]">
          {t(`${c}.before.noReply`)}
        </span>
      </div>

      {/* Complaint on social media */}
      <div className="absolute top-[46%] left-[46%] w-[36%] max-w-[270px] -rotate-2 rounded-lg bg-white p-3 shadow-md sm:p-4">
        <p className="flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-xs">
          <MessageCircle className="h-3.5 w-3.5" />
          {t(`${c}.before.socialMeta`)}
        </p>
        <p className="mt-1 text-xs leading-snug text-slate-800 sm:text-sm">
          {t(`${c}.before.social`)}
        </p>
        <span className="absolute -top-3 -right-2 rotate-6 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-white uppercase sm:text-[10px]">
          {t(`${c}.before.duplicate`)}
        </span>
      </div>

      {/* The spreadsheet everything ends up in */}
      <div className="absolute top-[60%] left-[5%] flex max-w-[40%] rotate-2 items-center gap-2 rounded-md border border-emerald-700/20 bg-white px-2.5 py-2 shadow-md">
        <FileSpreadsheet className="h-5 w-5 shrink-0 text-emerald-700" />
        <span className="truncate font-mono text-[10px] text-slate-700 sm:text-xs">
          {t(`${c}.before.sheet`)}
        </span>
      </div>

      {/* Paper ticket from the front desk */}
      <div className="absolute top-[77%] left-[16%] -rotate-6 rounded-md border border-dashed border-slate-400 bg-white px-3 py-2 shadow-md">
        <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 sm:text-xs">
          <Ticket className="h-3.5 w-3.5" />
          {t(`${c}.before.counter`)}
        </p>
        <p className="text-[9px] text-slate-500 sm:text-[11px]">{t(`${c}.before.counterMeta`)}</p>
      </div>
    </div>
  );
}

type Status = 'inAnalysis' | 'inProgress' | 'concluded';

const statusStyles: Record<Status, string> = {
  inAnalysis: 'bg-amber-50 text-amber-700',
  inProgress: 'bg-[#EEF3FF] text-[#224FB4]',
  concluded: 'bg-emerald-50 text-emerald-700',
};

const afterRows = [
  { icon: TrafficCone, color: '#f97316', status: 'inAnalysis' },
  { icon: Lightbulb, color: '#eab308', status: 'inProgress' },
  { icon: Trash2, color: '#22c55e', status: 'inProgress' },
  { icon: Armchair, color: '#6366f1', status: 'concluded' },
] as const;

/* After: one list in the Urbi back office, every issue with an origin, a status and an owner */
function AfterPanel() {
  const { t } = useTranslation();
  const rows = t(`${c}.after.rows`, { returnObjects: true }) as {
    subject: string;
    ref: string;
    origin: string;
  }[];

  return (
    <div className="relative flex h-full w-full flex-col items-end justify-center bg-[#EEF2F8] px-[4%] pt-10 text-[#0F1D3E] sm:pt-0">
      <div className="w-[60%] sm:w-[58%]">
        <p className="text-base font-extrabold sm:text-xl">{t(`${c}.after.title`)}</p>
        <p className="hidden text-xs text-[#5E6B80] sm:block">{t(`${c}.after.subtitle`)}</p>
      </div>

      <div className="mt-3 w-[60%] divide-y divide-slate-100 overflow-hidden rounded-xl bg-white sm:mt-4 sm:w-[58%]">
        {afterRows.map(({ icon: Icon, color, status }, i) => (
          <div
            key={rows[i]?.ref ?? i}
            className="flex items-center gap-3 px-2.5 py-2 sm:px-4 sm:py-2.5"
          >
            <span
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:flex"
              style={{ backgroundColor: `${color}1A`, color }}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold sm:text-sm">{rows[i]?.subject}</p>
              <p className="font-mono text-[10px] text-[#5E6B80]">{rows[i]?.ref}</p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap sm:hidden ${statusStyles[status]}`}
              >
                {t(`home.urbi.mock.status.${status}`)}
              </span>
            </div>
            <span className="hidden rounded-md border border-slate-200 px-2 py-0.5 text-[11px] text-[#5E6B80] sm:inline">
              {rows[i]?.origin}
            </span>
            <span
              className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap sm:inline ${statusStyles[status]}`}
            >
              {t(`home.urbi.mock.status.${status}`)}
            </span>
          </div>
        ))}
      </div>

      {/* The resident is told, without having to ask */}
      <div className="mt-3 flex w-[60%] items-center gap-2.5 rounded-xl bg-white px-3 py-2 shadow-lg shadow-slate-900/10 sm:w-auto">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#224FB4] text-white">
          <Bell className="h-3.5 w-3.5" />
        </span>
        <p className="text-[11px] leading-snug sm:text-xs">{t(`${c}.after.toast`)}</p>
      </div>
    </div>
  );
}

/** "Before and after Urbi" slider for the case study. */
export default function UrbiComparison() {
  const { t } = useTranslation();

  return (
    <BeforeAfter
      before={<BeforePanel />}
      after={<AfterPanel />}
      beforeLabel={t(`${c}.beforeLabel`)}
      afterLabel={t(`${c}.afterLabel`)}
      handleLabel={t(`${c}.handleLabel`)}
      initial={40}
      className="h-[460px] shadow-xl ring-1 shadow-slate-900/5 ring-slate-900/5 sm:h-[480px]"
    />
  );
}
