import { BookingForm } from '@/components/BookingForm'
import { SectionTitle } from '@/components/ui'
import { draft, pageMetadata } from '@/lib/site'
export const metadata = pageMetadata('Запись','Заявка на консультацию, программу или участие в клубе.','/booking')
export default async function Booking({searchParams}:{searchParams:Promise<{service?:string|string[]}>}) {
 const {service} = await searchParams
 return <section className="section sage"><div className="wrap split"><div><h1 className="page-heading">Запись</h1><p>Выберите формат и удобное время. Для согласования встречи используем указанный вами контакт.</p></div>
 <div><SectionTitle>Заявка</SectionTitle><BookingForm draft={draft} selected={typeof service==='string'?service:''}/></div></div></section>
}
