/** Euclidean inversion. Pure functions; pixel/world coordinate agnostic. */
export const EPS = 1e-10;
export const finitePoint = p => p && Number.isFinite(p.x) && Number.isFinite(p.y);
export const squaredDistance = (a, b) => (a.x-b.x)**2 + (a.y-b.y)**2;

export function invertPoint(point, center={x:0,y:0}, radius=1, epsilon=EPS) {
  if (!finitePoint(point) || !finitePoint(center) || !Number.isFinite(radius) || radius<=0) throw new RangeError('Invalid inversion input');
  const d2=squaredDistance(point,center);
  if (d2<=epsilon*epsilon) return null; // pole -> infinity; do not fake a coordinate
  const k=radius*radius/d2;
  const p={x:center.x+(point.x-center.x)*k,y:center.y+(point.y-center.y)*k};
  return finitePoint(p)?p:null;
}

export function invertCircle(circle, center={x:0,y:0}, radius=1, epsilon=EPS) {
  const {x,y,r}=circle;
  if (!finitePoint({x,y})||!Number.isFinite(r)||r<=0||radius<=0) throw new RangeError('Invalid circle');
  const dx=x-center.x,dy=y-center.y,d2=dx*dx+dy*dy;
  const den=d2-r*r, scale=radius*radius;
  if (Math.abs(den)<=epsilon*Math.max(1,d2,r*r)) {
    if (d2<=epsilon*epsilon) throw new RangeError('Degenerate circle through pole');
    // v · (p' - center) = R²/2
    const norm=Math.sqrt(d2),nx=dx/norm,ny=dy/norm;
    return {kind:'line',point:{x:center.x+nx*scale/(2*norm),y:center.y+ny*scale/(2*norm)},direction:{x:-ny,y:nx}};
  }
  return {kind:'circle',x:center.x+scale*dx/den,y:center.y+scale*dy/den,r:Math.abs(scale*r/den)};
}

export function invertLine(line, center={x:0,y:0}, radius=1, epsilon=EPS) {
  const {point,direction}=line;
  if (!finitePoint(point)||!finitePoint(direction)||radius<=0) throw new RangeError('Invalid line');
  const length=Math.hypot(direction.x,direction.y);
  if (length<=epsilon) throw new RangeError('Line needs a direction');
  const nx=-direction.y/length,ny=direction.x/length;
  const h=(point.x-center.x)*nx+(point.y-center.y)*ny;
  if (Math.abs(h)<=epsilon) return {kind:'line',point:{...center},direction:{x:direction.x/length,y:direction.y/length}};
  const k=radius*radius/(2*h);
  return {kind:'circle',x:center.x+k*nx,y:center.y+k*ny,r:Math.abs(k)};
}

export function composeInversions(point, transforms) {
  return transforms.reduce((p,t)=>p===null?null:invertPoint(p,t.center,t.radius), point);
}
