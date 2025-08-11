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

function mapGradeToScore(grade) {
  var _a;
  if (!grade) return 0;
  const map = {
    "A+": 100,
    "A": 95,
    "A-": 90,
    "B": 80,
    "C": 70,
    "D": 60,
    "E": 50,
    "F": 40,
    "T": 0,
    "M": 0
  };
  return (_a = map[grade]) != null ? _a : 0;
}
const securitySsl_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { url } = body || {};
    if (!url) {
      throw createError({ statusCode: 400, statusMessage: "URL requise" });
    }
    let hostname;
    try {
      const u = new URL(url);
      if (!["http:", "https:"].includes(u.protocol)) throw new Error("Protocole non support\xE9");
      hostname = u.hostname;
    } catch {
      throw createError({ statusCode: 400, statusMessage: "URL invalide" });
    }
    const base = "https://api.ssllabs.com/api/v3/analyze";
    const query = `host=${encodeURIComponent(hostname)}&fromCache=on&all=done`;
    const res = await $fetch(`${base}?${query}`).catch((e) => {
      throw createError({ statusCode: 502, statusMessage: (e == null ? void 0 : e.message) || "Erreur SSL Labs" });
    });
    const endpoints = Array.isArray(res == null ? void 0 : res.endpoints) ? res.endpoints : [];
    const bestGrade = endpoints.map((e) => e.grade).filter(Boolean).sort((a, b) => mapGradeToScore(b) - mapGradeToScore(a))[0];
    const score = mapGradeToScore(bestGrade);
    const supportsTls13 = !!endpoints.find((e) => {
      var _a, _b;
      return (_b = (_a = e.details) == null ? void 0 : _a.protocols) == null ? void 0 : _b.some((p) => p.name === "TLS" && p.version === "1.3");
    });
    const supportsTls12 = supportsTls13 || !!endpoints.find((e) => {
      var _a, _b;
      return (_b = (_a = e.details) == null ? void 0 : _a.protocols) == null ? void 0 : _b.some((p) => p.name === "TLS" && p.version === "1.2");
    });
    const recommendations = [];
    if (!bestGrade) recommendations.push("Lancer/attendre un scan SSL Labs complet pour obtenir une note");
    if (!supportsTls12) recommendations.push("D\xE9sactiver TLS 1.0/1.1 et activer au minimum TLS 1.2");
    if (!supportsTls13) recommendations.push("Activer TLS 1.3 pour de meilleures performances et s\xE9curit\xE9");
    return {
      success: true,
      data: {
        host: hostname,
        status: res == null ? void 0 : res.status,
        grade: bestGrade || null,
        score,
        endpoints,
        supportsTls12,
        supportsTls13,
        recommendations,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  } catch (error) {
    console.error("Erreur /api/security-ssl:", error);
    throw createError({
      statusCode: (error == null ? void 0 : error.statusCode) || 500,
      statusMessage: (error == null ? void 0 : error.statusMessage) || "Erreur interne du serveur"
    });
  }
});

export { securitySsl_post as default };
//# sourceMappingURL=security-ssl.post.mjs.map
