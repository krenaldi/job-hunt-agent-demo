# Job Hunt Agent

A Markdown-driven AI agent workflow for a personal job search. There is no application code: Claude Code reads the files below and runs the weekly procedure.

## How it works

1. `job_search_profile.md` defines what counts as a match (roles, level, location, industries, salary floor, dealbreakers).
2. `weekly_job_hunt_workflow.md` is the numbered procedure Claude follows: search, filter, dedupe, record, check follow-ups, report.
3. `job_leads.md` is the running table of leads (Source, Role, Company, Location, Link, MatchReason, Notes, OutreachStatus).
4. `weekly_run_prompt.md` holds the prompt to paste each week to start a run.
5. `CLAUDE.md` gives Claude Code the project rules (e.g. never apply or message anyone without approval).

## Usage

Open the folder in Claude Code and paste the prompt from `weekly_run_prompt.md`. Claude updates `job_leads.md` and summarizes new leads, follow-ups due, and next actions. Review leads marked `Unverified` before acting on them.

## Setup notes

- `.env` is gitignored and holds local secrets; it is not part of the repo.
- Web search must be available to Claude for the search step to run.
- This repo may be public: keep personal details (contact info, resume content) out of tracked files.
