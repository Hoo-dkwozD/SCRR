# Sir Cecil Royal Roulette

A client-only React SPA: guests enter an access code, then spin a prize wheel once.

| Prize | Odds | Dark (Aurora) | Light (Frost) |
|---|---|---|---|
| 1st — Power Bank | 3% | `#EBCB8B` | `#5E81AC` |
| 2nd — Travel Adapter | 7% | `#B48EAD` | `#81A1C1` |
| 3rd — Utensil Set | 90% | `#A3BE8C` | `#8FBCBB` |

The wheel is three identical 120° sectors of `[3rd 15% · 2nd 2⅓% · 3rd 15% · 1st 1%]`. The odds are spread evenly around the wheel and no two neighbouring segments share a prize. A fair spin picks a uniformly random point on the wheel using `crypto.getRandomValues`, and the segment under that point wins.

## Access codes

- **Rotating guest codes:** 96 codes, one for each 15-minute window from 00:00 (device local time). The same order repeats every day. There is a 60-second grace period after each change of window.
- **Predetermined codes:** 3 fixed codes, one for each prize. Each is valid at any time and forces that outcome. The spin looks the same as a random spin.
- Codes are 8 characters and case-insensitive. Dashes and spaces are ignored.

The plaintext codes are in `secrets/CODES.md`. That folder is **git-ignored and must never be committed**.

## Phones only

The app runs only on phones held upright. `src/lib/useDeviceGate.js` checks for a touch screen with no hover, and the screen's short side must be 540 CSS px or less.
- **Anything else** (desktop, laptop, tablet) sees a "Phones only" screen, and the app is never rendered.
- **A phone in landscape** sees "Rotate your phone" on top of the app. A spin in progress keeps going underneath and isn't lost.
- **Local development on a desktop:** open `http://localhost:5173/?anydevice`. This bypass only works in dev mode and isn't in production builds.

Like everything else here, this check runs in the browser. A determined user could get around it with browser tools. It keeps honest guests on the intended device; it isn't a security control.

The code screen and the wheel screen both tell guests to use the app only in front of a staff member. Spins made without staff present are invalid.

## Secrets: how they are handled

Every hash is `bcrypt(HMAC-SHA256(pepper, CODE), cost 12)`. The hashes and the pepper live in `secrets/secrets.json`. The generator is in `generator/`, which is git-ignored so it is never pushed.

GitHub Pages only serves static files, so **whatever the browser uses to check a code must ship to the browser**. The goal is therefore not to hide the hashes. The goals are:

1. **Keep them out of the repository.** GitHub Pages on a free plan needs a public repo. The secrets file is git-ignored and reaches the build only through a **GitHub Actions encrypted secret**, which Vite inlines at build time (`vite.config.js`).
2. **Make the shipped hashes useless to attackers.** bcrypt at cost 12 takes about 0.3 s per guess. With 31⁸ ≈ 8.5 × 10¹¹ possible codes, brute-forcing even one code would take thousands of CPU-years.

What this does **not** protect against: someone with dev tools can read the pepper and the hashes, and a technically minded guest could in theory edit the JavaScript to skip the check. For a prize wheel run by staff this risk is acceptable. If you need real enforcement, move verification to a serverless function (for example Cloudflare Workers or Netlify Functions) that holds the pepper.

## Setup

```bash
npm install
npm run dev        # reads secrets/secrets.json locally
```

### Deploy to GitHub Pages

1. Create a GitHub repo and push this project. Check that `secrets/` is **not** included.
2. Store the secrets file as a repository secret (this uses the GitHub CLI):
   ```bash
   base64 -i secrets/secrets.json | gh secret set ROULETTE_SECRETS
   ```
   Or go to *Settings → Secrets and variables → Actions → New repository secret*, name it `ROULETTE_SECRETS`, and paste the output of `base64 -i secrets/secrets.json`.
3. Go to *Settings → Pages → Build and deployment → Source: **GitHub Actions***.
4. Push to `main`. `.github/workflows/deploy.yml` builds and deploys. If the secret is missing, the build fails.

### Regenerating codes

```bash
npm run secrets:generate
```

This makes all new codes and a new pepper, and moves the old files to `secrets/archive/`. Then update the live site:

```bash
base64 -i secrets/secrets.json | gh secret set ROULETTE_SECRETS
```
```bash
gh workflow run deploy.yml
```

Old codes stop working once the new build is deployed. See `generator/README.md` for the options.

## Project structure

```
src/
  lib/auth.js        code verification (HMAC pepper + bcryptjs, 15-min windows)
  lib/prizes.js      prizes and wheel segment layout
  lib/spin.js        CSPRNG draw + landing angle
  lib/useTheme.js    dark/light theme (dark by default, remembered)
  components/        VerifyPage, WheelPage, Wheel, Legend, ThemeToggle
```
