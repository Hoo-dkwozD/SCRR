import { useState } from 'react'
import DeviceGate from './components/DeviceGate'
import ThemeToggle from './components/ThemeToggle'
import WheelPage from './components/WheelPage'
import { useDeviceGate } from './lib/useDeviceGate'
import { useTheme } from './lib/useTheme'

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const gate = useDeviceGate()
  // Bumping the round remounts the wheel so the next guest starts fresh.
  const [round, setRound] = useState(0)

  return (
    <>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      {gate !== 'ok' && <DeviceGate state={gate} />}
      {/* Non-phones never see the app. Rotating mid-spin only overlays it, so the spin isn't lost. */}
      {gate !== 'unsupported' && <WheelPage key={round} onDone={() => setRound((r) => r + 1)} />}
    </>
  )
}
