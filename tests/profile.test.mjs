import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const profile = JSON.parse(
  readFileSync(new URL("../src/data/profile.json", import.meta.url), "utf8"),
);
test("JavaScript is explicitly learning, never a hands-on proficiency claim", () => {
  const groups = profile.skillGroups.filter((g) =>
    g.items.some((s) => s.includes("JavaScript")),
  );
  assert.equal(groups.length, 1);
  assert.equal(groups[0].title, "Currently learning");
  const cvEntries = profile.skills.filter(([, items]) =>
    items.includes("JavaScript"),
  );
  assert.equal(cvEntries.length, 1);
  assert.match(cvEntries[0][1], /JavaScript \(learning\)/);
});
test("Java remains basic and confirmed Python and MySQL remain hands-on", () => {
  const hands = profile.skillGroups.find((g) => g.title === "Hands-on skills");
  assert.ok(hands.items.includes("Python"));
  assert.ok(hands.items.includes("MySQL"));
  assert.match(
    profile.skills.find(([label]) => label === "Learning")[1],
    /Java \(basics\)/,
  );
});
