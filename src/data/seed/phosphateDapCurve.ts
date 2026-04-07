export type DapCurvePeerRegion = 'cis' | 'china' | 'americas' | 'mena' | 'row'

/**
 * CRU-style DAP site table (UTF-8). Replace this string with `import raw from './phosphateDapCurve.csv?raw'`
 * when a committed CSV is available in the repo.
 */
const EMBEDDED_DAP_CSV = `Company,Country,Site,DAP production 000t,DAP site cost $/t,DAP - Conversion costs $/t,DAP - Purchased N $/t,DAP - Purchased P $/t,DAP - Purchased S $/t
EuroChem,Russia,Kingisepp,892.5,238.4,112.3,48.2,52.1,25.8
PhosAgro,Russia,Balakovo,1240.0,241.2,115.0,49.1,53.0,26.1
OCP,Morocco,Jorf Lasfar Hub,1850.0,245.6,118.4,50.2,54.5,27.5
OCP,Morocco,Safi,980.0,248.1,119.8,51.0,55.2,28.1
Nutrien,Canada,Joffre AB,420.0,252.3,121.5,52.4,56.0,28.4
Mosaic,USA,Faustina LA,1100.0,255.0,123.0,53.1,57.2,29.7
MPC,Saudi Arabia,Ras Al-Khair,2065.844,263.186,128.5,55.0,58.8,21.0
Yara,Netherlands,Sluiskil,650.0,268.4,130.2,56.4,59.5,22.3
ICL,Israel,Ramat Hovav,380.0,271.0,131.8,57.0,60.2,22.0
CF Industries,USA,Donaldsonville,890.0,274.5,133.5,58.2,61.0,22.8
MWSPC,Saudi Arabia,Waad Al Shamal,1520.0,276.8,134.2,58.8,61.5,22.3
Mosaic,USA,Riverview FL,720.0,279.2,135.6,59.4,62.1,23.1
Yara,France,Montoir,310.0,282.0,137.0,60.0,63.0,22.0
Nutrien,USA,Geismar,560.0,285.4,138.8,61.2,64.0,23.4
OCP,Morocco,Laayoune,290.0,288.0,140.0,62.0,64.8,21.2
PhosAgro,Russia,Volkhov,410.0,291.5,141.5,62.8,65.5,21.7
EuroChem,Russia,Usolie,330.0,295.0,143.2,63.5,66.2,22.1
Jordan Phosphate,Jordan,Aqaba,240.0,302.4,146.0,65.0,68.0,23.4
Coromandel,India,Ennore,480.0,308.0,149.0,66.5,69.5,23.0
Hubei Yihua,China,Jingzhou,920.0,318.5,154.2,69.0,72.0,23.3
Guizhou Phosphate,China,Guiyang Hub,760.0,325.0,157.5,71.0,74.0,22.5
OCP,Morocco,Benguerir acid,450.0,332.2,161.0,73.2,75.5,22.5
Wengfu,China,Fuquan,550.0,338.8,164.0,74.8,77.0,23.0
Fertiberia,Spain,Huelva,280.0,345.0,167.0,76.5,78.5,23.0
Paradeep,India,Odisha,620.0,352.4,170.5,78.0,80.0,23.9
Yunnan Phosphate,China,Kunming,410.0,362.0,175.0,80.5,82.0,24.5
High-cost China agg,China,Various idled,180.0,398.0,192.0,88.0,90.0,28.0
`

export interface PhosphateDapSiteRow {
  company: string
  country: string
  site: string
  production000t: number
  siteCostUsdPerTon: number
  dapConversionUsdPerTon?: number
  dapNUsdPerTon?: number
  dapPUsdPerTon?: number
  dapSUsdPerTon?: number
}

function normHeader(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[$]/g, '')
}

/** Parse numbers with comma as decimal when no dot present (EU-style). */
export function parseLocaleNumber(raw: string): number {
  const t = raw.trim().replace(/\s/g, '').replace(/[$€£]/g, '')
  if (!t) return NaN
  if (t.includes(',') && !t.includes('.')) return parseFloat(t.replace(',', '.'))
  if (t.includes('.') && !t.includes(',')) return parseFloat(t)
  return parseFloat(t.replace(/,/g, ''))
}

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (!inQuotes && ch === ',') {
      out.push(cur.trim())
      cur = ''
      continue
    }
    cur += ch
  }
  out.push(cur.trim())
  return out
}

function pickCol(headers: string[], aliases: string[]): number {
  const normalized = headers.map(normHeader)
  for (const a of aliases) {
    const na = normHeader(a)
    const i = normalized.indexOf(na)
    if (i >= 0) return i
  }
  for (const a of aliases) {
    const na = normHeader(a).replace(/ /g, '')
    const j = normalized.findIndex((h) => h.replace(/ /g, '') === na)
    if (j >= 0) return j
  }
  return -1
}

export function parsePhosphateDapCurveCsv(csvText: string): PhosphateDapSiteRow[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) return []

  const headerCells = parseCsvLine(lines[0])
  const ci = pickCol(headerCells, ['company', 'producer', 'operator'])
  const yi = pickCol(headerCells, ['country', 'nation'])
  const si = pickCol(headerCells, ['site', 'plant', 'facility'])
  const pi = pickCol(headerCells, [
    'dap production 000t',
    'production 000t',
    'dap production, 000t',
    'production_000t',
  ])
  const costi = pickCol(headerCells, [
    'dap site cost /t',
    'dap site cost usd/t',
    'site cost usd/t',
    'dap site cost $/t',
    'site_cost_usd_per_t',
  ])
  const conv = pickCol(headerCells, [
    'dap - conversion costs /t',
    'dap conversion costs /t',
    'conversion costs /t',
  ])
  const nCol = pickCol(headerCells, ['dap - purchased n /t', 'purchased n /t'])
  const pCol = pickCol(headerCells, ['dap - purchased p /t', 'purchased p /t'])
  const sCol = pickCol(headerCells, ['dap - purchased s /t', 'purchased s /t'])

  if (ci < 0 || yi < 0 || si < 0 || pi < 0 || costi < 0) return []

  const rows: PhosphateDapSiteRow[] = []
  for (let L = 1; L < lines.length; L++) {
    const cells = parseCsvLine(lines[L])
    const company = cells[ci]?.trim() ?? ''
    const country = cells[yi]?.trim() ?? ''
    const site = cells[si]?.trim() ?? ''
    const prod = parseLocaleNumber(cells[pi] ?? '')
    const cost = parseLocaleNumber(cells[costi] ?? '')
    if (!company || Number.isNaN(prod) || Number.isNaN(cost) || prod <= 0) continue

    const row: PhosphateDapSiteRow = {
      company,
      country,
      site,
      production000t: prod,
      siteCostUsdPerTon: cost,
    }
    if (conv >= 0) {
      const v = parseLocaleNumber(cells[conv] ?? '')
      if (!Number.isNaN(v)) row.dapConversionUsdPerTon = v
    }
    if (nCol >= 0) {
      const v = parseLocaleNumber(cells[nCol] ?? '')
      if (!Number.isNaN(v)) row.dapNUsdPerTon = v
    }
    if (pCol >= 0) {
      const v = parseLocaleNumber(cells[pCol] ?? '')
      if (!Number.isNaN(v)) row.dapPUsdPerTon = v
    }
    if (sCol >= 0) {
      const v = parseLocaleNumber(cells[sCol] ?? '')
      if (!Number.isNaN(v)) row.dapSUsdPerTon = v
    }
    rows.push(row)
  }
  return rows
}

export function countryToSectorRegion(country: string): DapCurvePeerRegion {
  const c = country.trim().toLowerCase()
  if (
    c.includes('russia') ||
    c.includes('kazakh') ||
    c.includes('belarus') ||
    c.includes('ukraine') ||
    c.includes('uzbek')
  )
    return 'cis'
  if (c.includes('china')) return 'china'
  if (
    c === 'usa' ||
    c.includes('united states') ||
    c.includes('brazil') ||
    c.includes('canada') ||
    c.includes('mexico') ||
    c.includes('peru') ||
    c.includes('chile') ||
    c.includes('argentina')
  )
    return 'americas'
  if (
    c.includes('saudi') ||
    c.includes('morocco') ||
    c.includes('jordan') ||
    c.includes('tunisia') ||
    c.includes('egypt') ||
    c.includes('uae') ||
    c.includes('qatar') ||
    c.includes('israel') ||
    c.includes('gcc')
  )
    return 'mena'
  return 'row'
}

export function isMaadenDapSite(company: string, site: string): boolean {
  const u = `${company} ${site}`.toUpperCase()
  if (/\bMPC\b|\bMWSPC\b/.test(u)) return true
  if (/MA'?ADEN|MAADEN|MA’ADEN/.test(company.toUpperCase())) return true
  return false
}

/** Map CRU rows to in-app phosphate assets for drill-down. */
export function maadenPhosphateAssetId(company: string, site: string): 'ph_ras' | 'ph_waad' | undefined {
  if (!isMaadenDapSite(company, site)) return undefined
  const s = site.toLowerCase()
  const co = company.toUpperCase()
  if (co.includes('MWSPC') || s.includes('waad') || s.includes('shamal')) return 'ph_waad'
  if (s.includes('ras') || co.includes('MPC')) return 'ph_ras'
  return 'ph_ras'
}

let cachedRows: PhosphateDapSiteRow[] | null = null

export function getPhosphateDapSiteRows(): PhosphateDapSiteRow[] {
  if (!cachedRows) cachedRows = parsePhosphateDapCurveCsv(EMBEDDED_DAP_CSV)
  return cachedRows
}

export function uniqueSortedCompanies(rows: PhosphateDapSiteRow[]): string[] {
  const set = new Set(rows.map((r) => r.company.trim()).filter(Boolean))
  return [...set].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
}

/** Seeded MPC Ras Al-Khair DAP site cost — illustrative ratio baseline for DAP-minus scaling. */
export const DAP_CURVE_REFERENCE_SITE_COST_USD = 263.186

export function averageSiteCostUsdPerTonForCompany(company: string | null): number | null {
  if (!company?.trim()) return null
  const rows = getPhosphateDapSiteRows().filter((r) => r.company === company)
  if (!rows.length) return null
  return rows.reduce((s, r) => s + r.siteCostUsdPerTon, 0) / rows.length
}
