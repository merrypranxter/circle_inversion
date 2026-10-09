# Agent build mandate

Primary agent: `.github/agents/circle-inversion.agent.md`.

- Read `repo_seed.txt`, `context.manifest.json`, `docs/MATH.md`, `docs/INTEGRATION.md` before changing behavior.
- Preserve mathematically valid inversion; never bridge paths across the pole.
- `npm test` before declaring success. Browser demo must remain no-build, dependency free.
- Shared source files are read-only reference unless this repository specifically owns them.
- Keep exports as real filled SVG geometry, not CSS-only strokes, and preserve nine separable glyph groups.
- Do not introduce model API calls, secrets, heavy bundlers or commercial billing into this personal lab.
