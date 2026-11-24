'use client'
import Link from 'next/link'
import { useRef } from 'react'

export function MobileNav({links}:{links:string[][]}) {
  const menu = useRef<HTMLDetailsElement>(null)
  const summary = useRef<HTMLElement>(null)
  return <details className="mobile-nav" ref={menu} onKeyDown={event=>{
    if (event.key === 'Escape' && menu.current?.open) {
      menu.current.open = false
      summary.current?.focus()
    }
  }}>
    <summary ref={element=>{summary.current=element}}>Меню</summary>
    <nav aria-label="Мобильное меню">{links.map(([href,title])=>(
      <Link key={href} href={href} onClick={()=>{if (menu.current) menu.current.open=false}}>{title}</Link>
    ))}</nav>
  </details>
}
