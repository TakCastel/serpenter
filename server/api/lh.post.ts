import lighthouse from 'lighthouse'
import { launch, LaunchedChrome } from 'chrome-launcher'
import puppeteer from 'puppeteer'

interface Body { url: string; basicUser?: string; basicPass?: string; formFactor?: 'mobile' | 'desktop' }

export default defineEventHandler(async (event) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 1000 * 60 * 3) // 3 min

  try {
    const { url, basicUser, basicPass, formFactor = 'mobile' } = await readBody<Body>(event)
    if (!url || !/^https?:\/\//i.test(url)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid URL' })
    }

    let chrome: LaunchedChrome | null = null
    try {
      // Tente Chrome local, sinon Chromium livré par Puppeteer
      try {
        chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] })
      } catch {
        const executablePath = puppeteer.executablePath()
        chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'], chromePath: executablePath })
      }

      const headers: Record<string, string> = {}
      if (basicUser && basicPass) {
        const b64 = Buffer.from(`${basicUser}:${basicPass}`).toString('base64')
        headers.Authorization = `Basic ${b64}`
      }

      const isMobile = formFactor === 'mobile'

      // Options: uniquement les flags supportés par Lighthouse (port, output, logLevel)
      const options: any = {
        port: chrome!.port,
        output: 'json',
        logLevel: 'info',
      }

      // Configuration: mettre l'émulation et les en-têtes dans settings
      const config: any = {
        extends: 'lighthouse:default',
        settings: {
          onlyCategories: ['performance', 'seo', 'best-practices', 'accessibility'],
          emulatedFormFactor: isMobile ? 'mobile' : 'desktop',
          extraHeaders: headers,
        },
      }

      const result = await lighthouse(url, options, config)
      return result?.lhr || { error: 'No result' }
    } finally {
      if (chrome) await chrome.kill()
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw createError({ statusCode: 504, statusMessage: 'Audit timeout' })
    }
    throw createError({ statusCode: 500, statusMessage: err?.message || 'Audit failed' })
  } finally {
    clearTimeout(timeout)
  }
})
