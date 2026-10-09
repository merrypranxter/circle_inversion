import {invertPoint,finitePoint} from './inversion.js';

const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
const sq=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;

/** Adaptive sampling of the inverse image of a finite source polyline.
 * Separate finite runs at singularities, jumps or extreme positions so no bridge crosses infinity.
 */
export function invertPolyline(points,{center={x:0,y:0},radius=1,tolerance=.008,maxDepth=7,limit=12}={}) {
  if(!Array.isArray(points)||points.length<2) return [];
  const valid=p=>finitePoint(p)&&Math.abs(p.x)<limit&&Math.abs(p.y)<limit;
  const f=p=>invertPoint(p,center,radius);
  const out=[],push=p=>{if(valid(p)){if(!out.length||out[out.length-1]!==null) out.push(p);else out.push(p);}else if(out.length&&out[out.length-1]!==null)out.push(null);};
  function refine(a,b,fa,fb,depth){
    const mid=lerp(a,b,.5), fm=f(mid);
    const jump=valid(fa)&&valid(fb) && Math.sqrt(sq(fa,fb))>limit*.5;
    const bend=valid(fa)&&valid(fb)&&valid(fm)?sq(fm,lerp(fa,fb,.5))>tolerance*tolerance:!valid(fa)||!valid(fb)||!valid(fm);
    if(depth<maxDepth && (jump||bend)){
      refine(a,mid,fa,fm,depth+1);refine(mid,b,fm,fb,depth+1);
    }else{push(fb);}
  }
  push(f(points[0]));
  for(let i=1;i<points.length;i++) refine(points[i-1],points[i],f(points[i-1]),f(points[i]),0);
  const paths=[];let current=[];
  for(const p of out){if(p){if(!current.length||sq(current[current.length-1],p)>1e-18)current.push(p);}else{if(current.length>=2)paths.push(current);current=[];}}
  if(current.length>=2)paths.push(current);
  return paths;
}

export function fitPaths(paths,{width=100,height=100,padding=8,lowerQuantile=0,upperQuantile=1}={}){
  const all=paths.flat().filter(finitePoint);
  if(!all.length)return [];
  const xs=all.map(p=>p.x).sort((a,b)=>a-b),ys=all.map(p=>p.y).sort((a,b)=>a-b);
  const lo=Math.min(all.length-1,Math.floor(all.length*lowerQuantile)),hi=Math.min(all.length-1,Math.ceil((all.length-1)*upperQuantile));
  const [minX,maxX,minY,maxY]=[xs[lo],xs[hi],ys[lo],ys[hi]];
  const scale=Math.min((width-2*padding)/Math.max(maxX-minX,1e-8),(height-2*padding)/Math.max(maxY-minY,1e-8));
  const ox=width/2-(minX+maxX)*scale/2,oy=height/2-(minY+maxY)*scale/2;
  return paths.map(path=>path.map(p=>({x:p.x*scale+ox,y:p.y*scale+oy})));
}
