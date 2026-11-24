import { baseUrl, draft } from '@/lib/site'
import type { MetadataRoute } from 'next'
export const dynamic = "force-static"
export default function sitemap(): MetadataRoute.Sitemap {
 return draft ? [] : ['/','/club','/booking','/privacy','/terms'].map(path=>({url:new URL(path,baseUrl).href}))
}
