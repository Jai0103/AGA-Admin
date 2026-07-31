# AGA Admin

Apollo Global Academy Student Information System.

This project is a production-focused admin dashboard for managing students,
training enrolments, training records, flight logs, certificates, invoices,
registration forms, uploaded PDFs, users, reports, and audit history.

## Tech Stack

- React
- Vite
- TypeScript
- TailwindCSS
- React Router
- Google Sheets database architecture
- Google Drive file storage architecture
- Google Apps Script REST API architecture
- GitHub Actions
- GitHub Pages
- Progressive Web App roadmap

## Local Setup

Install dependencies:

```bash
npm install
```

Start the local development server:

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

## GitHub Pages

This repository is configured for GitHub Pages deployment under:

```txt
https://jai0103.github.io/AGA-Admin/
```

The app uses hash routing so module pages work correctly on GitHub Pages:

```txt
https://jai0103.github.io/AGA-Admin/#/dashboard
```

In GitHub, enable:

```txt
Settings > Pages > Build and deployment > Source > GitHub Actions
```

After that, every push to the `main` branch will trigger deployment.

## Current Build Status

Completed:

- Project foundation
- Vite + React + TypeScript setup
- TailwindCSS setup
- App shell
- Sidebar navigation
- Dark and light mode
- Dashboard page
- Dashboard analytics cards
- Charts
- Placeholder routes for future modules
- GitHub Pages workflow

Next modules:

- Student Information
- Training Enrolments
- Training Records
- Flight Logs
- Certificates
- Invoice Management
- Training Enrolment Agreement
- Registration Forms
- File Manager
- Trainers
- Users
- Reports
- Audit History
- Settings
