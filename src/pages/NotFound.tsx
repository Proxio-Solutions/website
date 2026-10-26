import voidIllustration from '@assets/void.svg';
import DotGrid from '@components/motion/DotGrid';
import Magnetic from '@components/motion/Magnetic';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="relative flex grow flex-col items-center justify-center overflow-hidden px-4 py-32 sm:px-6 lg:px-8">
      <div className="hero-mask pointer-events-none absolute inset-0" aria-hidden="true">
        <DotGrid />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <p className="text-proxio-accent font-mono text-sm font-medium tracking-[0.2em] uppercase">
          <span className="opacity-60">// </span>Erro 404
        </p>

        <h1 className="text-proxio-text-main mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t('notFound.title')}
        </h1>

        <img
          src={voidIllustration}
          alt="Página não encontrada - Void"
          className="float my-8 w-44 opacity-95 md:w-48 lg:w-60"
        />

        <p className="text-proxio-text-muted mx-auto mt-4 max-w-md text-lg">
          {t('notFound.description')}
        </p>

        <div className="mt-8">
          <Magnetic>
            <Link
              to="/"
              className="group text-proxio-darker bg-proxio-accent hover:bg-proxio-accent-hover inline-flex items-center gap-2 rounded-md border border-transparent px-6 py-3 text-base font-bold shadow-sm transition-colors"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              {t('notFound.backHome')}
            </Link>
          </Magnetic>
        </div>
      </div>
    </main>
  );
}
