export type ProjectCategory = "Automation" | "Full-stack" | "Data & vision";

// Ordered by strength for a Python / AI developer role: computer vision and AI first.
export const projects = [
  {
    id: "attendance",
    number: "01",
    category: "Data & vision" as ProjectCategory,
    title: "Attendance that refuses to guess.",
    name: "Face Attendance AI",
    status: "Work project",
    visual: "attendance",
    wide: true,
    summary:
      "End-to-end face-recognition attendance: a liveness check, a live HR dashboard and an installable phone app, running fully on-premise.",
    tags: ["Python", "FastAPI", "OpenCV", "PostgreSQL + pgvector", "Docker"],
    problem:
      "Attendance has to be fast at the door and still trustworthy. Poor light, printed photos and repeated scans lead to wrong records and disputes.",
    built: [
      "Face pipeline: YuNet detection, quality and head-pose checks, MiniFASNet liveness against photos and screens, and SFace embeddings matched in PostgreSQL with pgvector.",
      "Entrance kiosk and installable phone app (PWA). The phone only accepts the logged-in employee's own face.",
      "Live HR dashboard over WebSockets and Redis, history with filters and CSV export, and work-hours rules that HR configures.",
      "Security: Argon2 password hashing, short-lived JWTs, a login pause after repeated wrong passwords, and password resets that end old sessions.",
      "Production setup: Docker, Alembic migrations, daily restore-tested backups, one-command deployment and 91 automated tests.",
    ],
    learned:
      "Real-world computer vision is mostly about handling bad input well. Tests, migrations and backups are what make a system safe to change.",
    note: "Built as a work project. The visual is an illustration; no real faces or company data are shown.",
  },
  {
    id: "news",
    number: "02",
    category: "Automation" as ProjectCategory,
    title: "A calmer way to follow tech.",
    name: "AI Tech News Briefing",
    status: "Personal project",
    visual: "news",
    wide: true,
    summary:
      "Four news feeds, one useful email: a daily briefing scored and summarised by large language models, built with n8n.",
    tags: ["n8n", "Groq API", "LLMs", "RSS"],
    problem:
      "Following AI, chips and India tech news meant checking too many sites and receiving too many emails.",
    built: [
      "Combined four RSS feeds and removed duplicate stories.",
      "Used an LLM to score stories and return 8–12 summaries as structured JSON.",
      "Scheduled a 9:00 AM IST email and a separate breaking-news check every 30 minutes.",
      "Added a fallback from GPT OSS 120B to GPT OSS 20B for API failures and rate limits.",
      "Built table-based email layouts for Outlook and Gmail.",
    ],
    learned:
      "Structured model output, API reliability, cron schedules and the details of email HTML.",
    note: "The visual shows the workflow, not a real inbox.",
  },
  {
    id: "vision",
    number: "03",
    category: "Data & vision" as ProjectCategory,
    title: "Counting people in live video.",
    name: "Real-time People Counting",
    status: "Earlier project",
    visual: "vision",
    summary:
      "A Python and OpenCV program that detects, tracks and counts people in a live video feed.",
    tags: ["Python", "OpenCV", "Object tracking"],
    problem:
      "Counting people in a video feed requires keeping track of each person's movement across frames.",
    built: [
      "Built a Python program to process a live video feed.",
      "Used OpenCV for people detection, tracking and counting.",
    ],
    learned:
      "Computer vision fundamentals and the challenge of keeping tracks stable across video frames.",
    note: "The visual is an abstract illustration of object tracking.",
  },
  {
    id: "crm",
    number: "04",
    category: "Automation" as ProjectCategory,
    title: "From enquiry to the right team.",
    name: "Website to Odoo CRM",
    status: "In progress · PHYTEC India",
    visual: "crm",
    summary:
      "Connecting website enquiries to Odoo CRM with n8n: validated data and an instant notification for sales.",
    tags: ["Odoo CRM", "n8n", "Webhooks", "REST APIs"],
    problem:
      "Website enquiries had to be copied into the CRM by hand, which made the process slow and easy to get wrong.",
    built: [
      "Developing a webhook to receive website form submissions.",
      "Cleaning and checking incoming fields before sending them on.",
      "Mapping enquiry data to an Odoo CRM lead through its API.",
      "Adding a notification so the sales team knows about the enquiry.",
    ],
    learned:
      "Webhook testing, API documentation, field mapping and why clean input matters.",
    note: "This work is in progress. No company data is shown.",
  },
  {
    id: "robot",
    number: "05",
    category: "Full-stack" as ProjectCategory,
    title: "Software for a smarter kitchen.",
    name: "Akshaya Cooking Robot App",
    status: "Earlier project",
    visual: "robot",
    summary:
      "A full-stack app for smart cooking robots: recipe management, meal planning and robot status.",
    tags: ["React", "Node.js", "DynamoDB", "AWS"],
    problem:
      "A smart cooking robot needs a clear interface for recipes, user access and robot status.",
    built: [
      "Worked on responsive interfaces with React and Material-UI.",
      "Worked with Node.js and Express APIs for login, recipes and robot status.",
      "Used a single-table DynamoDB design and AWS services.",
    ],
    learned:
      "API design, application data modelling and connecting a frontend to backend services.",
    note: "The visual illustrates the app's functions; it is not a product screenshot.",
  },
  {
    id: "healthcare",
    number: "06",
    category: "Data & vision" as ProjectCategory,
    title: "Making healthcare data useful.",
    name: "Healthcare Database & Analytics",
    status: "Earlier project",
    visual: "data",
    summary:
      "A SQL database connecting patient records, appointments and billing, with reporting views.",
    tags: ["SQL", "Data modelling", "Reporting"],
    problem:
      "Patient, appointment and billing information needs a connected structure to support useful reports.",
    built: [
      "Designed related tables for patient records, appointments and billing.",
      "Used SQL joins and reporting views to bring information together.",
    ],
    learned:
      "Relational modelling, joins and writing queries for practical reporting.",
    note: "No patient records are included. The diagram illustrates the data model.",
  },
];
