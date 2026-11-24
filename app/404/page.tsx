import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/site'
export const metadata = pageMetadata('Страница не найдена','Страница ошибки сайта «Точка опоры».','/404',true)
export default function ErrorPage(){notFound()}
