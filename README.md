# Sir Cecil Royal Roulette

A client-only React SPA. Guests open the page and spin a prize wheel once, with a staff member present.

| Prize | Odds | Dark (Aurora) | Light (Frost) |
|---|---|---|---|
| 1st — Power Bank | 3% | `#EBCB8B` | `#5E81AC` |
| 2nd — Travel Adapter | 7% | `#B48EAD` | `#81A1C1` |
| 3rd — Utensil Set | 90% | `#A3BE8C` | `#8FBCBB` |

The wheel is three identical 120° sectors of `[3rd 15% · 2nd 2⅓% · 3rd 15% · 1st 1%]`. The odds are spread evenly around the wheel and no two neighbouring segments share a prize. A spin picks a uniformly random point on the wheel using `crypto.getRandomValues`, and the segment under that point wins.

## Staff supervision

There is no access code. The staff member present is what stops misuse. The wheel page tells guests to spin only in front of a staff member, and that spins made without staff present are invalid. After a result, staff tap **Next guest** to reset the wheel.

## Phones only

The app runs only on phones held upright. `src/lib/useDeviceGate.js` checks for a touch screen with no hover, and the screen's short side must be 540 CSS px or less.
- **Anything else** (desktop, laptop, tablet) sees a "Phones only" screen, and the app is never rendered.
- **A phone in landscape** sees "Rotate your phone" on top of the app. A spin in progress keeps going underneath and isn't lost.
- **Local development on a desktop:** open `http://localhost:5173/?anydevice`. This bypass only works in dev mode and isn't in production builds.

This check runs in the browser, so a determined user could get around it with browser tools. It keeps guests on the intended device; it isn't a security control.

## Setup

```bash
npm install
npm run dev
```

### Deploy to GitHub Pages

Pages is set to *Settings → Pages → Source: **GitHub Actions***. Every push to `main` builds and deploys through `.github/workflows/deploy.yml`.

## Project structure

```
src/
  lib/prizes.js          prizes and wheel segment layout
  lib/spin.js            CSPRNG draw + landing angle
  lib/useDeviceGate.js   phone-only / portrait-only check
  lib/useTheme.js        dark/light theme (dark by default, remembered)
  components/            WheelPage, Wheel, Legend, StaffNotice, DeviceGate, ThemeToggle
```

## Retired: access codes

An earlier version required an 8-character access code before spinning. There were rotating 15-minute codes, plus predetermined codes that forced a prize. That version is in git history at commit `90bf30e`, in `src/lib/auth.js` and `src/components/VerifyPage.jsx`.

The code generator (`generator/`) and the last generated codes (`secrets/`) are kept locally and are git-ignored. `npm run secrets:generate` still works, and `bcryptjs` is kept as a dev dependency for it. The current app doesn't use any of this.
