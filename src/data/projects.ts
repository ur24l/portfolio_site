export type ProjectCategory = "Automation" | "Full-stack" | "Data & vision";

// Ordered by strength for a Python / AI developer role: computer vision and AI first.
export const projects = [
  {
    id: "attendance",
    number: "01",
    category: "Data & vision" as ProjectCategory,
    title: "Face recognition attendance with anti-spoofing",
    name: "Face Attendance AI",
    status: "Production · PHYTEC India",
    visual: "attendance",
    wide: true,
    summary:
      "End-to-end face recognition attendance platform with anti-spoofing liveness checks, a live WebSocket HR dashboard, and an installable PWA client running fully on-premises.",
    tags: ["Python", "FastAPI", "OpenCV", "PostgreSQL + pgvector", "Docker"],
    problem:
      "Doorway check-ins must be fast yet tamper-resistant. Poor lighting, printed photos, screen replays, and repeated scans lead to inaccurate logs and attendance disputes.",
    built: [
      "Computer vision pipeline: YuNet face detection, brightness/sharpness/head-pose quality gates, MiniFASNet anti-spoofing liveness checks, and SFace embeddings matched in PostgreSQL with pgvector.",
      "Entrance kiosk mode and an installable PWA mobile client where employees can only check in with their own enrolled face.",
      "Live HR dashboard over WebSockets and Redis, searchable attendance logs with CSV export, and configurable work-hours rules.",
      "Authentication & security: Argon2 password hashing, short-lived JWTs, progressive login lockouts, and session invalidation on password reset.",
      "Operations: Docker deployment, Alembic database migrations, restore-tested daily backups, one-command setup, and 91 automated pytest tests.",
    ],
    learned:
      "Production computer vision is primarily about rejecting bad inputs cleanly and deterministically. Automated tests, migrations, and verified backups are what keep an on-premises service safe to evolve.",
    note: "Built as a work project at PHYTEC India. The interface preview is an architectural illustration; no real faces or company data are shown.",
  },
  {
    id: "news",
    number: "02",
    category: "Automation" as ProjectCategory,
    title: "Automated daily tech digest with LLM scoring",
    name: "AI Tech News Briefing",
    status: "Personal project",
    visual: "news",
    wide: true,
    summary:
      "Daily 9:00 AM IST tech briefing aggregating four RSS feeds—deduplicated, scored, and summarized by LLMs into structured JSON with automatic fallback routing in n8n.",
    tags: ["n8n", "Groq API", "LLMs", "RSS"],
    problem:
      "Tracking AI, semiconductor, and India tech developments manually across multiple sites created noise and inconsistent reading habits.",
    built: [
      "Aggregated and deduplicated stories across four technical RSS feeds.",
      "Prompted an LLM via Groq API to score relevance and return 8–12 structured JSON summaries.",
      "Scheduled a 9:00 AM IST daily digest alongside a 30-minute breaking-news monitor.",
      "Implemented automatic model fallback from GPT OSS 120B to GPT OSS 20B to handle rate limits and API errors.",
      "Formatted responsive table-based HTML emails compatible with both Gmail and Outlook.",
    ],
    learned:
      "Enforcing structured JSON model outputs, designing resilient API fallbacks, and handling cross-client email HTML constraints.",
    note: "The preview illustrates the automated workflow and email structure rather than a live inbox.",
  },
  {
    id: "vision",
    number: "03",
    category: "Data & vision" as ProjectCategory,
    title: "Live video person detection and counting",
    name: "Real-Time People Counting",
    status: "Earlier project",
    visual: "vision",
    summary:
      "Python and OpenCV pipeline that detects, tracks, and counts people crossing a virtual boundary in real-time video streams.",
    tags: ["Python", "OpenCV", "Object tracking"],
    problem:
      "Accurate people counting requires maintaining consistent identity tracks across consecutive video frames without double-counting.",
    built: [
      "Built a real-time video ingestion and frame processing pipeline in Python.",
      "Applied OpenCV detection and object tracking across frames to trigger directional line-crossing counts.",
    ],
    learned:
      "Frame-to-frame object tracking fundamentals and handling occlusion and jitter in live video streams.",
    note: "The visual is a schematic representation of the tracking and counting pipeline.",
  },
  {
    id: "crm",
    number: "04",
    category: "Automation" as ProjectCategory,
    title: "Automated website lead routing into Odoo CRM",
    name: "Website to Odoo CRM",
    status: "In progress · PHYTEC India",
    visual: "crm",
    summary:
      "n8n webhook pipeline connecting website inquiry forms to Odoo CRM with field validation, schema mapping, and instant sales notifications.",
    tags: ["Odoo CRM", "n8n", "Webhooks", "REST APIs"],
    problem:
      "Manual transfer of website inquiries into CRM created response delays and inconsistent lead data entry.",
    built: [
      "Built webhook endpoints to ingest structured website inquiry submissions.",
      "Added input sanitization, normalization, and validation rules before CRM sync.",
      "Mapped validated fields directly into Odoo CRM lead records via REST APIs.",
      "Configured automated alerts so the sales team can respond immediately.",
    ],
    learned:
      "Webhook reliability, defensive payload validation, and clean field mapping across external CRM APIs.",
    note: "Work in progress at PHYTEC India. Diagram reflects pipeline architecture only; no company data is shown.",
  },
  {
    id: "robot",
    number: "05",
    category: "Full-stack" as ProjectCategory,
    title: "Control and recipe platform for smart cooking hardware",
    name: "Akshaya Cooking Robot App",
    status: "Earlier project",
    visual: "robot",
    summary:
      "Full-stack web application for managing recipes, meal plans, and live robot status backed by Node.js APIs and DynamoDB.",
    tags: ["React", "Node.js", "DynamoDB", "AWS"],
    problem:
      "Connected kitchen hardware needs an intuitive web interface to browse recipes, schedule meals, and monitor device state.",
    built: [
      "Built responsive UI views using React and Material-UI.",
      "Implemented Node.js and Express REST endpoints for authentication, recipes, and robot status.",
      "Modeled application data with a single-table DynamoDB schema on AWS.",
    ],
    learned:
      "NoSQL single-table access patterns, REST API design, and connecting React clients to backend services.",
    note: "The visual summarizes the application architecture rather than a live product screenshot.",
  },
  {
    id: "healthcare",
    number: "06",
    category: "Data & vision" as ProjectCategory,
    title: "Relational schema and analytics views for healthcare records",
    name: "Healthcare Database & Analytics",
    status: "Earlier project",
    visual: "data",
    summary:
      "Normalized SQL database linking patient records, appointments, and billing with analytical reporting views.",
    tags: ["SQL", "Data modelling", "Reporting"],
    problem:
      "Clinical, scheduling, and billing workflows require a normalized relational model to generate accurate operational reports.",
    built: [
      "Designed normalized relational tables with foreign-key constraints across patients, appointments, and billing.",
      "Authored multi-table SQL joins and reporting views for summary analytics.",
    ],
    learned:
      "Relational normalization, referential integrity, and writing maintainable analytical SQL views.",
    note: "No real patient data is included. The diagram illustrates the relational schema.",
  },
];
