import subprocess
from PIL import Image
h=open('../index.html').read()
demo=open('demo.json').read()
inject="<script>localStorage.setItem('u10-leistungsprofil-v2',JSON.stringify(%s));localStorage.setItem('u10-meta-v1',JSON.stringify({lastBackup:Date.now()+1e9,lastChange:0,seenVersion:999}));</script>"%demo
base=h.replace('<script>\n"use strict";',inject+'<script>\n"use strict";',1)
def shot(name,js,height):
    open(f'_{name}.html','w').write(base.replace("})();\n</script>","setTimeout(()=>{"+js+"},60);\n})();\n</script>",1))
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--window-size=375,{height}','--force-device-scale-factor=2','--virtual-time-budget=2500',f'--screenshot={name}.png',f'file://'+__import__('os').getcwd()+'/_{name}.html'],stderr=subprocess.DEVNULL,timeout=60)
LIVE="A.go('lineup');A.cfgFmt('parts',2);A.liveFromLineup(true);A.liveClock();const L=S.live;const f=Object.values(L.pos).filter(Boolean);const adv=s=>{L.clock.lastTick-=s*1000;};adv(240);A.goalAsk();A.goalScorer(L.goals.at(-1).id,f[5]);adv(400);A.concede();adv(200);A.liveTap('slot','M-L');A.liveTap('bench',L.bench[0]);adv(160);A.cardGive('y',f[0]);adv(300);A.goalAsk();A.goalScorer(L.goals.at(-1).id,f[4]);[[f[0],1],[f[0],1],[f[1],1],[f[2],-1],[f[3],1],[f[4],1],[f[4],-1],[f[5],1]].forEach(([p,d])=>{A.liveAct(p,d);A.sheetHide();});L.alerted={1:1};adv(110);L.mins[L.bench[1]]=0;A.sheetHide();"
shot('live',LIVE+"render(true);window.scrollTo(0,0);",1150)
shot('sheet',LIVE+"render(true);A.liveAct(f[2],1);",760)
shot('swap',LIVE+"A.liveTap('slot','A-L');",1150)
shot('tl',LIVE+"S.tlOpen=true;render(true);setTimeout(()=>{const c=[...document.querySelectorAll('details.card')].find(x=>x.textContent.includes('Spielverlauf'));document.querySelector('main').innerHTML='';document.querySelector('main').appendChild(c);},30);",520)
shot('lineup',"A.go('lineup');A.cfgFmt('parts',2);",1500)
shot('profil',"A.openPlayer('p1');setTimeout(()=>{const c=[...document.querySelectorAll('.card')].find(x=>x.textContent.includes('Trainer vs. App'));document.querySelector('main').innerHTML='';document.querySelector('main').appendChild(c);},30);",620)
shot('karte',"const p=S.players.p1;p.goals=[{id:'z1',text:'Linken Fuß einsetzen',status:'besser'},{id:'z2',text:'Laut den Ball fordern',status:'erreicht'}];S.playerId='p1';A.go('skarte');",1100)
shot('settings',"A.go('settings');A.pdfTog('p1');A.pdfTog('p3');",900)
def crop(src,dst,a,b):
    im=Image.open(src);w,hh=im.size;im.crop((0,a,w,min(hh,b))).save(dst)
crop('live.png','c_live.png',190,1640);crop('sheet.png','c_sheet.png',0,1520);crop('swap.png','c_swap.png',700,1880)
crop('profil.png','c_profil.png',230,1220);crop('karte.png','c_karte.png',330,2200);crop('settings.png','c_settings.png',190,1800);crop('tl.png','c_tl.png',190,1040)
