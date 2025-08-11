/* Map Lighthouse audit IDs to checklist item IDs */
const lighthouseAuditIdToChecklistItemId: Record<string, string | string[]> = {
  // Titres & meta (IDs alignés avec app/data/checklist-items-web.json)
  'document-title': 'title-tag',
  'meta-description': 'meta-description',
  'canonical': 'canonical',
  'robots-txt': 'robots-txt',
  // Liens internes / crawlabilité
  'is-crawlable': 'internal-links',
  // Images: texte alternatif
  'image-alt': 'alt-text',
}

export function collectChecklistItemIdsFromLhr(lhr: any): string[] {
  if (!lhr || !lhr.audits) return []
  const itemIds: string[] = []

  for (const [auditId, mapped] of Object.entries(lighthouseAuditIdToChecklistItemId)) {
    const audit = lhr.audits?.[auditId]
    if (audit && audit.score === 1) {
      const ids = Array.isArray(mapped) ? mapped : [mapped]
      ids.forEach(id => itemIds.push(id))
    }
  }

  return Array.from(new Set(itemIds))
}




