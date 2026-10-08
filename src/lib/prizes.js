export const PRIZES = {
  first: { rank: '1st Prize', name: 'Power Bank', weight: 2 },
  second: { rank: '2nd Prize', name: 'Travel Adapter', weight: 6 },
  third: { rank: '3rd Prize', name: 'Utensil Set', weight: 92 },
}

export const PRIZE_ORDER = ['first', 'second', 'third']

// Spread the odds evenly: the wheel is 2 identical 180° halves, each holding
// [3rd 23%, 2nd 3%, 3rd 23%, 1st 1%]. Totals: 3rd 92%, 2nd 6%, 1st 2%.
// Rotational symmetry means no region of the wheel is "luckier" than another,
// and no two neighbouring segments share a prize.
const SECTOR = [
  ['third', 23],
  ['second', 3],
  ['third', 23],
  ['first', 1],
]
const REPEATS = 2

// Segments in degrees, clockwise from 12 o'clock.
export const SEGMENTS = (() => {
  const out = []
  let start = 0
  for (let r = 0; r < REPEATS; r++) {
    for (const [prize, pct] of SECTOR) {
      const sweep = pct * 3.6
      out.push({ id: out.length, prize, start, end: start + sweep })
      start += sweep
    }
  }
  return out
})()
