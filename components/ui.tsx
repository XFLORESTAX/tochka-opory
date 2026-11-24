import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { services } from '@/lib/catalog'
import { MobileNav } from './MobileNav'

const links = [
  ['/#services','Консультации'], ['/#about','О проекте'], ['/club','Клуб'], ['/#faq','Вопросы'],
]

function Brand() {
  return <Link className="brand" href="/" aria-label="Точка опоры, главная">
    <span className="brand-mark" aria-hidden="true"><i /></span>
    <span>ТОЧКА ОПОРЫ<small>ПРОСТРАНСТВО ПСИХОЛОГИИ</small></span>
  </Link>
}

export function Header() {
  return <header className="header"><div className="wrap nav-row">
    <Brand />
    <nav className="desktop-nav" aria-label="Основное меню">{links.map(([href,title]) => <Link key={href} href={href}>{title}</Link>)}</nav>
    <Link className="btn outline nav-cta" href="/booking">Записаться</Link>
    <MobileNav links={[...links, ['/booking','Записаться']]} />
  </div></header>
}

export function Hero({club = false}: {club?: boolean}) {
  return <section className={'hero '+(club?'club-hero':'home-hero')}>
    <Image fill preload sizes="100vw" src={club?'/images/club.jpg':'/images/hero.jpg'} alt="" />
    <div className="wrap hero-content">
      <div className="eyebrow"><span />{club?'ОБЩЕСТВО И САМОПОЗНАНИЕ':'ПРОСТРАНСТВО ПСИХОЛОГИИ'}</div>
      <h1>{club?<>Ближе <em>к себе</em></>:<>Всё начинается<br /><em>с тебя.</em></>}</h1>
      <p>{club?'Клуб для тех, кто хочет лучше слышать себя и обсуждать важное в бережном сообществе.':'Индивидуальные консультации и сообщество для тех, кто хочет лучше понимать себя и найти опору в переменах.'}</p>
      <div className="actions"><Link className="btn light" href={club?'#plans':'/booking'}>{club?'Посмотреть тарифы':'Записаться на консультацию'}</Link>
      <Link className="btn ghost" href={club?'#club-about':'/club'}>{club?'О клубе':'О клубе «Ближе к себе»'}</Link></div>
    </div>
  </section>
}

export function SectionTitle({label, children}: {label?:string,children:ReactNode}) {
  return <div className="section-title">{label&&<p className="eyebrow"><span />{label}</p>}<h2>{children}</h2></div>
}

export function ServiceCard({service}: {service:typeof services[number]}) {
  return <article className="service-card">
    <div className="card-image"><Image fill sizes="(max-width:550px) 100vw, (max-width:950px) 50vw, 27vw" src={'/images/'+service.image+'.jpg'} alt="" /></div>
    <div className="card-body">
      <p className="card-meta"><span>{service.duration}</span><strong>€{service.price}{service.monthly?'/мес.':''}</strong></p>
      <h3>{service.name}</h3><p className="card-desc">{service.description}</p>
      <details><summary>Что входит</summary><p>{service.includes}</p></details>
      <Link className="btn outline" href={'/booking?service='+service.id}>Выбрать формат</Link>
    </div>
  </article>
}

export function ProgramCard({service}: {service:typeof services[number]}) {
  return <ServiceCard service={service} />
}

export function About() {
  return <section id="about" className="section sage"><div className="wrap split">
    <div className="arch media"><Image fill sizes="(max-width:750px) 100vw, 50vw" src="/images/window.jpg" alt="Мягкий дневной свет в интерьере" /></div>
    <div><SectionTitle label="О ПРОЕКТЕ">Время для себя</SectionTitle>
      <p>В «Точке опоры» предусмотрены индивидуальные встречи, программы на несколько консультаций и группа для обсуждения повседневных вопросов.</p>
      <div className="divider" />
      <h3>О специалисте и квалификации</h3>
      <p>Сведения об исполнителе, образовании и праве на оказание услуг появятся после проверки документов.</p>
    </div>
  </div></section>
}

export function ClubPreview() {
  return <section className="section forest"><div className="wrap split">
    <div><SectionTitle label="КЛУБ">Ближе к себе</SectionTitle>
      <p>Годовая программа о границах, отношениях и заботе о себе. Каждый месяц посвящён одной теме, которую можно обсуждать на встречах и исследовать в своём темпе между ними.</p>
      <Link className="btn light" href="/club">Посмотреть программу</Link></div>
    <div className="arch media"><Image fill sizes="(max-width:750px) 100vw, 50vw" src="/images/club.jpg" alt="Горы и лес в вечернем свете" /></div>
  </div></section>
}

export function FAQ({items}: {items:string[][]}) {
  return <div className="faq">{items.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
}

export function Footer() {
  return <footer className="footer"><div className="wrap footer-row">
    <Brand /><div><Link href="/privacy">Конфиденциальность</Link><Link href="/terms">Условия оказания услуг</Link></div>
    <div><Link href="/club">Клуб</Link><Link href="/booking">Запись</Link></div>
  </div></footer>
}
