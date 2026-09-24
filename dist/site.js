const edits = [
  {client:'Scalebucks', reel:'Reel 1', duration:'00:25', group:'scalebucks', video:'assets/work/scalebucks-reel-1.mp4', poster:'assets/work/scalebucks-reel-1.webp'},
  {client:'Scalebucks', reel:'Reel 2', duration:'00:31', group:'scalebucks', video:'assets/work/scalebucks-reel-2.mp4', poster:'assets/work/scalebucks-reel-2.webp'},
  {client:'AMR', reel:'Reel 1', duration:'00:31', group:'more', video:'assets/work/amr-reel-1.mp4', poster:'assets/work/amr-reel-1.webp'},
  {client:'AMR', reel:'Reel 5', duration:'00:46', group:'more', video:'assets/work/amr-reel-5.mp4', poster:'assets/work/amr-reel-5.webp'},
  {client:'Sikara', reel:'Reel 7', duration:'00:43', group:'sikara', video:'assets/work/sikara-reel-7.mp4', poster:'assets/work/sikara-reel-7.webp'},
  {client:'Sikara', reel:'Reel 1', duration:'00:40', group:'sikara', video:'assets/work/sikara-sureka-1.mp4', poster:'assets/work/sikara-sureka-1.webp'},
  {client:'Asian Poultry', reel:'Reel 1', duration:'00:45', group:'more', video:'assets/work/asian-reel-1.mp4', poster:'assets/work/asian-reel-1.webp'},
  {client:'Asian Poultry', reel:'Reel 2', duration:'00:51', group:'more', video:'assets/work/asian-reel-2.mp4', poster:'assets/work/asian-reel-2.webp'},
  {client:'Nooni', reel:'Reel 1', duration:'00:53', group:'more', video:'assets/work/nooni-reel-1.mp4', poster:'assets/work/nooni-reel-1.webp'},
  {client:'Nooni', reel:'Reel 2', duration:'00:33', group:'more', video:'assets/work/nooni-reel-2.mp4', poster:'assets/work/nooni-reel-2.webp'},
  {client:'Sri Dharani', reel:'Reel 2', duration:'00:24', group:'more', video:'assets/work/dharani-reel-2.mp4', poster:'assets/work/dharani-reel-2.webp'},
  {client:'Sri Dharani', reel:'Reel 4', duration:'00:22', group:'more', video:'assets/work/dharani-reel-4.mp4', poster:'assets/work/dharani-reel-4.webp'},
  {client:'Dentix', reel:'Reel 1', duration:'00:38', group:'more', video:'assets/work/dentix-reel-1.mp4', poster:'assets/work/dentix-reel-1.webp'},
  {client:'Dentix', reel:'Reel 2', duration:'00:46', group:'more', video:'assets/work/dentix-reel-2.mp4', poster:'assets/work/dentix-reel-2.webp'},
  {client:'Studio', reel:'Reel 1', duration:'00:21', group:'more', video:'assets/work/studio-reel-1.mp4', poster:'assets/work/studio-reel-1.webp'}
];

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));

const heroShowreel = document.getElementById('hero-showreel');
const showreelToggle = document.getElementById('showreel-toggle');
let heroPausedByUser = reducedMotion.matches;
function setShowreelPlaying(playing, byUser = false) {
  if (byUser) heroPausedByUser = !playing;
  showreelToggle.setAttribute('aria-pressed', String(playing));
  showreelToggle.textContent = playing ? 'Ⅱ Pause reel' : '▶ Play reel';
  if (playing) heroShowreel.play().catch(() => setShowreelPlaying(false));
  else heroShowreel.pause();
}
showreelToggle.addEventListener('click', () => setShowreelPlaying(showreelToggle.getAttribute('aria-pressed') !== 'true', true));
if (!reducedMotion.matches) setShowreelPlaying(true);
new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) heroShowreel.pause();
  else if (!heroPausedByUser && !reducedMotion.matches) heroShowreel.play().catch(() => setShowreelPlaying(false));
}, {threshold:.12}).observe(heroShowreel);

const revealTargets = [...document.querySelectorAll('.reveal')];
if (reducedMotion.matches || !('IntersectionObserver' in window)) revealTargets.forEach(element => element.classList.add('visible'));
else {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }), {threshold:.09, rootMargin:'0px 0px -7% 0px'});
  revealTargets.forEach(element => revealObserver.observe(element));
}

let scrollTicking = false;
function updatePageProgress() {
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const progress = Math.max(0, Math.min(1, scrollY / max));
  document.documentElement.style.setProperty('--scroll-progress', `${progress * 100}%`);
  const totalFrames = Math.floor(progress * 12 * 24);
  const seconds = Math.floor(totalFrames / 24);
  document.getElementById('hero-timecode').textContent = `00:00:${String(seconds).padStart(2,'0')}:${String(totalFrames % 24).padStart(2,'0')}`;
  scrollTicking = false;
}
addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(updatePageProgress);
}, {passive:true});
updatePageProgress();

const railLinks = [...document.querySelectorAll('.chapter-rail a')];
const chapterSections = [...document.querySelectorAll('[data-chapter-section]')];
const chapterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    railLinks.forEach(link => link.classList.toggle('active', link.dataset.chapter === entry.target.id));
  });
}, {rootMargin:'-32% 0px -58% 0px', threshold:0});
chapterSections.forEach(section => chapterObserver.observe(section));

const projectVideos = [...document.querySelectorAll('.project-video')];
function loadProjectVideo(video) { if (!video.getAttribute('src')) video.src = video.dataset.src; }
function startPreview(media) {
  if (!finePointer.matches || reducedMotion.matches) return;
  const video = media.querySelector('video');
  loadProjectVideo(video); video.muted = true; video.loop = true; media.classList.add('previewing');
  video.play().catch(() => media.classList.remove('previewing'));
}
function stopPreview(media) {
  const video = media.querySelector('video');
  video.pause(); video.currentTime = 0; media.classList.remove('previewing');
}
document.querySelectorAll('.project-media').forEach(media => {
  const button = media.querySelector('.project-open');
  media.addEventListener('mouseenter', () => startPreview(media));
  media.addEventListener('mouseleave', () => stopPreview(media));
  button.addEventListener('focus', () => startPreview(media));
  button.addEventListener('blur', () => stopPreview(media));
  button.addEventListener('click', () => {
    stopPreview(media);
    const video = media.querySelector('video');
    const featuredIndex = projectVideos.indexOf(video);
    const editIndex = featuredIndex === 0 ? 1 : featuredIndex === 1 ? 4 : 13;
    openReel(editIndex);
  });
});

const grid = document.getElementById('archive-grid');
edits.forEach((edit, index) => {
  const card = document.createElement('button');
  card.type = 'button'; card.className = 'archive-card reveal'; card.dataset.group = edit.group; card.dataset.index = String(index);
  card.setAttribute('aria-label', `Play ${edit.client} ${edit.reel}`);
  card.innerHTML = `<img src="${edit.poster}" alt="" loading="lazy"><div><span>${String(index + 1).padStart(2,'0')} / ${edit.duration}</span><strong>${edit.client} · ${edit.reel}</strong></div>`;
  grid.append(card);
});
const archiveRevealTargets = [...grid.querySelectorAll('.reveal')];
if (reducedMotion.matches || !('IntersectionObserver' in window)) archiveRevealTargets.forEach(element => element.classList.add('visible'));
else {
  const archiveObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return; entry.target.classList.add('visible'); archiveObserver.unobserve(entry.target);
  }), {threshold:.06, rootMargin:'0px 0px -5% 0px'});
  archiveRevealTargets.forEach(element => archiveObserver.observe(element));
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  document.querySelectorAll('.archive-card').forEach(card => { card.hidden = selected !== 'all' && card.dataset.group !== selected; });
}));

const dialog = document.getElementById('reel-dialog');
const dialogVideo = document.getElementById('dialog-video');
const dialogTitle = document.getElementById('dialog-title');
const dialogIndex = document.getElementById('dialog-index');
function openReel(index) {
  projectVideos.forEach(video => video.pause()); heroShowreel.pause();
  const edit = edits[index];
  dialogTitle.textContent = `${edit.client} / ${edit.reel}`;
  dialogIndex.textContent = `${String(index + 1).padStart(2,'0')} / 15 · ${edit.duration}`;
  dialogVideo.poster = edit.poster; dialogVideo.src = edit.video; dialog.showModal();
  dialogVideo.play().catch(() => {});
}
function closeReel() {
  dialogVideo.pause(); dialogVideo.removeAttribute('src'); dialogVideo.removeAttribute('poster'); dialogVideo.load(); dialog.close();
  if (!heroPausedByUser && !reducedMotion.matches && heroShowreel.getBoundingClientRect().bottom > 0) heroShowreel.play().catch(() => {});
}
grid.addEventListener('click', event => { const card = event.target.closest('.archive-card'); if (card) openReel(Number(card.dataset.index)); });
document.querySelector('.dialog-close').addEventListener('click', closeReel);
dialog.addEventListener('click', event => { if (event.target === dialog) closeReel(); });
dialog.addEventListener('cancel', event => { event.preventDefault(); closeReel(); });

const beats = [
  {title:'Win the first few seconds.', text:'Open with the image, question, or tension that earns the next moment.', tag:'SHOT SELECTION / STORY'},
  {title:'Let the story gather momentum.', text:'Shape rhythm through shot length, movement, contrast, and room to breathe.', tag:'PACING / MOTION'},
  {title:'Leave something with the viewer.', text:'Resolve the sequence with a final image and feeling that holds after the cut.', tag:'STRUCTURE / FINISH'}
];
const beatTabs = [...document.querySelectorAll('[data-beat]')];
function selectBeat(index) {
  beatTabs.forEach((tab, tabIndex) => { const active = tabIndex === index; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  const panel = document.getElementById('beat-panel');
  panel.setAttribute('aria-labelledby', beatTabs[index].id); panel.querySelector('.beat-number').textContent = String(index + 1).padStart(2,'0'); panel.querySelector('h3').textContent = beats[index].title; panel.querySelector('p').textContent = beats[index].text; panel.querySelector('.beat-tag').textContent = beats[index].tag;
}
beatTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectBeat(index));
  tab.addEventListener('keydown', event => {
    let next = index; if (event.key === 'ArrowRight') next = (index + 1) % beatTabs.length; else if (event.key === 'ArrowLeft') next = (index + beatTabs.length - 1) % beatTabs.length; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = beatTabs.length - 1; else return;
    event.preventDefault(); selectBeat(next); beatTabs[next].focus();
  });
});

const editConsole = document.getElementById('edit-console');
const timelinePlay = document.getElementById('timeline-play');
const timelineScrub = document.getElementById('timeline-scrub');
const timelineTime = document.getElementById('timeline-time');
const timelinePhase = document.getElementById('timeline-phase');
for (let index = 0; index < 92; index += 1) { const bar = document.createElement('i'); bar.style.height = `${14 + Math.abs(Math.sin(index * 1.7) * Math.cos(index * .29)) * 82}%`; document.getElementById('waveform').append(bar); }
let timelinePosition = 0, timelinePlaying = false, timelineVisible = false, timelineFrame = 0, timelineLast = 0;
function paintTimeline() {
  const normalized = timelinePosition / 1200; editConsole.style.setProperty('--position', `${normalized * 100}%`); timelineScrub.value = String(Math.round(timelinePosition));
  const seconds = timelinePosition / 100; timelineTime.textContent = `00:${String(Math.floor(seconds)).padStart(2,'0')}:${String(Math.floor((seconds % 1) * 24)).padStart(2,'0')}`; timelineScrub.setAttribute('aria-valuetext', `${seconds.toFixed(1)} seconds of 12 seconds`);
  timelinePhase.textContent = normalized < .3 ? '01 / HOOK' : normalized < .7 ? '02 / BUILD' : '03 / FEELING';
  editConsole.querySelectorAll('.clip').forEach(clip => clip.classList.toggle('active', normalized >= Number(clip.dataset.start) && (normalized < Number(clip.dataset.end) || normalized === 1 && Number(clip.dataset.end) === 1)));
}
function animateTimeline(now) {
  timelineFrame = 0; if (!timelinePlaying || !timelineVisible || document.hidden) return;
  if (timelineLast) timelinePosition = (timelinePosition + Math.min(now - timelineLast,100) / 10) % 1200; timelineLast = now; paintTimeline(); timelineFrame = requestAnimationFrame(animateTimeline);
}
function scheduleTimeline() { cancelAnimationFrame(timelineFrame); timelineLast = 0; if (timelinePlaying && timelineVisible && !document.hidden) timelineFrame = requestAnimationFrame(animateTimeline); }
function setTimelinePlaying(value) { timelinePlaying = value; timelinePlay.textContent = value ? 'Ⅱ Pause' : '▶ Play'; timelinePlay.setAttribute('aria-pressed', String(value)); scheduleTimeline(); }
timelinePlay.addEventListener('click', () => setTimelinePlaying(!timelinePlaying));
timelineScrub.addEventListener('input', () => { setTimelinePlaying(false); timelinePosition = Number(timelineScrub.value); paintTimeline(); });
new IntersectionObserver(entries => { timelineVisible = entries[0].isIntersecting; scheduleTimeline(); }, {threshold:.05}).observe(editConsole);
document.addEventListener('visibilitychange', scheduleTimeline); paintTimeline();

const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
copyButton.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  try { await navigator.clipboard.writeText(email); copyStatus.textContent = `Copied ${email}`; }
  catch { copyStatus.textContent = email; }
});

reducedMotion.addEventListener('change', event => {
  if (event.matches) { setShowreelPlaying(false); setTimelinePlaying(false); document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible')); }
});
