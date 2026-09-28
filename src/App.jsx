import { useState } from 'react'
import DeviceGate from './components/DeviceGate'
import ThemeToggle from './components/ThemeToggle'
import VerifyPage from './components/VerifyPage'
import WheelPage from './components/WheelPage'
import { useDeviceGate } from './lib/useDeviceGate'
import { useTheme } from './lib/useTheme'

export default function App() {
  const [theme, toggleTheme] = useTheme()
  // Access lives only in memory: a refresh or "Next guest" returns to verification.
  const [session, setSession] = useState(null) // null | { forcedPrize }
  const gate = useDeviceGate()

  return (
    <>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      {gate !== 'ok' && <DeviceGate state={gate} />}
      {/* Non-phones never see the app. Rotating mid-spin only overlays it, so the spin isn't lost. */}
      {gate === 'unsupported' ? null : session ? (
        <WheelPage key={session.id} forcedPrize={session.forcedPrize} onDone={() => setSession(null)} />
      ) : (
        <VerifyPage onVerified={(forcedPrize) => setSession({ id: Date.now(), forcedPrize })} />
      )}
    </>
  )
}
