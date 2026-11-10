// Detail-Ausschnitte für den Flyer (z_*.png): node shots_zoom.js (im Ordner materialien)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const LIVE=fs.readFileSync('shots2.py','utf8').match(/LIVE="(.*?)"\n/)[1];
const d=JSON.parse(fs.readFileSync('demo.json','utf8'));d.teams[d.current].name='1. Herren';const demo=JSON.stringify(d);
const b=await chromium.launch();
// find: JS-Ausdruck für das Element; box: (r)=>{x,y,w,h} in CSS-Pixeln relativ zur Seite
async function shot(js,out,find,box){const pg=await b.newPage({viewport:{width:375,height:2400},deviceScaleFactor:4});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(d=>{localStorage.setItem('u10-leistungsprofil-v2',d);localStorage.setItem('u10-meta-v1',JSON.stringify({lastBackup:Date.now()+1e9,lastChange:0,seenVersion:999}));},demo);
 await pg.goto('file://'+process.cwd()+'/../index.html');await pg.waitForTimeout(500);await pg.evaluate(js);await pg.waitForTimeout(2700);
 await pg.addStyleTag({content:'#sheet,#toast{display:none!important}'});await pg.evaluate(()=>window.scrollTo(0,0));
 const r=await pg.evaluate(f=>{const e=eval(f);const q=e.getBoundingClientRect();return {x:q.left,y:q.top+scrollY,w:q.width,h:q.height};},find);
 const c=box(r);await pg.screenshot({path:out,clip:{x:c.x,y:c.y,width:c.w,height:c.h},fullPage:true});if(errs.length)console.log(out,errs);await pg.close();}
const L=LIVE+"render(true);";
await shot(L,'z_live.png',"document.querySelectorAll('.lslot')[1]",r=>({x:r.x-10,y:r.y-13,w:345,h:165}));
await shot(L,'z_sub.png',"document.querySelector('.subsug')",r=>({x:r.x-4,y:r.y-4,w:215,h:r.h+8}));
await shot(L,'z_clock.png',"document.querySelector('.lhead')",r=>({x:r.x-6,y:r.y-6,w:r.w+12,h:r.h+12}));
await shot("A.go('lineup');",'z_lineup.png',"document.querySelector('.pitch')",r=>({x:r.x+r.w/2-150,y:r.y+2,w:300,h:232}));
await shot("A.openPlayer('p1');",'z_radar.png',"document.querySelector('svg.radar')",r=>({x:r.x-2,y:r.y+2,w:r.w+4,h:r.h-4}));
await shot("A.openPlayer('p1');",'z_mess.png',"[...document.querySelectorAll('.card')].find(x=>x.textContent.startsWith('Entwicklung der Messwerte'))",r=>({x:r.x+6,y:r.y+52,w:r.w-12,h:Math.min(225,r.h-56)}));
await b.close();})();
