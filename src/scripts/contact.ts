// Sends the contact form without leaving the page (FormSubmit, or an optional webhook).
const form = document.querySelector<HTMLFormElement>("#contact-form");
const success = document.querySelector<HTMLElement>("#contact-success");
const successCopy = document.querySelector<HTMLElement>(
  "#contact-success-copy",
);
const errorBox = document.querySelector<HTMLElement>("#contact-error");
const reset = document.querySelector<HTMLButtonElement>("#contact-reset");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const endpoint = form.dataset.endpoint;
  const owner = form.dataset.ownerEmail || "";
  if (!endpoint) return;

  const data = new FormData(form);
  const value = (key: string) => String(data.get(key) || "").trim();
  if (value("_honey")) return; // spam bots fill the hidden field

  const name = value("name");
  const email = value("email");
  const topic = value("topic") || "General question";
  const message = value("message");
  const button = form.querySelector<HTMLButtonElement>(".form-submit");
  if (errorBox) errorBox.hidden = true;
  if (button) {
    button.disabled = true;
    button.textContent = "Sending...";
  }

  try {
    let ok = false;
    let detail = "";
    if (form.dataset.isWebhook === "true") {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          topic,
          message,
          submittedAt: new Date().toISOString(),
        }),
      });
      const json = await response.json().catch(() => ({ ok: response.ok }));
      ok = response.ok && json.ok !== false;
      detail = json.error || "";
    } else {
      const payload = new FormData();
      payload.append("name", name);
      payload.append("email", email);
      payload.append("topic", topic);
      payload.append("message", message);
      payload.append("_subject", `[Portfolio] ${topic}: ${name}`);
      payload.append("_template", "table");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });
      const json = await response.json().catch(() => ({}));
      ok = response.ok && (json.success === true || json.success === "true");
      detail = json.message || "";
    }
    if (!ok) throw new Error(detail || "The message could not be sent.");

    form.hidden = true;
    if (successCopy)
      successCopy.textContent = `Thank you, ${name}. I will reply to ${email} soon.`;
    if (success) success.hidden = false;
  } catch (error) {
    if (errorBox) {
      const reason =
        error instanceof Error
          ? error.message
          : "The message could not be sent.";
      errorBox.textContent = `${reason} Please email ${owner} directly.`;
      errorBox.hidden = false;
    }
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Send message";
    }
  }
});

reset?.addEventListener("click", () => {
  form?.reset();
  if (success) success.hidden = true;
  if (form) form.hidden = false;
});
