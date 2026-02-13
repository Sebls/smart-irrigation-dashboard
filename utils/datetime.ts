export type Dateish = Date | string | number | null | undefined

/**
 * Change these in ONE place to update the entire UI.
 *
 * - locale: affects language + ordering (ex: "Jan 26, 2026" vs "26 Jan 2026")
 * - timeZone: set to "UTC" for stable demo data, or undefined for user's local time
 * - hour12: set true for "1:05 PM", false for "13:05"
 */
export const FRIENDLY_LOCALE: string | undefined = "en-US"
export const FRIENDLY_TIME_ZONE: string | undefined = "UTC"
export const FRIENDLY_HOUR12 = false

export const FRIENDLY_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
  timeZone: FRIENDLY_TIME_ZONE,
}

export const FRIENDLY_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: FRIENDLY_HOUR12,
  timeZone: FRIENDLY_TIME_ZONE,
}

export const FRIENDLY_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  ...FRIENDLY_DATE_OPTIONS,
  ...FRIENDLY_TIME_OPTIONS,
}

function toDate(value: Dateish): Date | null {
  if (!value) return null
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : null
  const d = new Date(value)
  return Number.isFinite(d.getTime()) ? d : null
}

function fmt(value: Dateish, options: Intl.DateTimeFormatOptions): string {
  const d = toDate(value)
  if (!d) return "—"
  return new Intl.DateTimeFormat(FRIENDLY_LOCALE, options).format(d)
}

export function formatDate(value: Dateish): string {
  return fmt(value, FRIENDLY_DATE_OPTIONS)
}

export function formatTime(value: Dateish): string {
  return fmt(value, FRIENDLY_TIME_OPTIONS)
}

export function formatDateTime(value: Dateish): string {
  return fmt(value, FRIENDLY_DATE_TIME_OPTIONS)
}

/**
 * Keep ISO available for copying/debugging.
 */
export function formatIso(date: Dateish): string {
  const d = toDate(date)
  if (!d) return "—"
  return d.toISOString()
}

export function formatTimeAgo(
  value: Dateish,
  opts?: {
    now?: Date
    /** "short" => "3 min ago", "long" => "3 minutes ago" */
    style?: Intl.RelativeTimeFormatStyle
  },
): string {
  const d = toDate(value)
  if (!d) return "—"

  const now = opts?.now ?? new Date()
  const style = opts?.style ?? "short"

  const diffMs = d.getTime() - now.getTime()
  const absSec = Math.abs(diffMs) / 1000

  // Pick a human unit.
  const rtf = new Intl.RelativeTimeFormat(FRIENDLY_LOCALE, { numeric: "auto", style })

  if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), "second")
  const absMin = absSec / 60
  if (absMin < 60) return rtf.format(Math.round(diffMs / (60 * 1000)), "minute")
  const absHr = absMin / 60
  if (absHr < 24) return rtf.format(Math.round(diffMs / (60 * 60 * 1000)), "hour")
  const absDay = absHr / 24
  if (absDay < 7) return rtf.format(Math.round(diffMs / (24 * 60 * 60 * 1000)), "day")
  const absWeek = absDay / 7
  if (absWeek < 4) return rtf.format(Math.round(diffMs / (7 * 24 * 60 * 60 * 1000)), "week")
  const absMonth = absDay / 30
  if (absMonth < 12) return rtf.format(Math.round(diffMs / (30 * 24 * 60 * 60 * 1000)), "month")
  return rtf.format(Math.round(diffMs / (365 * 24 * 60 * 60 * 1000)), "year")
}

