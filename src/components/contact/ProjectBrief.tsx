import { gsap, MOTION_OK, motion, useGSAP } from '@/lib/gsap';
import { scrollToTarget } from '@/lib/smoothScroll';
import emailjs from '@emailjs/browser';
import { AlertTriangle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BUDGETS,
  estimate,
  FEATURES,
  PROJECT_TYPES,
  TIMELINES,
  type Brief,
  type Estimate,
  type Feature,
} from './briefData';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

const emailConfigured =
  Boolean(EMAILJS_SERVICE_ID) && Boolean(EMAILJS_TEMPLATE_ID) && Boolean(EMAILJS_PUBLIC_KEY);

const b = 'contact.brief';
const EMPTY: Brief = { type: null, features: [], timeline: null, budget: null };

type Step = 'type' | 'features' | 'timing' | 'contact';

const inputClass =
  'border-proxio-dark-border bg-proxio-darker text-proxio-text-main placeholder:text-proxio-text-muted/70 w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors hover:border-slate-300 focus:border-proxio-accent/40';

/** A selectable card: radio inside a radiogroup, or a toggle button for multi-select. */
function Choice({
  selected,
  onSelect,
  multi = false,
  children,
  className = '',
}: {
  selected: boolean;
  onSelect: () => void;
  multi?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role={multi ? undefined : 'radio'}
      aria-checked={multi ? undefined : selected}
      aria-pressed={multi ? selected : undefined}
      onClick={onSelect}
      className={`relative rounded-xl border transition-[border-color,background-color,box-shadow] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
        selected
          ? 'border-proxio-accent bg-blue-50 shadow-[0_0_0_1px_var(--color-proxio-accent)]'
          : 'border-proxio-dark-border bg-proxio-darker hover:border-slate-300'
      } ${className}`}
    >
      {children}
      {multi && (
        <span
          className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
            selected
              ? 'border-proxio-accent bg-proxio-accent text-white'
              : 'border-slate-300 bg-white text-transparent'
          }`}
          aria-hidden="true"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

/** Live estimate: weeks range, a three-step complexity meter and a deadline warning. */
function EstimateBlock({ value, compact = false }: { value: Estimate | null; compact?: boolean }) {
  const { t } = useTranslation();

  if (!value) {
    return <p className="text-proxio-text-muted text-sm">{t(`${b}.summary.empty`)}</p>;
  }

  return (
    <div aria-live="polite">
      <p className="text-proxio-text-muted font-mono text-[11px] tracking-wider uppercase">
        {t(`${b}.summary.estimateLabel`)}
      </p>
      <p
        className={`text-proxio-text-main mt-1 font-extrabold tracking-tight tabular-nums ${compact ? 'text-xl' : 'text-3xl'}`}
      >
        {t(`${b}.summary.weeks`, { min: value.min, max: value.max })}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex gap-1" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-1.5 w-7 rounded-full transition-colors duration-300 ${n <= value.level ? 'bg-proxio-accent' : 'bg-slate-200'}`}
            />
          ))}
        </div>
        <span className="text-proxio-text-muted text-xs font-medium">
          {t(`${b}.summary.level.${value.level}`)}
        </span>
      </div>
      {value.tight && (
        <p className="mt-3 flex gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t(`${b}.summary.tight`)}
        </p>
      )}
    </div>
  );
}

/**
 * Contact form as a short brief: project type, features, timing and budget, then contact
 * details. A live estimate sits beside it. It still goes out through the same EmailJS
 * template (name, email, subject, message), with the brief written into the message.
 */
export default function ProjectBrief({ aside }: { aside?: ReactNode }) {
  const { t, i18n } = useTranslation();
  const [brief, setBrief] = useState<Brief>(EMPTY);
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const direction = useRef(1);
  const hasMoved = useRef(false);

  // Consulting has nothing to build, so it skips the features step
  const steps: Step[] =
    brief.type === 'consulting'
      ? ['type', 'timing', 'contact']
      : ['type', 'features', 'timing', 'contact'];
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const isLast = step === 'contact';
  const result = estimate(brief);

  const canContinue =
    (step === 'type' && brief.type !== null) ||
    step === 'features' ||
    (step === 'timing' && brief.timeline !== null && brief.budget !== null);

  const goTo = (index: number) => {
    direction.current = index > stepIndex ? 1 : -1;
    hasMoved.current = true;
    setStepIndex(index);
  };

  const toggleFeature = (id: Feature) =>
    setBrief((prev) => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter((f) => f !== id)
        : [...prev.features, id],
    }));

  // Each step slides in from the side it was reached from; focus follows for screen readers
  useGSAP(
    () => {
      if (!hasMoved.current) return;
      heading.current?.focus({ preventScroll: true });
      // On small screens the next step can start above the fold; bring its top back into view
      const form = root.current?.querySelector('form');
      if (form && form.getBoundingClientRect().top < 64) scrollToTarget(form);
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(panel.current, {
          autoAlpha: 0,
          x: direction.current * motion.distance.sm * 1.5,
          duration: motion.duration.fast,
          ease: motion.ease.out,
          clearProps: 'all',
        });
      });
    },
    { dependencies: [step], scope: root },
  );

  /** The brief in plain Portuguese, for the team's inbox. */
  const composeMessage = (company: string, note: string) => {
    const pt = i18n.getFixedT('pt');
    const lines = [
      `${pt(`${b}.summary.type`)}: ${brief.type ? pt(`${b}.type.options.${brief.type}.title`) : '—'}`,
    ];
    if (brief.type && brief.type !== 'consulting') {
      const names = brief.features.map((f) => pt(`${b}.features.options.${f}.title`));
      lines.push(`${pt(`${b}.summary.features`)}: ${names.join(', ') || pt(`${b}.summary.none`)}`);
    }
    if (brief.timeline)
      lines.push(`${pt(`${b}.summary.timeline`)}: ${pt(`${b}.timing.timeline.${brief.timeline}`)}`);
    if (brief.budget)
      lines.push(`${pt(`${b}.summary.budget`)}: ${pt(`${b}.timing.budget.${brief.budget}`)}`);
    if (result)
      lines.push(
        `${pt(`${b}.summary.estimateLabel`)}: ${pt(`${b}.summary.weeks`, { min: result.min, max: result.max })}`,
      );
    if (company) lines.push(`${pt(`${b}.contact.company`)}: ${company}`);
    lines.push(`${pt(`${b}.summary.language`)}: ${i18n.language}`);
    return `${note || '—'}\n\n— Brief —\n${lines.join('\n')}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailConfigured) return;
    const data = new FormData(e.currentTarget);
    const name = String(data.get('from_name') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();
    const pt = i18n.getFixedT('pt');
    const typeName = brief.type
      ? pt(`${b}.type.options.${brief.type}.title`)
      : pt(`${b}.email.general`);

    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: String(data.get('from_email') ?? '').trim(),
          subject: pt(`${b}.email.subject`, { type: typeName, who: company || name }),
          message: composeMessage(company, String(data.get('message') ?? '').trim()),
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setStatus('success');
      window.plausible?.('Contact Brief Submitted');
    } catch {
      setStatus('error');
    }
  };

  const restart = () => {
    setBrief(EMPTY);
    hasMoved.current = false;
    setStepIndex(0);
    setStatus('idle');
  };

  const summaryRows = [
    {
      label: t(`${b}.summary.type`),
      value: brief.type ? t(`${b}.type.options.${brief.type}.title`) : null,
    },
    ...(brief.type === 'consulting'
      ? []
      : [
          {
            label: t(`${b}.summary.features`),
            value: brief.features.length
              ? t(`${b}.summary.featureCount`, { count: brief.features.length })
              : null,
          },
        ]),
    {
      label: t(`${b}.summary.timeline`),
      value: brief.timeline ? t(`${b}.timing.timeline.${brief.timeline}`) : null,
    },
    {
      label: t(`${b}.summary.budget`),
      value: brief.budget ? t(`${b}.timing.budget.${brief.budget}`) : null,
    },
  ];

  return (
    <div ref={root} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {status === 'success' ? (
          <div className="bg-proxio-dark border-proxio-dark-border flex flex-col items-center rounded-3xl border p-16 text-center">
            <div className="bg-proxio-accent mb-6 inline-flex rounded-full p-5 shadow-lg shadow-blue-600/30">
              <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                <path
                  className="draw-check"
                  d="M5 12.5l4.5 4.5L19 7.5"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                />
              </svg>
            </div>
            <h3 className="text-proxio-text-main text-2xl font-bold">{t(`${b}.success`)}</h3>
            <p className="text-proxio-text-muted mt-2 max-w-sm text-sm">{t(`${b}.successSub`)}</p>
            <button
              type="button"
              onClick={restart}
              className="text-proxio-accent mt-6 text-sm font-medium underline-offset-4 hover:underline"
            >
              {t('contact.form.sendAnother')}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-proxio-dark border-proxio-dark-border overflow-hidden rounded-3xl border"
          >
            {/* Progress */}
            <div className="border-proxio-dark-border border-b px-6 pt-6 pb-5 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-proxio-text-muted font-mono text-xs tracking-wider uppercase">
                  {t(`${b}.stepOf`, { current: stepIndex + 1, total: steps.length })}
                </p>
                {step === 'type' && (
                  <button
                    type="button"
                    onClick={() => goTo(steps.length - 1)}
                    className="text-proxio-text-muted hover:text-proxio-accent text-xs font-medium underline-offset-4 transition-colors hover:underline"
                  >
                    {t(`${b}.nav.skip`)}
                  </button>
                )}
              </div>
              <ol className="mt-3 flex gap-1.5">
                {steps.map((s, i) => (
                  <li key={s} className="flex-1">
                    <span className="sr-only">{t(`${b}.steps.${s}`)}</span>
                    <span
                      className={`block h-1 rounded-full transition-colors duration-300 ${i <= stepIndex ? 'bg-proxio-accent' : 'bg-slate-200'}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`mt-2 hidden text-xs font-medium sm:block ${i === stepIndex ? 'text-proxio-text-main' : 'text-proxio-text-muted'}`}
                      aria-hidden="true"
                    >
                      {t(`${b}.steps.${s}`)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div ref={panel} className="min-h-[360px] px-6 py-7 sm:px-8">
              {!emailConfigured && isLast && (
                <p className="mb-6 rounded-lg bg-yellow-500/10 px-4 py-3 text-sm font-medium text-yellow-700">
                  {t('contact.form.notConfigured')}
                </p>
              )}

              <h3
                ref={heading}
                tabIndex={-1}
                className="text-proxio-text-main text-xl font-extrabold tracking-tight outline-none sm:text-2xl"
              >
                {t(`${b}.${step}.title`)}
              </h3>
              <p className="text-proxio-text-muted mt-1 text-sm">{t(`${b}.${step}.subtitle`)}</p>

              {step === 'type' && (
                <div
                  role="radiogroup"
                  aria-label={t(`${b}.type.title`)}
                  className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {PROJECT_TYPES.map(({ id, icon: Icon }) => (
                    <Choice
                      key={id}
                      selected={brief.type === id}
                      onSelect={() => setBrief((prev) => ({ ...prev, type: id }))}
                      className="flex gap-4 p-4 text-left"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${brief.type === id ? 'bg-proxio-accent text-white' : 'bg-proxio-accent/10 text-proxio-accent'}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="text-proxio-text-main block text-sm font-bold">
                          {t(`${b}.type.options.${id}.title`)}
                        </span>
                        <span className="text-proxio-text-muted mt-0.5 block text-xs leading-relaxed">
                          {t(`${b}.type.options.${id}.desc`)}
                        </span>
                      </span>
                    </Choice>
                  ))}
                </div>
              )}

              {step === 'features' && (
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {FEATURES.map(({ id, icon: Icon }) => (
                    <Choice
                      key={id}
                      multi
                      selected={brief.features.includes(id)}
                      onSelect={() => toggleFeature(id)}
                      className="flex items-start gap-3 p-4 pr-10 text-left"
                    >
                      <Icon className="text-proxio-accent mt-0.5 h-4.5 w-4.5 shrink-0" />
                      <span>
                        <span className="text-proxio-text-main block text-sm font-bold">
                          {t(`${b}.features.options.${id}.title`)}
                        </span>
                        <span className="text-proxio-text-muted mt-0.5 block text-xs leading-relaxed">
                          {t(`${b}.features.options.${id}.desc`)}
                        </span>
                      </span>
                    </Choice>
                  ))}
                </div>
              )}

              {step === 'timing' && (
                <div className="mt-6 space-y-7">
                  <fieldset>
                    <legend className="text-proxio-text-main mb-3 text-sm font-semibold">
                      {t(`${b}.timing.timelineLabel`)}
                    </legend>
                    <div
                      role="radiogroup"
                      aria-label={t(`${b}.timing.timelineLabel`)}
                      className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
                    >
                      {TIMELINES.map((id) => (
                        <Choice
                          key={id}
                          selected={brief.timeline === id}
                          onSelect={() => setBrief((prev) => ({ ...prev, timeline: id }))}
                          className="text-proxio-text-main px-3 py-3 text-center text-sm font-semibold"
                        >
                          {t(`${b}.timing.timeline.${id}`)}
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="text-proxio-text-main mb-3 text-sm font-semibold">
                      {t(`${b}.timing.budgetLabel`)}
                    </legend>
                    <div
                      role="radiogroup"
                      aria-label={t(`${b}.timing.budgetLabel`)}
                      className="grid grid-cols-2 gap-2.5 sm:grid-cols-5"
                    >
                      {BUDGETS.map((id) => (
                        <Choice
                          key={id}
                          selected={brief.budget === id}
                          onSelect={() => setBrief((prev) => ({ ...prev, budget: id }))}
                          className="text-proxio-text-main px-3 py-3 text-center text-sm font-semibold tabular-nums"
                        >
                          {t(`${b}.timing.budget.${id}`)}
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 'contact' && (
                <div className="mt-6 space-y-5">
                  {result && (
                    <div className="border-proxio-dark-border bg-proxio-darker rounded-xl border p-4 lg:hidden">
                      <EstimateBlock value={result} compact />
                    </div>
                  )}
                  {status === 'error' && (
                    <p className="text-sm font-medium text-red-500">{t('contact.form.error')}</p>
                  )}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                        {t('contact.form.name')}
                      </span>
                      <input
                        type="text"
                        name="from_name"
                        required
                        autoComplete="name"
                        placeholder={t('contact.form.namePlaceholder')}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                        {t('contact.form.email')}
                      </span>
                      <input
                        type="email"
                        name="from_email"
                        required
                        autoComplete="email"
                        placeholder={t('contact.form.emailPlaceholder')}
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                      {t(`${b}.contact.company`)}{' '}
                      <span className="text-proxio-text-muted font-normal">
                        {t(`${b}.contact.optional`)}
                      </span>
                    </span>
                    <input
                      type="text"
                      name="company"
                      autoComplete="organization"
                      placeholder={t(`${b}.contact.companyPlaceholder`)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                      {t('contact.form.message')}
                      {brief.type && (
                        <>
                          {' '}
                          <span className="text-proxio-text-muted font-normal">
                            {t(`${b}.contact.optional`)}
                          </span>
                        </>
                      )}
                    </span>
                    <textarea
                      name="message"
                      // Without a brief, the message is all we get
                      required={!brief.type}
                      rows={4}
                      placeholder={t('contact.form.messagePlaceholder')}
                      className={`${inputClass} block resize-none`}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="border-proxio-dark-border flex items-center justify-between gap-3 border-t px-6 py-4 sm:px-8">
              {stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => goTo(stepIndex - 1)}
                  className="text-proxio-text-muted hover:text-proxio-text-main flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t(`${b}.nav.back`)}
                </button>
              ) : (
                <span />
              )}

              {isLast ? (
                <button
                  // Separate keys: React must not turn the clicked "next" button into a submit
                  key="submit"
                  type="submit"
                  disabled={status === 'sending' || !emailConfigured}
                  className="group bg-proxio-accent hover:bg-proxio-accent-hover flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-colors disabled:opacity-60"
                >
                  {status === 'sending' ? t('contact.form.sending') : t(`${b}.nav.submit`)}
                  {status !== 'sending' && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              ) : (
                <button
                  key="next"
                  type="button"
                  disabled={!canContinue}
                  onClick={() => goTo(stepIndex + 1)}
                  className="group bg-proxio-accent hover:bg-proxio-accent-hover flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  {step === 'features' && brief.features.length === 0
                    ? t(`${b}.nav.noneOfThese`)
                    : t(`${b}.nav.next`)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="space-y-4">
        {/* Live summary of the brief */}
        <div className="bg-proxio-dark border-proxio-dark-border hidden rounded-2xl border p-6 lg:block">
          <p className="text-proxio-text-main text-sm font-bold">{t(`${b}.summary.title`)}</p>
          <dl className="mt-4 space-y-2.5">
            {summaryRows.map(({ label, value }) => (
              <div key={label} className="flex items-baseline justify-between gap-4 text-sm">
                <dt className="text-proxio-text-muted">{label}</dt>
                <dd
                  className={`text-right font-semibold ${value ? 'text-proxio-text-main' : 'text-slate-300'}`}
                >
                  {value ?? '—'}
                </dd>
              </div>
            ))}
          </dl>
          <div className="border-proxio-dark-border mt-5 border-t pt-5">
            <EstimateBlock value={result} />
          </div>
          <p className="text-proxio-text-muted mt-4 text-[11px] leading-relaxed">
            {t(`${b}.summary.disclaimer`)}
          </p>
        </div>
        {aside}
      </div>
    </div>
  );
}
