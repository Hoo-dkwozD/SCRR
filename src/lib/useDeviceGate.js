import { useEffect, useState } from 'react'

// Phones have a short screen side of ~320–480 CSS px; the smallest tablets start ~600.
const PHONE_MAX_SHORT_SIDE = 540

// Require the orientation API and the viewport shape to agree: the API alone can
// misreport, and the viewport alone flips when an on-screen keyboard opens.
function isLandscape() {
  const viewportLandscape = innerWidth > innerHeight
  const type = screen.orientation?.type
  if (type) return type.startsWith('landscape') && viewportLandscape
  if (typeof window.orientation === 'number') return Math.abs(window.orientation) === 90 && viewportLandscape
  return viewportLandscape
}

/** @returns {'ok' | 'unsupported' | 'rotate'} */
function evaluate() {
  // Dev-only escape hatch for working on a desktop: http://localhost:5173/?anydevice
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('anydevice')) return 'ok'

  const touch = navigator.maxTouchPoints > 0 && matchMedia('(pointer: coarse)').matches
  const noHover = matchMedia('(hover: none)').matches
  const shortSide = Math.min(screen.width, screen.height)
  if (!touch || !noHover || shortSide > PHONE_MAX_SHORT_SIDE) return 'unsupported'
  return isLandscape() ? 'rotate' : 'ok'
}

export function useDeviceGate() {
  const [state, setState] = useState(evaluate)
  useEffect(() => {
    const update = () => setState(evaluate())
    const queries = ['(pointer: coarse)', '(hover: none)'].map((q) => matchMedia(q))
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    screen.orientation?.addEventListener?.('change', update)
    queries.forEach((mq) => mq.addEventListener('change', update))
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      screen.orientation?.removeEventListener?.('change', update)
      queries.forEach((mq) => mq.removeEventListener('change', update))
    }
  }, [])
  return state
}
