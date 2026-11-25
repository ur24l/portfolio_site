/**
 * Google Apps Script Web App for Bhargav Sai Bhartu's portfolio contact form.
 *
 * Setup (takes ~1 minute):
 * 1. Open https://script.google.com/ and create a New Project.
 * 2. Paste this entire file and save.
 * 3. Click Deploy -> New deployment -> Web app:
 *    - Execute as: Me (bhargavsaibhartu@gmail.com)
 *    - Who has access: Anyone
 * 4. Copy the Web App URL (ends with /exec) and paste it into
 *    "contactWebhookUrl" inside src/data/profile.json, then rebuild.
 *
 * Behavior:
 * - Emails Bhargav with the visitor's details (Reply-To set to visitor's email).
 * - Automatically sends a clean Thank-You confirmation email to the visitor.
 */

const OWNER_EMAIL = "bhargavsaibhartu@gmail.com";
const OWNER_NAME = "Bhargav Sai Bhartu";

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || "{}";
    const data = JSON.parse(raw);

    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const topic = String(data.topic || "General Inquiry").trim();
    const message = String(data.message || "").trim();

    if (!name || !email || !message || data._honey) {
      return jsonResponse({ ok: false, error: "Invalid submission." });
    }

    // 1. Send inquiry details to Bhargav
    MailApp.sendEmail({
      to: OWNER_EMAIL,
      replyTo: email,
      name: `${name} via Portfolio`,
      subject: `[Portfolio] ${topic} — ${name}`,
      body:
        `New inquiry from your portfolio:\n\n` +
        `Name:    ${name}\n` +
        `Email:   ${email}\n` +
        `Topic:   ${topic}\n\n` +
        `Message:\n${message}\n`,
    });

    // 2. Send automatic Thank-You confirmation to the visitor
    MailApp.sendEmail({
      to: email,
      name: OWNER_NAME,
      replyTo: OWNER_EMAIL,
      subject: `Thank you for reaching out — ${OWNER_NAME}`,
      body:
        `Hi ${name},\n\n` +
        `Thank you for contacting me through my portfolio. I have received your message regarding "${topic}" and will review it and reply shortly.\n\n` +
        `Copy of your message:\n` +
        `"${message}"\n\n` +
        `Best regards,\n` +
        `${OWNER_NAME}\n` +
        `Python & AI Developer · PHYTEC India\n` +
        `https://ur24l.github.io/portfolio_site/\n`,
    });

    return jsonResponse({ ok: true, message: "Sent and auto-reply delivered." });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
