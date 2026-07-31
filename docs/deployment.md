# AGA Admin Deployment Guide

This guide explains how to deploy the Apollo Global Academy Student Information
System frontend to GitHub Pages.

## 1. Repository

Repository:

```txt
https://github.com/Jai0103/AGA-Admin
```

Production URL:

```txt
https://jai0103.github.io/AGA-Admin/
```

Dashboard URL:

```txt
https://jai0103.github.io/AGA-Admin/#/dashboard
```

## 2. Local Setup

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build the production app:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 3. GitHub Pages Settings

In GitHub, open:

```txt
Settings > Pages
```

Under:

```txt
Build and deployment
```

Set:

```txt
Source: GitHub Actions
```

## 4. GitHub Actions

Deployment workflow file:

```txt
.github/workflows/deploy.yml
```

The workflow runs when changes are pushed to:

```txt
main
```

The workflow will:

1. Check out the repository.
2. Install Node.js.
3. Install npm dependencies.
4. Build the Vite app.
5. Upload the `dist` folder.
6. Deploy to GitHub Pages.

## 5. Vite Base Path

Because this app is deployed under the repository path `AGA-Admin`, the Vite
base path must be:

```js
base: "/AGA-Admin/"
```

This is configured in:

```txt
vite.config.js
```

## 6. Routing

The app uses hash routing for GitHub Pages compatibility.

Correct:

```txt
https://jai0103.github.io/AGA-Admin/#/dashboard
```

Avoid direct browser route URLs like:

```txt
https://jai0103.github.io/AGA-Admin/dashboard
```

GitHub Pages does not automatically rewrite those URLs to `index.html`.

## 7. Deployment Checklist

Before pushing:

```bash
npm run build
```

Then commit and push:

```bash
git add .
git commit -m "Update AGA Admin"
git push origin main
```

After pushing, check:

```txt
GitHub > AGA-Admin > Actions
```

The latest workflow run should be green.

## 8. Common Issues

### Blank Page

Check:

- `vite.config.js` has `base: "/AGA-Admin/"`
- `index.html` exists at the repository root
- `src/main.tsx` exists
- GitHub Pages source is set to GitHub Actions

### Workflow Cannot Find Lock File

If the workflow says no lock file was found, either:

- Commit `package-lock.json`, or
- Do not enable npm cache in the workflow.

The current workflow does not require a lock file.

### Page Opens But Routes Fail

Use the hash URL:

```txt
https://jai0103.github.io/AGA-Admin/#/dashboard
```
