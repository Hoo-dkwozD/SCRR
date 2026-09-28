import { PRIZES, PRIZE_ORDER } from '../lib/prizes'

export default function Legend({ highlight }) {
  return (
    <ul className="legend" aria-label="Prize legend">
      {PRIZE_ORDER.map((key) => (
        <li key={key} className={highlight && highlight !== key ? 'dim' : ''}>
          <span className={`swatch seg-${key}`} aria-hidden="true" />
          <span>
            <span className="rank">{PRIZES[key].rank}</span>
            <span className="name">{PRIZES[key].name}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
