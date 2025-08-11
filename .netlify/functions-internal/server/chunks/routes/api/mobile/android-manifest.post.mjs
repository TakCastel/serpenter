import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
import { XMLParser } from 'fast-xml-parser';
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

function getAttr(obj, name) {
  var _a;
  return (_a = obj == null ? void 0 : obj[`@_${name}`]) != null ? _a : obj == null ? void 0 : obj[`@_android:${name}`];
}
const androidManifest_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.manifestXml)) {
    throw createError({ statusCode: 400, statusMessage: 'Param\xE8tre "manifestXml" requis' });
  }
  let manifest;
  try {
    const parser = new XMLParser({ ignoreAttributes: false, allowBooleanAttributes: true });
    manifest = parser.parse(body.manifestXml);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Manifest XML invalide" });
  }
  const root = manifest == null ? void 0 : manifest.manifest;
  if (!root) {
    throw createError({ statusCode: 400, statusMessage: "Racine <manifest> introuvable" });
  }
  const issues = [];
  const usesSdk = root["uses-sdk"] || root.usesSdk;
  const minSdk = getAttr(usesSdk, "minSdkVersion");
  const targetSdk = Number(getAttr(usesSdk, "targetSdkVersion") || 0);
  if (!minSdk) issues.push("minSdkVersion manquant dans <uses-sdk>");
  if (!targetSdk) issues.push("targetSdkVersion manquant dans <uses-sdk>");
  if (targetSdk && targetSdk < 33) issues.push(`targetSdkVersion recommand\xE9 \u2265 33 (actuel: ${targetSdk})`);
  const app = root.application;
  if (app) {
    const allowBackup = String((_a = getAttr(app, "allowBackup")) != null ? _a : "").toLowerCase();
    if (allowBackup === "true" || allowBackup === "") {
      issues.push('android:allowBackup devrait \xEAtre "false" en production');
    }
    const cleartext = String((_b = getAttr(app, "usesCleartextTraffic")) != null ? _b : "").toLowerCase();
    if (cleartext === "true") {
      issues.push("android:usesCleartextTraffic = true (\xE9vitez le HTTP non chiffr\xE9)");
    }
    const activities = Array.isArray(app.activity) ? app.activity : app.activity ? [app.activity] : [];
    for (const act of activities) {
      const hasIntentFilter = !!act["intent-filter"];
      const exported = getAttr(act, "exported");
      if (hasIntentFilter && (exported === void 0 || exported === "")) {
        issues.push("Activity avec <intent-filter> doit d\xE9finir android:exported (API 31+)");
      }
    }
  } else {
    issues.push("<application> introuvable");
  }
  return { ok: true, issues, minSdk, targetSdk };
});

export { androidManifest_post as default };
//# sourceMappingURL=android-manifest.post.mjs.map
