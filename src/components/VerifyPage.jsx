import { useRef, useState } from 'react'
import { isConfigured, normalizeCode, verifyCode } from '../lib/auth'
import StaffNotice from './StaffNotice'

export default function VerifyPage({ onVerified }) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('idle') // idle | checking | error
  const inputRef = useRef(null)

  async function submit(e) {
    e.preventDefault()
    if (code.length !== 8 || status === 'checking') return
    setStatus('checking')
    try {
      const result = await verifyCode(code)
      if (result.ok) return onVerified(result.forcedPrize)
    } catch (err) {
      console.error(err)
    }
    setStatus('error')
    setCode('')
    inputRef.current?.focus()
  }

  return (
    <main className="screen verify">
      <div className="card">
        <p className="eyebrow">Sir Cecil</p>
        <h1>Royal Roulette</h1>
        <p className="muted">Enter your 8-character access code to spin.</p>
        <StaffNotice>
          <strong>Staff must be present.</strong> Only enter your code in front of a staff member.
        </StaffNotice>

        {!isConfigured ? (
          <p className="error" role="alert">Not configured — no access codes were bundled with this build.</p>
        ) : (
          <form onSubmit={submit} noValidate>
            <input
              ref={inputRef}
              className={`code-input${status === 'error' ? ' shake' : ''}`}
              value={code}
              onChange={(e) => {
                setCode(normalizeCode(e.target.value).slice(0, 8))
                if (status === 'error') setStatus('idle')
              }}
              onAnimationEnd={(e) => e.currentTarget.classList.remove('shake')}
              placeholder="••••••••"
              aria-label="Access code"
              autoComplete="off"
              autoCapitalize="characters"
              autoCorrect="off"
              inputMode="text"
              enterKeyHint="go"
              spellCheck={false}
              autoFocus
              disabled={status === 'checking'}
            />
            <button className="btn primary" type="submit" disabled={code.length !== 8 || status === 'checking'}>
              {status === 'checking' ? <span className="spinner" aria-label="Verifying" /> : 'Continue'}
            </button>
            <p className="error" role="alert" aria-live="polite">
              {status === 'error' ? 'That code isn’t valid right now.' : ' '}
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
