import { createHmac, timingSafeEqual } from 'node:crypto'

function signature(value:string, secret:string) {
  return createHmac('sha256', secret).update(value).digest()
}

export function createReceipt(secret:string) {
  const expires = String(Date.now() + 15 * 60 * 1000)
  return expires + '.' + signature(expires,secret).toString('hex')
}

export function hasReceipt(value:string|undefined, secret:string|undefined) {
  if (!value || !secret || !/^\d{13}\.[a-f0-9]{64}$/.test(value)) return false
  const [expires, mac] = value.split('.')
  return Number(expires) > Date.now() && timingSafeEqual(signature(expires,secret),Buffer.from(mac,'hex'))
}
