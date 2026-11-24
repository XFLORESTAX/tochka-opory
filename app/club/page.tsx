import Link from 'next/link'
import { BookingForm } from '@/components/BookingForm'
import { FAQ, Hero, SectionTitle } from '@/components/ui'
import { plans, topics } from '@/lib/catalog'
import { draft, pageMetadata } from '@/lib/site'
export const metadata = pageMetadata('Клуб «Ближе к себе»','Клубная программа на 12 месяцев, групповые встречи и тарифы участия.','/club')
export default function Club() {
 return <>
  <Hero club/>
  <section id="club-about" className="section"><div className="wrap split"><SectionTitle>Сообщество, где можно говорить о важном</SectionTitle><div><p>«Ближе к себе» объединяет людей, которым интересно исследовать повседневный опыт и учиться разговаривать о нём бережно.</p><h3>Что входит в участие</h3><ul className="lined"><li>Групповые онлайн-встречи</li><li>Материалы по теме месяца</li><li>Вопросы для самостоятельных размышлений</li></ul></div></div></section>
  <section className="section sand"><div className="wrap"><SectionTitle label="ПРОГРАММА">Двенадцать тем на год</SectionTitle><ol className="topics">{topics.map(([name,body])=><li key={name}><h3>{name}</h3><p>{body}</p></li>)}</ol></div></section>
  <section className="section sage"><div className="wrap split"><SectionTitle>Встречи и правила участия</SectionTitle><div><p>Встреча проходит онлайн. Ведущий обозначает тему, предлагает вопросы для обсуждения и оставляет время для итогов. Можно говорить, задавать вопросы или слушать.</p><ul className="lined"><li>Не записывайте встречи и не пересказывайте чужие истории.</li><li>Говорите от своего имени и уважайте право других не отвечать.</li><li>Воздержитесь от диагнозов и непрошеных советов.</li></ul><p>Клуб не является экстренной психологической помощью.</p></div></div></section>
  <section id="plans" className="section"><div className="wrap"><SectionTitle>Тарифы участия</SectionTitle>
   <div className="cards programs">{plans.map(plan=><article className="plan" key={plan.id}><h3>{plan.name}</h3><p className="plan-price">€{plan.price}</p><p>Групповые встречи и материалы на выбранный срок.</p><Link className="btn outline" href={'/booking?service='+plan.id}>Выбрать тариф</Link></article>)}</div>
   <p className="muted">Онлайн-оплата пока недоступна. Условия участия согласовываются после заявки.</p>
  </div></section>
  <section className="section sand"><div className="wrap split"><SectionTitle>Вопросы о клубе</SectionTitle><FAQ items={[
   ['Можно ли просто слушать?','Да. Вы сами решаете, готовы ли говорить на встрече.'],
   ['Как узнать расписание?','Время и продолжительность встреч сообщают при согласовании участия.'],
   ['Когда открывается доступ?','Отправка заявки не активирует участие. Дату начала и способ доступа согласовывают отдельно.'],
  ]}/></div></section>
  <section className="section sage" id="join"><div className="wrap split"><SectionTitle>Вступить в клуб</SectionTitle><BookingForm draft={draft} club/></div></section>
 </>
}
