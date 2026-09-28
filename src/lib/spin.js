import { SEGMENTS } from './prizes'

// Uniform float in [0, 1) from the CSPRNG.
function random() {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] / 2 ** 32
}

// A fair draw is a uniformly random point on the wheel; the segment under it
// wins, so each prize's odds equal its share of the circumference.
function drawSegment() {
  const angle = random() * 360
  return SEGMENTS.find((s) => angle >= s.start && angle < s.end) ?? SEGMENTS[0]
}

/**
 * Plan a spin. Returns the winning segment and the wheel's new absolute rotation.
 * @param {number} currentRotation - current wheel rotation in degrees
 */
export function planSpin(currentRotation) {
  const segment = drawSegment()
  // Land well inside the segment so the result is never visually ambiguous.
  const sweep = segment.end - segment.start
  const target = segment.start + sweep * (0.2 + random() * 0.6)

  // Pointer sits at 0°; rotating the wheel by R brings angle (360 - R) under it.
  const turns = 6 + Math.floor(random() * 3)
  const base = currentRotation - (currentRotation % 360)
  const rotation = base + turns * 360 + ((360 - target) % 360)
  return { segment, rotation }
}
