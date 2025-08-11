import { d as defineEventHandler, r as readBody, c as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@intlify/utils';
import 'vue-router';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'node:crypto';
import 'consola';

let lighthouse;
let launch;
let puppeteer;
const lh_post = defineEventHandler(async (event) => {
  if (!lighthouse) {
    const lh = await import('lighthouse');
    lighthouse = lh.default || lh;
  }
  if (!launch) {
    const chromeLauncher = await import('chrome-launcher');
    launch = chromeLauncher.launch;
  }
  if (!puppeteer) {
    const p = await import('puppeteer');
    puppeteer = p.default || p;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1e3 * 60 * 3);
  try {
    const { url, basicUser, basicPass, formFactor = "mobile" } = await readBody(event);
    if (!url || !/^https?:\/\//i.test(url)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid URL" });
    }
    let chrome = null;
    try {
      try {
        chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
      } catch {
        const executablePath = puppeteer.executablePath();
        chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox"], chromePath: executablePath });
      }
      const headers = {};
      if (basicUser && basicPass) {
        const b64 = Buffer.from(`${basicUser}:${basicPass}`).toString("base64");
        headers.Authorization = `Basic ${b64}`;
      }
      const isMobile = formFactor === "mobile";
      const options = {
        port: chrome.port,
        output: "json",
        logLevel: "info"
      };
      const config = {
        extends: "lighthouse:default",
        settings: {
          onlyCategories: ["performance", "seo", "best-practices", "accessibility"],
          emulatedFormFactor: isMobile ? "mobile" : "desktop",
          extraHeaders: headers
        }
      };
      const result = await lighthouse(url, options, config);
      return (result == null ? void 0 : result.lhr) || { error: "No result" };
    } finally {
      if (chrome) await chrome.kill();
    }
  } catch (err) {
    if ((err == null ? void 0 : err.name) === "AbortError") {
      throw createError({ statusCode: 504, statusMessage: "Audit timeout" });
    }
    throw createError({ statusCode: 500, statusMessage: (err == null ? void 0 : err.message) || "Audit failed" });
  } finally {
    clearTimeout(timeout);
  }
});

export { lh_post as default };
//# sourceMappingURL=lh.post.mjs.map
