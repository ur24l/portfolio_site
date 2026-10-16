import { test } from "node:test";
import assert from "node:assert/strict";
import { workflowSteps } from "../src/scripts/workflow.ts";

test("a complete enquiry reaches sales after the CRM record", () => {
  const steps = workflowSteps("valid");
  assert.deepEqual(
    steps.map((s) => s.state),
    ["done", "done", "done", "done"],
  );
  assert.match(steps[2].message, /Odoo CRM/);
  assert.match(steps[3].message, /notification/);
});
test("an invalid enquiry blocks both CRM creation and notification", () => {
  const steps = workflowSteps("invalid");
  assert.equal(steps[1].state, "error");
  assert.deepEqual(
    steps.slice(2).map((s) => s.state),
    ["skipped", "skipped"],
  );
  assert.match(steps[1].message, /Email is required/);
});
test("a duplicate does not create a lead or send another notification", () => {
  const steps = workflowSteps("duplicate");
  assert.deepEqual(
    steps.map((s) => s.state),
    ["done", "done", "skipped", "skipped"],
  );
  assert.match(steps[3].message, /could be extended/);
});
