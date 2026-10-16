import { animate, inView, scroll } from "motion";
import { projects } from "../data/projects";
import profile from "../data/profile.json";
import { workflowSteps, type Scenario } from "./workflow";

const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string) => [
  ...document.querySelectorAll<T>(selector),
];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
const shouldReduce = () => reduced.matches || root.dataset.motion === "off";
const store = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences are optional. */
  }
};
let toastTimer: ReturnType<typeof setTimeout>;
function toast(message: string) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3200);
}
async function copy(text: string, success: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast(success);
  } catch {
    toast("Clipboard unavailable. Select and copy the text directly.");
  }
}
function syncTheme() {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : systemDark.matches;
  $("button[data-theme]")?.setAttribute(
    "aria-label",
    `Switch to ${dark ? "light" : "dark"} theme`,
  );
  $('meta[name="theme-color"]')?.setAttribute(
    "content",
    dark ? "#101827" : "#fcfcfd",
  );
}
$("button[data-theme]")?.addEventListener("click", () => {
  const current = root.dataset.theme || (systemDark.matches ? "dark" : "light");
  root.dataset.theme = current === "dark" ? "light" : "dark";
  store("portfolio-theme", root.dataset.theme);
  syncTheme();
});
systemDark.addEventListener("change", syncTheme);
syncTheme();

const motionButton = $("button[data-motion]");
function syncMotion() {
  const off = shouldReduce();
  if (motionButton) {
    motionButton.textContent = `Motion: ${off ? "off" : "on"}`;
    motionButton.setAttribute("aria-pressed", String(off));
  }
}
motionButton?.addEventListener("click", () => {
  if (reduced.matches) {
    toast("Motion follows your device’s reduced-motion setting.");
    return;
  }
  root.dataset.motion = root.dataset.motion === "off" ? "on" : "off";
  store("portfolio-motion", root.dataset.motion);
  syncMotion();
  if (shouldReduce())
    $$("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
});
reduced.addEventListener("change", syncMotion);
syncMotion();

// All content starts visible. Motion is an enhancement, with a short travel distance.
if (!shouldReduce()) {
  inView(
    "[data-reveal]",
    (element) => {
      if (!shouldReduce())
        animate(
          element,
          {
            opacity: [0.55, 1],
            transform: ["translateY(18px)", "translateY(0)"],
          },
          { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        );
    },
    { margin: "0px 0px -25px 0px" },
  );
}
const progress = $(".reading-progress");
if (progress)
  scroll((p) => {
    progress.style.transform = `scaleX(${p})`;
  });

const nav = $("#navigation");
const menu = $(".menu-toggle");
function setMenu(open: boolean) {
  nav?.classList.toggle("is-open", open);
  menu?.setAttribute("aria-expanded", String(open));
  menu?.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
}
menu?.addEventListener("click", () =>
  setMenu(menu.getAttribute("aria-expanded") !== "true"),
);
nav?.addEventListener("click", (e) => {
  if ((e.target as Element).closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});
window.matchMedia("(min-width: 681px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$<HTMLAnchorElement>("#navigation a").forEach((a) => {
        if (a.hash === `#${entry.target.id}`)
          a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-20% 0px -65% 0px" },
);
$$("main > section[id]").forEach((el) => sectionObserver.observe(el));

function tick() {
  const el = $("[data-local-time]");
  if (el)
    el.textContent =
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()) + " IST";
}
tick();
setInterval(tick, 60000);

$$("[data-project-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    const category = button.dataset.projectFilter;
    $$("[data-project-filter]").forEach((b) => {
      b.classList.toggle("is-active", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });
    let count = 0;
    $$(".project[data-category]").forEach((card) => {
      const show = category === "all" || card.dataset.category === category;
      card.hidden = !show;
      if (show) count++;
    });
    const countEl = $("[data-project-count]");
    if (countEl) countEl.textContent = String(count);
  }),
);

// Native dialogs provide focus containment, Escape handling and focus restoration.
$$<HTMLDialogElement>("dialog").forEach((dialog) => {
  dialog
    .querySelector("[data-close-dialog]")
    ?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (
      e.clientX < box.left ||
      e.clientX > box.right ||
      e.clientY < box.top ||
      e.clientY > box.bottom
    )
      dialog.close();
  });
});
const recruiter = $<HTMLDialogElement>("#recruiter-dialog");
$("[data-recruiter-open]")?.addEventListener("click", () =>
  recruiter?.showModal(),
);
$("[data-copy-email]")?.addEventListener("click", () =>
  copy(profile.email, "Email address copied."),
);
$("[data-copy-summary]")?.addEventListener("click", () =>
  copy(
    `${profile.name} — Junior Software Developer at PHYTEC India, Visakhapatnam. Works with Odoo development and n8n automations for marketing and sales. Hands-on with Python and MySQL; MERN stack project experience. Currently learning JavaScript and AI workflows. Previous internship at Superport-IT. ${profile.email} | ${profile.github}`,
    "Professional summary copied.",
  ),
);

function textElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text: string,
  className?: string,
) {
  const el = document.createElement(tag);
  el.textContent = text;
  if (className) el.className = className;
  return el;
}
const projectDialog = $<HTMLDialogElement>("#project-dialog");
$$("[data-project-open]").forEach((button) =>
  button.addEventListener("click", () => {
    const project = projects.find((p) => p.id === button.dataset.projectOpen);
    const target = $("#project-detail");
    if (!project || !target || !projectDialog) return;
    const body = document.createElement("div");
    body.className = "project-detail-body";
    body.append(
      textElement("span", project.status, "eyebrow"),
      textElement("h2", project.name),
      textElement("p", project.summary),
    );
    body.append(
      textElement("h3", "The problem"),
      textElement("p", project.problem),
      textElement(
        "h3",
        project.id === "crm" ? "What I’m building" : "What I built",
      ),
    );
    const list = document.createElement("ul");
    project.built.forEach((line) => list.append(textElement("li", line)));
    body.append(
      list,
      textElement("h3", "What I learned"),
      textElement("p", project.learned),
    );
    const tags = document.createElement("ul");
    tags.className = "tags";
    project.tags.forEach((tag) => tags.append(textElement("li", tag)));
    body.append(tags, textElement("p", project.note, "project-detail-note"));
    target.replaceChildren(body);
    projectDialog.setAttribute("aria-label", project.name);
    projectDialog.showModal();
  }),
);

const scenario = $<HTMLSelectElement>("#scenario");
const run = $<HTMLButtonElement>("#run-workflow");
const nodes = $$("[data-node]");
const output = $("#workflow-result");
const demoEmails: Record<Scenario, string> = {
  valid: "asha@example.com",
  invalid: "— missing —",
  duplicate: "asha@example.com (existing)",
};
function resetWorkflow() {
  nodes.forEach((node, i) => {
    node.classList.remove("done", "running", "error", "skipped");
    const state = node.querySelector(".node-state");
    if (state) state.textContent = `0${i + 1}`;
  });
  if (output)
    output.textContent = "Ready when you are. Choose a scenario and press run.";
}
scenario?.addEventListener("change", () => {
  resetWorkflow();
  const email = $("[data-sample-email]");
  if (email) email.textContent = demoEmails[scenario.value as Scenario];
});
run?.addEventListener("click", async () => {
  if (!scenario || !output || !run) return;
  run.disabled = true;
  scenario.disabled = true;
  resetWorkflow();
  const steps = workflowSteps(scenario.value as Scenario);
  for (let i = 0; i < steps.length; i++) {
    const node = nodes[i];
    if (!node) continue;
    node.classList.add("running");
    if (!shouldReduce())
      await new Promise((resolve) => setTimeout(resolve, 650));
    node.classList.remove("running");
    node.classList.add(steps[i].state);
    const state = node.querySelector(".node-state");
    if (state)
      state.textContent =
        steps[i].state === "done"
          ? "✓"
          : steps[i].state === "error"
            ? "!"
            : "—";
    output.textContent = steps[i].message;
    if (steps[i].state === "error") {
      for (let j = i + 1; j < nodes.length; j++) {
        nodes[j].classList.add("skipped");
        const label = nodes[j].querySelector(".node-state");
        if (label) label.textContent = "—";
      }
      break;
    }
  }
  run.disabled = false;
  scenario.disabled = false;
});

const command = $<HTMLDialogElement>("#command-dialog");
const commandInput = $<HTMLInputElement>("#command-input");
const commandResults = $("#command-results");
type Command = { label: string; type: string; run: () => void };
const commands: Command[] = [
  ...[
    ["Selected work", "work"],
    ["Automation lab", "playground"],
    ["Experience at PHYTEC", "experience"],
    ["About Bhargav", "about"],
    ["Skills and tools", "skills"],
    ["Learning notes", "notes"],
    ["Contact", "contact"],
  ].map(([label, id]) => ({
    label,
    type: "Go to",
    run: () =>
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: shouldReduce() ? "instant" : "smooth" }),
  })),
  {
    label: "30-second recruiter overview",
    type: "Open",
    run: () => recruiter?.showModal(),
  },
  {
    label: "Download CV / résumé",
    type: "Download",
    run: () => {
      const link = document.createElement("a");
      link.href = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/assets/Bhargav-Sai-Bhartu-Resume.pdf`;
      link.download = "Bhargav-Sai-Bhartu-Resume.pdf";
      link.click();
    },
  },
  {
    label: "Copy email address",
    type: "Copy",
    run: () => {
      void copy(profile.email, "Email address copied.");
    },
  },
  {
    label: "Switch colour theme",
    type: "Action",
    run: () => $("button[data-theme]")?.click(),
  },
];
let filtered = commands;
let active = 0;
function renderCommands() {
  if (!commandInput || !commandResults) return;
  const q = commandInput.value.toLowerCase().trim();
  filtered = commands.filter((c) =>
    `${c.label} ${c.type}`.toLowerCase().includes(q),
  );
  active = 0;
  commandResults.replaceChildren();
  if (!filtered.length) {
    commandResults.append(
      textElement("p", "No matches. Try “work”, “CV” or “email”."),
    );
    return;
  }
  filtered.forEach((c, i) => {
    const button = textElement("button", c.label);
    button.type = "button";
    button.dataset.commandIndex = String(i);
    button.append(textElement("span", c.type));
    button.addEventListener("click", () => executeCommand(i));
    commandResults.append(button);
  });
  highlightCommand();
}
function highlightCommand() {
  commandResults
    ?.querySelectorAll("button")
    .forEach((el, i) => el.classList.toggle("command-active", i === active));
}
function executeCommand(index: number) {
  command?.close();
  filtered[index]?.run();
}
function openCommand() {
  if (!command || !commandInput) return;
  commandInput.value = "";
  renderCommands();
  command.showModal();
  commandInput.focus();
}
$$("[data-command-open]").forEach((button) =>
  button.addEventListener("click", openCommand),
);
commandInput?.addEventListener("input", renderCommands);
command?.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    active =
      (active +
        (e.key === "ArrowDown" ? 1 : -1) +
        Math.max(1, filtered.length)) %
      Math.max(1, filtered.length);
    highlightCommand();
    commandResults?.querySelectorAll("button")[active]?.focus();
  } else if (e.key === "Enter" && e.target === commandInput) {
    e.preventDefault();
    executeCommand(active);
  }
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (command?.open) command.close();
    else if (!document.querySelector("dialog[open]")) openCommand();
  }
});
if (!/Mac|iPhone|iPad/.test(navigator.platform))
  $$("[data-command-open] kbd").forEach((el) => (el.textContent = "Ctrl K"));
