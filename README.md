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

- `src/data/profile.json`: summary, experience, resume projects, skills, education, and contact settings. Shared by the homepage, `/resume/`, and the Word resume generator.
- `src/data/projects.ts`: portfolio projects, ordered by relevance. The `featured` project is shown first in full.
- `src/pages/index.astro`: homepage (intro, selected work, experience, skills, education, contact).
- `src/pages/resume.astro`: the online resume. Its print styles are also the source of the PDF resume.
- `src/pages/thanks.astro`: fallback page after a contact message.
- `src/components/SiteHeader.astro`, `SiteFooter.astro`: shared header and footer.
- `src/scripts/contact.ts`: sends the contact form without leaving the page.
- `src/styles/site.css`: the whole design system (light by default, follows the device's dark mode).
- `public/assets/`: social preview image (`og-image.jpg`) and the PDF and Word resumes.

## Update the resume

1. Edit `src/data/profile.json`.
2. Word version: `python scripts/build_resume.py` (needs `scripts/requirements.txt`).
3. PDF version (Windows): run `npm run build` and `npm run preview`, then `.\scripts\export_resume_pdf.ps1`.
   This prints the `/resume/` page with Microsoft Edge, so the PDF matches the website. Check that it is still one page.

## Contact form & auto-reply setup

By default, the contact form submits inline via `fetch()` to FormSubmit's JSON API (`https://formsubmit.co/ajax/...`) so visitors stay on the portfolio with an inline confirmation state (no third-party redirect screen).

To also send automatic "Thank you" confirmation emails from your own Gmail address (`bhargavsaibhartu@gmail.com`), deploy `scripts/contact_apps_script.gs` as a Google Apps Script Web App (or point to your own n8n webhook) and paste the URL into `contactWebhookUrl` in `src/data/profile.json`.

## Deployment

`.github/workflows/deploy.yml` runs `npm run check && npm test && npm run build` and deploys `dist/` to GitHub Pages on pushes to `main`.
