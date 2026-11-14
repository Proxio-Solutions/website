import { Link } from '@components/LocalizedLink';
import { gsap, MOTION_OK, motion, useGSAP } from '@/lib/gsap';
import { scrollToTarget } from '@/lib/smoothScroll';
import emailjs from '@emailjs/browser';
import { ArrowLeft, ArrowRight, Check, MessageSquare, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  BUDGETS,
  estimate,
  FEATURES,
  PROJECT_TYPES,
  TIMELINES,
  type Brief,
  type Feature,
  type ProjectType,
} from './briefData';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

const emailConfigured =
  Boolean(EMAILJS_SERVICE_ID) && Boolean(EMAILJS_TEMPLATE_ID) && Boolean(EMAILJS_PUBLIC_KEY);

const b = 'contact.brief';
const EMPTY: Brief = { type: null, features: [], timeline: null, budget: null };
/** Long enough for the chosen card to show as selected before the next step slides in. */
const AUTO_ADVANCE_MS = 220;

type Mode = 'project' | 'question';
type Step = 'type' | 'details' | 'contact';
type Field = 'type' | 'description' | 'timeline' | 'budget';

const STEPS: Step[] = ['type', 'details', 'contact'];
const REQUIRED: Record<Step, Field[]> = {
  type: ['type'],
  details: ['description', 'timeline', 'budget'],
  contact: [],
};

const inputClass =
  'border-proxio-dark-border bg-proxio-darker text-proxio-text-main placeholder:text-proxio-text-muted/70 w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors hover:border-slate-300 focus:border-proxio-accent/40';

/** A selectable card or pill: a radio inside a radiogroup, or a toggle button for multi-select. */
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
      className={`relative rounded-xl border transition-[border-color,background-color,box-shadow,color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
        selected
          ? 'border-proxio-accent bg-blue-50 shadow-[0_0_0_1px_var(--color-proxio-accent)]'
          : 'border-proxio-dark-border bg-proxio-darker hover:border-slate-300'
      } ${className}`}
    >
      {children}
    </button>
  );
}

/** A short message under a field the visitor still has to fill in. */
function FieldError({ id, show, children }: { id: string; show: boolean; children: ReactNode }) {
  if (!show) return null;
  return (
    <p id={id} className="mt-2 text-xs font-medium text-red-600">
      {children}
    </p>
  );
}

/**
 * The contact form, in two modes. "I have a project" is a three-step brief (type, the project,
 * contact); "I just have a question" is a plain message. Both go out through the same EmailJS
 * template (name, email, subject, message); a brief is written into the message, together with
 * an internal duration estimate that the visitor does not see.
 */
export default function ProjectBrief({ aside }: { aside?: ReactNode }) {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<Mode>('project');
  const [brief, setBrief] = useState<Brief>(EMPTY);
  const [description, setDescription] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const direction = useRef(1);
  const hasMoved = useRef(false);
  const advanceTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  const step = STEPS[stepIndex];
  const isProject = mode === 'project';
  const isLast = !isProject || step === 'contact';
  const missing: Record<Field, boolean> = {
    type: brief.type === null,
    description: description.trim() === '',
    timeline: brief.timeline === null,
    budget: brief.budget === null,
  };
  const showError = (field: Field) => attempted && missing[field];

  const goTo = (index: number) => {
    direction.current = index > stepIndex ? 1 : -1;
    hasMoved.current = true;
    setAttempted(false);
    setStepIndex(index);
  };

  /** Moves on, or points at what is still missing on this step. */
  const next = () => {
    const firstMissing = REQUIRED[step].find((field) => missing[field]);
    if (!firstMissing) {
      goTo(stepIndex + 1);
      return;
    }
    setAttempted(true);
    // The field itself, or the first option of a group of choices
    const target = root.current?.querySelector<HTMLElement>(`[data-field="${firstMissing}"]`);
    (target?.closest('button') ?? target)?.focus();
  };

  const chooseType = (id: ProjectType) => {
    setBrief((prev) => ({ ...prev, type: id }));
    // A single choice needs no extra click: show it selected, then move on
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => goTo(1), AUTO_ADVANCE_MS);
  };

  const toggleFeature = (id: Feature) =>
    setBrief((prev) => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter((f) => f !== id)
        : [...prev.features, id],
    }));

  const switchMode = (value: Mode) => {
    if (value === mode) return;
    window.clearTimeout(advanceTimer.current);
    direction.current = value === 'question' ? 1 : -1;
    hasMoved.current = true;
    setAttempted(false);
    setStatus('idle');
    setMode(value);
  };

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
    { dependencies: [step, mode], scope: root },
  );

  /** The brief in plain Portuguese for the team's inbox, with the internal estimate. */
  const composeBrief = (company: string) => {
    const pt = i18n.getFixedT('pt');
    const result = estimate(brief);
    const lines = [
      `${pt(`${b}.summary.type`)}: ${brief.type ? pt(`${b}.type.options.${brief.type}.title`) : '—'}`,
    ];
    if (brief.type !== 'consulting') {
      const names = brief.features.map((f) => pt(`${b}.features.options.${f}.title`));
      lines.push(`${pt(`${b}.summary.features`)}: ${names.join(', ') || pt(`${b}.summary.none`)}`);
    }
    if (brief.timeline)
      lines.push(`${pt(`${b}.summary.timeline`)}: ${pt(`${b}.timing.timeline.${brief.timeline}`)}`);
    if (brief.budget)
      lines.push(`${pt(`${b}.summary.budget`)}: ${pt(`${b}.timing.budget.${brief.budget}`)}`);
    if (result) {
      lines.push(
        `${pt(`${b}.summary.estimateLabel`)}: ${pt(`${b}.summary.weeks`, { min: result.min, max: result.max })}`,
      );
      if (result.tight) lines.push(pt(`${b}.summary.tight`));
    }
    if (company) lines.push(`${pt(`${b}.contact.company`)}: ${company}`);
    lines.push(`${pt(`${b}.summary.language`)}: ${i18n.language}`);
    return `${description.trim()}\n\n— Brief —\n${lines.join('\n')}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailConfigured) return;
    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? '').trim();
    const name = field('from_name');
    const company = field('company');
    const pt = i18n.getFixedT('pt');
    const typeName =
      isProject && brief.type
        ? pt(`${b}.type.options.${brief.type}.title`)
        : pt(`${b}.email.general`);
    const message = isProject
      ? composeBrief(company)
      : `${field('message')}\n\n${pt(`${b}.summary.language`)}: ${i18n.language}`;

    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: field('from_email'),
          subject: pt(`${b}.email.subject`, { type: typeName, who: company || name }),
          message,
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
    setDescription('');
    hasMoved.current = false;
    setAttempted(false);
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

  const headingKey = isProject ? `${b}.${step}` : `${b}.question`;

  /** Name and email, shared by both modes. */
  const identityFields = (
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
  );

  const pillGroup = <T extends string>(
    field: 'timeline' | 'budget',
    options: readonly T[],
    value: T | null,
    onChange: (id: T) => void,
  ) => (
    <fieldset>
      <legend className="text-proxio-text-main mb-3 text-sm font-semibold">
        {t(`${b}.timing.${field}Label`)}
      </legend>
      <div
        role="radiogroup"
        aria-label={t(`${b}.timing.${field}Label`)}
        aria-invalid={showError(field) || undefined}
        aria-describedby={showError(field) ? `brief-error-${field}` : undefined}
        className="flex flex-wrap gap-2"
      >
        {options.map((id, i) => (
          <Choice
            key={id}
            selected={value === id}
            onSelect={() => onChange(id)}
            className="text-proxio-text-main px-4 py-2.5 text-sm font-semibold tabular-nums"
          >
            {/* The first option takes focus when this group is the first thing missing */}
            <span data-field={i === 0 ? field : undefined}>{t(`${b}.timing.${field}.${id}`)}</span>
          </Choice>
        ))}
      </div>
      <FieldError id={`brief-error-${field}`} show={showError(field)}>
        {t(`${b}.errors.${field}`)}
      </FieldError>
    </fieldset>
  );

  const nextSteps = (
    <ol className="mt-8 w-full max-w-md space-y-3 text-left">
      {(['step1', 'step2', 'step3'] as const).map((key, i) => (
        <li key={key} className="flex gap-3 text-sm">
          <span className="bg-proxio-accent/10 text-proxio-accent flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold">
            {i + 1}
          </span>
          <span className="text-proxio-text-main pt-0.5">{t(`${b}.next.${key}`)}</span>
        </li>
      ))}
    </ol>
  );

  return (
    <div ref={root} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {status === 'success' ? (
          <div className="bg-proxio-dark border-proxio-dark-border flex flex-col items-center rounded-3xl border px-6 py-14 text-center sm:px-16">
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
            <h3 className="text-proxio-text-main text-2xl font-bold" role="status">
              {t(isProject ? `${b}.success` : `${b}.questionSuccess`)}
            </h3>
            <p className="text-proxio-text-muted mt-2 max-w-sm text-sm">
              {t(isProject ? `${b}.successSub` : `${b}.questionSuccessSub`)}
            </p>
            {isProject && (
              <>
                <p className="text-proxio-text-main mt-10 text-sm font-bold">
                  {t(`${b}.next.title`)}
                </p>
                {nextSteps}
              </>
            )}
            <button
              type="button"
              onClick={restart}
              className="text-proxio-accent mt-8 text-sm font-medium underline-offset-4 hover:underline"
            >
              {t('contact.form.sendAnother')}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            // overflow-clip (not hidden) keeps the rounded corners without breaking the sticky bar
            className="bg-proxio-dark border-proxio-dark-border overflow-clip rounded-3xl border"
          >
            {/* What brings you here: a brief or a plain question */}
            <div className="border-proxio-dark-border border-b px-6 pt-6 pb-5 sm:px-8">
              <div
                role="radiogroup"
                aria-label={t(`${b}.mode.label`)}
                className="bg-proxio-darker border-proxio-dark-border grid grid-cols-2 gap-1 rounded-xl border p-1"
              >
                {(
                  [
                    ['project', Sparkles],
                    ['question', MessageSquare],
                  ] as const
                ).map(([value, Icon]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={mode === value}
                    onClick={() => switchMode(value)}
                    className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-center text-[13px] leading-tight font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 sm:px-3 sm:text-sm ${
                      mode === value
                        ? 'bg-proxio-dark text-proxio-text-main shadow-sm'
                        : 'text-proxio-text-muted hover:text-proxio-text-main'
                    }`}
                  >
                    <Icon
                      className={`hidden h-4 w-4 shrink-0 sm:block ${mode === value ? 'text-proxio-accent' : ''}`}
                    />
                    {t(`${b}.mode.${value}`)}
                  </button>
                ))}
              </div>

              {isProject && (
                <>
                  <p className="text-proxio-text-muted mt-5 font-mono text-xs tracking-wider uppercase">
                    {t(`${b}.stepOf`, { current: stepIndex + 1, total: STEPS.length })}
                    <span className="sm:hidden"> · {t(`${b}.steps.${step}`)}</span>
                  </p>
                  <ol className="mt-3 flex gap-1.5">
                    {STEPS.map((s, i) => (
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
                </>
              )}
            </div>

            <div ref={panel} className="px-6 py-7 sm:min-h-[360px] sm:px-8">
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
                {t(`${headingKey}.title`)}
              </h3>
              <p className="text-proxio-text-muted mt-1 text-sm">{t(`${headingKey}.subtitle`)}</p>

              {isProject && step === 'type' && (
                <>
                  <div
                    role="radiogroup"
                    aria-label={t(`${b}.type.title`)}
                    aria-invalid={showError('type') || undefined}
                    aria-describedby={showError('type') ? 'brief-error-type' : undefined}
                    className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    {PROJECT_TYPES.map(({ id, icon: Icon }, i) => (
                      <Choice
                        key={id}
                        selected={brief.type === id}
                        onSelect={() => chooseType(id)}
                        className="flex gap-4 p-4 text-left"
                      >
                        <span
                          data-field={i === 0 ? 'type' : undefined}
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
                  <FieldError id="brief-error-type" show={showError('type')}>
                    {t(`${b}.errors.type`)}
                  </FieldError>
                </>
              )}

              {isProject && step === 'details' && (
                <div className="mt-6 space-y-7">
                  <label className="block">
                    <span className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                      {t(`${b}.details.descriptionLabel`)}
                    </span>
                    <textarea
                      data-field="description"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t(`${b}.details.descriptionPlaceholder`)}
                      aria-invalid={showError('description') || undefined}
                      aria-describedby={
                        showError('description') ? 'brief-error-description' : undefined
                      }
                      className={`${inputClass} block resize-none`}
                    />
                    <FieldError id="brief-error-description" show={showError('description')}>
                      {t(`${b}.errors.description`)}
                    </FieldError>
                  </label>

                  {brief.type !== 'consulting' && (
                    <fieldset>
                      <legend className="text-proxio-text-main mb-3 text-sm font-semibold">
                        {t(`${b}.details.featuresLabel`)}{' '}
                        <span className="text-proxio-text-muted font-normal">
                          {t(`${b}.contact.optional`)}
                        </span>
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {FEATURES.map(({ id, icon: Icon }) => {
                          const selected = brief.features.includes(id);
                          return (
                            <Choice
                              key={id}
                              multi
                              selected={selected}
                              onSelect={() => toggleFeature(id)}
                              className="text-proxio-text-main flex items-center gap-2 px-3.5 py-2 text-sm font-medium"
                            >
                              {selected ? (
                                <Check className="text-proxio-accent h-4 w-4" strokeWidth={3} />
                              ) : (
                                <Icon className="text-proxio-text-muted h-4 w-4" />
                              )}
                              {t(`${b}.features.options.${id}.title`)}
                            </Choice>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}

                  {pillGroup('timeline', TIMELINES, brief.timeline, (id) =>
                    setBrief((prev) => ({ ...prev, timeline: id })),
                  )}
                  {pillGroup('budget', BUDGETS, brief.budget, (id) =>
                    setBrief((prev) => ({ ...prev, budget: id })),
                  )}
                </div>
              )}

              {isLast && (
                <div className="mt-6 space-y-5">
                  {status === 'error' && (
                    <p className="text-sm font-medium text-red-600" role="alert">
                      {t('contact.form.error')}
                    </p>
                  )}
                  {identityFields}
                  {isProject ? (
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
                  ) : (
                    <label className="block">
                      <span className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                        {t('contact.form.message')}
                      </span>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder={t('contact.form.messagePlaceholder')}
                        className={`${inputClass} block resize-none`}
                      />
                    </label>
                  )}
                  <p className="text-proxio-text-muted text-xs leading-relaxed">
                    <Trans
                      i18nKey={`${b}.privacy`}
                      components={{
                        link: (
                          <Link
                            to="/privacy-policy"
                            className="text-proxio-text-main underline underline-offset-2"
                          />
                        ),
                      }}
                    />
                  </p>
                </div>
              )}
            </div>

            {/* Navigation: stays in reach at the bottom of the screen on phones */}
            <div className="border-proxio-dark-border bg-proxio-dark/95 sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t px-6 py-4 backdrop-blur sm:static sm:bg-transparent sm:px-8 sm:backdrop-blur-none">
              {isProject && stepIndex > 0 ? (
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
                  {status === 'sending'
                    ? t('contact.form.sending')
                    : isProject
                      ? t(`${b}.nav.submit`)
                      : t('contact.form.submit')}
                  {status !== 'sending' && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              ) : (
                <button
                  key="next"
                  type="button"
                  onClick={next}
                  className="group bg-proxio-accent hover:bg-proxio-accent-hover flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-colors"
                >
                  {t(`${b}.nav.next`)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="space-y-4">
        {/* What the visitor has chosen so far; no estimate, that is for the team */}
        {isProject && status !== 'success' && (
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
            <p className="border-proxio-dark-border text-proxio-text-muted mt-5 border-t pt-4 text-xs leading-relaxed">
              {t(`${b}.summary.disclaimer`)}
            </p>
          </div>
        )}
        {aside}
      </div>
    </div>
  );
}
