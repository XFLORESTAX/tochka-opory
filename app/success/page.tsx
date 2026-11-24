import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { draft, pageMetadata } from '@/lib/site'
import { hasReceipt } from '@/lib/receipt'
export const metadata = pageMetadata('Заявка доставлена','Подтверждение доставки заявки.','/success',true)
export default async function Success(){
 const cookie = (await cookies()).get('booking_receipt')
 if (draft || !hasReceipt(cookie?.value,process.env.BOOKING_SECRET)) redirect('/booking')
 return <section className="section wrap prose"><h1>Заявка доставлена</h1><p>С вами свяжутся по указанному контакту, чтобы согласовать детали.</p><Link className="btn solid" href="/">На главную</Link></section>
}
