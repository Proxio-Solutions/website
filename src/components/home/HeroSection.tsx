import { HighlightUnderline, splitHighlights } from '@components/HighlightedText';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { ArrowRight } from 'lucide-react';
import { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DotGrid from './DotGrid';

const heroHighlights: Record<string, string[]> = {
  pt: ['Soluções Digitais', 'Diferença'],
  en: ['Digital Solutions', 'Difference'],
};

/** Each word sits in a clipping mask so it can slide up into view. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((word, i) =>
        /^\s+$/.test(word) ? (
          <Fragment key={i}> </Fragment>
        ) : word ? (
          <span
            key={i}
            className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom"
          >
            <span className="hero-word inline-block">{word}</span>
          </span>
        ) : null,
      )}
    </>
  );
}

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const parts = splitHighlights(
    t('home.hero.title'),
    heroHighlights[i18n.language] ?? heroHighlights.en,
  );

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from('.hero-fade-top', { y: 16, opacity: 0, duration: 0.8 })
          .from('.hero-word', { yPercent: 115, duration: 1, stagger: 0.07 }, '<0.1')
          .fromTo(
            '.highlight-underline path',
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.9, stagger: 0.15, ease: 'power2.inOut' },
            '-=0.4',
          )
          .from('.hero-fade', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, '<0.1');
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden">
      <div className="hero-mask pointer-events-none absolute inset-0" aria-hidden="true">
        <DotGrid />
      </div>
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="hero-fade-top bg-proxio-darker/80 border-proxio-dark-border text-proxio-text-muted inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 font-mono text-xs font-medium shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="bg-proxio-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
              <span className="bg-proxio-accent relative inline-flex h-2 w-2 rounded-full" />
            </span>
            {t('home.hero.badge')}
            <span className="caret text-proxio-accent -ml-1.5" aria-hidden="true">
              _
            </span>
          </span>

          <h1 className="text-proxio-text-main mt-8 text-4xl leading-[1.1] font-extrabold tracking-tight min-[440px]:text-5xl sm:text-6xl lg:text-7xl">
            {parts.map((part, i) =>
              part.highlighted ? (
                <span key={i} className="relative inline-block whitespace-nowrap">
                  <Words text={part.text} />
                  <HighlightUnderline />
                </span>
              ) : (
                <Words key={i} text={part.text} />
              ),
            )}
          </h1>

          <p className="hero-fade text-proxio-text-muted mx-auto mt-8 max-w-2xl text-xl leading-relaxed">
            {t('home.hero.subtitle')}
          </p>

          <div className="hero-fade mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/contact"
              className="bg-proxio-accent hover:bg-proxio-accent-hover shadow-proxio-accent/30 w-full rounded-lg px-8 py-3.5 text-base font-bold text-white shadow-lg transition-colors sm:w-auto"
            >
              {t('home.hero.cta')}
            </Link>
            <Link
              to="/projects"
              className="border-proxio-dark-border bg-proxio-darker/70 text-proxio-text-main hover:border-proxio-accent hover:text-proxio-accent group flex w-full items-center justify-center gap-2 rounded-lg border px-8 py-3.5 text-base font-bold backdrop-blur transition-colors sm:w-auto"
            >
              {t('home.hero.learnMore')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
