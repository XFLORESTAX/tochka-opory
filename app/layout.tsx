import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@fontsource-variable/manrope'
import '@fontsource-variable/cormorant-garamond'
import '@fontsource-variable/cormorant-garamond/wght-italic.css'
import './globals.css'
import { Footer, Header } from '@/components/ui'
import { baseUrl, draft } from '@/lib/site'
export const metadata: Metadata = {metadataBase:new URL(baseUrl), applicationName:'ТОЧКА ОПОРЫ'}
export default function Layout({children}:{children:ReactNode}) {
 return <html lang="ru"><body><a className="skip" href="#content">Перейти к содержанию</a><Header />
 {draft&&<div className="draft">Предварительная версия сайта</div>}
 <main id="content">{children}</main><Footer /></body></html>
}
