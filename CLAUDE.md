# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

A personal job-hunt agent. Claude runs a repeatable weekly workflow to find and track roles that fit the user's profile, and helps tailor application materials. There is no application code, build system, or test suite; the project is driven by the Markdown files below.

## Key files

Read these before doing any job-hunt task. Each is the source of truth for its topic.

| File | Role |
|---|---|
| `job_search_profile.md` | Target roles, locations, industries, and constraints. Use it to decide what counts as a match. |
| `weekly_job_hunt_workflow.md` | The repeatable workflow to follow each week. Follow its steps rather than improvising. |
| `job_leads.md` | Saved leads and notes. Append new leads and update existing ones here; don't create parallel lists. |
| `weekly_run_prompt.md` | The reusable command the user runs weekly. Treat it as the entry point; keep it consistent with the workflow file. |

`job_search_profile.md` is filled in. If a file is missing or contains TODOs, say so and ask; don't invent the user's preferences.

The user's resume is outside the repo at `/Users/krisrenaldi/Documents/Resumes/KRIS RENALDI Resume.pdf`. Read it for facts about their background; don't copy it into the repo.

## Working rules

- Match leads against `job_search_profile.md`, and note why a lead fits or doesn't.
- When adding to `job_leads.md`, avoid duplicates (check company and role first) and keep each lead's source link and date.
- Never apply, send messages, or submit forms on the user's behalf without explicit approval. Draft materials and let the user send them.
- `job_leads.md` columns: Source, Role, Company, Location, Link, MatchReason, Notes, OutreachStatus. Keep them in that order; the workflow depends on it.
- Leads taken from search snippets without opening the posting must say `Unverified` in Notes.
- Don't state facts about the user's experience that aren't in their resume or profile.

## Repository

- Remote: `https://github.com/krenaldi/job-hunt-agent-demo.git` (`origin`), default branch `main`.
- `.env` holds local secrets and is gitignored. Never commit it or print its values.
- This repo is pushed to GitHub: keep personal details (contact info, resume content) out of tracked files unless the user says otherwise.
