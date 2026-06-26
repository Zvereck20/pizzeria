---
name: docker-debug
description: Use this skill when debugging Docker, docker-compose, containers, ports, volumes, startup errors, or dependency installation issues.
---

When debugging Docker in this project:

- Assume dependencies should not be installed locally.
- Use docker compose commands from the repository root.
- Check docker compose config first.
- Check running containers.
- Check logs for client, server, and mongo.
- Use docker compose exec or docker compose run for npm commands.
- Do not delete volumes unless explicitly requested.
- Explain what each command checks.
- Prefer minimal fixes.
