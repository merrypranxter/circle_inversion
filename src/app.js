import {invertPolyline,fitPaths} from './math/sampling.js';
import {getMotifs,validatePaths} from './math/motifs.js';
import {PRESETS} from './data/presets.js';
import {renderGlyphSVG,renderSheetSVG,downloadText,svgToPng} from './export/svg.js';

const $=id=>document.getElementById(id);
const ui={grid:$('grid'),seed:$('seed'),size:$('thickness'),r:$('radius'),cx:$('centerX'),cy:$('centerY'),invert:$('invert'),status:$('status'),select:$('preset')};
let selected=0,imported=null,compiled=[];

function controls(){return {seed:Math.max(1,Math.trunc(Number(ui.seed.value)||1)),thickness:Number(ui.size.value),radius:Number(ui.r.value),center:{x:Number(ui.cx.value),y:Number(ui.cy.value)},invert:ui.invert.checked};}
function render(){
 const c=controls();
 const motifs=getMotifs(c.seed);
 compiled=motifs.map((motif,i)=>{
   const raw=imported?.paths??motif.paths;
   const preset=PRESETS[i];
   const center={x:c.center.x+preset.center.x,y:c.center.y+preset.center.y};
   const radius=c.radius*preset.radius;
   const paths=c.invert?raw.flatMap(p=>invertPolyline(p,{center,radius,limit:14,tolerance:.009,maxDepth:6})):raw;
   const fitted=fitPaths(paths,{width:100,height:100,padding:10});
   return {id:imported?'import-'+(i+1):preset.id,label:imported?`Mutation ${i+1}`:motif.label,paths:fitted,width:c.thickness};
 });
 ui.grid.replaceChildren();
 compiled.forEach((g,i)=>{
   const button=document.createElement('button');button.className='glyph'+(selected===i?' is-selected':'');
   button.type='button';button.setAttribute('aria-label',`Select ${g.label}`);
   button.innerHTML=renderGlyphSVG(g.paths,{size:300,width:g.width,id:g.id})+`<span>${String(i+1).padStart(2,'0')} / ${g.label}</span>`;
   button.addEventListener('click',()=>{selected=i;ui.select.value=String(i);render();});ui.grid.append(button);
 });
 ui.status.textContent=`${imported?'IMPORTED GEOMETRY':'NINE GEOMETRY SPECIMENS'} · seed ${c.seed} · ${c.invert?'INVERSION ON':'SOURCE VIEW'}`;
}
function current(){return compiled[selected];}
function label(){return `circle-inversion-${current().id}-s${controls().seed}`;}
function sheet(){return renderSheetSVG(compiled,{cell:160,gap:18,margin:18});}
function exportRecipe(){return JSON.stringify({format:'circle-inversion-recipe-v1',seed:controls().seed,settings:controls(),source:imported?'imported':'built-in',presets:PRESETS,chosen:current().id,output_contract:{units:'100x100 normalized',geometry:'filled black SVG paths, no strokes'},note:'Presets define varying inversion centers/radii per specimen. The source JSON geometry is not embedded in this recipe.'},null,2);}

ui.select.replaceChildren(...PRESETS.map((p,i)=>{const el=document.createElement('option');el.value=String(i);el.textContent=`${i+1} · ${p.label}`;return el}));
ui.select.addEventListener('change',()=>{selected=Number(ui.select.value);render()});
for(const key of ['seed','thickness','radius','centerX','centerY','invert'])ui[key==='thickness'?'size':key].addEventListener('input',render);
$('exportGlyph').addEventListener('click',()=>downloadText(label()+'.svg',renderGlyphSVG(current().paths,{size:1024,width:current().width,id:current().id})));
$('exportSheet').addEventListener('click',()=>downloadText(`circle-inversion-nineup-s${controls().seed}.svg`,sheet()));
$('exportPNG').addEventListener('click',async()=>{try{await svgToPng(sheet(),`circle-inversion-nineup-s${controls().seed}.png`,3)}catch(e){ui.status.textContent=e.message}});
$('exportJSON').addEventListener('click',()=>downloadText(`circle-inversion-recipe-s${controls().seed}.json`,exportRecipe(),'application/json'));
$('importFile').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{if(file.size>2000000)throw new Error('Import limited to 2 MB');const obj=JSON.parse(await file.text());imported={name:file.name,paths:validatePaths(obj)};render();ui.status.textContent=`Imported ${imported.paths.length} polyline(s), using nine inversion variations`}
 catch(error){ui.status.textContent=`Import rejected: ${error.message}`}finally{e.target.value='';}
});
$('clearImport').addEventListener('click',()=>{imported=null;render()});
$('randomSeed').addEventListener('click',()=>{ui.seed.value=String(Math.floor(Math.random()*100000)+1);render()});
render();
