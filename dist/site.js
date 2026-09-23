document.getElementById('year').textContent=new Date().getFullYear();
const beats=[{title:'Win the first few seconds.',text:'Start with a compelling image, a question, or a moment of tension. The opening sets the promise for everything that follows.',tag:'SHOT SELECTION / STORY'},{title:'Let the story gather momentum.',text:'Build a rhythm through shot length, movement, and contrast. Give important moments room to breathe, then bring the viewer closer to the reveal.',tag:'PACING / RHYTHM'},{title:'Leave something with the viewer.',text:'Resolve the tension with the right final image. Bring motion, color, and sound together so the ending feels earned and the message stays clear.',tag:'COLOR / MOTION / SOUND'}];
const tabs=[...document.querySelectorAll('[data-beat]')];
function selectBeat(i){tabs.forEach((tab,n)=>{tab.setAttribute('aria-selected',String(n===i));tab.tabIndex=n===i?0:-1});const panel=document.getElementById('beat-panel');panel.setAttribute('aria-labelledby',tabs[i].id);panel.querySelector('.beat-number').textContent=String(i+1).padStart(2,'0');panel.querySelector('h3').textContent=beats[i].title;panel.querySelector('p').textContent=beats[i].text;panel.querySelector('.beat-tag').textContent=beats[i].tag}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectBeat(i));tab.addEventListener('keydown',event=>{let next=i;if(event.key==='ArrowRight')next=(i+1)%tabs.length;else if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();selectBeat(next);tabs[next].focus()})});
document.getElementById('inquiry').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const subject='Project inquiry: '+data.get('type');const body=`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject: ${data.get('type')}\n\n${data.get('brief')}`;window.location.href='mailto:satyateja4653@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);document.getElementById('form-status').textContent='Your email draft is ready to open. Send it from your email app, or contact satyateja4653@gmail.com directly.'});
const edit=document.querySelector('.live-edit');
const playButton=document.getElementById('timeline-play');
const scrub=document.getElementById('timeline-scrub');
const output=document.getElementById('timeline-time');
const phase=document.getElementById('timeline-phase');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let position=0,playing=false,visible=false,raf=0,lastTime=0;
for(let i=0;i<100;i++){const bar=document.createElement('i');bar.style.height=(15+Math.abs(Math.sin(i*1.73)*Math.cos(i*.31))*85)+'%';document.querySelector('.waveform').append(bar)}
function paintTimeline(){const normalized=position/1200;edit.style.setProperty('--position',(normalized*100)+'%');scrub.value=String(Math.round(position));const seconds=position/100;output.textContent='00:'+String(Math.floor(seconds)).padStart(2,'0')+':'+String(Math.floor((seconds%1)*24)).padStart(2,'0');scrub.setAttribute('aria-valuetext',seconds.toFixed(1)+' seconds of 12 seconds');phase.textContent=normalized<.28?'01 / THE HOOK':normalized<.7?'02 / THE BUILD':'03 / THE FEELING';edit.querySelectorAll('.clip').forEach(clip=>clip.classList.toggle('active',normalized>=Number(clip.dataset.start)&&(normalized<Number(clip.dataset.end)||normalized===1&&Number(clip.dataset.end)===1)))}
function animate(now){raf=0;if(!playing||!visible||document.hidden)return;if(lastTime)position=(position+Math.min(now-lastTime,100)/10)%1200;lastTime=now;paintTimeline();raf=requestAnimationFrame(animate)}
function schedule(){cancelAnimationFrame(raf);lastTime=0;if(playing&&visible&&!document.hidden)raf=requestAnimationFrame(animate)}
function setPlaying(value){playing=value;playButton.textContent=value?'Ⅱ PAUSE':'▶ PLAY';playButton.setAttribute('aria-label',value?'Pause timeline animation':'Play timeline animation');playButton.setAttribute('aria-pressed',String(value));schedule()}
playButton.addEventListener('click',()=>setPlaying(!playing));
scrub.addEventListener('input',()=>{setPlaying(false);position=Number(scrub.value);paintTimeline()});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.05}).observe(edit);
document.addEventListener('visibilitychange',schedule);
reducedMotion.addEventListener('change',event=>{if(event.matches)setPlaying(false)});
paintTimeline();setPlaying(!reducedMotion.matches);
let ticking=false;
function updateScroll(){const progress=Math.max(0,Math.min(1,window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));const frame=Math.floor(progress*60*24);document.querySelector('.metadata b').textContent='00:'+String(Math.floor(frame/1440)).padStart(2,'0')+':'+String(Math.floor(frame/24)%60).padStart(2,'0')+':'+String(frame%24).padStart(2,'0');document.querySelector('.ruler').style.setProperty('--page-progress',(progress*100)+'%');ticking=false}
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll)}},{passive:true});updateScroll();
// Attach media only on demand, preserving bandwidth for the rest of the page.
const clientVideos=[...document.querySelectorAll('.reel-card video')];
document.querySelectorAll('.reel-card').forEach(card=>{
 const video=card.querySelector('video'),play=card.querySelector('.reel-play'),status=card.querySelector('.reel-status');
 play.addEventListener('click',()=>{
  status.textContent='';clientVideos.forEach(other=>{if(other!==video)other.pause()});
  if(!video.getAttribute('src'))video.src=video.dataset.src;
  play.hidden=true;video.focus();
  video.play().catch(()=>{status.textContent='Press play in the video controls to watch this reel.'});
 });
 video.addEventListener('play',()=>clientVideos.forEach(other=>{if(other!==video)other.pause()}));
 video.addEventListener('error',()=>{status.textContent='This reel could not load. Please try again.';play.hidden=false;video.removeAttribute('src');video.load()});
 card.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{
  if(button.getAttribute('aria-pressed')==='true')return;
  video.pause();video.removeAttribute('src');video.load();video.dataset.src=button.dataset.video;video.poster=button.dataset.poster;
  video.setAttribute('aria-label',button.dataset.title+' edited by Satya Teja');play.setAttribute('aria-label','Play '+button.dataset.title);play.hidden=false;status.textContent='';
  card.querySelector('.reel-duration').textContent=button.dataset.duration;
  card.querySelectorAll('[data-video]').forEach(choice=>choice.setAttribute('aria-pressed',String(choice===button)));
 }));
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)clientVideos.forEach(video=>video.pause())});
