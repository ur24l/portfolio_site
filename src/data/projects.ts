export type ProjectCategory = "Automation" | "Full-stack" | "Data & vision";
export const projects = [
  {
    id: "news",
    number: "01",
    category: "Automation" as ProjectCategory,
    title: "A calmer way to follow tech.",
    name: "AI Tech News Briefing",
    status: "Personal project",
    visual: "news",
    summary:
      "Four news feeds. One useful email. A daily briefing built with n8n and large language models.",
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
    note: "The visual is a simplified overview of the workflow, rather than a screenshot of a live inbox.",
  },
  {
    id: "crm",
    number: "02",
    category: "Automation" as ProjectCategory,
    title: "From enquiry to the right team.",
    name: "Website to Odoo CRM",
    status: "In progress · PHYTEC India",
    visual: "crm",
    summary:
      "Connecting website enquiries to Odoo CRM with n8n, clean data and a notification for sales.",
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
    note: "This work is in progress. The interactive demo uses sample data and does not connect to company systems.",
  },
  {
    id: "robot",
    number: "03",
    category: "Full-stack" as ProjectCategory,
    title: "Software for a smarter kitchen.",
    name: "Akshaya Cooking Robot App",
    status: "Earlier project",
    visual: "robot",
    summary:
      "A full-stack app for smart cooking robots, recipe management and meal planning.",
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
    note: "The visual illustrates the app’s functions; it is not a product screenshot.",
  },
  {
    id: "healthcare",
    number: "04",
    category: "Data & vision" as ProjectCategory,
    title: "Making healthcare data useful.",
    name: "Healthcare Database & Analytics",
    status: "Earlier project",
    visual: "data",
    summary:
      "A SQL database connecting patient records, appointments and billing with reporting views.",
    tags: ["SQL", "Data modelling", "Reporting"],
    problem:
      "Patient, appointment and billing information needs a connected structure to support useful reports.",
    built: [
      "Designed related tables for patient records, appointments and billing.",
      "Used SQL joins and reporting views to bring information together.",
    ],
    learned:
      "Relational modelling, joins and writing queries for practical reporting.",
    note: "No patient records are included in this portfolio. The diagram illustrates the data model.",
  },
  {
    id: "vision",
    number: "05",
    category: "Data & vision" as ProjectCategory,
    title: "Understanding movement with code.",
    name: "Real-time People Counting",
    status: "Earlier project",
    visual: "vision",
    summary:
      "A Python and OpenCV project to detect, track and count people in a live video feed.",
    tags: ["Python", "OpenCV", "Object tracking"],
    problem:
      "Counting people in a video feed requires keeping track of movement across frames.",
    built: [
      "Built a Python program to process a live video feed.",
      "Used OpenCV for people detection, tracking and counting.",
    ],
    learned:
      "Computer vision basics and the challenges of maintaining tracks across video frames.",
    note: "The visual is an abstract illustration of object tracking.",
  },
];
export const notes = [
  {
    topic: "AI",
    title: "Plan for the API to fail.",
    text: "Rate limits happen. In my news project, a smaller backup model keeps the briefing going when the main model is unavailable.",
  },
  {
    topic: "n8n",
    title: "Clean data before connecting tools.",
    text: "Trim spaces, normalise email addresses and check required fields before creating a CRM record. Small checks prevent bigger fixes.",
  },
  {
    topic: "Odoo",
    title: "Start with the sales process.",
    text: "A CRM pipeline only helps when its stages match how the team works. Understand the process before adding fields.",
  },
  {
    topic: "AI",
    title: "Give the model a clear contract.",
    text: "A fixed JSON shape makes an LLM response easier to use in a workflow. Check the output before passing it to the next step.",
  },
];
