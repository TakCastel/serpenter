// Netlify Function pour Lighthouse
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

exports.handler = async (event, context) => {
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

    // Timeout de 4 minutes (limite Netlify Functions)
    const timeout = setTimeout(() => {
      throw new Error('Timeout')
    }, 240000)

    let chrome = null
    try {
      // Lancer Chrome
      chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage']
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
    } finally {
      if (chrome) await chrome.kill()
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
      body: JSON.stringify({ error: err?.message || 'Audit failed' })
    }
  }
}
