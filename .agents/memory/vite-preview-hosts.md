---
name: Vite preview hosts
description: Replit preview host configuration for Vite development servers.
---

Vite development servers used through Replit’s proxy need dynamic host acceptance rather than a single hardcoded hostname.

**Why:** Replit preview domains may differ between sessions or environments, which otherwise produces Vite’s “host is not allowed” error.

**How to apply:** For a Replit-facing Vite preview, configure the server with `allowedHosts: true` and bind the dev server to `0.0.0.0`.