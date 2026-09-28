import { useEffect, useState } from 'react'

const KEY = 'roulette-theme'

function initialTheme() {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(initialTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', theme === 'dark' ? '#2e3440' : '#eceff4')
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* storage unavailable — theme just won't persist */
    }
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}
