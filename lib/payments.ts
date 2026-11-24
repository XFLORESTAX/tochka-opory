export const paymentsEnabled = false

export interface PaymentProvider {
 // Адаптер проверяет подпись по необработанному телу и заголовкам запроса.
 verifySignature(body:Uint8Array, headers:Headers):Promise<{eventId:string,paymentId:string}|null>
 // Источник истины — серверный API платёжного провайдера.
 fetchPayment(paymentId:string):Promise<{orderId:string,amountMinor:number,currency:string,paid:boolean}>
}
export interface PaymentStore {
 // Сверка ожидаемой суммы, валюты и заказа, уникальность события и платежа
 // и изменение статуса заказа выполняются одной атомарной операцией.
 confirmOnce(input:{eventId:string,paymentId:string,orderId:string,amountMinor:number,currency:string}):Promise<void>
}
export async function processPaymentWebhook(body:Uint8Array,headers:Headers,provider:PaymentProvider,store:PaymentStore) {
 if (!paymentsEnabled) return 'disabled'
 const event = await provider.verifySignature(body,headers)
 if (!event) return 'invalid'
 const payment = await provider.fetchPayment(event.paymentId)
 if (!payment.paid) return 'pending'
 const {orderId,amountMinor,currency} = payment
 await store.confirmOnce({...event,orderId,amountMinor,currency})
 return 'confirmed'
}
