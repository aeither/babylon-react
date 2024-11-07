import type { Locale } from 'babylon-react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Providers } from './providers';

export function generateStaticParams() {
  return [{ locale: 'en-US' }, { locale: 'zh-CN' }];
}

// Dynamic metadata with locale
export async function generateMetadata(
  { params: { locale } }: { params: { locale: Locale } }
) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('title')
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
