import type { Metadata } from 'next'

export const draft = process.env.SITE_DRAFT !== 'false'
export const baseUrl = process.env.SITE_URL || 'http://localhost:3000'
export const siteName = 'ТОЧКА ОПОРЫ'

export function pageMetadata(title: string, description: string, path: string, hidden = false): Metadata {
  return {
    title: `${title} · ${siteName}`,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName, locale: 'ru_RU', type: 'website', images: ['/images/hero.jpg'] },
    robots: { index: !draft && !hidden, follow: !draft && !hidden },
  }
}
