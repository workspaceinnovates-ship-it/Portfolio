document.getElementById('year').textContent = new Date().getFullYear();

const beats = [
  {title:'Win the first few seconds.', text:'Start with a compelling image, a question, or a moment of tension. The opening sets the promise for everything that follows.', tag:'SHOT SELECTION / STORY'},
  {title:'Let the story gather momentum.', text:'Build rhythm through shot length, movement, and contrast. Give key moments room to breathe, then move the viewer toward the payoff.', tag:'PACING / RHYTHM'},
  {title:'Leave something with the viewer.', text:'Resolve the tension with the right final image. Bring the sequence together so the ending feels earned and the message stays clear.', tag:'STRUCTURE / FINISH'}
];

const tabs = [...document.querySelectorAll('[data-beat]')];
function selectBeat(index) {
  tabs.forEach((tab, tabIndex) => {
    tab.setAttribute('aria-selected', String(tabIndex === index));
    tab.tabIndex = tabIndex === index ? 0 : -1;
  });
  const panel = document.getElementById('beat-panel');
  panel.setAttribute('aria-labelledby', tabs[index].id);
  panel.querySelector('.beat-number').textContent = String(index + 1).padStart(2, '0');
  panel.querySelector('h3').textContent = beats[index].title;
  panel.querySelector('p').textContent = beats[index].text;
  panel.querySelector('.beat-tag').textContent = beats[index].tag;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectBeat(index));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectBeat(next);
    tabs[next].focus();
  });
});

const edit = document.querySelector('.live-edit');
const playButton = document.getElementById('timeline-play');
const scrub = document.getElementById('timeline-scrub');
const output = document.getElementById('timeline-time');
const phase = document.getElementById('timeline-phase');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const revealGroups = [
  ['.section-head', '.section-intro', '.live-edit', '.beat-panel', '.note', '.client-line', '.toolkit-heading'],
  ['.featured-card'],
  ['.edit-timeline button'],
  ['.edit-bin-row'],
  ['.proof-grid > div'],
  ['.service'],
  ['.about > div', '.about-portrait'],
  ['.tool-card'],
  ['.process-grid > div'],
  ['.contact-grid > div']
];

const revealHeadings = document.querySelectorAll('.section-intro h2, .proof h2, .about h2, .toolkit-heading h3, .about-portrait figcaption strong, .contact h2');
const revealTargets = [];
revealGroups.forEach(selectors => {
  const elements = document.querySelectorAll(selectors.join(','));
  elements.forEach((element, index) => {
    element.classList.add('motion-reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index * 65, 260)}ms`);
    revealTargets.push(element);
  });
});
revealHeadings.forEach(heading => {
  heading.classList.add('motion-text');
  revealTargets.push(heading);
});

if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  revealTargets.forEach(element => element.classList.add('is-visible'));
} else {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, {rootMargin:'0px 0px -8% 0px', threshold:.08});
  revealTargets.forEach(element => revealObserver.observe(element));
}

let position = 0;
let playing = false;
let timelineVisible = false;
let animationFrame = 0;
let lastTime = 0;

for (let index = 0; index < 100; index += 1) {
  const bar = document.createElement('i');
  bar.style.height = `${15 + Math.abs(Math.sin(index * 1.73) * Math.cos(index * .31)) * 85}%`;
  document.querySelector('.waveform').append(bar);
}

function paintTimeline() {
  const normalized = position / 1200;
  edit.style.setProperty('--position', `${normalized * 100}%`);
  scrub.value = String(Math.round(position));
  const seconds = position / 100;
  output.textContent = `00:${String(Math.floor(seconds)).padStart(2, '0')}:${String(Math.floor((seconds % 1) * 24)).padStart(2, '0')}`;
  scrub.setAttribute('aria-valuetext', `${seconds.toFixed(1)} seconds of 12 seconds`);
  phase.textContent = normalized < .28 ? '01 / THE HOOK' : normalized < .7 ? '02 / THE BUILD' : '03 / THE PAYOFF';
  edit.querySelectorAll('.clip').forEach(clip => {
    const active = normalized >= Number(clip.dataset.start) && (normalized < Number(clip.dataset.end) || normalized === 1 && Number(clip.dataset.end) === 1);
    clip.classList.toggle('active', active);
  });
}

function animate(now) {
  animationFrame = 0;
  if (!playing || !timelineVisible || document.hidden) return;
  if (lastTime) position = (position + Math.min(now - lastTime, 100) / 10) % 1200;
  lastTime = now;
  paintTimeline();
  animationFrame = requestAnimationFrame(animate);
}

function scheduleTimeline() {
  cancelAnimationFrame(animationFrame);
  lastTime = 0;
  if (playing && timelineVisible && !document.hidden) animationFrame = requestAnimationFrame(animate);
}

function setPlaying(value) {
  playing = value;
  playButton.textContent = value ? 'Ⅱ PAUSE' : '▶ PLAY';
  playButton.setAttribute('aria-label', value ? 'Pause timeline animation' : 'Play timeline animation');
  playButton.setAttribute('aria-pressed', String(value));
  scheduleTimeline();
}

playButton.addEventListener('click', () => setPlaying(!playing));
scrub.addEventListener('input', () => {
  setPlaying(false);
  position = Number(scrub.value);
  paintTimeline();
});
new IntersectionObserver(entries => {
  timelineVisible = entries[0].isIntersecting;
  scheduleTimeline();
}, {threshold:.05}).observe(edit);
reducedMotion.addEventListener('change', event => {
  if (event.matches) setPlaying(false);
});
paintTimeline();
setPlaying(!reducedMotion.matches);

let scrollTicking = false;
function updateScroll() {
  const progress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
  const frame = Math.floor(progress * 60 * 24);
  document.querySelector('.metadata b').textContent = `00:${String(Math.floor(frame / 1440)).padStart(2, '0')}:${String(Math.floor(frame / 24) % 60).padStart(2, '0')}:${String(frame % 24).padStart(2, '0')}`;
  document.querySelector('.ruler').style.setProperty('--page-progress', `${progress * 100}%`);
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(updateScroll);
  }
}, {passive:true});
updateScroll();

const portfolioVideos = [...document.querySelectorAll('.portfolio-video')];
document.querySelectorAll('.media-frame').forEach(frame => {
  const video = frame.querySelector('video');
  const play = frame.querySelector('.media-play');
  const status = frame.closest('article').querySelector('.media-status');
  play.addEventListener('click', () => {
    status.textContent = '';
    portfolioVideos.forEach(other => { if (other !== video) other.pause(); });
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    play.hidden = true;
    video.focus();
    video.play().catch(() => {
      status.textContent = 'Press play in the video controls to watch this reel.';
    });
  });
  video.addEventListener('play', () => portfolioVideos.forEach(other => { if (other !== video) other.pause(); }));
  video.addEventListener('error', () => {
    status.textContent = 'This reel could not load. Please try again.';
    play.hidden = false;
    video.removeAttribute('src');
    video.load();
  });
});

const workStage = document.querySelector('.work-stage');
const workFrame = workStage?.querySelector('.work-screen');
const workVideo = workStage?.querySelector('video');
const workPlay = workStage?.querySelector('.media-play');
const workStatus = workStage?.querySelector('.media-status');
const workButtons = [...document.querySelectorAll('.work-reel-button')];
const workTitle = document.getElementById('work-title');
const workDuration = document.getElementById('work-duration');
const workCounter = document.getElementById('work-counter');

function activateWorkReel(button, autoplay = true) {
  if (!workVideo || !workFrame) return;
  const isCurrent = button.getAttribute('aria-pressed') === 'true';
  workVideo.pause();
  workButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('.edit-bin-row').forEach(row => row.classList.toggle('active', row.contains(button)));

  if (!isCurrent) {
    workVideo.removeAttribute('src');
    workVideo.dataset.src = button.dataset.src;
    workVideo.poster = button.dataset.poster;
    workVideo.setAttribute('aria-label', `${button.dataset.client} ${button.dataset.reel} edited by RAIKO`);
    workPlay.setAttribute('aria-label', `Play ${button.dataset.client} ${button.dataset.reel}`);
    workTitle.textContent = `${button.dataset.client} / ${button.dataset.reel}`;
    workDuration.textContent = button.dataset.duration;
    workCounter.textContent = `${button.dataset.index} / 15`;
    workPlay.hidden = false;
    workStatus.textContent = '';
    workVideo.load();
    workFrame.classList.remove('reel-changing');
    void workFrame.offsetWidth;
    workFrame.classList.add('reel-changing');
  }

  if (!autoplay) return;
  portfolioVideos.forEach(other => { if (other !== workVideo) other.pause(); });
  if (!workVideo.getAttribute('src')) workVideo.src = workVideo.dataset.src;
  workPlay.hidden = true;
  workVideo.play().catch(() => {
    workPlay.hidden = false;
    workStatus.textContent = 'Press play in the video controls to watch this reel.';
  });
  if (matchMedia('(max-width: 760px)').matches) {
    workStage.scrollIntoView({behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start'});
  }
}

workButtons.forEach(button => button.addEventListener('click', () => activateWorkReel(button, true)));

const heroShowreel = document.getElementById('hero-showreel');
const heroReelToggle = document.getElementById('hero-reel-toggle');
let heroReelPaused = reducedMotion.matches;
function setHeroReelPlaying(playing) {
  if (!heroShowreel || !heroReelToggle) return;
  heroReelPaused = !playing;
  heroReelToggle.setAttribute('aria-pressed', String(playing));
  heroReelToggle.textContent = playing ? 'Ⅱ PAUSE REEL' : '▶ PLAY REEL';
  if (playing) heroShowreel.play().catch(() => setHeroReelPlaying(false));
  else heroShowreel.pause();
}
if (heroShowreel && heroReelToggle) {
  if (reducedMotion.matches) setHeroReelPlaying(false);
  heroReelToggle.addEventListener('click', () => setHeroReelPlaying(heroReelPaused));
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) heroShowreel.pause();
    else if (!heroReelPaused) heroShowreel.play().catch(() => setHeroReelPlaying(false));
  }, {threshold:.15}).observe(heroShowreel);
}

document.addEventListener('visibilitychange', () => {
  scheduleTimeline();
  if (document.hidden) {
    portfolioVideos.forEach(video => video.pause());
    heroShowreel?.pause();
  }
});

const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.email);
    copyStatus.textContent = 'Email address copied.';
  } catch {
    copyStatus.textContent = 'Copy unavailable. Select the email address below.';
  }
});
