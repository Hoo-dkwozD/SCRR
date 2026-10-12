# Sir Cecil Royal Roulette

A client-only React SPA. Guests open the page and spin a prize wheel once, with a staff member present.

| Prize | Odds | Dark (Aurora) | Light (Frost) |
|---|---|---|---|
| 1st — Power Bank | 2% | `#EBCB8B` | `#5E81AC` |
| 2nd — Travel Adapter | 6% | `#B48EAD` | `#81A1C1` |
| 3rd — Utensil Set | 92% | `#A3BE8C` | `#8FBCBB` |

The wheel is two identical 180° halves of `[3rd 23% · 2nd 3% · 3rd 23% · 1st 1%]`. The odds are spread evenly around the wheel and no two neighbouring segments share a prize. A spin picks a uniformly random point on the wheel using `crypto.getRandomValues`, and the segment under that point wins.

## Staff supervision

There is no access code. The staff member present is what stops misuse. The wheel page tells guests to spin only in front of a staff member, and that spins made without staff present are invalid. After a result, staff tap **Next guest** to reset the wheel.

## Layout

The app works on any screen.
- **Upright phones and tablets:** the legend and the Spin button sit under the wheel. Screens 720px tall or shorter get tighter spacing.
- **Wider screens** (desktop, landscape tablet or phone): they sit beside the wheel, and the wheel is sized to fit the screen height.

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
  lib/useTheme.js        dark/light theme (dark by default, remembered)
  components/            WheelPage, Wheel, Legend, StaffNotice, ThemeToggle
```

## Retired: access codes

An earlier version required an 8-character access code before spinning. There were rotating 15-minute codes, plus predetermined codes that forced a prize. That version is in git history at commit `90bf30e`, in `src/lib/auth.js` and `src/components/VerifyPage.jsx`.

The code generator (`generator/`) and the last generated codes (`secrets/`) are kept locally and are git-ignored. `npm run secrets:generate` still works, and `bcryptjs` is kept as a dev dependency for it. The current app doesn't use any of this.
