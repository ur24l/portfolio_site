export type Project = {
  id: string;
  name: string;
  context: string;
  summary: string;
  points: string[];
  stack: string[];
  featured?: boolean;
};

// Ordered by relevance: the featured project is shown first as a case study.
export const projects: Project[] = [
  {
    id: "attendance",
    name: "Face Attendance AI",
    context: "PHYTEC India · 2026",
    featured: true,
    summary:
      "A face recognition attendance system that runs entirely on the company network. Employees check in at an entrance kiosk or from their phone, and HR sees attendance live.",
    points: [
      "Vision pipeline with face detection (YuNet), image quality and head-pose checks, liveness detection against printed photos and screens (MiniFASNet), and face matching (SFace) with vector search in PostgreSQL.",
      "FastAPI backend with role-based access, short-lived tokens, login rate limiting, and password resets that end existing sessions.",
      "Live HR dashboard over WebSockets, attendance history with filters and CSV export, and configurable work-hours rules.",
      "Deployed with Docker on an on-premises Linux server, with database migrations, daily backups, and 91 automated tests.",
    ],
    stack: [
      "Python",
      "FastAPI",
      "OpenCV",
      "ONNX Runtime",
      "PostgreSQL",
      "pgvector",
      "Redis",
      "Docker",
    ],
  },
  {
    id: "news",
    name: "AI Tech News Briefing",
    context: "Personal project",
    summary:
      "An n8n workflow that turns four technology news feeds into one short daily email.",
    points: [
      "Combines four RSS feeds and removes duplicate stories.",
      "Uses an LLM to rank stories and return 8 to 12 summaries as structured JSON.",
      "Sends a 9:00 AM briefing and checks for breaking news every 30 minutes.",
      "Falls back to a smaller model when the main model is rate limited or unavailable.",
    ],
    stack: ["n8n", "Groq API", "LLMs", "RSS"],
  },
  {
    id: "vision",
    name: "Real-Time People Counting",
    context: "Earlier project",
    summary:
      "A Python program that detects, tracks, and counts people in a live video feed.",
    points: [
      "Processes a live video stream frame by frame.",
      "Uses OpenCV for person detection, tracking, and counting across a line.",
    ],
    stack: ["Python", "OpenCV"],
  },
  {
    id: "crm",
    name: "Website to Odoo CRM",
    context: "PHYTEC India · In progress",
    summary:
      "An integration that sends website inquiries straight to Odoo CRM, so sales no longer copies them by hand.",
    points: [
      "Receives form submissions through a webhook.",
      "Validates and cleans the fields before creating a lead.",
      "Creates the Odoo CRM lead through its API and notifies the sales team.",
    ],
    stack: ["Odoo CRM", "n8n", "Webhooks", "REST APIs"],
  },
  {
    id: "robot",
    name: "Akshaya Cooking Robot App",
    context: "Earlier project",
    summary:
      "A full-stack web app for a smart cooking robot: recipes, meal planning, and robot status.",
    points: [
      "Built responsive interfaces with React and Material UI.",
      "Worked on Node.js and Express APIs for login, recipes, and robot status.",
      "Used a single-table DynamoDB design on AWS.",
    ],
    stack: ["React", "Node.js", "Express", "DynamoDB", "AWS"],
  },
  {
    id: "healthcare",
    name: "Healthcare Database & Analytics",
    context: "Earlier project",
    summary:
      "A relational database connecting patient records, appointments, and billing, with reporting views.",
    points: [
      "Designed related tables for patients, appointments, and billing.",
      "Wrote SQL joins and views for practical reports.",
    ],
    stack: ["SQL", "Data modeling"],
  },
];
