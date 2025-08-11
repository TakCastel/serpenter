import { defineEventHandler, readBody, createError } from 'h3'

type Platform = 'ios' | 'android' | 'both'
interface Body {
  platform?: Platform
  data?: Record<string, any>
}

function limit(name: string, value: string | undefined, max: number) {
  if (!value) return [] as string[]
  return value.length > max ? [`${name} dépasse ${max} caractères (${value.length}).`] : []
}

export default defineEventHandler(async (event) => {
  const { platform = 'both', data = {} } = await readBody<Body>(event) || {}
  if (!data || typeof data !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Données manquantes' })
  }

  const issues: Record<string, string[]> = { ios: [], android: [] }

  if (platform === 'ios' || platform === 'both') {
    issues.ios.push(
      ...limit('Nom (App Store)', (data as any).name, 30),
      ...limit('Sous‑titre', (data as any).subtitle, 30),
      ...limit('Mots‑clés', (data as any).keywords, 100),
      ...limit('Texte promotionnel', (data as any).promotionalText, 170),
      ...limit('Description', (data as any).description, 4000),
      ...limit('Notes de version', (data as any).releaseNotes, 4000),
    )
  }

  if (platform === 'android' || platform === 'both') {
    const androidReleaseNotes = (data as any).androidReleaseNotes ?? (data as any).releaseNotes
    issues.android.push(
      ...limit('Titre (Play Store)', (data as any).title, 30),
      ...limit('Courte description', (data as any).shortDescription, 80),
      ...limit('Description complète', (data as any).fullDescription, 4000),
      ...limit('Notes de version', androidReleaseNotes, 500),
    )
  }

  return {
    ok: true,
    issues,
    hints: {
      ios: 'Respecter: Nom≤30, Sous‑titre≤30, Mots‑clés≤100, Promo≤170, Description≤4000.',
      android: 'Respecter: Titre≤30, Courte desc≤80, Description≤4000, Notes≤500.'
    }
  }
})


