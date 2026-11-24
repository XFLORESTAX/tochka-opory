import { randomUUID } from 'node:crypto'
import { isIP } from 'node:net'
import { NextResponse } from 'next/server'
import { allowRequest, bookingSchema, serverSettings } from '@/lib/booking'
import { createReceipt } from '@/lib/receipt'
import { draft } from '@/lib/site'

const maxBytes = 4096
function fail(status:number,message:string,headers?:HeadersInit) {
 return NextResponse.json({message},{status,headers})
}

async function readPayload(request:Request):Promise<unknown> {
 const reader = request.body?.getReader()
 if (!reader) return null
 const decoder = new TextDecoder('utf-8',{fatal:true})
 let text = ''
 let size = 0
 try {
  while (true) {
   const {done,value} = await reader.read()
   if (done) break
   size += value.byteLength
   if (size>maxBytes) {
    await reader.cancel()
    return null
   }
   text += decoder.decode(value,{stream:true})
  }
  return JSON.parse(text + decoder.decode())
 } catch {
  return null
 } finally {
  reader.releaseLock()
 }
}

export async function POST(request:Request) {
 if (draft) return fail(503,'Приём заявок пока закрыт.')
 try {
  const settings = serverSettings()
  if (!settings) return fail(503,'Приём заявок пока недоступен.')
  if (request.headers.get('origin') !== settings.origin) return fail(403,'Откройте форму на сайте.')
  const client = request.headers.get(settings.clientHeader)?.trim()
  if (!client || !isIP(client)) return fail(503,'Приём заявок пока недоступен.')
  if (!await allowRequest(settings,client)) return fail(429,'Слишком много попыток. Попробуйте через 15 минут.',{'Retry-After':'900'})
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
   return fail(415,'Неверный формат заявки.')
  }
  const result = bookingSchema.safeParse(await readPayload(request))
  if (!result.success) return fail(422,'Проверьте поля заявки, формат контакта и часовой пояс.')
  const {name,contact,service,time,zone} = result.data
  const id = randomUUID()
  const response = await fetch(settings.webhook,{
   method:'POST', redirect:'error',
   headers:{Authorization:'Bearer '+settings.webhookToken,'Content-Type':'application/json','Idempotency-Key':id},
   body:JSON.stringify({id,name,contact,service,time,zone,consentedAt:new Date().toISOString()}),
   signal:AbortSignal.timeout(8000),cache:'no-store',
  })
  if (!response.ok) return fail(502,'Не удалось подтвердить доставку заявки.')
  const confirmation = await response.json()
  if (confirmation.delivered !== true || confirmation.id !== id) return fail(502,'Не удалось подтвердить доставку заявки.')
  const reply = NextResponse.json({delivered:true})
  reply.cookies.set('booking_receipt',createReceipt(settings.secret),{
   path:'/success',httpOnly:true,sameSite:'lax',secure:settings.origin.startsWith('https:'),maxAge:900,
  })
  return reply
 } catch {
  return fail(503,'Не удалось подтвердить доставку заявки. Попробуйте позже.')
 }
}
