# CIRCLE INVERSION — Alien Ornament Laboratory

**Real inversion mathematics → distorted paths → 9 separate, black-filled vector ornaments.**

A free, dependency-free, browser-native experimental math lab. This repo extends Merry's existing `noneuclidean` + `apollonian_gasket` ecosystem with a purpose-built 2D inversion operator, adaptive sampling, SVG generation, a nine-up dingbat artboard, JSON import, and portable machine-readable presets. Existing creative laboratories remain unmodified.

## Get started

- Open the hosted static site when published with GitHub Pages, or download/clone and run `npm run serve` (requires Python 3) from the repo root, then visit `http://localhost:8080`.
- Move the inversion center and radius; adjust filled contour thickness and deterministic seed.
- Select any of the nine independent black vector glyphs.
- Export **selected SVG**, **nine-up SVG** (nine separately addressable `<g>` groups), **nine-up PNG**, or **recipe JSON**.
- Import paths as a local JSON file `{ "paths": [ [{ "x": -1, "y": 0 }, { "x": 1, "y": 0 }] ] }` to process shapes from other repositories. Each of the nine tiles applies a different preset transform to the same imported geometry. Nothing is uploaded anywhere.

### Browser support

Requires modern browser with native ES modules and SVG. No CDN or runtime API keys. The static `index.html` needs to be served over HTTP(S), not opened as a bare `file://` URL in some browsers. SVG downloading uses Blob links; PNG conversion uses an in-memory Canvas.

## What lives where

| Path | Purpose |
| --- | --- |
| `src/math/inversion.js` | Exact point, circle, and line inversions; composition and singularity handling |
| `src/math/sampling.js` | Curvature-driven inverse sampling, breaks near poles, viewport fitting |
| `src/math/motifs.js` | Nine distinct source motif grammars, validated JSON polyline import |
| `src/data/presets.js` | Nine independent inversion presets, separate from geometry |
| `src/export/svg.js` | **Filled paths**, not SVG strokes, per glyph and nine-up sheet; PNG conversion |
| `src/app.js`, `src/styles.css`, `index.html` | Browser artboard and exports |
| `tests/` | Node built-in unit tests for math, SVGs, determinism and JSON safety |
| `docs/` | Proofs, constraints, interaction guide, integration contracts and visual direction |
| `context.manifest.json` | Machine-readable knowledge contract for RepoScripter/Git Shitter |
| `repo_seed.txt` | Original detailed agent seed, with current implementation notes |
| `.github/agents/circle-inversion.agent.md` | Repository-specialist Copilot agent (preserved from initialization) |
| `.github/workflows/test.yml` | Automated zero-dependency CI |

## Technical truth

Inversion in a circle of radius `R` and center `c` maps point `p ≠ c` to `c + (R²/|p-c|²)(p-c)`. It maps the reference circle pointwise onto itself and is involutive. Circles through the center become lines, and lines avoiding the center become circles through it. The center is a pole: the app explicitly discards unbounded sample positions rather than replacing them with fake finite math.

**Rendering caveat:** The exported contours are unions of filled quads plus round disks, which gives robust black-filled vectors, but complex self-overlapping glyphs are **not boolean-unioned** into a single mathematically simplified outline. Illustrator can merge them with Pathfinder if a simplified contour is needed. Source polylines are adaptive approximations of true inverse arcs. For precise analytic geometry use `invertCircle`/`invertLine` in the library instead of SVG samples.

## Quality / run tests

`npm test` — Node >=20, built-in runner, no install required. Run `node --check src/app.js` for static syntax validation. CI reruns math and SVG tests on every push.

## How this crossbreeds

- **`slime_molds`** supplies source network polylines; inversion supplies geometry, not biological behavior.
- **`apollonian_gasket`** supplies circle packings as optional *input* (no modification of its algorithm).
- **`noneuclidean`** supplies broader geometric vocabulary and mapping comparisons; exact functions in this repo are stand-alone.
- **`op_art_style`** supplies an optional optical finishing stage after SVG export.
- **`daddydingy`** can ingest independently selected SVG silhouettes for dingbat glyphs.
- **`git_shitter`** reads the repo knowledge and contracts to generate causal fusion briefs.
- **`monetize`** may package approved descendant products later; the personal lab is not the store.

This is not an AI image generation service. Rendering needs no API and never consumes model credits.
