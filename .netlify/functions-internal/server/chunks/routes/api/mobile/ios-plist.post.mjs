import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
import plist from 'plist';
import { XMLValidator } from 'fast-xml-parser';
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

const iosPlist_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.plist)) {
    throw createError({ statusCode: 400, statusMessage: 'Param\xE8tre "plist" requis' });
  }
  const raw = body.plist.replace(/```[a-zA-Z]*\s*/g, "").replace(/```/g, "").trim();
  if (!raw.startsWith("<")) {
    throw createError({ statusCode: 400, statusMessage: "Le contenu ne semble pas \xEAtre du XML. Collez le contenu brut du Info.plist (XML)." });
  }
  if (!/<plist\b[^>]*>/i.test(raw)) {
    throw createError({ statusCode: 400, statusMessage: "Balise <plist> introuvable. Collez le Info.plist complet (XML)." });
  }
  const valid = XMLValidator.validate(raw);
  if (valid !== true) {
    const err = (valid == null ? void 0 : valid.err) || {};
    const msg = err.msg ? `${err.msg} (ligne ${err.line}, colonne ${err.col})` : "XML invalide";
    throw createError({ statusCode: 400, statusMessage: `Plist XML invalide: ${msg}` });
  }
  let data;
  try {
    data = plist.parse(raw);
  } catch (e) {
    const detail = (e == null ? void 0 : e.message) || "Erreur inconnue lors du parsing du plist";
    throw createError({ statusCode: 400, statusMessage: `Plist invalide: ${detail}` });
  }
  const issues = [];
  const warnIf = (cond, msg) => {
    if (cond) issues.push(msg);
  };
  const id = data.CFBundleIdentifier;
  warnIf(!id, "CFBundleIdentifier manquant");
  warnIf(!!id && !/^[A-Za-z0-9.-]+$/.test(id), "CFBundleIdentifier invalide (caract\xE8res autoris\xE9s: A\u2011Z, a\u2011z, 0\u20119, . -)");
  const shortV = data.CFBundleShortVersionString;
  warnIf(!shortV, "CFBundleShortVersionString manquant");
  warnIf(!!shortV && !/^\d+\.\d+(\.\d+)?$/.test(shortV), "CFBundleShortVersionString doit \xEAtre au format X.Y(.Z)");
  const buildV = data.CFBundleVersion;
  warnIf(!buildV, "CFBundleVersion manquant");
  warnIf(!!buildV && !/^\d+(\.\d+){0,2}$/.test(buildV), "CFBundleVersion doit \xEAtre 1 \xE0 3 entiers s\xE9par\xE9s par des points");
  const usageKeys = Object.keys(data).filter((k) => /UsageDescription$/.test(k));
  for (const k of usageKeys) {
    const v = ((_a = data[k]) != null ? _a : "").toString().trim();
    warnIf(!v, `${k} vide`);
    warnIf(/^(tbd|todo|lorem)/i.test(v), `${k} contient un texte provisoire (placeholder)`);
  }
  return { ok: true, issues, usageKeys };
});

export { iosPlist_post as default };
//# sourceMappingURL=ios-plist.post.mjs.map
