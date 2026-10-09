/** Nine deliberately different deterministic source grammars.
 * Every source is a normalized array of polyline arrays; no random web APIs. */
const TAU=Math.PI*2;
const radial=(f,n=160)=>Array.from({length:n+1},(_,i)=>{const t=TAU*i/n,r=f(t,i);return {x:r*Math.cos(t),y:r*Math.sin(t)}});
const circle=(x,y,r,n=90)=>Array.from({length:n+1},(_,i)=>({x:x+r*Math.cos(TAU*i/n),y:y+r*Math.sin(TAU*i/n)}));
const line=(x1,y1,x2,y2,n=32)=>Array.from({length:n+1},(_,i)=>({x:x1+(x2-x1)*i/n,y:y1+(y2-y1)*i/n}));
const rand=seed=>{let s=(Math.trunc(seed)>>>0)||1;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296}};
export const MOTIFS=[
{ id:'orbit-nest', label:'Orbit Nest', make:(v)=>[...Array.from({length:5},(_,i)=>circle(Math.sin(i*1.3)*.16,Math.cos(i*.6)*.11,.25+i*.14))]},
{ id:'petal-engine',label:'Petal Engine',make:()=>[radial(t=>.56+.26*Math.cos(9*t),320),radial(t=>.3+.09*Math.sin(9*t),260)]},
{ id:'alien-sun',label:'Alien Sun',make:()=>[radial(t=>.58+.12*Math.sin(21*t),340),circle(0,0,.24),circle(0,0,.35)]},
{ id:'orbit-spiral',label:'Orbit Spiral',make:()=>[Array.from({length:401},(_,i)=>{const t=i/400*TAU*4,r=.10+i/400*.78;return {x:r*Math.cos(t),y:r*Math.sin(t)}}),circle(0,0,.15)]},
{ id:'woven-star',label:'Woven Star',make:()=>[...Array.from({length:8},(_,i)=>{const t=i*TAU/8;return line(.08*Math.cos(t),.08*Math.sin(t),.93*Math.cos(t+.55),.93*Math.sin(t+.55))}),circle(0,0,.50)]},
{ id:'satellite-cells',label:'Satellite Cells',make:()=>[circle(0,0,.26),...Array.from({length:8},(_,i)=>{const a=TAU*i/8;return circle(.55*Math.cos(a),.55*Math.sin(a),.19)})]},
{ id:'folded-thread',label:'Folded Thread',make:()=>[...Array.from({length:5},(_,j)=>Array.from({length:161},(_,i)=>{const x=-.95+1.9*i/160;return {x,y:(j-2)*.18+.19*Math.sin(x*8+j*.53)}}))]},
{ id:'trochoid-vault',label:'Trochoid Vault',make:()=>[Array.from({length:401},(_,i)=>{const t=TAU*5*i/400;return {x:.49*Math.cos(t)+.34*Math.cos(3*t),y:.49*Math.sin(t)-.34*Math.sin(3*t)}})]},
{ id:'star-mutation',label:'Star Mutation',make:(v)=>{const r=rand(v);return [radial(t=>.48+.19*Math.sin(t*6+r()*0.15)+.10*Math.cos(t*13),360),circle(0,0,.26),circle(0,0,.66)]}}
];
export function getMotifs(seed=1){return MOTIFS.map(m=>({id:m.id,label:m.label,paths:m.make(seed)}));}
export function validatePaths(data){
 const raw=Array.isArray(data)?data:data?.paths;
 if(!Array.isArray(raw)||raw.length>150||raw.length<1)throw new TypeError('Expected {paths:[ [{x,y}, ...], ... ]}');
 return raw.map(path=>{if(!Array.isArray(path)||path.length<2||path.length>5000)throw new RangeError('Each path needs 2 to 5000 points');return path.map(p=>{const x=Number(p?.x),y=Number(p?.y);if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>1e6||Math.abs(y)>1e6)throw new RangeError('Coordinates must be finite, reasonable numbers');return {x,y};});});
}
