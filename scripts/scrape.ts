// Weekly job scraper: queries SerpAPI's Google Jobs engine and writes candidate
// postings to data/candidates.json for the weekly Claude run to review.
// It does NOT edit job_leads.md. Bun loads .env automatically.
// Usage: bun run scrape [--dry-run]

import { mkdir } from "node:fs/promises";

const KEY = process.env.SERPAPI_API_KEY;
const DRY_RUN = process.argv.includes("--dry-run");

// Keep in sync with job_search_profile.md (roles, location). Each query = 1 API credit.
const TITLES = [
  "senior backend engineer",
  "senior full stack engineer",
  "senior AI engineer",
];
const INDUSTRIES = ["fintech", "healthcare", "telecommunications", "media", "entertainment"];
const LOCATIONS = ["Edison, New Jersey", "New York, New York"];

type Candidate = {
  title: string;
  company: string;
  location: string;
  source: string;
  link: string;
  posted: string;
  salary: string;
  workFromHome: boolean;
  query: string;
  description: string;
};

// 3 titles x 2 locations + 5 industries x 2 locations = 16 queries (16 credits per run).
const queries: { q: string; location: string }[] = [];
for (const location of LOCATIONS) {
  for (const title of TITLES) queries.push({ q: `${title} hybrid`, location });
  for (const industry of INDUSTRIES)
    queries.push({ q: `senior software engineer hybrid ${industry}`, location });
}

if (DRY_RUN) {
  console.log(`Dry run: ${queries.length} queries would run (1 SerpAPI credit each):`);
  for (const { q, location } of queries) console.log(`- "${q}" in ${location}`);
  process.exit(0);
}

if (!KEY) {
  console.error("SERPAPI_API_KEY is not set. Add it to .env (see .env.example).");
  process.exit(1);
}

const seen = new Set<string>();
const candidates: Candidate[] = [];
let failures = 0;

for (const { q, location } of queries) {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_jobs");
  url.searchParams.set("q", q);
  url.searchParams.set("location", location);
  url.searchParams.set("chips", "date_posted:week");
  url.searchParams.set("api_key", KEY);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: any = await res.json();
    if (data.error && !/hasn't returned any results/i.test(data.error)) throw new Error(data.error);

    for (const j of data.jobs_results ?? []) {
      const dedupeKey = `${j.company_name}|${j.title}`.toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      const ext = j.detected_extensions ?? {};
      candidates.push({
        title: j.title,
        company: j.company_name,
        location: j.location ?? "",
        source: j.via ?? "",
        link: j.apply_options?.[0]?.link ?? j.share_link ?? "",
        posted: ext.posted_at ?? "",
        salary: ext.salary ?? "",
        workFromHome: Boolean(ext.work_from_home),
        query: `${q} | ${location}`,
        description: String(j.description ?? "").slice(0, 1500),
      });
    }
    console.log(`ok   "${q}" in ${location}: ${data.jobs_results?.length ?? 0} results`);
  } catch (err) {
    failures++;
    // Never print the URL: it contains the API key.
    console.error(`fail "${q}" in ${location}: ${(err as Error).message}`);
  }
}

await mkdir("data", { recursive: true });
const out = { ranAt: new Date().toISOString(), count: candidates.length, candidates };
await Bun.write("data/candidates.json", JSON.stringify(out, null, 2));
console.log(`Wrote ${candidates.length} unique candidates to data/candidates.json (${failures} failed queries)`);
process.exit(failures === queries.length ? 1 : 0);
