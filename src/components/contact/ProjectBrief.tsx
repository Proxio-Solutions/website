import { Link } from '@components/LocalizedLink';
import { gsap, MOTION_OK, motion, useGSAP } from '@/lib/gsap';
import { scrollToTarget } from '@/lib/smoothScroll';
import emailjs from '@emailjs/browser';
import { ArrowLeft, ArrowRight, Check, ChevronDown, MessageSquare, Sparkles } from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  BUDGET_MIN,
  BUDGETS,
  checkDeadline,
  DEADLINE_MAX_YEARS,
  deadlineBounds,
  estimate,
  FEATURES,
  formatBudget,
  parseBudget,
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
const EMPTY: Brief = {
  type: null,
  features: [],
  timeline: null,
  deadline: '',
  budget: null,
  budgetText: '',
};
/** Where an unsent brief waits while the visitor reads another page. Cleared once sent. */
const DRAFT_KEY = 'proxio-brief-draft';

interface Draft {
  mode: Mode;
  brief: Brief;
  description: string;
  contact: { name: string; email: string; company: string; message: string };
  stepIndex: number;
}

function readDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function writeDraft(draft: Draft | null) {
  try {
    if (draft) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Private mode or storage blocked: the form still works, it just does not remember
  }
}

/** Keeps `?type=` in the address bar in step with the chosen type, so a reload or a shared link agrees. */
function syncTypeParam(type: ProjectType | null) {
  const url = new URL(window.location.href);
  if (type) url.searchParams.set('type', type);
  else url.searchParams.delete('type');
  history.replaceState(history.state, '', url);
}

/** Long enough for the chosen card to show as selected before the next step slides in. */
const AUTO_ADVANCE_MS = 220;

type Mode = 'project' | 'question';
type Step = 'type' | 'details' | 'contact';
type Field = 'type' | 'description' | 'timeline' | 'budget' | 'name' | 'email' | 'message';

const STEPS: Step[] = ['type', 'details', 'contact'];
const REQUIRED: Record<Step, Field[]> = {
  type: ['type'],
  details: ['description', 'timeline', 'budget'],
  contact: ['name', 'email'],
};
const QUESTION_REQUIRED: Field[] = ['name', 'email', 'message'];
/** Something before and after a single @, and a dot in the domain: enough to catch typos. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 16px on phones, so iOS does not zoom in when a field takes focus
const inputClass =
  'border-proxio-dark-border bg-proxio-darker text-proxio-text-main placeholder:text-proxio-text-muted w-full rounded-lg border px-4 py-3 text-base outline-none transition-colors hover:border-slate-300 focus:border-proxio-accent focus:ring-proxio-accent/25 focus:ring-3 aria-[invalid=true]:border-red-400 sm:text-sm';

/** A selectable card or pill: a radio inside a radiogroup, or a toggle button for multi-select. */
function Choice({
  selected,
  onSelect,
  multi = false,
  invalid = false,
  tabbable = true,
  describedBy,
  onHint,
  children,
  className = '',
}: {
  selected: boolean;
  onSelect: () => void;
  multi?: boolean;
  /** Its group still needs an answer: the options take a red edge, like an invalid input. */
  invalid?: boolean;
  /** In a radiogroup only one option is a Tab stop; the arrow keys move between the rest. */
  tabbable?: boolean;
  describedBy?: string;
  /** Pointed at or focused: lets the parent show what this option means. */
  onHint?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role={multi ? undefined : 'radio'}
      aria-checked={multi ? undefined : selected}
      aria-pressed={multi ? selected : undefined}
      aria-describedby={describedBy}
      tabIndex={tabbable ? 0 : -1}
      onClick={onSelect}
      onPointerEnter={onHint}
      onFocus={onHint}
      className={`focus-visible:ring-proxio-accent relative rounded-xl border transition-[border-color,background-color,box-shadow,color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        selected
          ? 'border-proxio-accent bg-blue-50 shadow-[0_0_0_1px_var(--color-proxio-accent)]'
          : invalid
            ? 'bg-proxio-darker border-red-200 hover:border-red-300'
            : 'border-proxio-dark-border bg-proxio-darker hover:border-slate-300'
      } ${className}`}
    >
      {children}
    </button>
  );
}

const ARROW_STEP: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

/**
 * Arrow keys move focus between the options of a radiogroup, as in a native one. They do not
 * choose: choosing a project type moves on to the next step, which must stay a deliberate act.
 */
function moveBetweenRadios(event: KeyboardEvent<HTMLElement>) {
  const step = ARROW_STEP[event.key];
  if (!step) return;
  const radios = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')];
  const index = radios.indexOf(document.activeElement as HTMLElement);
  if (index < 0) return;
  event.preventDefault();
  radios[(index + step + radios.length) % radios.length].focus();
}

/** The option that takes Tab: the chosen one, or the first while none is chosen. */
const isTabStop = <T,>(id: T, index: number, value: T | null) =>
  value === null ? index === 0 : value === id;

/** A short message under a field the visitor still has to fill in. */
function FieldError({
  id,
  show,
  reserve = false,
  children,
}: {
  id: string;
  show: boolean;
  /** Keep the line's height while hidden, so fixing a field does not shift the form under you. */
  reserve?: boolean;
  children: ReactNode;
}) {
  if (!show)
    return reserve ? (
      <p className="mt-2 text-xs" aria-hidden="true">
        &nbsp;
      </p>
    ) : null;
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
  // Kept here, not in the inputs, so going back a step or switching mode loses nothing
  const [contact, setContact] = useState({ name: '', email: '', company: '', message: '' });
  const setContactField = (key: keyof typeof contact) => (value: string) =>
    setContact((prev) => ({ ...prev, [key]: value }));
  const [stepIndex, setStepIndex] = useState(0);
  const [attempted, setAttempted] = useState(false);
  // Free fields opened after a failed attempt: empty is expected until the next try
  const [justOpened, setJustOpened] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  // The feature last pointed at or tapped: its one-line description shows under the list
  const [featureHint, setFeatureHint] = useState<Feature | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const direction = useRef(1);
  const hasMoved = useRef(false);
  const advanceTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  // Restores a brief left half-way on another page, then applies a type chosen on a service card
  // (`?type=mobile`). Both are only readable after hydration: the pre-rendered page always starts
  // empty, so the panel stays hidden while `?type=` is pending (see index.html) and a layout
  // effect swaps the content before painting.
  // Until then the state is the empty pre-rendered form, which must not overwrite a saved draft
  const [restored, setRestored] = useState(false);
  useLayoutEffect(() => {
    const draft = readDraft();
    const type = new URLSearchParams(window.location.search).get('type');
    const known = PROJECT_TYPES.find((option) => option.id === type);
    /* eslint-disable react-hooks/set-state-in-effect -- browser-only state, read after hydration */
    if (draft) {
      setMode(draft.mode);
      setBrief(draft.brief);
      setDescription(draft.description);
      setContact(draft.contact);
      setStepIndex(draft.stepIndex);
    }
    if (known && draft?.brief.type !== known.id) {
      setMode('project');
      setBrief((prev) => ({ ...prev, type: known.id }));
      setStepIndex((prev) => Math.max(prev, 1));
    } else if (draft?.brief.type) syncTypeParam(draft.brief.type);
    setRestored(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Remember the unsent brief for the rest of the visit; forget it once it is sent
  useEffect(() => {
    if (!restored) return;
    if (status === 'success') writeDraft(null);
    else writeDraft({ mode, brief, description, contact, stepIndex });
  }, [restored, mode, brief, description, contact, stepIndex, status]);

  const step = STEPS[stepIndex];
  const isProject = mode === 'project';
  const isLast = !isProject || step === 'contact';
  // The free date and amount are checked as typed; the summary and the email use what they mean
  const deadline = brief.timeline === 'custom' ? checkDeadline(brief.deadline) : null;
  const budgetRange = brief.budget === 'custom' ? parseBudget(brief.budgetText) : null;
  const deadlineError = deadline && 'error' in deadline ? deadline.error : null;
  const budgetError = budgetRange && 'error' in budgetRange ? budgetRange.error : null;
  const deadlineText = (lng = i18n.language) =>
    deadline && 'weeks' in deadline
      ? new Date(`${brief.deadline}T00:00`).toLocaleDateString(lng === 'en' ? 'en-GB' : 'pt-PT', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null;
  const budgetValue = (lng = i18n.language) =>
    budgetRange && 'min' in budgetRange ? formatBudget(budgetRange, lng) : null;

  const missing: Record<Field, boolean> = {
    type: brief.type === null,
    description: description.trim() === '',
    timeline: brief.timeline === null || deadlineError !== null,
    budget: brief.budget === null || budgetError !== null,
    name: contact.name.trim() === '',
    email: !EMAIL_RE.test(contact.email.trim()),
    message: contact.message.trim() === '',
  };
  const showError = (field: Field) => attempted && missing[field] && !justOpened[field];
  const stillMissing = (isProject ? REQUIRED[step] : QUESTION_REQUIRED).filter(showError);
  const listFormat = new Intl.ListFormat(i18n.language === 'en' ? 'en' : 'pt', {
    type: 'conjunction',
  });
  /** The message under a group: why the free value is not usable, or that nothing was picked. */
  const errorText = (field: 'timeline' | 'budget') => {
    if (field === 'timeline' && deadlineError)
      return t(`${b}.errors.deadline.${deadlineError}`, { years: DEADLINE_MAX_YEARS });
    if (field === 'budget' && budgetError)
      return t(`${b}.errors.budgetText.${budgetError}`, {
        min: formatBudget({ min: BUDGET_MIN, max: BUDGET_MIN }, i18n.language),
      });
    return t(`${b}.errors.${field}`);
  };

  const goTo = (index: number) => {
    direction.current = index > stepIndex ? 1 : -1;
    hasMoved.current = true;
    setAttempted(false);
    setStepIndex(index);
  };

  /**
   * Shows the errors and takes the visitor to the first one. On a phone the field can sit above
   * the screen or under the sticky bar, so it is scrolled into view, not just focused.
   */
  const pointAt = (field: Field) => {
    setAttempted(true);
    setJustOpened({});
    // The field itself, or the first option of a group of choices
    const target = root.current?.querySelector<HTMLElement>(`[data-field="${field}"]`);
    if (!target) return;
    (target.closest('button') ?? target).focus({ preventScroll: true });
    scrollToTarget(target.closest<HTMLElement>('label, fieldset') ?? target);
  };

  /** Moves on, or points at what is still missing on this step. */
  const next = () => {
    const firstMissing = REQUIRED[step].find((field) => missing[field]);
    if (firstMissing) pointAt(firstMissing);
    else goTo(stepIndex + 1);
  };

  const chooseType = (id: ProjectType) => {
    setBrief((prev) => ({ ...prev, type: id }));
    syncTypeParam(id);
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
      lines.push(
        `${pt(`${b}.summary.timeline`)}: ${deadlineText('pt') ?? pt(`${b}.timing.timeline.${brief.timeline}`)}`,
      );
    if (brief.budget)
      lines.push(
        `${pt(`${b}.summary.budget`)}: ${
          brief.budget === 'custom'
            ? `${budgetValue('pt')} (“${brief.budgetText.trim()}”)`
            : pt(`${b}.timing.budget.${brief.budget}`)
        }`,
      );
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
    const firstMissing = (isProject ? REQUIRED.contact : QUESTION_REQUIRED).find((f) => missing[f]);
    if (firstMissing) {
      pointAt(firstMissing);
      return;
    }
    const name = contact.name.trim();
    const company = contact.company.trim();
    const pt = i18n.getFixedT('pt');
    const typeName =
      isProject && brief.type
        ? pt(`${b}.type.options.${brief.type}.title`)
        : pt(`${b}.email.general`);
    const message = isProject
      ? composeBrief(company)
      : `${contact.message.trim()}\n\n${pt(`${b}.summary.language`)}: ${i18n.language}`;

    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: contact.email.trim(),
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
    syncTypeParam(null);
    setDescription('');
    // Same person, new message: keep who they are
    setContactField('message')('');
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
      value:
        brief.timeline === 'custom'
          ? deadlineText()
          : brief.timeline
            ? t(`${b}.timing.timeline.${brief.timeline}`)
            : null,
    },
    {
      label: t(`${b}.summary.budget`),
      value:
        brief.budget === 'custom'
          ? budgetValue()
          : brief.budget
            ? t(`${b}.timing.budget.${brief.budget}`)
            : null,
    },
  ];

  /** What has been chosen so far, with the reminder that none of it is a commitment. */
  const summaryList = (
    <>
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
    </>
  );

  const headingKey = isProject ? `${b}.${step}` : `${b}.question`;

  /** The props that tie a contact input to its state and to its error message. */
  const contactInput = (field: 'name' | 'email' | 'message', key: keyof typeof contact) => ({
    'data-field': field,
    value: contact[key],
    onChange: (e: { target: { value: string } }) => setContactField(key)(e.target.value),
    'aria-invalid': showError(field) || undefined,
    'aria-describedby': showError(field) ? `brief-error-${field}` : undefined,
  });

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
          autoComplete="name"
          placeholder={t('contact.form.namePlaceholder')}
          className={inputClass}
          {...contactInput('name', 'name')}
        />
        <FieldError id="brief-error-name" reserve={attempted} show={showError('name')}>
          {t(`${b}.errors.name`)}
        </FieldError>
      </label>
      <label className="block">
        <span className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
          {t('contact.form.email')}
        </span>
        <input
          type="email"
          name="from_email"
          autoComplete="email"
          placeholder={t('contact.form.emailPlaceholder')}
          className={inputClass}
          {...contactInput('email', 'email')}
        />
        <FieldError id="brief-error-email" reserve={attempted} show={showError('email')}>
          {t(`${b}.errors.email`)}
        </FieldError>
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
        // Named by the fieldset's legend; a second name would be read twice
        role="radiogroup"
        aria-invalid={showError(field) || undefined}
        aria-describedby={showError(field) ? `brief-error-${field}` : undefined}
        onKeyDown={moveBetweenRadios}
        className="flex flex-wrap gap-2"
      >
        {options.map((id, i) => (
          <Choice
            key={id}
            selected={value === id}
            invalid={showError(field) && value !== 'custom'}
            tabbable={isTabStop(id, i, value)}
            onSelect={() => {
              onChange(id);
              // Opening the free field: move straight into it, without flagging it empty yet
              if (id === 'custom' && value !== 'custom') {
                setJustOpened((prev) => ({ ...prev, [field]: true }));
                requestAnimationFrame(() =>
                  root.current?.querySelector<HTMLElement>(`input[data-field="${field}"]`)?.focus(),
                );
              }
            }}
            className="text-proxio-text-main px-4 py-2.5 text-sm font-semibold tabular-nums"
          >
            {/* The first option takes focus when this group is the first thing missing,
                unless the free field below is open: then the field does */}
            <span data-field={i === 0 && value !== 'custom' ? field : undefined}>
              {t(`${b}.timing.${field}.${id}`)}
            </span>
          </Choice>
        ))}
      </div>
      {value === 'custom' && freeField(field)}
      <FieldError id={`brief-error-${field}`} reserve={attempted} show={showError(field)}>
        {errorText(field)}
      </FieldError>
    </fieldset>
  );

  /** The date or amount the visitor writes when no option fits, with what we understood. */
  const freeField = (field: 'timeline' | 'budget') => {
    const isDate = field === 'timeline';
    const invalid = showError(field) || undefined;
    const describedBy = showError(field) ? `brief-error-${field}` : `brief-hint-${field}`;
    const hint = isDate
      ? deadline && 'weeks' in deadline
        ? t(`${b}.timing.deadlineHint`, { count: Math.max(1, deadline.weeks) })
        : null
      : budgetValue()
        ? t(`${b}.timing.budgetTextHint`, { value: budgetValue() })
        : null;
    return (
      <label className="mt-4 block max-w-sm">
        <span className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
          {t(`${b}.timing.${isDate ? 'deadlineLabel' : 'budgetTextLabel'}`)}
        </span>
        {isDate ? (
          <input
            data-field={field}
            type="date"
            {...deadlineBounds()}
            value={brief.deadline}
            onChange={(e) => setBrief((prev) => ({ ...prev, deadline: e.target.value }))}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={inputClass}
          />
        ) : (
          <input
            data-field={field}
            type="text"
            inputMode="text"
            autoComplete="off"
            maxLength={60}
            value={brief.budgetText}
            onChange={(e) => setBrief((prev) => ({ ...prev, budgetText: e.target.value }))}
            placeholder={t(`${b}.timing.budgetTextPlaceholder`)}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={inputClass}
          />
        )}
        {hint && !showError(field) && (
          <p
            id={`brief-hint-${field}`}
            className="text-proxio-text-muted mt-2 text-xs"
            aria-live="polite"
          >
            <Check className="text-proxio-accent mr-1 inline h-3.5 w-3.5" strokeWidth={3} />
            {hint}
          </p>
        )}
      </label>
    );
  };

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
      {/* Mounted from the start, so screen readers announce the success when it fills in */}
      <p role="status" className="sr-only">
        {status === 'success' ? t(isProject ? `${b}.success` : `${b}.questionSuccess`) : ''}
      </p>
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
            <h2 className="text-proxio-text-main text-2xl font-bold">
              {t(isProject ? `${b}.success` : `${b}.questionSuccess`)}
            </h2>
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
            // Our own messages, in the page's language, instead of the browser's bubbles
            noValidate
            // overflow-clip (not hidden) keeps the rounded corners without breaking the sticky bar
            className="bg-proxio-dark border-proxio-dark-border overflow-clip rounded-3xl border"
          >
            {/* What brings you here: a brief or a plain question */}
            <div className="border-proxio-dark-border border-b px-6 pt-6 pb-5 sm:px-8">
              <div
                role="radiogroup"
                aria-label={t(`${b}.mode.label`)}
                onKeyDown={moveBetweenRadios}
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
                    tabIndex={mode === value ? 0 : -1}
                    onClick={() => switchMode(value)}
                    className={`focus-visible:ring-proxio-accent flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-center text-sm leading-tight font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-3 ${
                      mode === value
                        ? 'bg-proxio-accent text-white shadow-sm'
                        : 'text-proxio-text-muted hover:text-proxio-text-main'
                    }`}
                  >
                    <Icon className="hidden h-4 w-4 shrink-0 sm:block" />
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
                  {/* Phones have no side panel: keep the chosen type in sight, one tap from changing */}
                  {stepIndex > 0 && brief.type && (
                    <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-sm lg:hidden">
                      <span className="text-proxio-text-muted">{t(`${b}.summary.type`)}:</span>
                      <span className="text-proxio-text-main font-semibold">
                        {t(`${b}.type.options.${brief.type}.title`)}
                      </span>
                      <button
                        type="button"
                        onClick={() => goTo(0)}
                        className="text-proxio-accent decoration-proxio-accent/40 -my-2 py-2 font-medium underline underline-offset-4"
                      >
                        {t(`${b}.changeType`)}
                      </button>
                    </p>
                  )}
                </>
              )}
            </div>

            <div ref={panel} data-brief-panel className="px-6 py-7 sm:min-h-[360px] sm:px-8">
              {!emailConfigured && isLast && (
                <p className="mb-6 rounded-lg bg-yellow-500/10 px-4 py-3 text-sm font-medium text-yellow-700">
                  {t('contact.form.notConfigured')}
                </p>
              )}

              <h2
                ref={heading}
                tabIndex={-1}
                className="text-proxio-text-main text-xl font-extrabold tracking-tight outline-none sm:text-2xl"
              >
                {t(`${headingKey}.title`)}
              </h2>
              <p className="text-proxio-text-muted mt-1 text-sm">{t(`${headingKey}.subtitle`)}</p>

              {isProject && step === 'type' && (
                <>
                  <div
                    role="radiogroup"
                    aria-label={t(`${b}.type.title`)}
                    aria-invalid={showError('type') || undefined}
                    aria-describedby={showError('type') ? 'brief-error-type' : undefined}
                    onKeyDown={moveBetweenRadios}
                    className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    {PROJECT_TYPES.map(({ id, icon: Icon }, i) => (
                      <Choice
                        key={id}
                        selected={brief.type === id}
                        invalid={showError('type')}
                        tabbable={isTabStop(id, i, brief.type)}
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
                  <FieldError id="brief-error-type" reserve={attempted} show={showError('type')}>
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
                    <FieldError
                      id="brief-error-description"
                      reserve={attempted}
                      show={showError('description')}
                    >
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
                              describedBy={`brief-feature-${id}`}
                              onHint={() => setFeatureHint(id)}
                              onSelect={() => {
                                toggleFeature(id);
                                setFeatureHint(id);
                              }}
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
                      {/* What the pointed-at feature means; the line keeps its height */}
                      <p className="text-proxio-text-muted mt-3 min-h-5 text-sm" aria-hidden="true">
                        {featureHint && t(`${b}.features.options.${featureHint}.desc`)}
                      </p>
                      {/* The same descriptions for screen readers, one per option */}
                      <div hidden>
                        {FEATURES.map(({ id }) => (
                          <span key={id} id={`brief-feature-${id}`}>
                            {t(`${b}.features.options.${id}.desc`)}
                          </span>
                        ))}
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
                  {/* Phones have no side panel: a recap of the brief before sending it */}
                  {isProject && (
                    <details className="group bg-proxio-darker border-proxio-dark-border rounded-xl border px-4 py-3 lg:hidden">
                      <summary className="text-proxio-text-main flex cursor-pointer list-none items-center justify-between text-sm font-bold [&::-webkit-details-marker]:hidden">
                        {t(`${b}.summary.title`)}
                        <ChevronDown
                          className="text-proxio-text-muted h-4 w-4 transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      {summaryList}
                    </details>
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
                        value={contact.company}
                        onChange={(e) => setContactField('company')(e.target.value)}
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
                        rows={5}
                        placeholder={t('contact.form.messagePlaceholder')}
                        className={`${inputClass} block resize-none`}
                        {...contactInput('message', 'message')}
                      />
                      <FieldError
                        id="brief-error-message"
                        reserve={attempted}
                        show={showError('message')}
                      >
                        {t(`${b}.errors.message`)}
                      </FieldError>
                    </label>
                  )}
                  <p className="text-proxio-text-muted text-sm leading-relaxed">
                    <Trans
                      i18nKey={`${b}.privacy`}
                      components={{
                        policy: (
                          // A new tab, so reading it does not leave the form
                          <Link
                            to="/privacy-policy"
                            target="_blank"
                            rel="noopener"
                            className="text-proxio-text-main decoration-proxio-accent/60 hover:text-proxio-accent font-medium underline decoration-2 underline-offset-4"
                          />
                        ),
                      }}
                    />
                    <span className="sr-only"> {t('privacyPolicy.newWindow')}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Navigation: stays in reach at the bottom of the screen on phones. Not on the first
                step, where choosing a type already moves on */}
            {!(isProject && step === 'type') && (
              <div className="border-proxio-dark-border bg-proxio-dark/95 sticky bottom-0 z-10 border-t px-6 py-4 backdrop-blur sm:static sm:bg-transparent sm:px-8 sm:backdrop-blur-none">
                {/* On a phone only the first missing field is in view: say what else is left.
                  Always mounted, so screen readers announce it when it fills in */}
                <p aria-live="polite" className="mb-3 text-xs font-medium text-red-600 empty:mb-0">
                  {stillMissing.length > 1 &&
                    t(`${b}.errors.missing`, {
                      fields: listFormat.format(
                        stillMissing.map((f) => t(`${b}.errors.fields.${f}`)),
                      ),
                    })}
                </p>
                <div className="flex items-center justify-between gap-3">
                  {isProject && stepIndex > 0 ? (
                    <button
                      type="button"
                      onClick={() => goTo(stepIndex - 1)}
                      className="text-proxio-text-muted hover:text-proxio-text-main flex min-h-11 items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold transition-colors"
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
                      className="group bg-proxio-accent hover:bg-proxio-accent-hover flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-colors disabled:opacity-60 sm:flex-none"
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
                      className="group bg-proxio-accent hover:bg-proxio-accent-hover flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-colors sm:flex-none"
                    >
                      {t(`${b}.nav.next`)}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Follows the visitor down the long project step, so the choices stay in sight */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        {/* What the visitor has chosen so far; no estimate, that is for the team */}
        {isProject && status !== 'success' && (
          <div className="bg-proxio-dark border-proxio-dark-border hidden rounded-2xl border p-6 lg:block">
            <p className="text-proxio-text-main text-sm font-bold">{t(`${b}.summary.title`)}</p>
            {summaryList}
          </div>
        )}
        {aside}
      </div>
    </div>
  );
}
