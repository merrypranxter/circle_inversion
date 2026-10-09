import {finitePoint} from '../math/inversion.js';
const fmt=n=>Number(n.toFixed(3)).toString();
const coord=p=>`${fmt(p.x)} ${fmt(p.y)}`;

/** Construct *real filled vector shapes*, not SVG strokes, by uniting path-segment
 * quads and round vertex disks. Subpaths are intentionally black-filled.
 */
export function polylineFillPath(points,width=2.4){
  if(!Array.isArray(points)||points.length<2||!Number.isFinite(width)||width<=0)return '';
  const h=width/2,parts=[];
  for(let i=0;i<points.length-1;i++){
    const a=points[i],b=points[i+1];if(!finitePoint(a)||!finitePoint(b))continue;
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);if(len<1e-8)continue;
    const ox=-dy/len*h,oy=dx/len*h;
    parts.push(`M ${coord({x:a.x+ox,y:a.y+oy})} L ${coord({x:b.x+ox,y:b.y+oy})} L ${coord({x:b.x-ox,y:b.y-oy})} L ${coord({x:a.x-ox,y:a.y-oy})} Z`);
  }
  // Circle subpaths are filled (they are NOT SVG stroke elements).
  for(let i=0;i<points.length;i++){
    const p=points[i];if(!finitePoint(p))continue;
    const right={x:p.x+h,y:p.y},left={x:p.x-h,y:p.y};
    parts.push(`M ${coord(right)} A ${fmt(h)} ${fmt(h)} 0 1 0 ${coord(left)} A ${fmt(h)} ${fmt(h)} 0 1 0 ${coord(right)} Z`);
  }
  return parts.join(' ');
}
export function makeGlyphPath(paths,width=2.4){return paths.map(path=>polylineFillPath(path,width)).filter(Boolean).join(' ');}
export function renderGlyphSVG(paths,{size=256,width=2.4,background='white',id='circle-inversion-glyph'}={}){
  const d=makeGlyphPath(paths,width);
  const bg=background==='transparent'?'':`<rect width="100" height="100" fill="white"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${id}">${bg}<path d="${d}" fill="#000000"/></svg>`;
}
export function renderSheetSVG(glyphs,{cell=160,gap=16,margin=16,background='white'}={}){
  if(!Array.isArray(glyphs)||glyphs.length!==9)throw new RangeError('A sheet needs exactly nine glyphs');
  const unit=cell+gap,total=margin*2+cell*3+gap*2;
  const bg=background==='transparent'?'':`<rect width="${total}" height="${total}" fill="white"/>`;
  let body='';
  for(let i=0;i<9;i++){
    const x=margin+(i%3)*unit,y=margin+Math.floor(i/3)*unit,scale=cell/100;
    const d=makeGlyphPath(glyphs[i].paths,glyphs[i].width??2.4);
    // groups are independently selectable in Illustrator; path geometry is filled black, not SVG strokes.
    body+=`<g id="glyph-${i+1}" data-preset="${glyphs[i].id}" transform="translate(${x} ${y}) scale(${fmt(scale)})"><path d="${d}" fill="#000000"/></g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}">${bg}${body}</svg>`;
}
export function downloadText(filename,text,mime='image/svg+xml'){
  const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),5000);
}
export async function svgToPng(svg,filename,scale=2){
  const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob);
  try{
    const img=new Image();img.src=url;await img.decode();
    const canvas=document.createElement('canvas');canvas.width=img.naturalWidth*scale;canvas.height=img.naturalHeight*scale;
    canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
    const png=await new Promise((resolve,reject)=>canvas.toBlob(v=>v?resolve(v):reject(new Error('PNG conversion failed')),'image/png'));
    const pngUrl=URL.createObjectURL(png),a=document.createElement('a');a.href=pngUrl;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(pngUrl),5000);
  }finally{URL.revokeObjectURL(url);}
}
