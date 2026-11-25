# Bhargav Sai Bhartu Portfolio

A professional portfolio and single-page resume for Bhargav Sai Bhartu (Python & AI Developer at PHYTEC India). Built with Astro, TypeScript, and Motion, outputting static assets for GitHub Pages.

## Run locally

Use Node.js 24 LTS (at least 22.22) and npm:

```sh
npm ci
npm run dev
```

Open the printed URL with `/portfolio_site/` appended. Both the homepage and `/resume/` render as pre-rendered HTML without requiring client-side JavaScript; filters, dialogs, and the face check-in pipeline simulation are progressive enhancements.

```sh
npm run check
npm test
npm run build
npm run preview
```

## Project structure

- `src/data/profile.json`: Verified professional summary, experience, resume projects, education, and skills shared by the website, `/resume/`, and resume generator.
- `src/data/projects.ts`: Portfolio case studies ordered by strength for Python & AI developer roles.
- `src/scripts/checkin.ts`: Deterministic face check-in pipeline simulation (`tests/checkin.test.mjs`).
- `src/pages/index.astro`: Homepage with engineering systems overview, filterable projects, experience, skills, interactive pipeline demo, and resume download panel.
- `src/pages/resume.astro`: Integrated online A4-proportioned resume page with print styles and PDF/DOCX download actions.
- `src/styles/global.css` & `src/styles/experience.css`: Design system and responsive layout styles.
- `public/assets/`: Typographic Open Graph preview (`og-image.jpg`) and downloadable single-page PDF and Word resumes.

## Rebuild the Resume (PDF & DOCX)

Both `public/assets/Bhargav-Sai-Bhartu-Resume.pdf` and `public/assets/Bhargav-Sai-Bhartu-Resume.docx` are generated directly from `src/data/profile.json` as single-page, single-column, ATS-safe A4 documents.

Install dependencies from `scripts/requirements.txt` and run:

```sh
python scripts/build_resume.py
```

## Contact form & auto-reply setup

By default, the contact form submits inline via `fetch()` to FormSubmit's JSON API (`https://formsubmit.co/ajax/...`) so visitors stay on the portfolio with an inline confirmation state (no third-party redirect screen).

To also send automatic "Thank you" confirmation emails from your own Gmail address (`bhargavsaibhartu@gmail.com`), deploy `scripts/contact_apps_script.gs` as a Google Apps Script Web App (or point to your own n8n webhook) and paste the URL into `contactWebhookUrl` in `src/data/profile.json`.

## Deployment

`.github/workflows/deploy.yml` runs `npm run check && npm test && npm run build` and deploys `dist/` to GitHub Pages on pushes to `main`.
