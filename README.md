# Bhargav Sai Bhartu portfolio

A professional portfolio for a junior developer working with Odoo, n8n and AI at PHYTEC India. Built with Astro 7, TypeScript and Motion, with a static output for GitHub Pages.

## Run locally

Use Node.js 24 LTS (at least 22.22) and npm.

```sh
npm ci
npm run dev
```

Open the printed URL with `/portfolio_site/` appended. The homepage and resume also work as pre-rendered HTML without JavaScript. Filters, dialogs and the simulation are progressive enhancements.

```sh
npm run check
npm test
npm run build
npm run preview
```

The production website is generated in `dist/`. Astro's `base` is `/portfolio_site` so assets and resume links work on the existing GitHub Pages address.

## Update content

- `src/data/profile.json`: professional summary, experience, CV projects, education and skills used by the resume page and document generator.
- `src/data/projects.ts`: portfolio case studies, ordered by strength for a Python / AI developer role.
- `src/scripts/checkin.ts`: the steps and messages of the face check-in demo (tested in `tests/checkin.test.mjs`).
- `src/pages/index.astro`: homepage copy, layout and milestones. Experience and skill levels are rendered from the shared profile.
- `profile.skillGroups`: hands-on skills, AI & computer vision, business systems & web, and current learning. JavaScript is explicitly learning; Java remains basic.
- `src/styles/global.css`: colours, responsive layout and motion.
- `src/styles/experience.css`: presentation refinements, portrait composition and responsive interactive sections.
- `public/assets/`: anime portrait, social preview and downloadable CVs.

## Features

- An editorial navy-and-blue design with serif accents, a friendly smiling anime portrait, floating tool cards and subtle pointer-responsive details.
- Six filterable projects, led by Face Attendance AI, with animated transitions and keyboard-accessible case-study dialogs. Each project has a copyable direct link using `?project=attendance` (or the matching project ID).
- An interactive face check-in simulation (good light, poor light, printed photo, unknown person) that walks through detection, quality, liveness and matching. It runs locally; no camera is used and nothing is sent or saved.
- A 30-second recruiter overview, copyable introduction and PDF/Word CV downloads.
- A searchable quick menu with Ctrl/Cmd K, keyboard selection and native modal focus containment.
- Persistent light/dark themes and a motion preference that respects the operating system's reduced-motion setting.
- A smiling anime portrait, scroll entrances, animated workflow connections, tracking illustrations and subtle ambient motion.
- A floating back-to-top button with reading progress, plus a scroll cue and active navigation indicators.
- Expandable certificates and milestones.
- Canonical URLs, absolute social preview URLs, person schema, sitemap and robots file.

Project visuals are labelled illustrative overviews. They are not screenshots or proof of production deployment. No metrics, testimonials or project repository links have been invented.

## Rebuild the CV

The PDF and Word downloads are one-page A4 documents with a single column, standard headings and selectable text. They contain no images, layout tables, text boxes or header/footer contact information. This is designed for straightforward ATS parsing; scoring depends on the specific job and ATS.

Install `python-docx` in a Python environment, then:

```sh
python scripts/build_resume.py
```

Convert `public/assets/Bhargav-Sai-Bhartu-Resume.docx` to PDF with Word or LibreOffice, keeping the same filename. Visually inspect the PDF and confirm it still has one page after content edits. `scripts/requirements.txt` records the authoring dependency.

## Deploy to the existing GitHub Pages site

The repository includes `.github/workflows/deploy.yml`, using the official Astro action. In GitHub, choose **Settings → Pages → Source → GitHub Actions**. A push to `main` builds, checks and publishes the website. Pull requests run checks and build without deploying.

The source alone cannot be served directly as the previous plain HTML version was; GitHub Pages must serve the built output. Node packages are locked in `package-lock.json` for repeatable installation.

No backend, private API keys or paid services are required. Google Fonts is the only externally hosted visual dependency; system fonts provide a fallback.
