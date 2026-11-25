import { test } from "node:test";
import assert from "node:assert/strict";
import { checkinSteps, sampleInputs } from "../src/scripts/checkin.ts";

const states = (scenario) => checkinSteps(scenario).map((s) => s.state);

test("a clear photo of an employee passes every check and is recorded", () => {
  assert.deepEqual(states("valid"), ["done", "done", "done", "done"]);
  assert.match(checkinSteps("valid")[3].message, /Checked in/);
});
test("poor light stops at the quality check and nothing is saved", () => {
  assert.deepEqual(states("dark"), ["done", "error", "skipped", "skipped"]);
  assert.match(checkinSteps("dark")[1].message, /Too dark/);
});
test("a printed photo is refused by the liveness check", () => {
  assert.deepEqual(states("photo"), ["done", "done", "error", "skipped"]);
  assert.match(checkinSteps("photo")[2].message, /Real face required/);
});
test("an unknown person is not matched and nothing is saved", () => {
  assert.deepEqual(states("unknown"), ["done", "done", "done", "error"]);
  assert.match(checkinSteps("unknown")[3].message, /not recognised/);
});
test("every scenario has sample input for the demo panel", () => {
  for (const scenario of ["valid", "dark", "photo", "unknown"])
    assert.ok(sampleInputs[scenario].face);
});
