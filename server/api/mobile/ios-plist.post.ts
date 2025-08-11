import { defineEventHandler, readBody, createError } from 'h3'
import plist from 'plist'
import { XMLValidator } from 'fast-xml-parser'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ plist: string }>(event)
  if (!body?.plist) {
    throw createError({ statusCode: 400, statusMessage: 'Paramètre "plist" requis' })
  }

  // Nettoyage basique au cas où l'utilisateur colle un bloc Markdown
  const raw = body.plist
    .replace(/```[a-zA-Z]*\s*/g, '')
    .replace(/```/g, '')
    .trim()

  if (!raw.startsWith('<')) {
    throw createError({ statusCode: 400, statusMessage: 'Le contenu ne semble pas être du XML. Collez le contenu brut du Info.plist (XML).' })
  }
  if (!/<plist\b[^>]*>/i.test(raw)) {
    throw createError({ statusCode: 400, statusMessage: 'Balise <plist> introuvable. Collez le Info.plist complet (XML).' })
  }

  const valid = XMLValidator.validate(raw)
  if (valid !== true) {
    const err: any = valid?.err || {}
    const msg = err.msg ? `${err.msg} (ligne ${err.line}, colonne ${err.col})` : 'XML invalide'
    throw createError({ statusCode: 400, statusMessage: `Plist XML invalide: ${msg}` })
  }

  let data: any
  try {
    data = plist.parse(raw)
  } catch (e: any) {
    // Fournir l'erreur exacte du parseur plist
    const detail = e?.message || 'Erreur inconnue lors du parsing du plist'
    throw createError({ statusCode: 400, statusMessage: `Plist invalide: ${detail}` })
  }

  const issues: string[] = []
  const warnIf = (cond: boolean, msg: string) => { if (cond) issues.push(msg) }

  const id = data.CFBundleIdentifier as string | undefined
  warnIf(!id, 'CFBundleIdentifier manquant')
  warnIf(!!id && !/^[A-Za-z0-9.-]+$/.test(id), 'CFBundleIdentifier invalide (caractères autorisés: A‑Z, a‑z, 0‑9, . -)')

  const shortV = data.CFBundleShortVersionString as string | undefined
  warnIf(!shortV, 'CFBundleShortVersionString manquant')
  warnIf(!!shortV && !/^\d+\.\d+(\.\d+)?$/.test(shortV), 'CFBundleShortVersionString doit être au format X.Y(.Z)')

  const buildV = data.CFBundleVersion as string | undefined
  warnIf(!buildV, 'CFBundleVersion manquant')
  warnIf(!!buildV && !/^\d+(\.\d+){0,2}$/.test(buildV), 'CFBundleVersion doit être 1 à 3 entiers séparés par des points')

  const usageKeys = Object.keys(data).filter(k => /UsageDescription$/.test(k))
  for (const k of usageKeys) {
    const v = (data[k] ?? '').toString().trim()
    warnIf(!v, `${k} vide`)
    warnIf(/^(tbd|todo|lorem)/i.test(v), `${k} contient un texte provisoire (placeholder)`) 
  }

  return { ok: true, issues, usageKeys }
})


