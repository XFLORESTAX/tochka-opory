import { createHmac } from 'node:crypto'
import { z } from 'zod'
import { bookingOptions } from './catalog'

const localTime = /^\d{4}-\d\d-\d\dT\d\d:\d\d$/
export const bookingSchema = z.object({
 name:z.string().trim().min(1).max(80).regex(/^[^\r\n\x00-\x1F]+$/u),
 contact:z.string().trim().max(160).refine(value=>z.email().safeParse(value).success || /^@[a-zA-Z0-9_]{5,32}$/.test(value)),
 service:z.string().refine(value=>bookingOptions.some(option=>option.id===value)),
 time:z.string().regex(localTime).refine(value=>{
  const date = new Date(value+'Z')
  return Number.isFinite(+date) && date.toISOString().slice(0,16) === value
 }),
 zone:z.string().max(64).refine(value=>{
  try { new Intl.DateTimeFormat('ru',{timeZone:value}); return true } catch { return false }
 }),
 consent:z.literal('on'),
 website:z.literal('').optional(),
}).strict()

export function serverSettings() {
 const {SITE_URL, BOOKING_SECRET, BOOKING_WEBHOOK_URL, BOOKING_WEBHOOK_TOKEN, REDIS_REST_URL, REDIS_REST_TOKEN, BOOKING_CLIENT_IP_HEADER} = process.env
 if (!SITE_URL || !BOOKING_SECRET || BOOKING_SECRET.length < 32 || !BOOKING_WEBHOOK_URL || !BOOKING_WEBHOOK_TOKEN ||
     !REDIS_REST_URL || !REDIS_REST_TOKEN || !BOOKING_CLIENT_IP_HEADER) return
 return {origin:new URL(SITE_URL).origin, secret:BOOKING_SECRET, webhook:BOOKING_WEBHOOK_URL,
  webhookToken:BOOKING_WEBHOOK_TOKEN, redis:REDIS_REST_URL, redisToken:REDIS_REST_TOKEN, clientHeader:BOOKING_CLIENT_IP_HEADER}
}

type Settings = NonNullable<ReturnType<typeof serverSettings>>
export async function allowRequest(settings:Settings, client:string) {
 const id = createHmac('sha256',settings.secret).update(client).digest('hex')
 const script = "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], 900) end; return n"
 const response = await fetch(settings.redis,{
  method:'POST', headers:{Authorization:'Bearer '+settings.redisToken,'Content-Type':'application/json'},
  body:JSON.stringify(['EVAL',script,1,'tochka:booking:'+id]), signal:AbortSignal.timeout(3500),cache:'no-store',
 })
 if (!response.ok) throw new Error('Rate store unavailable')
 const {result} = await response.json()
 if (!Number.isInteger(result) || result<1) throw new Error('Invalid rate store response')
 return result<=5
}
