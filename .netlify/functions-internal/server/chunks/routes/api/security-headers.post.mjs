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

const securityHeaders_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { url } = body || {};
    if (!url) {
      throw createError({ statusCode: 400, statusMessage: "URL requise" });
    }
    let targetUrl;
    try {
      const urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        throw new Error("Protocole non support\xE9");
      }
      targetUrl = urlObj.toString();
    } catch {
      throw createError({ statusCode: 400, statusMessage: "URL invalide" });
    }
    let response = null;
    try {
      response = await fetch(targetUrl, { method: "HEAD" });
      if (!response.ok) {
        response = await fetch(targetUrl, { method: "GET" });
      }
    } catch (e) {
      response = await fetch(targetUrl, { method: "GET" }).catch(() => null);
    }
    if (!response) {
      throw createError({ statusCode: 502, statusMessage: "Impossible d'acc\xE9der \xE0 l'URL fournie" });
    }
    const wantedHeaders = [
      "content-security-policy",
      "x-frame-options",
      "x-content-type-options",
      "x-xss-protection",
      "strict-transport-security",
      "referrer-policy",
      "permissions-policy",
      "cross-origin-embedder-policy",
      "cross-origin-opener-policy",
      "cross-origin-resource-policy"
    ];
    const headers = {};
    for (const h of wantedHeaders) {
      headers[h] = response.headers.get(h);
    }
    const scoringKeys = [
      "content-security-policy",
      "x-frame-options",
      "x-content-type-options",
      "strict-transport-security",
      "referrer-policy"
    ];
    const present = scoringKeys.filter((k) => !!headers[k]).length;
    const score = Math.round(present / scoringKeys.length * 100);
    const recommendations = [];
    if (!headers["content-security-policy"]) {
      recommendations.push("Ajouter un Content-Security-Policy pour se prot\xE9ger des attaques XSS et injections");
    }
    if (!headers["x-frame-options"]) {
      recommendations.push("Configurer X-Frame-Options pour pr\xE9venir le clickjacking");
    }
    if (!headers["x-content-type-options"]) {
      recommendations.push("Activer X-Content-Type-Options pour emp\xEAcher le MIME sniffing");
    }
    if (!headers["strict-transport-security"]) {
      recommendations.push("Activer HSTS (Strict-Transport-Security) pour forcer HTTPS");
    }
    if (!headers["referrer-policy"]) {
      recommendations.push("D\xE9finir une Referrer-Policy restrictive (no-referrer ou strict-origin-when-cross-origin)");
    }
    const analysis = {
      presentCount: present,
      totalConsidered: scoringKeys.length,
      missing: scoringKeys.filter((k) => !headers[k])
    };
    return {
      success: true,
      data: {
        score,
        headers,
        analysis,
        recommendations,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  } catch (error) {
    console.error("Erreur /api/security-headers:", error);
    throw createError({
      statusCode: (error == null ? void 0 : error.statusCode) || 500,
      statusMessage: (error == null ? void 0 : error.statusMessage) || "Erreur interne du serveur"
    });
  }
});

export { securityHeaders_post as default };
//# sourceMappingURL=security-headers.post.mjs.map
