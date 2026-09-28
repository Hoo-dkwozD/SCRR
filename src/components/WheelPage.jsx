import { useState } from 'react'
import { PRIZES, SEGMENTS } from '../lib/prizes'
import { planSpin } from '../lib/spin'
import Legend from './Legend'
import StaffNotice from './StaffNotice'
import Wheel from './Wheel'

// Rest with the pointer in the middle of the first segment, not on a boundary.
const REST_ROTATION = -(SEGMENTS[0].start + SEGMENTS[0].end) / 2

export default function WheelPage({ forcedPrize, onDone }) {
  const [rotation, setRotation] = useState(REST_ROTATION)
  const [phase, setPhase] = useState('ready') // ready | spinning | done
  const [winner, setWinner] = useState(null)

  function spin() {
    if (phase !== 'ready') return
    const plan = planSpin(rotation, forcedPrize)
    setWinner(plan.segment)
    setRotation(plan.rotation)
    setPhase('spinning')
  }

  const prize = winner && PRIZES[winner.prize]
  const done = phase === 'done'

  return (
    <main className="screen stage">
      <StaffNotice compact>Spin only in front of a staff member. Spins made without staff present are invalid.</StaffNotice>

      <div className="board">
        <Wheel rotation={rotation} spinning={phase === 'spinning'} winner={done ? winner : null} onSpinEnd={() => setPhase('done')} />
        <Legend highlight={done ? winner.prize : null} />
      </div>

      <div className="actions">
        {done ? (
          <div className="result" role="status">
            <span className={`swatch seg-${winner.prize}`} aria-hidden="true" />
            <div>
              <p className="eyebrow">Congratulations — {prize.rank}</p>
              <p className="prize-name">{prize.name}</p>
            </div>
            <button className="btn ghost" onClick={onDone}>Next guest</button>
          </div>
        ) : (
          <button className="btn primary spin-btn" onClick={spin} disabled={phase !== 'ready'}>
            {phase === 'spinning' ? 'Spinning…' : 'Spin'}
          </button>
        )}
      </div>
    </main>
  )
}
