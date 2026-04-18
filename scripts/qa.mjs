import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const url = 'http://localhost:3000'
const dir = './temporary screenshots'
if (!fs.existsSync(dir)) fs.mkdirSync(dir)

const getNextIndex = () =>
  fs.readdirSync(dir).filter((f) => f.endsWith('.png')).length + 1

async function captureSection(page, selector, labelPrefix) {
  const bounds = await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    return {
      top: el.getBoundingClientRect().top + window.scrollY,
      height: el.offsetHeight,
    }
  }, selector)
  if (!bounds) return
  await page.evaluate(
    (y) => window.scroll({ top: y, left: 0, behavior: 'instant' }),
    Math.max(0, bounds.top - 16),
  )
  await new Promise((r) => setTimeout(r, 900))
  const n = getNextIndex()
  const fp = path.join(dir, `screenshot-${n}-${labelPrefix}.png`)
  const vw = page.viewport().width
  const clipH = Math.min(bounds.height + 32, 1800)
  await page.screenshot({
    path: fp,
    clip: { x: 0, y: Math.max(0, bounds.top - 16), width: vw, height: clipH },
  })
  console.log(`Saved: ${fp}`)
}

const sections = [
  { sel: '.hero',         label: 'hero' },
  { sel: '.ticker',       label: 'ticker' },
  { sel: '.about',        label: 'about' },
  { sel: '.meny-section', label: 'meny' },
  { sel: '.hitta',        label: 'hitta' },
  { sel: '.galleri',      label: 'galleri' },
  { sel: 'footer',        label: 'footer' },
]

const browser = await puppeteer.launch()

const dt = await browser.newPage()
await dt.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await dt.goto(url, { waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 1800))
for (const s of sections) await captureSection(dt, s.sel, `dt-${s.label}`)

const mb = await browser.newPage()
await mb.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 })
await mb.goto(url, { waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 1800))
for (const s of sections) await captureSection(mb, s.sel, `mb-${s.label}`)

await browser.close()
