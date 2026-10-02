// Builds the ATS-friendly CV (Word .docx). Convert to PDF with LibreOffice:
//   node cv/build_cv.js && soffice --headless --convert-to pdf --outdir assets assets/Bhargav-Sai-Bhartu-Resume.docx
// Rules followed: single column, no tables/text boxes/icons/headers/footers,
// standard section names, plain hyphens in dates, real (selectable) text.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType,
  LevelFormat, BorderStyle, TabStopType,
} = require('docx');

/* ------------------------------------------------------------------ */
/* Content — edit here                                                 */
/* ------------------------------------------------------------------ */
const cv = {
  name: 'BHARGAV SAI BHARTU',
  headline: 'Junior Software Developer | Odoo ERP & CRM | n8n Workflow Automation | LLMs',
  contact: [
    'Visakhapatnam, Andhra Pradesh, India',
    '+91 93462 36509',
    { text: 'bhargavsaibhartu@gmail.com', link: 'mailto:bhargavsaibhartu@gmail.com' },
  ],
  links: [
    { label: 'LinkedIn', text: 'linkedin.com/in/bhargav-sai-bhartu', link: 'https://www.linkedin.com/in/bhargav-sai-bhartu/' },
    { label: 'GitHub', text: 'github.com/ur24l', link: 'https://github.com/ur24l' },
  ],
  summary:
    'Junior Software Developer at PHYTEC India, working with Odoo ERP and CRM and building workflow automations in n8n ' +
    'using REST APIs and webhooks. Built a personal n8n project that uses large language models (LLMs) on the Groq API ' +
    'to select and summarise daily tech news. Completed a full-stack internship with React.js, Node.js and MySQL. ' +
    'Quick learner who works closely with sales and marketing teams to understand problems before building solutions.',
  experience: [
    {
      title: 'Junior Software Developer',
      org: 'PHYTEC India, Visakhapatnam',
      dates: 'January 2026 - Present',
      bullets: [
        'Support the setup of Odoo ERP and CRM: sales stages, CRM pipelines, custom fields and reports.',
        'Build n8n workflows that connect web forms and business applications to Odoo using webhooks and REST APIs.',
        'Currently building an n8n workflow that sends website enquiries into Odoo CRM and alerts the sales team.',
        'Work with sales and marketing teams to understand their daily tasks and find steps that can be automated.',
      ],
    },
    {
      title: 'Full Stack Engineer Intern',
      org: 'Superport-IT (Remote)',
      dates: 'March 2025 - July 2025',
      bullets: [
        'Developed features for the Sales_Pro CRM module using React.js, Node.js, Express.js and MySQL.',
        'Built backend REST APIs, connected them to a MySQL database, and created responsive user interfaces.',
        'Collaborated with the product team to deliver features in a live CRM application.',
      ],
    },
  ],
  projects: [
    {
      name: 'AI Tech News Briefing System',
      tech: 'n8n, Groq API, LLMs, JSON Schema, RSS, HTML Email',
      bullets: [
        'Built two n8n workflows: a daily 9:00 AM IST email briefing and a breaking-news alert that runs every 30 minutes.',
        'Merged 4 RSS news feeds, removed duplicates, and used an LLM to score (1-10) and summarise 8-12 stories in a fixed JSON format.',
        'Added automatic fallback from GPT OSS 120B to GPT OSS 20B to handle API rate limits and errors.',
        'Designed table-based HTML emails that display correctly in Microsoft Outlook and Gmail.',
      ],
    },
    {
      name: 'Akshaya Cooking Robot App',
      tech: 'React.js, Node.js, Express.js, DynamoDB, AWS, Material-UI',
      bullets: [
        'Built a full-stack app to control smart cooking robots and plan meals, with secure APIs for login, recipes and robot status, using a single-table DynamoDB design.',
      ],
    },
    {
      name: 'Healthcare Database and Analytics',
      tech: 'SQL, Data Modelling',
      bullets: [
        'Designed a SQL database for patient records, appointments and billing, with reporting views that reduced reporting time by about 80%.',
      ],
    },
    {
      name: 'Real-time People Counting',
      tech: 'Python, OpenCV',
      bullets: ['Built a computer vision program that detects, tracks and counts people in live video.'],
    },
  ],
  skills: [
    ['ERP and Automation', 'Odoo ERP, Odoo CRM, n8n, REST APIs, Webhooks'],
    ['AI', 'Large Language Models (LLMs), Prompt Engineering, Groq API'],
    ['Languages', 'Python, SQL, JavaScript, Java'],
    ['Web Development', 'React.js, Node.js, Express.js, HTML, CSS, Material-UI'],
    ['Databases', 'MySQL, PostgreSQL, DynamoDB'],
    ['Tools and Cloud', 'Git, Linux, AWS (Amplify, CloudFront, IAM)'],
    ['Spoken Languages', 'English (Fluent), Telugu (Native)'],
  ],
  education: [
    {
      degree: 'Bachelor of Technology (B.Tech), Information Technology',
      school: 'Anil Neerukonda Institute of Technology and Sciences (ANITS), Visakhapatnam',
      dates: '2021 - 2024',
      detail: 'CGPA: 7.77 / 10',
    },
    {
      degree: 'Diploma, Mechanical Engineering',
      school: 'Sai Ganapathi Polytechnic, Visakhapatnam',
      dates: '2016 - 2019',
      detail: 'Percentage: 74%',
    },
  ],
  achievements: [
    '1st Place, HACKAP Hackathon (January 2023); Participant, LeRobot Worldwide Hackathon by Hugging Face (June 2025)',
    'Certificates: Full-Stack Development (Wipro), Programming in Java (NPTEL), Ethical Hacking Workshop (JNTU Kakinada)',
    'NSS Coordinator, National Service Scheme: organised community welfare events',
  ],
};

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */
const FONT = 'Calibri';
const MARGIN = 794;                    // ~0.55 inch
const PAGE_W = 11906;                  // A4
const TEXT_W = PAGE_W - MARGIN * 2;
const BODY = 20;                       // 10pt (half-points)
const INK = '1A1A1A';
const MUTED = '444444';

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: BODY, color: INK, ...o });
const link = (text, url, o = {}) => new ExternalHyperlink({ link: url, children: [run(text, { color: '1F4E79', ...o })] });

function heading(text) {
  return new Paragraph({
    spacing: { before: 120, after: 50 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '999999', space: 2 } },
    children: [run(text.toUpperCase(), { bold: true, size: 22, characterSpacing: 10 })],
  });
}

function titleLine(left, right, sub) {
  // Title on the left, date on the right using a right tab stop (no tables)
  const children = [run(left, { bold: true })];
  if (sub) children.push(run(' | ' + sub, { color: MUTED }));
  if (right) children.push(run('\t' + right, { color: MUTED }));
  return new Paragraph({
    spacing: { before: 60, after: 10 },
    tabStops: [{ type: TabStopType.RIGHT, position: TEXT_W }],
    keepNext: true,
    children,
  });
}

const bullet = (text) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  spacing: { after: 10 },
  children: [run(text)],
});

const children = [];

// Name + headline + contact (in the body, not in a header)
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [run(cv.name, { bold: true, size: 36, characterSpacing: 20 })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [run(cv.headline, { size: 21, color: MUTED })] }));

const contactRuns = [];
cv.contact.forEach((c, i) => {
  if (i) contactRuns.push(run(' | ', { size: 19, color: MUTED }));
  contactRuns.push(typeof c === 'string' ? run(c, { size: 19 }) : link(c.text, c.link, { size: 19 }));
});
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: contactRuns }));

const linkRuns = [];
cv.links.forEach((l, i) => {
  if (i) linkRuns.push(run(' | ', { size: 19, color: MUTED }));
  linkRuns.push(run(l.label + ': ', { size: 19 }));
  linkRuns.push(link(l.text, l.link, { size: 19 }));
});
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: linkRuns }));

// Summary
children.push(heading('Professional Summary'));
children.push(new Paragraph({ spacing: { after: 20 }, children: [run(cv.summary)] }));

// Experience
children.push(heading('Work Experience'));
cv.experience.forEach((job) => {
  children.push(titleLine(job.title, job.dates, job.org));
  job.bullets.forEach((b) => children.push(bullet(b)));
});

// Projects
children.push(heading('Projects'));
cv.projects.forEach((p) => {
  const parts = [run(p.name, { bold: true }), run(' | ' + p.tech, { color: MUTED })];
  if (p.link) { parts.push(run(' | ', { color: MUTED })); parts.push(link(p.link.text, p.link.link)); }
  children.push(new Paragraph({ spacing: { before: 60, after: 10 }, keepNext: true, children: parts }));
  p.bullets.forEach((b) => children.push(bullet(b)));
});

// Skills
children.push(heading('Technical Skills'));
cv.skills.forEach(([k, v]) => children.push(new Paragraph({ spacing: { after: 20 }, children: [run(k + ': ', { bold: true }), run(v)] })));

// Education
children.push(heading('Education'));
cv.education.forEach((e) => {
  children.push(titleLine(e.degree, e.dates));
  children.push(new Paragraph({ spacing: { after: 20 }, children: [run(e.school + ' | ' + e.detail, { color: MUTED })] }));
});

// Certifications & achievements
children.push(heading('Certifications and Achievements'));
cv.achievements.forEach((a) => children.push(bullet(a)));


const doc = new Document({
  creator: 'Bhargav Sai Bhartu',
  title: 'Bhargav Sai Bhartu - Resume',
  description: 'Resume of Bhargav Sai Bhartu, Junior Software Developer',
  styles: { default: { document: { run: { font: FONT, size: BODY } } } },
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 300, hanging: 220 } } } }],
    }],
  },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: 680, bottom: 680, left: MARGIN, right: MARGIN } } },
    children,
  }],
});

const out = path.join(__dirname, '..', 'assets', 'Bhargav-Sai-Bhartu-Resume.docx');
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log('wrote', out); });
