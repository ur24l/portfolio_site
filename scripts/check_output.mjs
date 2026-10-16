import { readFile, access } from "node:fs/promises";
import { resolve, join } from "node:path";
const root = resolve("dist");
const base = "/portfolio_site";
const pages = ["index.html", "resume/index.html"];
let checked = 0;
for (const page of pages) {
  const html = await readFile(join(root, page), "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length)
    throw new Error(`Duplicate IDs in ${page}`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (value.startsWith("#")) {
      if (!ids.includes(value.slice(1)))
        throw new Error(`Missing anchor ${value} in ${page}`);
      checked++;
      continue;
    }
    if (!value.startsWith(base + "/")) continue;
    let relative = decodeURIComponent(value.slice(base.length + 1)).split(
      /[?#]/,
    )[0];
    if (!relative || relative.endsWith("/")) relative += "index.html";
    await access(join(root, relative));
    checked++;
  }
  if (!html.includes('rel="canonical"'))
    throw new Error(`Missing canonical URL in ${page}`);
  const og = html.match(/property="og:image" content="([^"]+)"/);
  if (!og?.[1].startsWith("https://"))
    throw new Error(`Social image must be absolute in ${page}`);
}
console.log(
  `Verified ${pages.length} pages and ${checked} internal anchors/assets.`,
);
