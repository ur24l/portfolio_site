# Bhargav Sai's Portfolio

This is the personal portfolio of Bhargav Sai Bhartu, a junior software developer at PHYTEC India learning Odoo, n8n and AI. It introduces his background, skills, work experience, projects, education, achievements, and contact details.

The site is designed as a simple one-page website with a modern, interactive look. It is useful for sharing his work with recruiters, employers, and collaborators.

## What is included

- An introduction and career summary
- Technical skills, including full-stack development, cloud, computer vision, IoT, and Odoo
- Work experience at Superport-IT
- Featured projects such as people counting, a cooking robot app, and healthcare analytics
- Education, achievements, and contact links

## Features

- Learning log with topic filters (edit the `.log-item` blocks in `index.html` to add your own notes)
- Honest skill levels: using at work, comfortable with, learning now, have tried
- Motion: word-by-word headline, aurora background, magnetic buttons, 3D card tilt, animated project border, scroll-driven effects (Chrome, Edge, Safari 26+), circular theme switch
- Light and dark themes (follows the device, remembers your choice)
- Quick menu: press Ctrl K (or Cmd K on Mac) to jump to any section, copy the email or open links
- ATS-friendly one-page CV in PDF and Word (`assets/Bhargav-Sai-Bhartu-Resume.*`). Edit the content in `cv/build_cv.js`, then run `node cv/build_cv.js` and convert the .docx to PDF with LibreOffice or Word
- Social share image (`assets/og-image.jpg`) for LinkedIn, WhatsApp and X previews
- Animated workflow diagram, count-up stats and scroll reveals (all respect "reduce motion")
- Works without JavaScript; fully responsive down to phone width

## Built with

- Semantic HTML in a single page (`index.html`)
- Hand-written CSS with design tokens (`css/styles.css`)
- A small, dependency-free script (`js/main.js`)
- Fonts: Geist, Geist Mono and Instrument Serif from Google Fonts

No framework, build step or package installation is needed.

## Project structure

```text
index.html        All page content
css/styles.css    Design tokens, layout, themes and print (CV) styles
js/main.js        Theme, menu, quick menu, counters, copy email, CV print
assets/           Portrait photos (WebP + JPG) and the social share image
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server
```

## Deploy

Push to GitHub and enable GitHub Pages for the branch, or drag the folder into Netlify or Vercel.
After deploying, change `og:image` in `index.html` to the full URL (for example `https://<you>.github.io/portfolio_site/assets/og-image.jpg`) so link previews show the image.
