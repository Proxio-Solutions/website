declare global {
  interface Window {
    plausible?: (event: string) => void;
  }
}

import HighlightedText from '@components/HighlightedText';
import SEO from '@components/SEO';
import emailjs from '@emailjs/browser';
import { Clock, Mail, MapPin } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const EMAILJS_SERVICE_ID = 'service_oamgj8f';
const EMAILJS_TEMPLATE_ID = 'template_qscsv6j';
const EMAILJS_PUBLIC_KEY = 'wq8c44hOVc_fVr0Fq';

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
    if (!formRef.current) return;
    setStatus('sending');
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, {
        publicKey: EMAILJS_PUBLIC_KEY,
      });
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
    'border-proxio-dark-border bg-proxio-darker text-proxio-text-main placeholder:text-proxio-text-muted w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:border-proxio-accent';

  return (
    <>
      <SEO title={t('contact.title')} description={t('contact.hero.subtitle')} />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
              {t('contact.hero.label')}
            </span>
            <h1 className="text-proxio-text-main mt-4 text-5xl font-extrabold tracking-tight">
              <HighlightedText text={t('contact.hero.title')} words={heroHighlights[i18n.language] ?? heroHighlights.en} />
            </h1>
            <p className="text-proxio-text-muted mt-6 text-xl leading-relaxed">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Form + Info */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="bg-proxio-dark border-proxio-dark-border flex flex-col items-center rounded-2xl border p-16 text-center">
                  <div className="bg-proxio-accent/10 mb-5 inline-flex rounded-full p-5">
                    <Mail className="text-proxio-accent h-8 w-8" />
                  </div>
                  <h3 className="text-proxio-text-main text-2xl font-bold">
                    {t('contact.form.success')}
                  </h3>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="bg-proxio-dark border-proxio-dark-border space-y-6 rounded-2xl border p-8"
                >
                  {status === 'error' && (
                    <p className="text-sm font-medium text-red-400">
                      {t('contact.form.error')}
                    </p>
                  )}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                        {t('contact.form.name')}
                      </label>
                      <input
                        type="text"
                        name="from_name"
                        required
                        placeholder={t('contact.form.namePlaceholder')}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                        {t('contact.form.email')}
                      </label>
                      <input
                        type="email"
                        name="from_email"
                        required
                        placeholder={t('contact.form.emailPlaceholder')}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                      {t('contact.form.subject')}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      placeholder={t('contact.form.subjectPlaceholder')}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-proxio-text-main mb-1.5 block text-sm font-semibold">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      placeholder={t('contact.form.messagePlaceholder')}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="bg-proxio-accent hover:bg-proxio-accent-hover w-full rounded-lg py-3.5 text-base font-bold text-white transition-colors disabled:opacity-60"
                  >
                    {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
                  </button>
                </form>
              )}
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {infoCards.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-proxio-dark border-proxio-dark-border rounded-xl border p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-proxio-accent/10 rounded-lg p-2">
                      <Icon className="text-proxio-accent h-5 w-5" />
                    </div>
                    <span className="text-proxio-text-muted text-sm font-medium">{label}</span>
                  </div>
                  <p className="text-proxio-text-main font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
