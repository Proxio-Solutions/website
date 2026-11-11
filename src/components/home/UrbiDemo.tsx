import potholeStreet from '@/assets/urbi/pothole-street.webp';
import {
  Armchair,
  Bell,
  Bus,
  Check,
  ChevronLeft,
  Construction,
  Container,
  Droplet,
  Droplets,
  Footprints,
  Lamp,
  Leaf,
  Lightbulb,
  LightbulbOff,
  Loader2,
  MapPin,
  Plus,
  RotateCcw,
  Route,
  Send,
  Sprout,
  ToyBrick,
  TrafficCone,
  Trash2,
  TreePine,
  Waves,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

const d = 'home.urbi.demo';

/*
 * A playable version of the resident wizard in urbi-client (Localização → Categoria →
 * Detalhes), with a subset of the default taxonomy seeded by urbi-backend: same names,
 * Lucide icons and colours. Nothing leaves the page.
 */
const AREAS: {
  icon: LucideIcon;
  color: string;
  subjects: { icon: LucideIcon; color: string }[];
}[] = [
  {
    icon: Construction,
    color: '#f97316',
    subjects: [
      { icon: TrafficCone, color: '#f97316' },
      { icon: Footprints, color: '#f59e0b' },
      { icon: Route, color: '#eab308' },
    ],
  },
  {
    icon: Lightbulb,
    color: '#eab308',
    subjects: [
      { icon: LightbulbOff, color: '#eab308' },
      { icon: Lamp, color: '#84cc16' },
    ],
  },
  {
    icon: Trash2,
    color: '#22c55e',
    subjects: [
      { icon: Trash2, color: '#22c55e' },
      { icon: Container, color: '#06b6d4' },
    ],
  },
  {
    icon: TreePine,
    color: '#10b981',
    subjects: [
      { icon: TreePine, color: '#10b981' },
      { icon: Leaf, color: '#14b8a6' },
      { icon: Sprout, color: '#84cc16' },
    ],
  },
  {
    icon: Droplets,
    color: '#0ea5e9',
    subjects: [
      { icon: Droplets, color: '#0ea5e9' },
      { icon: Droplet, color: '#3b82f6' },
      { icon: Waves, color: '#224fb4' },
    ],
  },
  {
    icon: Armchair,
    color: '#6366f1',
    subjects: [
      { icon: Armchair, color: '#6366f1' },
      { icon: Bus, color: '#224fb4' },
      { icon: ToyBrick, color: '#f43f5e' },
    ],
  },
];

/** Other residents' reports already on the map, in % of the map box. */
const NEARBY = [
  { x: 24, y: 28, color: '#f97316' },
  { x: 74, y: 20, color: '#eab308' },
  { x: 66, y: 74, color: '#22c55e' },
  { x: 18, y: 72, color: '#6366f1' },
];

const STATUSES = ['submitted', 'inAnalysis', 'inProgress', 'concluded'] as const;
const STATUS_DOT = ['bg-slate-400', 'bg-amber-500', 'bg-[#224FB4]', 'bg-emerald-500'];
const REF = 'OC-2026-0143';
const STATUS_EVERY_MS = 1600;

type Phase = 'location' | 'category' | 'details' | 'done';
const PHASES: Phase[] = ['location', 'category', 'details'];

interface Taxonomy {
  name: string;
  subjects: string[];
}

/** Stylised street map of a made-up parish; the dashed line is the area the junta covers. */
function MapArt() {
  return (
    <svg
      viewBox="14 0 252 290"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <rect width="280" height="290" fill="#E4E9F0" />
      {/* Park */}
      <rect x="158" y="168" width="104" height="104" rx="12" fill="#D3E9D6" />
      {[
        [180, 190],
        [214, 200],
        [244, 186],
        [196, 236],
        [236, 246],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill="#B7DCBD" />
      ))}
      {/* River */}
      <path d="M-10 262 C 60 246, 110 286, 170 300" stroke="#C9DDF2" strokeWidth="22" fill="none" />
      {/* Streets */}
      <g stroke="#FFFFFF" strokeLinecap="round" fill="none">
        <path d="M-10 92 H 290" strokeWidth="14" />
        <path d="M-10 160 H 290" strokeWidth="18" />
        <path d="M96 -10 V 300" strokeWidth="13" />
        <path d="M206 -10 V 160" strokeWidth="11" />
        <path d="M20 -10 L 96 92" strokeWidth="9" />
        <path d="M96 210 H 158" strokeWidth="9" />
        <path d="M30 160 V 240" strokeWidth="8" />
      </g>
      <g fill="#8A97AB" fontSize="7" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">
        <text x="112" y="88">
          Rua da Escola
        </text>
        <text x="200" y="156">
          Av. Central
        </text>
        <text x="100" y="40" transform="rotate(90 100 40)">
          Rua das Flores
        </text>
      </g>
      {/* Area the junta covers */}
      <path
        d="M26 14 H 254 V 276 H 26 Z"
        fill="#224FB4"
        fillOpacity="0.035"
        stroke="#224FB4"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
    </svg>
  );
}

export default function UrbiDemo() {
  const { t } = useTranslation();
  const taxonomy = t(`${d}.taxonomy`, { returnObjects: true }) as Taxonomy[];
  const addresses = t(`${d}.location.addresses`, { returnObjects: true }) as string[];
  const times = t(`${d}.done.times`, { returnObjects: true }) as string[];

  const [phase, setPhase] = useState<Phase>('location');
  const [pin, setPin] = useState({ x: 46, y: 46 });
  const [confirm, setConfirm] = useState<'idle' | 'resolving' | 'done'>('idle');
  const [area, setArea] = useState<number | null>(null);
  const [subject, setSubject] = useState<{ area: number; index: number } | null>(null);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [toast, setToast] = useState<number | null>(null);
  const tracked = useRef(false);

  const address = addresses[(pin.x > 50 ? 1 : 0) + (pin.y > 50 ? 2 : 0)];
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Address lookup after confirming the pin, like the real reverse geocoding
  useEffect(() => {
    if (confirm !== 'resolving') return;
    const id = window.setTimeout(() => setConfirm('done'), reduceMotion ? 0 : 700);
    return () => window.clearTimeout(id);
  }, [confirm, reduceMotion]);

  // After submitting, play the follow-up: the junta moves the report along and the resident is told
  useEffect(() => {
    if (phase !== 'done' || statusIndex >= STATUSES.length - 1) return;
    const id = window.setTimeout(
      () => {
        setStatusIndex(statusIndex + 1);
        setToast(statusIndex + 1);
      },
      reduceMotion ? 0 : STATUS_EVERY_MS,
    );
    return () => window.clearTimeout(id);
  }, [phase, statusIndex, reduceMotion]);

  useEffect(() => {
    if (toast === null) return;
    const id = window.setTimeout(() => setToast(null), STATUS_EVERY_MS - 200);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (phase === 'done' && statusIndex === STATUSES.length - 1 && !tracked.current) {
      tracked.current = true;
      window.plausible?.('Urbi Demo Completed');
    }
  }, [phase, statusIndex]);

  const movePin = (x: number, y: number) => {
    setPin({ x: Math.min(92, Math.max(8, x)), y: Math.min(90, Math.max(12, y)) });
    setConfirm('idle');
  };

  const onMapClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    movePin(
      ((e.clientX - rect.left) / rect.width) * 100,
      ((e.clientY - rect.top) / rect.height) * 100,
    );
  };

  const onMapKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-5, 0],
      ArrowRight: [5, 0],
      ArrowUp: [0, -5],
      ArrowDown: [0, 5],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    movePin(pin.x + move[0], pin.y + move[1]);
  };

  const restart = () => {
    setPhase('location');
    setPin({ x: 46, y: 46 });
    setConfirm('idle');
    setArea(null);
    setSubject(null);
    setDescription('');
    setPhoto(false);
    setStatusIndex(0);
    setToast(null);
  };

  const chosen = subject ? AREAS[subject.area].subjects[subject.index] : null;
  const chosenName = subject ? taxonomy[subject.area]?.subjects[subject.index] : '';
  const ChosenIcon = chosen?.icon ?? MapPin;
  const isPothole = subject?.area === 0 && subject.index === 0;
  const phaseIndex = PHASES.indexOf(phase);

  const canNext =
    (phase === 'location' && confirm === 'done') || (phase === 'category' && subject !== null);

  const back = () => {
    if (phase === 'category' && area !== null) setArea(null);
    else if (phase === 'category') setPhase('location');
    else if (phase === 'details') setPhase('category');
  };

  return (
    <div className="w-[300px] max-w-full rounded-[2.75rem] border border-white/15 bg-slate-900 p-2.5 shadow-2xl shadow-blue-950/60">
      <div className="relative h-[600px] overflow-hidden rounded-[2.25rem] bg-[#EEF2F8] text-[#0F1D3E]">
        <div
          className="absolute top-2 left-1/2 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900"
          aria-hidden="true"
        />

        {/* Push notification, as the resident receives it */}
        <div
          role="status"
          className={`absolute inset-x-3 top-9 z-20 flex items-start gap-2.5 rounded-2xl bg-white p-3 shadow-xl shadow-slate-900/15 transition-all duration-500 ${
            toast !== null
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-4 opacity-0'
          }`}
        >
          {toast !== null && (
            <>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#224FB4] text-white">
                <Bell className="h-3.5 w-3.5" />
              </span>
              <p className="text-[11px] leading-snug">
                <span className="block font-bold">Urbi</span>
                {t(`${d}.done.notification`, {
                  ref: REF,
                  status: t(`home.urbi.mock.status.${STATUSES[toast]}`),
                })}
              </p>
            </>
          )}
        </div>

        <div className="flex h-full flex-col pt-9">
          {/* Header + step indicator */}
          {phase !== 'done' && (
            <div className="shrink-0 px-4">
              <div className="flex items-center gap-2 pb-3">
                <button
                  type="button"
                  onClick={back}
                  disabled={phase === 'location'}
                  aria-label={t(`${d}.nav.back`)}
                  className="-ml-1 rounded-md p-0.5 text-[#5E6B80] disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-[13px] font-bold">{t(`${d}.header`)}</span>
              </div>
              <ol className="flex items-start px-1">
                {PHASES.map((p, i) => (
                  <li key={p} className="flex flex-1 items-start last:flex-none">
                    <div className="flex min-w-[56px] flex-col items-center gap-1">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                          i <= phaseIndex ? 'bg-[#224FB4] text-white' : 'bg-white text-[#5E6B80]'
                        }`}
                      >
                        {i < phaseIndex ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                      </span>
                      <span
                        className={`text-[9px] font-semibold ${i <= phaseIndex ? 'text-[#224FB4]' : 'text-[#5E6B80]'}`}
                      >
                        {t(`${d}.steps.${p}`)}
                      </span>
                    </div>
                    {i < PHASES.length - 1 && (
                      <span
                        className={`mx-0.5 mt-2.5 h-0.5 flex-1 rounded transition-colors ${i < phaseIndex ? 'bg-[#224FB4]' : 'bg-slate-200'}`}
                      />
                    )}
                  </li>
                ))}
              </ol>
              <p className="mt-2.5 text-[11px] text-[#5E6B80]">{t(`${d}.questions.${phase}`)}</p>
            </div>
          )}

          <div
            key={`${phase}-${area ?? ''}`}
            className="urbi-demo-step flex min-h-0 flex-1 flex-col px-3.5 pt-2.5 pb-3.5"
          >
            {phase === 'location' && (
              <>
                <div className="relative h-[290px] shrink-0 overflow-hidden rounded-xl">
                  <MapArt />
                  {NEARBY.map(({ x, y, color }) => (
                    <span
                      key={`${x}-${y}`}
                      className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
                      style={{ left: `${x}%`, top: `${y}%`, backgroundColor: color }}
                      aria-hidden="true"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={onMapClick}
                    onKeyDown={onMapKey}
                    aria-label={t(`${d}.location.mapLabel`)}
                    className="absolute inset-0 cursor-crosshair rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#224FB4] focus-visible:ring-inset"
                  />
                  {/* The pin; its tip marks the spot */}
                  <span
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-full transition-[left,top] duration-300 ease-out"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    aria-hidden="true"
                  >
                    <MapPin
                      className="h-8 w-8 drop-shadow-md"
                      fill={confirm === 'done' ? '#224FB4' : '#ffffff'}
                      stroke={confirm === 'done' ? '#ffffff' : '#224FB4'}
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[9.5px] font-medium text-[#5E6B80]">
                    {t(`${d}.location.tapHint`)}
                  </span>
                </div>

                <div className="mt-2.5 rounded-xl bg-white p-3">
                  {confirm === 'idle' ? (
                    <>
                      <p className="text-[10.5px] leading-snug text-[#5E6B80]">
                        {t(`${d}.location.hint`)}
                      </p>
                      <button
                        type="button"
                        onClick={() => setConfirm('resolving')}
                        className="mt-2 w-full rounded-lg bg-[#EEF3FF] py-2 text-[11px] font-bold text-[#224FB4] transition-colors hover:bg-[#E0E9FF]"
                      >
                        {t(`${d}.location.confirm`)}
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        {confirm === 'resolving' ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold">
                          {confirm === 'resolving' ? t(`${d}.location.resolving`) : address}
                        </p>
                        <p className="text-[9.5px] text-[#5E6B80]">
                          {t(`${d}.location.confirmed`)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {phase === 'category' && area === null && (
              <div className="grid grid-cols-2 gap-2">
                {AREAS.map(({ icon: Icon, color, subjects }, i) => (
                  <button
                    key={color + i}
                    type="button"
                    onClick={() => setArea(i)}
                    className={`flex flex-col items-start gap-1.5 rounded-xl bg-white p-2.5 text-left transition-shadow hover:shadow-md ${
                      subject?.area === i ? 'ring-2 ring-[#224FB4]' : ''
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${color}1A`, color }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] leading-tight font-bold">{taxonomy[i]?.name}</span>
                    <span className="text-[9.5px] text-[#5E6B80]">
                      {t(`${d}.category.subjectCount`, { count: subjects.length })}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {phase === 'category' && area !== null && (
              <div>
                <button
                  type="button"
                  onClick={() => setArea(null)}
                  className="flex items-center gap-1 text-[10.5px] font-semibold text-[#224FB4]"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  {t(`${d}.category.backToAreas`)}
                </button>
                <h3 className="mt-2 text-[13px] font-bold">{taxonomy[area]?.name}</h3>
                <div
                  role="radiogroup"
                  aria-label={taxonomy[area]?.name}
                  className="mt-2 space-y-1.5"
                >
                  {AREAS[area].subjects.map(({ icon: Icon, color }, i) => {
                    const selected = subject?.area === area && subject.index === i;
                    return (
                      <button
                        key={color + i}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setSubject({ area, index: i })}
                        className={`flex w-full items-center gap-2.5 rounded-xl bg-white p-2.5 text-left transition-shadow ${
                          selected ? 'ring-2 ring-[#224FB4]' : 'hover:shadow-md'
                        }`}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${color}1A`, color }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1 text-[11.5px] font-semibold">
                          {taxonomy[area]?.subjects[i]}
                        </span>
                        {selected && (
                          <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#224FB4] text-white">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {phase === 'details' && subject && chosen && (
              <div className="space-y-2.5">
                <div className="space-y-2 rounded-xl bg-white p-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${chosen.color}1A`, color: chosen.color }}
                    >
                      <ChosenIcon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold">{chosenName}</p>
                      <p className="truncate text-[9px] text-[#5E6B80]">
                        {taxonomy[subject.area]?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-slate-100 pt-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#224FB4]">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <p className="truncate text-[11px] font-bold">{address}</p>
                  </div>
                </div>

                <label className="block">
                  <span className="sr-only">{t(`${d}.details.descriptionLabel`)}</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={280}
                    rows={4}
                    placeholder={t(`${d}.details.descriptionPlaceholder`)}
                    className="block w-full resize-none rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] leading-relaxed outline-none placeholder:text-[#5E6B80]/70 focus:border-[#224FB4]/50"
                  />
                </label>

                <div>
                  <p className="mb-1 text-[9px] font-bold tracking-wide text-[#5E6B80] uppercase">
                    {t(`${d}.details.photos`)}
                  </p>
                  <div className="flex gap-1.5">
                    {photo ? (
                      <span className="relative">
                        {isPothole ? (
                          <img
                            src={potholeStreet}
                            alt=""
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <span
                            className="flex h-14 w-14 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${chosen.color}26`, color: chosen.color }}
                          >
                            <ChosenIcon className="h-6 w-6" />
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPhoto(false)}
                          aria-label={t(`${d}.details.removePhoto`)}
                          className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-900 text-white"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPhoto(true)}
                        aria-label={t(`${d}.details.addPhoto`)}
                        className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400 transition-colors hover:border-[#224FB4] hover:text-[#224FB4]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-[9px] text-[#5E6B80]">{t(`${d}.details.photosHint`)}</p>
                </div>
              </div>
            )}

            {phase === 'done' && (
              <div className="flex flex-1 flex-col pt-4">
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                    <Check className="h-6 w-6" strokeWidth={3} />
                  </span>
                  <p className="mt-3 text-[15px] font-extrabold">{t(`${d}.done.title`)}</p>
                  <p className="mt-0.5 text-[11px] text-[#5E6B80]">
                    {t(`${d}.done.message`, { ref: REF })}
                  </p>
                </div>

                <div className="mt-5 rounded-xl bg-white p-3">
                  <p className="text-[9px] font-bold tracking-wide text-[#5E6B80] uppercase">
                    {t(`${d}.done.follow`)}
                  </p>
                  <ol className="mt-2.5">
                    {STATUSES.map((s, i) => {
                      const reached = i <= statusIndex;
                      return (
                        <li key={s} className="relative flex gap-2.5 pb-3 last:pb-0">
                          {i < STATUSES.length - 1 && (
                            <span
                              className={`absolute top-3.5 left-[5px] h-full w-0.5 transition-colors duration-500 ${i < statusIndex ? 'bg-[#224FB4]' : 'bg-slate-200'}`}
                            />
                          )}
                          <span
                            className={`relative mt-1 h-3 w-3 shrink-0 rounded-full ring-2 ring-white transition-colors duration-500 ${reached ? STATUS_DOT[i] : 'bg-slate-200'}`}
                          />
                          <div
                            className={`transition-opacity duration-500 ${reached ? 'opacity-100' : 'opacity-35'}`}
                          >
                            <p className="text-[11px] font-bold">
                              {t(`home.urbi.mock.status.${s}`)}
                            </p>
                            <p className="text-[9.5px] text-[#5E6B80]">{times[i]}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <button
                  type="button"
                  onClick={restart}
                  className="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-[11px] font-bold text-[#224FB4]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t(`${d}.done.restart`)}
                </button>
              </div>
            )}

            {/* Wizard navigation */}
            {phase !== 'done' && (
              <div className="mt-auto flex gap-1.5 pt-3">
                {phase !== 'location' && (
                  <button
                    type="button"
                    onClick={back}
                    className="flex-1 rounded-xl bg-white py-2.5 text-[11px] font-bold text-[#5E6B80]"
                  >
                    {t(`${d}.nav.back`)}
                  </button>
                )}
                {phase === 'details' ? (
                  <button
                    key="submit"
                    type="button"
                    onClick={() => setPhase('done')}
                    className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-[#224FB4] py-2.5 text-[11px] font-bold text-white shadow-md shadow-[#224FB4]/40"
                  >
                    {t(`${d}.nav.submit`)}
                    <Send className="h-3 w-3" />
                  </button>
                ) : (
                  <button
                    key="next"
                    type="button"
                    disabled={!canNext}
                    onClick={() => setPhase(phase === 'location' ? 'category' : 'details')}
                    className="flex-[2] rounded-xl bg-[#224FB4] py-2.5 text-[11px] font-bold text-white shadow-md shadow-[#224FB4]/40 transition-opacity disabled:opacity-35 disabled:shadow-none"
                  >
                    {t(`${d}.nav.next`)}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
