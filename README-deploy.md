# Deploying Prunaverso Web

This document explains how to deploy the Prunaverso Web project to Vercel and how the CI workflow updates the monitor JSON automatically.

## 1) Vercel configuration

1. Go to https://vercel.com and sign in with your Git provider (GitHub recommended).
2. Import this repository as a new project.
3. Set the following build settings (if Vercel doesn't detect them automatically):
   - Framework Preset: Vite (or Other)
   - Install Command: `npm ci`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. Environment Variables (add in Vercel Project Settings → Environment Variables):
   - `PRUNAVERSO_HMAC_KEY` — the HMAC key used by monitor/validator scripts.

## 2) GitHub Actions (monitor generation)

This repo includes a scheduled workflow at `.github/workflows/monitor-and-deploy.yml` which runs every 15 minutes and executes `node scripts/monitor_symbolic.cjs`.

Important notes:
- The workflow expects the secret `PRUNAVERSO_HMAC_KEY` to be added to GitHub Actions secrets (Repository → Settings → Secrets and variables → Actions).
- The monitor script should write `public/data/monitor-latest.json`. The workflow will commit and push the file if it changed, which triggers Vercel to redeploy.

## 3) Quick local test (before deploying)

1. Install dependencies:

```powershell
npm ci
```

2. Run lint and build locally:

```powershell
npm run lint
npm run build
```

3. Preview the build locally:

```powershell
npm run preview
# then open http://localhost:4173 (or the printed port)
```

## 4) Optional: Vercel CLI

If you prefer to deploy from your machine:

```powershell
npm i -g vercel
vercel login
vercel --prod
```

## 5) Security

- Never commit secrets to the repository. Use GitHub Secrets and Vercel environment variables.
- Limit the access to secrets in GitHub (only repo admins).

---
If you want, I can also:
- add a small smoke-check GitHub Action that validates the generated JSON against the handshake/schema before committing, or
- make the monitor upload its results to a public storage (S3/R2) instead of committing to the repo.
