import { useState } from 'react'
import ThemeToggle from './components/ThemeToggle'
import WheelPage from './components/WheelPage'
import { useTheme } from './lib/useTheme'

export default function App() {
  const [theme, toggleTheme] = useTheme()
  // Bumping the round remounts the wheel so the next guest starts fresh.
  const [round, setRound] = useState(0)

  return (
    <>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <WheelPage key={round} onDone={() => setRound((r) => r + 1)} />
    </>
  )
}
