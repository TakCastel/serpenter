import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
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

function limit(name, value, max) {
  if (!value) return [];
  return value.length > max ? [`${name} d\xE9passe ${max} caract\xE8res (${value.length}).`] : [];
}
const metadata_post = defineEventHandler(async (event) => {
  var _a;
  const { platform = "both", data = {} } = await readBody(event) || {};
  if (!data || typeof data !== "object") {
    throw createError({ statusCode: 400, statusMessage: "Donn\xE9es manquantes" });
  }
  const issues = { ios: [], android: [] };
  if (platform === "ios" || platform === "both") {
    issues.ios.push(
      ...limit("Nom (App Store)", data.name, 30),
      ...limit("Sous\u2011titre", data.subtitle, 30),
      ...limit("Mots\u2011cl\xE9s", data.keywords, 100),
      ...limit("Texte promotionnel", data.promotionalText, 170),
      ...limit("Description", data.description, 4e3),
      ...limit("Notes de version", data.releaseNotes, 4e3)
    );
  }
  if (platform === "android" || platform === "both") {
    const androidReleaseNotes = (_a = data.androidReleaseNotes) != null ? _a : data.releaseNotes;
    issues.android.push(
      ...limit("Titre (Play Store)", data.title, 30),
      ...limit("Courte description", data.shortDescription, 80),
      ...limit("Description compl\xE8te", data.fullDescription, 4e3),
      ...limit("Notes de version", androidReleaseNotes, 500)
    );
  }
  return {
    ok: true,
    issues,
    hints: {
      ios: "Respecter: Nom\u226430, Sous\u2011titre\u226430, Mots\u2011cl\xE9s\u2264100, Promo\u2264170, Description\u22644000.",
      android: "Respecter: Titre\u226430, Courte desc\u226480, Description\u22644000, Notes\u2264500."
    }
  };
});

export { metadata_post as default };
//# sourceMappingURL=metadata.post.mjs.map
