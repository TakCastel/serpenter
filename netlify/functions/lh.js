// Netlify Function pour Lighthouse avec fallback Puppeteer
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const puppeteer = require('puppeteer')

exports.handler = async (event, context) => {
  // Gestion CORS pour les requêtes OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    }
  }

  // Vérifier la méthode
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { url, basicUser, basicPass, formFactor = 'mobile' } = JSON.parse(event.body || '{}')

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL requise' })
      }
    }

    // Timeout de 3 minutes (limite Netlify Functions)
    const timeout = setTimeout(() => {
      throw new Error('Timeout')
    }, 180000)

    let chrome = null
    let browser = null
    
    try {
      // Essayer d'abord avec chrome-launcher
      try {
        chrome = await chromeLauncher.launch({
          chromeFlags: [
            '--headless=new',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        })

        const headers = {}
        if (basicUser && basicPass) {
          const b64 = Buffer.from(`${basicUser}:${basicPass}`).toString('base64')
          headers.Authorization = `Basic ${b64}`
        }

        const isMobile = formFactor === 'mobile'

        const options = {
          port: chrome.port,
          output: 'json',
          logLevel: 'info',
        }

        const config = {
          extends: 'lighthouse:default',
          settings: {
            onlyCategories: ['performance', 'seo', 'best-practices', 'accessibility'],
            emulatedFormFactor: isMobile ? 'mobile' : 'desktop',
            extraHeaders: headers,
          },
        }

        const result = await lighthouse(url, options, config)
        
        clearTimeout(timeout)
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
          },
          body: JSON.stringify(result?.lhr || { error: 'No result' })
        }
      } catch (chromeError) {
        console.warn('Chrome-launcher failed, trying Puppeteer:', chromeError.message)
        
        // Fallback vers Puppeteer
        browser = await puppeteer.launch({
          headless: 'new',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security'
          ]
        })

        const page = await browser.newPage()
        
        // Configuration des headers d'authentification
        if (basicUser && basicPass) {
          await page.setExtraHTTPHeaders({
            'Authorization': `Basic ${Buffer.from(`${basicUser}:${basicPass}`).toString('base64')}`
          })
        }

        // Configuration mobile/desktop
        if (formFactor === 'mobile') {
          await page.emulate(puppeteer.devices['iPhone 12'])
        }

        // Navigation vers l'URL
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
        
        // Attendre que la page soit chargée
        await page.waitForTimeout(2000)

        // Exécuter Lighthouse via CDN (fallback)
        const lighthouseResult = await page.evaluate(async (url) => {
          try {
            const { default: lighthouse } = await import('https://cdn.skypack.dev/lighthouse')
            return await lighthouse(url, undefined, {
              extends: 'lighthouse:default',
              settings: {
                onlyCategories: ['performance', 'seo', 'best-practices', 'accessibility'],
                emulatedFormFactor: 'mobile'
              }
            })
          } catch (e) {
            return { error: 'Lighthouse CDN failed: ' + e.message }
          }
        }, url)

        clearTimeout(timeout)
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
          },
          body: JSON.stringify(lighthouseResult?.lhr || lighthouseResult || { error: 'No result' })
        }
      }
    } finally {
      if (chrome) await chrome.kill()
      if (browser) await browser.close()
      clearTimeout(timeout)
    }
  } catch (err) {
    console.error('Lighthouse error:', err)
    
    if (err?.message === 'Timeout') {
      return {
        statusCode: 504,
        body: JSON.stringify({ error: 'Audit timeout' })
      }
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: err?.message || 'Audit failed',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      })
    }
  }
}
