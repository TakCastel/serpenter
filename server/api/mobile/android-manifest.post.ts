import { defineEventHandler, readBody, createError } from 'h3'
import { XMLParser } from 'fast-xml-parser'

function getAttr(obj: any, name: string) {
  return obj?.[`@_${name}`] ?? obj?.[`@_android:${name}`]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ manifestXml: string }>(event)
  if (!body?.manifestXml) {
    throw createError({ statusCode: 400, statusMessage: 'Paramètre "manifestXml" requis' })
  }

  let manifest: any
  try {
    const parser = new XMLParser({ ignoreAttributes: false, allowBooleanAttributes: true })
    manifest = parser.parse(body.manifestXml)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Manifest XML invalide' })
  }

  const root = manifest?.manifest
  if (!root) {
    throw createError({ statusCode: 400, statusMessage: 'Racine <manifest> introuvable' })
  }

  const issues: string[] = []
  const usesSdk = root['uses-sdk'] || root.usesSdk
  const minSdk = getAttr(usesSdk, 'minSdkVersion')
  const targetSdk = Number(getAttr(usesSdk, 'targetSdkVersion') || 0)
  if (!minSdk) issues.push('minSdkVersion manquant dans <uses-sdk>')
  if (!targetSdk) issues.push('targetSdkVersion manquant dans <uses-sdk>')
  if (targetSdk && targetSdk < 33) issues.push(`targetSdkVersion recommandé ≥ 33 (actuel: ${targetSdk})`)

  const app = root.application
  if (app) {
    const allowBackup = String(getAttr(app, 'allowBackup') ?? '').toLowerCase()
    if (allowBackup === 'true' || allowBackup === '') {
      issues.push('android:allowBackup devrait être "false" en production')
    }

    const cleartext = String(getAttr(app, 'usesCleartextTraffic') ?? '').toLowerCase()
    if (cleartext === 'true') {
      issues.push('android:usesCleartextTraffic = true (évitez le HTTP non chiffré)')
    }

    const activities = Array.isArray(app.activity) ? app.activity : (app.activity ? [app.activity] : [])
    for (const act of activities) {
      const hasIntentFilter = !!act['intent-filter']
      const exported = getAttr(act, 'exported')
      if (hasIntentFilter && (exported === undefined || exported === '')) {
        issues.push('Activity avec <intent-filter> doit définir android:exported (API 31+)')
      }
    }
  } else {
    issues.push('<application> introuvable')
  }

  return { ok: true, issues, minSdk, targetSdk }
})


