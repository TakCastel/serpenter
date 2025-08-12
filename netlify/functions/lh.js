const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');

exports.handler = async (event, context) => {
  // Vérifier la méthode HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { url, basicUser, basicPass, formFactor = 'mobile' } = body;

    // Validation de l'URL
    if (!url || !/^https?:\/\//i.test(url)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid URL' })
      };
    }

    let chrome = null;
    try {
      // Tente Chrome local, sinon Chromium livré par Puppeteer
      try {
        chrome = await chromeLauncher.launch({ 
          chromeFlags: ['--headless=new', '--no-sandbox'] 
        });
      } catch {
        const executablePath = puppeteer.executablePath();
        chrome = await chromeLauncher.launch({ 
          chromeFlags: ['--headless=new', '--no-sandbox'], 
          chromePath: executablePath 
        });
      }

      const headers = {};
      if (basicUser && basicPass) {
        const b64 = Buffer.from(`${basicUser}:${basicPass}`).toString('base64');
        headers.Authorization = `Basic ${b64}`;
      }

      const isMobile = formFactor === 'mobile';

      // Options Lighthouse
      const options = {
        port: chrome.port,
        output: 'json',
        logLevel: 'info',
      };

      // Configuration
      const config = {
        extends: 'lighthouse:default',
        settings: {
          onlyCategories: ['performance', 'seo', 'best-practices', 'accessibility'],
          emulatedFormFactor: isMobile ? 'mobile' : 'desktop',
          extraHeaders: headers,
        },
      };

      const result = await lighthouse(url, options, config);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(result?.lhr || { error: 'No result' })
      };

    } finally {
      if (chrome) await chrome.kill();
    }

  } catch (error) {
    console.error('Lighthouse error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Audit failed', 
        message: error.message 
      })
    };
  }
};
