import voidIllustration from '@assets/void.svg';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="flex grow flex-col items-center justify-center px-4 py-32 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <p className="text-proxio-accent text-base font-bold tracking-widest uppercase">Erro 404</p>

        <h1 className="text-proxio-text-main mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t('notFound.title')}
        </h1>

        <img
          src={voidIllustration}
          alt="Página não encontrada - Void"
          className="my-8 w-44 opacity-95 transition-opacity duration-300 hover:opacity-100 md:w-48 lg:w-60"
        />

        <p className="text-proxio-text-muted mx-auto mt-4 max-w-md text-lg">
          {t('notFound.description')}
        </p>

        <div className="mt-8">
          <Link
            to="/"
            className="text-proxio-darker bg-proxio-accent hover:bg-proxio-accent-hover inline-flex items-center gap-2 rounded-md border border-transparent px-6 py-3 text-base font-bold shadow-sm transition-colors"
          >
            {/* Ícone de seta no botão */}
            <ArrowLeft className="h-5 w-5" />
            {t('notFound.backHome')}
          </Link>
        </div>
      </div>
    </main>
  );
}
