import { baseUrl, draft } from '@/lib/site'
import type { MetadataRoute } from 'next'
export const dynamic = "force-static"
export default function robots(): MetadataRoute.Robots {
 return draft ? {rules:{userAgent:'*',disallow:'/'}}
 : {rules:{userAgent:'*',allow:'/',disallow:['/api/','/success','/404']},sitemap:new URL('/sitemap.xml',baseUrl).href}
}
