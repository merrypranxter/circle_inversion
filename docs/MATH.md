# Inversion: working reference and gotchas

Given circle center c=(a,b) and radius R>0, write v=p-c and r²=v·v. For p≠c:

I(p) = c + R² v/r².

For p on |p-c|=R the multiplier is 1, so every point of the reference circle is fixed. For q=I(p), |q-c|=R²/|p-c|, so applying I again recovers p: I(I(p))=p. It is **undefined** at c (pole mapped to ideal infinity), orientation reversing on its domain and angle-preserving in absolute magnitude (anti-conformal in 2D complex notation). It is not an ordinary orientation-preserving complex Möbius transform, although it is an extended Möbius/anti-Möbius operation on the sphere.

## Exact circle images

Source circle has center o and radius r>0. Put v=o-c, d=|v|²-r².

- If d≠0: image center o'=c+(R²/d)v and radius r'=R² r/|d|.
- If d=0: source circle passes through the inversion pole; image is a line satisfying v·(x'-c)=R²/2. A point on that line is c+R² v/(2|v|²), with tangent direction perpendicular to v.

Test example: unit-radius circle centered at (3,0), inverted about origin with R=2, maps to circle centered (1.5,0), radius 0.5. Circle centered (1,0), radius 1 maps to line x=2.

## Exact line images

Represent an unbounded line by a point p0 and unit direction u. Let unit normal n=(-u_y,u_x), signed distance h=n·(p0-c). If h=0, the line passes through c and maps to itself as an unbounded generalized circle (except the pole). Otherwise its image is a circle through c, centered at c+R² n/(2h), radius R²/(2|h|).

For example, vertical line x=1 with origin inversion radius R=2 maps to circle centered (2,0), radius 2.

## Piecewise curves and numerics

A generic polygon, stroke or growth network will map to curved arcs. Simply inverting vertices and connecting them by straight segments introduces approximation error. `invertPolyline` recursively subdivides each source segment if the inverse image's midpoint deviates beyond a numerical tolerance from the chord midpoint; it segments near the pole and suppresses points outside a finite limit. This is a practical sampling scheme, **not an exact transformation of an arbitrary infinite curve**.

Exact circle / line conversions are offered separately for precise geometric calculations. The exporter builds broad black vector contours from many **filled** shapes; it does not currently perform robust polygon boolean union. The `fitPaths` normalizer centers finite content in a 100×100 tile; if an inverse path approaches the pole, clipping can truncate branches. Extreme scales and near-pole samples require extra care.

## References

- [MathWorld — Inversion](https://mathworld.wolfram.com/Inversion.html)
- [Encyclopedia of Mathematics — Inversion](https://encyclopediaofmath.org/wiki/Inversion)
- [Wikipedia — Inversive geometry (overview)](https://en.wikipedia.org/wiki/Inversive_geometry)

Research source links are included for independent checking. This codebase does not infer their full contents dynamically.
