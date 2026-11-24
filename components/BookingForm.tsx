'use client'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { bookingOptions } from '@/lib/catalog'

export function BookingForm({draft, selected='', club=false}: {draft:boolean, selected?:string, club?:boolean}) {
  const router = useRouter()
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  const options = club ? bookingOptions.filter(({id}) => id.startsWith('club-')) : bookingOptions
  const defaultOption = options.some(({id}) => id === selected) ? selected : ''
  const serviceField = useRef<HTMLSelectElement>(null)
  const [zone,setZone] = useState('')
  useEffect(()=>{
    if (!draft || selected || !serviceField.current || !/^\/booking\/?$/.test(window.location.pathname)) return
    const requested = new URLSearchParams(window.location.search).get('service')
    if (bookingOptions.some(option=>option.id===requested)) serviceField.current.value = requested!
  },[draft,selected])
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || draft) return
    setBusy(true)
    setError('')
    const payload = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const response = await fetch('/api/booking', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok || result.delivered !== true) {
        setError(result.message || 'Не удалось подтвердить доставку.')
        return
      }
      router.push('/success')
    } catch {
      setError('Не удалось подтвердить доставку. Попробуйте позже.')
    } finally {
      setBusy(false)
    }
  }
  return <form className="booking-form" onSubmit={submit} onFocus={() => {
    if (!zone) setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }}>
    {draft&&<p className="notice">Предварительная версия. Приём заявок пока закрыт.</p>}
    <fieldset disabled={draft||busy}>
      <div className="form-grid">
        <label>Имя<input name="name" autoComplete="name" required maxLength={80} /></label>
        <label>Email или Telegram<input name="contact" autoCapitalize="none" required maxLength={160} placeholder="name@example.com или @username" /></label>
        <label className="full">{club?'Тариф':'Выбранная услуга'}<select ref={serviceField} name="service" required defaultValue={defaultOption}>
          <option value="" disabled>Выберите вариант</option>{options.map(({id,name}) => <option value={id} key={id}>{name}</option>)}
        </select></label>
        <label>Предпочтительное время<input name="time" type="datetime-local" required /></label>
        <label>Часовой пояс<input name="zone" required value={zone} onChange={event=>setZone(event.target.value)} maxLength={64} placeholder="Europe/Moscow" /></label>
      </div>
      <div className="trap" aria-hidden="true"><label>Сайт<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="consent"><input id={club?'club-consent':'booking-consent'} type="checkbox" name="consent" required /><label htmlFor={club?'club-consent':'booking-consent'}>Согласен(-на) на обработку данных по <Link href="/privacy">политике конфиденциальности</Link>.</label></div>
      <button className="btn solid" type="submit">{busy?'Отправляем…':club?'Подать заявку на вступление':'Отправить заявку'}</button>
    </fieldset>
    <p className="form-error" role="alert">{error}</p>
  </form>
}
