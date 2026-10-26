import { Camera, Check, ChevronLeft, Lightbulb, MapPin, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/* Illustrative UI mockups of the Urbi flow. Decorative: hidden from assistive tech by the caller. */

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-[260px] rounded-[2.6rem] border border-white/15 bg-slate-900 p-2.5 shadow-2xl shadow-blue-950/60">
      <div className="relative h-[500px] overflow-hidden rounded-[2.1rem] bg-white text-slate-900">
        <div className="absolute top-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900" />
        <div className="h-full pt-10">{children}</div>
      </div>
    </div>
  );
}

function BrowserFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-[440px] max-w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl shadow-blue-950/60">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-3 font-mono text-[11px] text-white/50">{title}</span>
      </div>
      <div className="bg-white p-5 text-slate-900">{children}</div>
    </div>
  );
}

function ScreenHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 px-4 pb-3">
      <ChevronLeft className="h-4 w-4 text-slate-400" />
      <span className="text-sm font-bold">{children}</span>
    </div>
  );
}

export function ReportScreen() {
  const { t } = useTranslation();
  const m = 'home.urbi.mock.report';
  return (
    <PhoneFrame>
      <ScreenHeader>{t(`${m}.header`)}</ScreenHeader>
      <div className="space-y-3 p-4">
        <span className="bg-proxio-accent/10 text-proxio-accent inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold">
          <Lightbulb className="h-3 w-3" />
          {t(`${m}.category`)}
        </span>
        <div className="flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-300">
          <Camera className="h-7 w-7 text-slate-500" />
        </div>
        <div className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold">
          {t(`${m}.title`)}
        </div>
        <div className="urbi-map relative h-32 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <span className="bg-proxio-accent/30 absolute top-1/2 left-1/2 h-2.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded-[50%]" />
          <MapPin className="urbi-pin text-proxio-accent fill-proxio-accent/20 absolute top-1/2 left-1/2 -mt-8 -ml-4 h-8 w-8" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {t(`${m}.location`)}
        </div>
        <div className="bg-proxio-accent rounded-xl py-2.5 text-center text-sm font-bold text-white">
          {t(`${m}.submit`)}
        </div>
      </div>
    </PhoneFrame>
  );
}

const statusStyles = [
  'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
];

export function ManageScreen() {
  const { t } = useTranslation();
  const m = 'home.urbi.mock.manage';
  const items = t(`${m}.items`, { returnObjects: true }) as { title: string; status: string }[];
  const kpis = [
    { label: t(`${m}.open`), value: '24' },
    { label: t(`${m}.inProgress`), value: '12' },
    { label: t(`${m}.resolved`), value: '318' },
  ];

  return (
    <BrowserFrame title={t(`${m}.header`)}>
      <div className="grid grid-cols-3 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-slate-200 p-3">
            <div className="text-[11px] font-medium text-slate-500">{kpi.label}</div>
            <div className="mt-1 text-2xl font-extrabold">{kpi.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item, i) => (
          <div
            key={item.title}
            className="urbi-row flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="bg-proxio-accent/10 text-proxio-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              <span className="truncate text-sm font-semibold">{item.title}</span>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[i % statusStyles.length]}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </BrowserFrame>
  );
}

export function ResolveScreen() {
  const { t } = useTranslation();
  const m = 'home.urbi.mock.resolve';
  const timeline = t(`${m}.timeline`, { returnObjects: true }) as string[];

  return (
    <PhoneFrame>
      <ScreenHeader>{t(`${m}.header`)}</ScreenHeader>
      <div className="space-y-4 p-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <Check className="h-3 w-3" />
          {t(`${m}.status`)}
        </span>
        <ol className="space-y-3">
          {timeline.map((step) => (
            <li key={step} className="flex items-center gap-2.5 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3 w-3" />
              </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-2 gap-2">
          {[t(`${m}.before`), t(`${m}.after`)].map((label, i) => (
            <div
              key={label}
              className={`flex h-24 items-end rounded-xl p-2 ${i === 0 ? 'bg-gradient-to-br from-slate-300 to-slate-400' : 'bg-gradient-to-br from-amber-100 to-amber-300'}`}
            >
              <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xs font-semibold text-slate-500">{t(`${m}.rate`)}</div>
          <div className="mt-1.5 flex justify-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="urbi-star h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export const urbiScreens = [ReportScreen, ManageScreen, ResolveScreen];
