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

const MOZ_API = "https://http-observatory.security.mozilla.org/api/v1";
const securityObservatory_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  try {
    const body = await readBody(event);
    const { url } = body || {};
    if (!url) {
      throw createError({ statusCode: 400, statusMessage: "URL requise" });
    }
    let hostname;
    try {
      const u = new URL(url);
      hostname = u.hostname;
      if (!hostname || !u.protocol.startsWith("http")) throw new Error("URL invalide");
    } catch {
      throw createError({ statusCode: 400, statusMessage: "URL invalide" });
    }
    const analyzeUrl = `${MOZ_API}/analyze?host=${encodeURIComponent(hostname)}&hidden=true&rescan=false`;
    let analyze = await $fetch(analyzeUrl).catch((e) => {
      throw createError({ statusCode: 502, statusMessage: (e == null ? void 0 : e.message) || "Erreur Observatory" });
    });
    const transientStates = /* @__PURE__ */ new Set(["STARTING", "PENDING", "RUNNING", "QUEUED"]);
    if ((analyze == null ? void 0 : analyze.state) && transientStates.has(analyze.state)) {
      const rescanUrl = `${MOZ_API}/analyze?host=${encodeURIComponent(hostname)}&hidden=true&rescan=true`;
      try {
        await $fetch(rescanUrl);
      } catch {
      }
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 1200));
        analyze = await $fetch(analyzeUrl).catch(() => analyze);
        if (analyze && !analyze.state) break;
        if (analyze && !transientStates.has(analyze.state || "")) break;
      }
    }
    const score = typeof (analyze == null ? void 0 : analyze.score) === "number" ? analyze.score : 0;
    const grade = (analyze == null ? void 0 : analyze.grade) || null;
    return {
      success: true,
      data: {
        host: hostname,
        score,
        grade,
        state: (analyze == null ? void 0 : analyze.state) || "FINISHED",
        testsFailed: (_a = analyze == null ? void 0 : analyze.tests_failed) != null ? _a : null,
        testsPassed: (_b = analyze == null ? void 0 : analyze.tests_passed) != null ? _b : null,
        testsQuantity: (_c = analyze == null ? void 0 : analyze.tests_quantity) != null ? _c : null,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  } catch (error) {
    console.error("Erreur /api/security-observatory:", error);
    throw createError({
      statusCode: (error == null ? void 0 : error.statusCode) || 500,
      statusMessage: (error == null ? void 0 : error.statusMessage) || "Erreur interne du serveur"
    });
  }
});

export { securityObservatory_post as default };
//# sourceMappingURL=security-observatory.post.mjs.map
