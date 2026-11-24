// Собирает статический черновик для закрытого предпросмотра.
import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve, join } from 'node:path'

const root = process.cwd()
const work = mkdtempSync(join(root, '.preview-'))
try {
  for (const item of ['app', 'components', 'lib', 'public', 'package.json', 'tsconfig.json', 'postcss.config.mjs']) {
    cpSync(resolve(root, item), join(work, item), { recursive: true })
  }
  symlinkSync(resolve(root, 'node_modules'), join(work, 'node_modules'), 'dir')
  rmSync(join(work, 'app/api'), { recursive: true })
  rmSync(join(work, 'app/404'), { recursive: true })
  writeFileSync(join(work, 'next.config.ts'), "export default {output:'export',images:{unoptimized:true},trailingSlash:true}\n")
  writeFileSync(join(work,'app/success/page.tsx'), `
    import Link from 'next/link'
    import { pageMetadata } from '@/lib/site'
    export const metadata = pageMetadata('Подтверждение заявки','Статус доставки заявки.','/success',true)
    export default function Success(){return <section className="section wrap prose">
      <h1>Подтверждение заявки</h1><p>В предварительной версии приём заявок закрыт.</p>
      <Link className="btn solid" href="/booking">К форме записи</Link>
    </section>}
  `)
  const booking = join(work,'app/booking/page.tsx')
  writeFileSync(booking, `
    import { BookingForm } from '@/components/BookingForm'
    import { pageMetadata } from '@/lib/site'
    export const metadata = pageMetadata('Запись','Заявка на консультацию или участие в клубе.','/booking')
    export default function Booking(){return <section className="section sage"><div className="wrap split">
      <div><h1 className="page-heading">Запись</h1><p>Выберите формат и удобное время.</p></div>
      <BookingForm draft/>
    </div></section>}
  `)
  const result = spawnSync(process.execPath, [resolve(root,'node_modules/next/dist/bin/next'),'build'], {
    cwd:work, stdio:'inherit', env:{...process.env,SITE_DRAFT:'true'},
  })
  if (result.status !== 0) throw new Error('Не удалось собрать предварительную версию.')
  const dist = resolve(root, 'dist')
  rmSync(dist, { recursive:true, force:true })
  mkdirSync(dist)
  cpSync(join(work,'out'), dist, { recursive:true })
} finally {
  rmSync(work, { recursive: true, force: true })
}
