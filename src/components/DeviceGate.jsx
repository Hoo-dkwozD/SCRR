const COPY = {
  unsupported: {
    title: 'Phones only',
    body: 'Royal Roulette only works on a mobile phone. Please open this page on your phone.',
  },
  rotate: {
    title: 'Rotate your phone',
    body: 'Please turn your phone upright to continue.',
  },
}

export default function DeviceGate({ state }) {
  const { title, body } = COPY[state]
  return (
    <div className="gate" role="alertdialog" aria-modal="true" aria-labelledby="gate-title" aria-describedby="gate-body">
      <svg className={`gate-icon${state === 'rotate' ? ' tilt' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
        <path d="M10.5 18.5h3" />
      </svg>
      <h1 id="gate-title">{title}</h1>
      <p id="gate-body" className="muted">{body}</p>
    </div>
  )
}
