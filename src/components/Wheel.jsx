import { SEGMENTS } from '../lib/prizes'

const R = 100 // wheel radius in SVG units; viewBox is centred on 0,0

function point(deg, r = R) {
  const rad = ((deg - 90) * Math.PI) / 180
  return [r * Math.cos(rad), r * Math.sin(rad)]
}

function arcPath(start, end) {
  const [x1, y1] = point(start)
  const [x2, y2] = point(end)
  const large = end - start > 180 ? 1 : 0
  return `M0 0 L${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`
}

export default function Wheel({ rotation, spinning, winner, onSpinEnd }) {
  return (
    <div className="wheel-wrap">
      <svg className="pointer" viewBox="0 0 24 28" aria-hidden="true">
        <path d="M12 27 L2 5 Q12 -1 22 5 Z" />
      </svg>
      <svg className="wheel" viewBox="-108 -108 216 216" role="img" aria-label="Prize wheel">
        <circle r="106" className="rim" />
        <g
          className={`spinner-group${spinning ? ' spinning' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
          onTransitionEnd={(e) => e.propertyName === 'transform' && onSpinEnd()}
        >
          {SEGMENTS.map((s) => (
            <path
              key={s.id}
              d={arcPath(s.start, s.end)}
              className={`seg seg-${s.prize}${winner && winner.id !== s.id ? ' dim' : ''}`}
            />
          ))}
          {Array.from({ length: 36 }, (_, i) => {
            const [x, y] = point(i * 10, R + 3)
            return <circle key={i} cx={x} cy={y} r="1" className="stud" />
          })}
        </g>
        <circle r="16" className="hub" />
        <circle r="5" className="hub-dot" />
      </svg>
    </div>
  )
}
