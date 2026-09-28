export const PRIZES = {
  first: { rank: '1st Prize', name: 'Power Bank', weight: 3 },
  second: { rank: '2nd Prize', name: 'Travel Adapter', weight: 7 },
  third: { rank: '3rd Prize', name: 'Utensil Set', weight: 90 },
}

export const PRIZE_ORDER = ['first', 'second', 'third']

// Spread the odds evenly: the wheel is 3 identical 120° sectors, each holding
// [3rd 15%, 2nd 7/3%, 3rd 15%, 1st 1%]. Totals: 3rd 90%, 2nd 7%, 1st 3%.
// Rotational symmetry means no region of the wheel is "luckier" than another,
// and no two neighbouring segments share a prize.
const SECTOR = [
  ['third', 15],
  ['second', 7 / 3],
  ['third', 15],
  ['first', 1],
]
const REPEATS = 3

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
