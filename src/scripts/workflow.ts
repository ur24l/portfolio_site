export type Scenario = "valid" | "invalid" | "duplicate";
export type WorkflowStep = {
  state: "done" | "error" | "skipped";
  message: string;
};
/** A deterministic illustration. No network, storage or CRM calls. */
export function workflowSteps(scenario: Scenario): WorkflowStep[] {
  if (scenario === "invalid")
    return [
      { state: "done", message: "Sample enquiry received." },
      {
        state: "error",
        message:
          "Email is required. The enquiry stops here so incomplete data does not reach the CRM.",
      },
      { state: "skipped", message: "No CRM lead created." },
      { state: "skipped", message: "No sales notification sent." },
    ];
  if (scenario === "duplicate")
    return [
      { state: "done", message: "Sample enquiry received." },
      {
        state: "done",
        message:
          "Fields cleaned. This sample email matches an existing enquiry.",
      },
      {
        state: "skipped",
        message:
          "Existing lead found. The demo avoids creating another record.",
      },
      {
        state: "skipped",
        message:
          "No repeated notification. Duplicate checks are an example of how this flow could be extended.",
      },
    ];
  return [
    { state: "done", message: "Sample enquiry received through the webhook." },
    {
      state: "done",
      message: "Name trimmed, email normalised and required fields checked.",
    },
    { state: "done", message: "Sample fields mapped to a new Odoo CRM lead." },
    {
      state: "done",
      message:
        "Complete. In this example, the sales team receives a notification with the lead details.",
    },
  ];
}
