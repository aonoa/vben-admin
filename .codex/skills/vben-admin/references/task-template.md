# Task Template

## Before Editing

- Read the project docs listed in `AGENTS.md`.
- Check `git status --short --branch` and worktree list.
- Identify the active frontend/backend version line and inspect paired `../base-server` impact.
- Identify the exact write paths.
- Mark any shared or high-conflict files as out of scope unless explicitly requested.

## During Editing

- Keep changes within the reserved paths.
- Prefer the smallest source file or package boundary that solves the task.
- If a generated file changes, regenerate it from source instead of hand-editing output.

## Before Handoff

- Run the smallest verification command that covers the changed boundary.
- Escalate to broader checks if shared packages, tooling, or cross-app behavior changed.
- Include paired backend verification when API contracts, auth, permissions, data fields, upload, or SSE behavior can be affected.
- Update the relevant project docs when decisions, assumptions, or task boundaries changed.
