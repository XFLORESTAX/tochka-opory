import Image from 'next/image'
import { About, ClubPreview, FAQ, Hero, ProgramCard, SectionTitle, ServiceCard } from '@/components/ui'
import { BookingForm } from '@/components/BookingForm'
import { services } from '@/lib/catalog'
import { draft, pageMetadata } from '@/lib/site'
export const metadata = pageMetadata('Всё начинается с тебя','Форматы индивидуальных консультаций, программы и частный клуб «Точка опоры».','/')

const questions = [
  ['Как проходят встречи?','Встречи проходят онлайн. Время и ссылку согласовывают по контакту из заявки.'],
  ['Как выбрать консультацию?','Для первого разговора можно выбрать «Знакомство». На этой встрече можно обсудить ваш запрос и дальнейший формат.'],
  ['Что писать в заявке?','Достаточно имени, контакта, формата, желаемого времени и часового пояса. Описание личной ситуации в форме не требуется.'],
  ['Означает ли заявка, что встреча назначена?','После доставки заявки время и условия встречи согласовываются отдельно.'],
]
const consultationTopics = [
 ['relationships', 'Отношения', 'Конфликты, одиночество, близость и доверие.'],
 ['emotions', 'Эмоциональные состояния', 'Повседневное напряжение, тревожные переживания, усталость.'],
 ['self-esteem', 'Самооценка', 'Сомнения в себе, самокритика и принятие себя.'],
 ['patterns', 'Жизненные сценарии', 'Повторяющиеся ситуации и привычные реакции.'],
 ['self-discovery', 'Поиск себя', 'Ценности, желания, цели и жизненные ориентиры.'],
 ['boundaries', 'Личные границы', 'Отстаивание потребностей и уважение к себе.'],
 ['transitions', 'Жизненные перемены', 'Расставание, переезд, смена работы и сложный выбор.'],
 ['growth', 'Личностное развитие', 'Осознанность и формирование новых привычек.'],
]
const steps = [
 ['Заявка','Выберите формат и оставьте контакт.'],
 ['Согласование','Обсудите время, стоимость и условия.'],
 ['Встреча','Поговорите о том, что для вас сейчас важно.'],
 ['Итоги','Обсудите, нужны ли дальнейшие встречи.'],
]
export default function Home() {
 return <>
  <Hero />
  <section id="services" className="section"><div className="wrap">
   <SectionTitle label="ИНДИВИДУАЛЬНЫЕ ВСТРЕЧИ">Форматы консультаций</SectionTitle>
   <div className="cards">{services.slice(0,4).map(service=><ServiceCard key={service.id} service={service}/>)}</div>
  </div></section>
  <section id="consultation-topics" className="section sand"><div className="wrap">
   <div className="consultation-topics-heading">
    <Image className="consultation-portrait" src="/images/consultation-portrait.jpg" width={512} height={512} alt="Портрет автора проекта" />
    <SectionTitle>С какими запросами можно обратиться</SectionTitle>
   </div>
   <div className="cards consultation-topics">
    {consultationTopics.map(([id, title, description]) => (
     <details className="service-card consultation-topic" key={id}>
      <summary>
       <Image className="consultation-topic-icon" width={20} height={20} src={'/images/topics/'+id+'.svg'} alt="" />
       <span className="consultation-topic-title">{title}</span>
      </summary>
      <p>{description}</p>
     </details>
    ))}
   </div>
  </div></section>
  <About />
  <section className="section"><div className="wrap"><SectionTitle>Как проходит консультация</SectionTitle>
   <ol className="steps">{steps.map(([title,body])=><li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol>
  </div></section>
  <section id="programs" className="section sand"><div className="wrap"><SectionTitle label="РЕГУЛЯРНЫЕ ВСТРЕЧИ">Долгосрочные программы</SectionTitle>
   <div className="cards programs">{services.slice(4).map(service=><ProgramCard key={service.id} service={service}/>)}</div>
  </div></section>
  <ClubPreview />
  <section className="section compact"><div className="wrap"><SectionTitle>Отзывы</SectionTitle><p>Отзывы публикуются с разрешения авторов. Сейчас здесь нет опубликованных отзывов.</p></div></section>
  <section id="faq" className="section sand"><div className="wrap split"><SectionTitle>Частые вопросы</SectionTitle><FAQ items={questions}/></div></section>
  <section className="section"><div className="wrap split"><SectionTitle>Безопасность и границы</SectionTitle><div><p>Условия конфиденциальности и её пределы оговариваются до начала встреч. Вы вправе задавать вопросы, откладывать обсуждение темы или завершить встречу.</p><p>Консультации и клуб не предназначены для экстренной помощи. При непосредственной угрозе жизни или здоровью обратитесь в местную экстренную службу.</p></div></div></section>
  <section id="booking" className="section sage"><div className="wrap split"><SectionTitle label="ЗАПИСЬ">Записаться на консультацию</SectionTitle><BookingForm draft={draft}/></div></section>
 </>
}
