declare global {
  interface Window {
    plausible?: (event: string) => void;
  }
}

import PageHero from '@components/motion/PageHero';
import SpotlightCard from '@components/motion/SpotlightCard';
import Reveal from '@components/Reveal';
import SEO from '@components/SEO';
import emailjs from '@emailjs/browser';
import { ArrowRight, Clock, Mail, MapPin } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

const emailConfigured =
  Boolean(EMAILJS_SERVICE_ID) && Boolean(EMAILJS_TEMPLATE_ID) && Boolean(EMAILJS_PUBLIC_KEY);

const heroHighlights: Record<string, string[]> = {
  pt: ['Vamos Falar', 'Teu Projeto'],
  en: ["Let's Talk", 'Your Project'],
};

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current || !emailConfigured) return;
    setStatus('sending');
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, {
        publicKey: EMAILJS_PUBLIC_KEY,
      });
      formRef.current.reset();
      setStatus('success');
      window.plausible?.('Contact Form Submitted');
    } catch {
      setStatus('error');
    }
  };

  const infoCards = [
    { icon: Mail, label: t('contact.info.email.label'), value: t('contact.info.email.value') },
    {
      icon: MapPin,
      label: t('contact.info.location.label'),
      value: t('contact.info.location.value'),
    },
    {
      icon: Clock,
      label: t('contact.info.response.label'),
      value: t('contact.info.response.value'),
    },
  ];

  const inputClass =
    'border-proxio-dark-border bg-proxio-darker text-proxio-text-main placeholder:text-proxio-text-muted/70 w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors hover:border-slate-300 focus:border-proxio-accent/40';

  return (
    <>
      <SEO title={t('contact.title')} description={t('contact.hero.subtitle')} />

      <main>
        <PageHero
          label={t('contact.hero.label')}
          title={t('contact.hero.title')}
          highlights={heroHighlights[i18n.language] ?? heroHighlights.en}
          subtitle={t('contact.hero.subtitle')}
        />

        {/* Form + Info */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Form */}
            <Reveal className="lg:col-span-2">
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
                  <h3 className="text-proxio-text-main text-2xl font-bold">
                    {t('contact.form.success')}
                  </h3>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-proxio-accent mt-6 text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {t('contact.form.sendAnother')}
                  </button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="bg-proxio-dark border-proxio-dark-border space-y-6 rounded-3xl border p-6 sm:p-8"
                >
                  {!emailConfigured && (
                    <p className="rounded-lg bg-yellow-500/10 px-4 py-3 text-sm font-medium text-yellow-700">
                      {t('contact.form.notConfigured')}
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="text-sm font-medium text-red-500">{t('contact.form.error')}</p>
                  )}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                        {t('contact.form.name')}
                      </label>
                      <div className="field">
                        <input
                          type="text"
                          name="from_name"
                          required
                          placeholder={t('contact.form.namePlaceholder')}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                        {t('contact.form.email')}
                      </label>
                      <div className="field">
                        <input
                          type="email"
                          name="from_email"
                          required
                          placeholder={t('contact.form.emailPlaceholder')}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                      {t('contact.form.subject')}
                    </label>
                    <div className="field">
                      <input
                        type="text"
                        name="subject"
                        required
                        placeholder={t('contact.form.subjectPlaceholder')}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                      {t('contact.form.message')}
                    </label>
                    <div className="field">
                      <textarea
                        name="message"
                        required
                        rows={6}
                        placeholder={t('contact.form.messagePlaceholder')}
                        className={`${inputClass} block resize-none`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending' || !emailConfigured}
                    className="group bg-proxio-accent hover:bg-proxio-accent-hover flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-colors disabled:opacity-60"
                  >
                    {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
                    {status !== 'sending' && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                </form>
              )}
            </Reveal>

            {/* Info Cards */}
            <div className="space-y-4">
              {infoCards.map(({ icon: Icon, label, value }, index) => (
                <Reveal key={label} delay={150 + index * 100}>
                  <SpotlightCard className="group bg-proxio-dark border-proxio-dark-border rounded-2xl border p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="bg-proxio-accent/10 group-hover:bg-proxio-accent rounded-lg p-2 transition-colors duration-300">
                        <Icon className="text-proxio-accent h-5 w-5 transition-colors duration-300 group-hover:text-white" />
                      </div>
                      <span className="text-proxio-text-muted font-mono text-xs tracking-wider uppercase">
                        {label}
                      </span>
                    </div>
                    <p className="text-proxio-text-main font-semibold break-words">{value}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
