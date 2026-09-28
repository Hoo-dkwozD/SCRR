import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import { defineConfig } from 'vite'

// Secrets are injected at build time, never committed:
//  - CI (GitHub Actions): ROULETTE_SECRETS env var = base64 of secrets/secrets.json
//  - Local dev: falls back to the git-ignored secrets/secrets.json
function loadSecrets() {
  const fromEnv = process.env.ROULETTE_SECRETS
  if (fromEnv) return JSON.parse(Buffer.from(fromEnv, 'base64').toString('utf8'))
  const file = new URL('./secrets/secrets.json', import.meta.url)
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'))
  return null
}

export default defineConfig(({ command }) => {
  const secrets = loadSecrets()
  if (!secrets && command === 'build' && process.env.CI) {
    throw new Error('ROULETTE_SECRETS is not set — add it as a GitHub Actions secret.')
  }
  return {
    base: './', // relative paths so it works under https://<user>.github.io/<repo>/
    plugins: [react()],
    define: { __ROULETTE_SECRETS__: JSON.stringify(secrets) },
  }
})
