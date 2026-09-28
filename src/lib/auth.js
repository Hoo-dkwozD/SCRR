import bcrypt from 'bcryptjs'

/* global __ROULETTE_SECRETS__ */
// Injected at build time by vite.config.js (see README → "Secrets").
const SECRETS = __ROULETTE_SECRETS__

export const isConfigured = Boolean(SECRETS?.slots?.length)

// Accept codes typed with a short delay after a window rolls over.
const GRACE_SECONDS = 60

export const normalizeCode = (raw) => raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
export const isWellFormed = (code) => /^[A-Z0-9]{8}$/.test(code)

let hmacKey
async function pepper(code) {
  if (!crypto?.subtle) throw new Error('Secure context (HTTPS or localhost) required.')
  hmacKey ??= await crypto.subtle.importKey(
    'raw',
    Uint8Array.from(atob(SECRETS.pepper), (c) => c.charCodeAt(0)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', hmacKey, new TextEncoder().encode(code))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// 15-minute windows counted from local midnight; the same order repeats daily.
export function slotAt(date = new Date()) {
  const seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
  const slotSeconds = SECRETS.slotMinutes * 60
  return { index: Math.floor(seconds / slotSeconds), elapsed: seconds % slotSeconds }
}

/**
 * Verify an access code.
 * @returns {Promise<{ok: false} | {ok: true, forcedPrize: string|null}>}
 */
export async function verifyCode(raw, now = new Date()) {
  const code = normalizeCode(raw)
  if (!isConfigured || !isWellFormed(code)) return { ok: false }

  const candidate = await pepper(code)
  const { index, elapsed } = slotAt(now)
  const total = SECRETS.slots.length

  if (await bcrypt.compare(candidate, SECRETS.slots[index])) return { ok: true, forcedPrize: null }

  for (const { prize, hash } of SECRETS.special) {
    if (await bcrypt.compare(candidate, hash)) return { ok: true, forcedPrize: prize }
  }

  if (elapsed < GRACE_SECONDS) {
    const prev = SECRETS.slots[(index - 1 + total) % total]
    if (await bcrypt.compare(candidate, prev)) return { ok: true, forcedPrize: null }
  }

  return { ok: false }
}
