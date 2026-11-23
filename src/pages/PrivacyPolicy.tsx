import SEO from '@components/SEO';
import { CONTACT_EMAIL } from '@/config/links';
import { Trans, useTranslation } from 'react-i18next';

const linkClass =
  'text-proxio-text-main hover:text-proxio-accent underline underline-offset-2 transition-colors';

/** Tags the copy may use: <email> for our address, <cnpd> for the data protection authority. */
const components = {
  email: <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass} />,
  cnpd: (
    <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className={linkClass} />
  ),
};

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  const sections = [
    'intro',
    'controller',
    'dataCollected',
    'usage',
    'legal',
    'retention',
    'thirdParties',
    'rights',
    'cookies',
    'contact',
  ] as const;

  return (
    <>
      <SEO title={t('privacyPolicy.title')} description={t('privacyPolicy.seo.description')} />

      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-proxio-text-main mb-2 text-4xl font-extrabold tracking-tight">
          {t('privacyPolicy.title')}
        </h1>
        <p className="text-proxio-text-muted mb-12 text-sm">{t('privacyPolicy.lastUpdated')}</p>

        <div className="space-y-10">
          {sections.map((section) => {
            const items = t(`privacyPolicy.${section}.items`, {
              returnObjects: true,
              defaultValue: null,
            }) as string[] | null;

            return (
              <div key={section}>
                <h2 className="text-proxio-text-main mb-3 text-xl font-bold">
                  {t(`privacyPolicy.${section}.title`)}
                </h2>
                <p className="text-proxio-text-muted leading-relaxed">
                  <Trans
                    i18nKey={`privacyPolicy.${section}.body`}
                    values={{ email: CONTACT_EMAIL }}
                    components={components}
                  />
                </p>
                {Array.isArray(items) && items.length > 0 && (
                  <ul className="text-proxio-text-muted mt-3 list-disc space-y-1.5 pl-5 leading-relaxed">
                    {items.map((_, i) => (
                      <li key={i}>
                        <Trans
                          i18nKey={`privacyPolicy.${section}.items.${i}`}
                          components={components}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
