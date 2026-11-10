// Screenshots für den Flyer (f_live.png, f_lineup.png, f_profil.png): node shots_flyer.js (im Ordner materialien)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const LIVE=fs.readFileSync('shots2.py','utf8').match(/LIVE="(.*?)"\n/)[1];
const d=JSON.parse(fs.readFileSync('demo.json','utf8'));d.teams[d.current].name='1. Herren';const demo=JSON.stringify(d);
const b=await chromium.launch();
async function shot(js,out,find,off){const pg=await b.newPage({viewport:{width:375,height:740},deviceScaleFactor:2});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(d=>{localStorage.setItem('u10-leistungsprofil-v2',d);localStorage.setItem('u10-meta-v1',JSON.stringify({lastBackup:Date.now()+1e9,lastChange:0,seenVersion:999}));},demo);
 await pg.goto('file://'+process.cwd()+'/../index.html');await pg.waitForTimeout(500);await pg.evaluate(js);await pg.waitForTimeout(2700);
 if(!find){await pg.screenshot({path:out});}else{
  const r=await pg.evaluate(f=>{const e=eval(f);return {h:document.querySelector('header').offsetHeight,y:e.getBoundingClientRect().top+scrollY};},find);
  await pg.addStyleTag({content:'#sheet,#toast{display:none!important}'});const full=await pg.screenshot({fullPage:true});const top=Math.round(r.y-off);
  // Kopfzeile + Ausschnitt ab dem Ziel zu einem Handybild zusammensetzen
  const p2=await b.newPage({viewport:{width:375,height:740},deviceScaleFactor:2});
  await p2.setContent(`<body style="margin:0;overflow:hidden"><div style="height:${r.h}px;background:url(data:image/png;base64,${full.toString('base64')}) 0 0/375px auto no-repeat"></div><div style="height:${740-r.h}px;background:url(data:image/png;base64,${full.toString('base64')}) 0 -${top}px/375px auto no-repeat"></div></body>`);
  await p2.waitForTimeout(300);await p2.screenshot({path:out});await p2.close();}if(errs.length)console.log(out,errs);await pg.close();}
await shot(LIVE+"render(true);window.scrollTo(0,0);",'f_live.png');
await shot("A.go('lineup');A.cfgFmt('parts',2);",'f_lineup.png',"document.querySelector('.pitch')",48);
await shot("A.openPlayer('p1');",'f_profil.png',"[...document.querySelectorAll('.card')].find(x=>x.textContent.startsWith('Stärkenprofil'))",10);
await b.close();})();
