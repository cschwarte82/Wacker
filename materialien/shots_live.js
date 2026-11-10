// Screenshots der Live-Seite (c_live.png, c_sheet.png) mit Playwright: node shots_live.js (im Ordner materialien)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const LIVE=fs.readFileSync('shots2.py','utf8').match(/LIVE="(.*?)"\n/)[1];const demo=fs.readFileSync('demo.json','utf8');
const b=await chromium.launch();
(LIVE+"S.live.opp='SV Blau-Weiß';render(true);window.scrollTo(0,0);",1150,'c_live.png',95,725);
async function shot(js,h,out,clipTop,clipH,js2){const pg=await b.newPage({viewport:{width:375,height:h},deviceScaleFactor:2});
 await pg.addInitScript(d=>{localStorage.setItem('u10-leistungsprofil-v2',d);localStorage.setItem('u10-meta-v1',JSON.stringify({lastBackup:Date.now()+1e9,lastChange:0,seenVersion:999}));},demo);
 await pg.goto('file://'+process.cwd()+'/../index.html');await pg.waitForTimeout(500);await pg.evaluate(js);await pg.waitForTimeout(2700);if(js2){await pg.evaluate(js2);await pg.waitForTimeout(600);}
 await pg.screenshot({path:out,clip:{x:0,y:clipTop,width:375,height:clipH}});await pg.close();}

await shot(LIVE+"S.live.opp='SV Blau-Weiß';render(true);window.scrollTo(0,0);",1150,'c_live.png',95,725);
await shot(LIVE+"S.live.opp='SV Blau-Weiß';render(true);",760,'c_sheet.png',0,760,"A.liveAct(Object.values(S.live.pos).filter(Boolean)[2],1)");
await b.close();})();
