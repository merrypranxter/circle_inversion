# Ecosystem interop: input and output contracts

## Import source polylines

JSON:

```json
{"paths":[[{"x":-0.8,"y":0},{"x":0,"y":0.25},{"x":0.8,"y":0}], [{"x":0.2,"y":0.2},{"x":0.4,"y":0.4}]]}
```

- Coordinates finite numeric x/y in any consistent world unit; recommended normalized range −1..1.
- 1–150 paths, each 2–5000 points; browser input 2 MB max.
- Explicit polylines; no curves, SVG transforms, or image payloads in this JSON schema.
- Avoid source segments crossing the inversion pole when a continuous finite curve is required. The engine splits or excludes unbounded sections.
- Browser demo fits the resulting finite paths to 100×100 tile, then expands centerline strokes into filled paths.

## JavaScript API

```js
import { invertPoint, invertCircle, invertLine } from './src/math/inversion.js';
import { invertPolyline, fitPaths } from './src/math/sampling.js';
import { renderSheetSVG } from './src/export/svg.js';
const source = [[{x:-1,y:0.2},{x:1,y:0.2}]];
const inverted = source.flatMap(path => invertPolyline(path,{center:{x:0,y:0},radius:1}));
const result = fitPaths(inverted);
```

Pure geometry imports run under Node or browser with no dependencies. Download methods that touch DOM work in browsers only. `renderSheetSVG` requires exactly nine `{id,paths,width}` objects and returns a stand-alone SVG document.

## Child-repo composition

| Parent | Causal role | Correct derived recipe |
| --- | --- | --- |
| `slime_molds` | source adaptive path graph | convert network edges to polylines → invert coordinates → fit → SVG |
| `apollonian_gasket` | source generated circles | call `invertCircle` directly for exact circle/line outputs → visualize |
| `noneuclidean` | geometry comparison/context | contrast inversive vs hyperbolic/Poincaré mappings |
| `op_art_style` | independent visual styling | apply interference overlays to **already exported** silhouettes |
| `daddydingy` | glyph keyboard output | ingest one of nine SVG groups as glyph shape |
| `monetize` | packaging, if approved | copy known-good SVG+recipes into a **separate** commercial artifact |

## Procedural recipe schema

Read `context.manifest.json` plus user-exported recipe JSON. A minimal crossbreed prompt must include: the input parent, its data/shape units, why inversion is being applied, inversion center/radius, singularity/clip constraints, expected vector/raster outputs, and separate finishing parent if any. Do not claim a physically possible 3D space operation based on this 2D transform.
