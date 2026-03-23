import SEO from '@components/SEO';
import { useTranslation } from 'react-i18next';

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
      <SEO title={t('privacyPolicy.title')} description={t('privacyPolicy.intro.body')} />

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
                  {t(`privacyPolicy.${section}.body`)}
                </p>
                {Array.isArray(items) && items.length > 0 && (
                  <ul className="text-proxio-text-muted mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
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
