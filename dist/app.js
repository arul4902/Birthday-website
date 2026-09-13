'use strict';
const $=id=>document.getElementById(id);
const config=window.BIRTHDAY_CONTENT;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const memories=[
['The Stranger','We met at Brown Tree. Of all the people I could have met in 2019, I met you. I never expected that stranger to become my brother.'],
['The First Text','I texted first. Yes, I’m taking credit for that! The first two months were quiet, but something lovely was waiting on the other side of those little conversations.'],
['The Random “Hi”','A friend sent a random “Hi” from my phone. Such a tiny message. Such a big beginning. Somehow, that was all our story needed.'],
['The First Outing','Our first movie with friends. Just a simple outing back then. Now, it’s a little piece of a story I wouldn’t trade for anything.'],
['The Late-Night Talks','Serious things. Silly things. Absolutely nothing. Those endless conversations and calls made even ordinary days feel a little more special.'],
['Your Scoldings','“Did you eat?” You made caring sound like scolding. But I knew what you really meant: I matter to you. And you matter to me, too.'],
['My Possessive Era','Okay, I admit it. I got possessive when you talked to others. Somewhere in all that nonsense, I realised just how much you meant to me.'],
['Always There','Through everything, you were there. Supporting me. Caring for me. No big speeches needed. Sometimes, simply showing up says everything.'],
['Tom & Jerry','No official day. No grand announcement. The name just fit us. A little fighting, a lot of teasing, and a bond that always stayed.'],
['Us','Strangers → colleagues → friends → best friends → brother. Different chapters. One bond. And a Jerry who’s very glad she found her Tom.']
];
config.photos.forEach((photo,i)=>{
 if(photo.optional&&!photo.src)return;
 const card=document.createElement('article');card.className='photo-card reveal';
 const slot=document.createElement('div');slot.className='photo-slot';
 const number=document.createElement('strong');number.textContent=String(i+1).padStart(2,'0');
 const label=document.createElement('span');label.textContent='A MEMORY BELONGS HERE';slot.append(number,label);
 if(photo.src){slot.classList.add('has-photo');number.hidden=true;label.hidden=true;const img=new Image();img.alt=photo.caption;img.loading='lazy';img.src=photo.src;img.onerror=()=>{img.remove();slot.classList.remove('has-photo');number.hidden=false;label.hidden=false;};slot.append(img);}
 const caption=document.createElement('p');caption.textContent=photo.caption;
 const index=document.createElement('span');index.className='photo-index';index.textContent='OUR STORY / '+String(i+1).padStart(2,'0');card.append(slot,caption,index);$('gallery').append(card);
});
if('IntersectionObserver' in window){
 document.documentElement.classList.add('js');
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08,rootMargin:'0px 0px -20px 0px'});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}
const stages=[...document.querySelectorAll('.stage-nav span')];
const stageMarkers=[...document.querySelectorAll('[data-stage]')];
let scrollPending=false,lastStage=-1;
function progress(){
 const height=document.documentElement.scrollHeight-innerHeight;
 $('progress').style.width=(height?scrollY/height*100:0)+'%';
 let current=0;stageMarkers.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.55)current=Number(el.dataset.stage);});
 if(current!==lastStage){stages.forEach((el,i)=>{el.classList.toggle('active',i===current);if(i===current)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});const nav=document.querySelector('.stage-nav');if(nav.scrollWidth>nav.clientWidth)nav.scrollTo({left:Math.max(0,stages[current].offsetLeft-nav.clientWidth/2+stages[current].clientWidth/2),behavior:reduced?'auto':'smooth'});lastStage=current;}
 scrollPending=false;
}
addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(progress);}},{passive:true});addEventListener('resize',progress);progress();
// Opening sequence animates once; the scroll journey then owns the active stage.
if(!reduced){stages.forEach((el,i)=>{el.animate([{opacity:.15,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,delay:250+i*180,fill:'backwards'});});}
const target=new Date(config.countdownTarget).getTime();
function tick(now=Date.now()){
 const remaining=Math.max(0,target-now);const seconds=Math.floor(remaining/1000);
 const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];
 ['days','hours','minutes','seconds'].forEach((id,i)=>$(id).textContent=String(values[i]).padStart(2,'0'));
 $('clock').hidden=remaining===0;$('birthdayMessage').hidden=remaining>0;
}
tick();setInterval(tick,1000);
let page=0;function renderPage(){const title=document.createElement('h3');title.textContent=memories[page][0];const eyebrow=document.createElement('span');eyebrow.className='eyebrow';eyebrow.textContent='A PAGE FROM OUR STORY / '+String(page+1).padStart(2,'0');const p=document.createElement('p');p.textContent=memories[page][1];$('bookPage').replaceChildren(eyebrow,title,p);if(!reduced)$('bookPage').animate([{opacity:0,transform:'translateX(8px)'},{opacity:1,transform:'translateX(0)'}],{duration:350});$('pageCounter').textContent=String(page+1).padStart(2,'0')+' / 10';$('prevPage').disabled=page===0;$('nextPage').disabled=page===9;}
$('prevPage').onclick=()=>{if(page>0){page--;renderPage();}};$('nextPage').onclick=()=>{if(page<9){page++;renderPage();}};renderPage();
const canvas=$('scratchCanvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});let scratched=false,drawing=false,lastPoint=null,segments=0;
function drawCover(){if(scratched)return;const bounds=canvas.getBoundingClientRect();canvas.width=Math.round(bounds.width);canvas.height=Math.round(bounds.height);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#b8a576';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#eee4c055';ctx.lineWidth=1;for(let x=-canvas.height;x<canvas.width;x+=16){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+canvas.height,canvas.height);ctx.stroke();}ctx.fillStyle='#f9f4e7';ctx.textAlign='center';ctx.font='36px Georgia';ctx.fillText('A little luck, just for you.',canvas.width/2,canvas.height/2-15,canvas.width-35);ctx.font='11px sans-serif';ctx.fillText('SCRATCH HERE  ✧',canvas.width/2,canvas.height/2+25);}
function revealPrize(){scratched=true;canvas.hidden=true;$('scratchPrize').setAttribute('aria-hidden','false');$('scratchPrize').setAttribute('role','status');$('revealScratch').textContent='A Jerry for life. Lucky you!';$('revealScratch').disabled=true;}
function erase(e){if(!drawing||scratched)return;const b=canvas.getBoundingClientRect();const p={x:e.clientX-b.left,y:e.clientY-b.top};ctx.globalCompositeOperation='destination-out';ctx.lineWidth=48;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(lastPoint?lastPoint.x:p.x,lastPoint?lastPoint.y:p.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y,24,0,Math.PI*2);ctx.fill();lastPoint=p;segments++;if(segments%10===0)checkScratch();}
function checkScratch(){const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0,total=0;for(let i=3;i<pixels.length;i+=64){total++;if(pixels[i]<60)clear++;}if(clear/total>.4)revealPrize();}
canvas.onpointerdown=e=>{drawing=true;lastPoint=null;canvas.setPointerCapture(e.pointerId);erase(e);};canvas.onpointermove=erase;canvas.onpointerup=()=>{drawing=false;lastPoint=null;if(!scratched)checkScratch();};canvas.onpointercancel=()=>{drawing=false;lastPoint=null;};$('revealScratch').onclick=revealPrize;drawCover();new ResizeObserver(drawCover).observe(canvas.parentElement);
$('giftButton').onclick=()=>{const opening=$('giftMessage').hidden;$('giftMessage').hidden=!opening;$('giftButton').setAttribute('aria-expanded',String(opening));$('giftButton').classList.toggle('opened',opening);$('giftButton').lastElementChild.textContent=opening?'OPENED WITH LOVE · TAP TO CLOSE':'FOR TOM · OPEN ME';};
$('secretButton').onclick=()=>{const opening=$('secretMessage').hidden;$('secretMessage').hidden=!opening;$('secretButton').setAttribute('aria-expanded',String(opening));if(opening)$('secretMessage').scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});};
