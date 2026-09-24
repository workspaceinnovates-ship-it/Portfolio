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

const inlineVideos = [...document.querySelectorAll('.inline-video')];
document.querySelectorAll('.video-shell').forEach(shell => {
  const video = shell.querySelector('video');
  const cover = shell.querySelector('.play-cover');
  cover.addEventListener('click', () => {
    inlineVideos.forEach(other => { if (other !== video) other.pause(); });
    if (!video.src) video.src = video.dataset.src;
    cover.hidden = true;
    video.play().catch(() => { cover.hidden = false; });
  });
  video.addEventListener('play', () => inlineVideos.forEach(other => { if (other !== video) other.pause(); }));
  video.addEventListener('ended', () => { cover.hidden = false; });
});

const grid = document.getElementById('archive-grid');
edits.forEach((edit, index) => {
  const card = document.createElement('button');
  card.type = 'button'; card.className = 'archive-card'; card.dataset.group = edit.group; card.dataset.index = String(index);
  card.setAttribute('aria-label', `Play ${edit.client} ${edit.reel}`);
  card.innerHTML = `<img src="${edit.poster}" alt="" loading="lazy"><div><span>${String(index + 1).padStart(2,'0')} / ${edit.duration}</span><strong>${edit.client} · ${edit.reel}</strong></div>`;
  grid.append(card);
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    document.querySelectorAll('.archive-card').forEach(card => { card.hidden = selected !== 'all' && card.dataset.group !== selected; });
  });
});

const dialog = document.getElementById('reel-dialog');
const dialogVideo = document.getElementById('dialog-video');
const dialogTitle = document.getElementById('dialog-title');
const dialogIndex = document.getElementById('dialog-index');
const closeDialog = () => {
  dialogVideo.pause(); dialogVideo.removeAttribute('src'); dialogVideo.removeAttribute('poster'); dialogVideo.load(); dialog.close();
};
grid.addEventListener('click', event => {
  const card = event.target.closest('.archive-card'); if (!card) return;
  inlineVideos.forEach(video => video.pause());
  const index = Number(card.dataset.index); const edit = edits[index];
  dialogTitle.textContent = `${edit.client} / ${edit.reel}`;
  dialogIndex.textContent = `${String(index + 1).padStart(2,'0')} / 15 · ${edit.duration}`;
  dialogVideo.poster = edit.poster; dialogVideo.src = edit.video; dialog.showModal(); dialogVideo.play().catch(() => {});
});
document.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });

const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
copyButton.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  try { await navigator.clipboard.writeText(email); copyStatus.textContent = `Copied ${email}`; }
  catch { copyStatus.textContent = email; }
});

const revealTargets = document.querySelectorAll('.section-label, .section-heading, .about-grid, .featured-card, .archive-card, .skill-card, .process-grid article, .contact-copy');
if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) revealTargets.forEach(element => element.classList.add('visible'));
else {
  revealTargets.forEach(element => element.classList.add('reveal'));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.08, rootMargin:'0px 0px -8% 0px'});
  revealTargets.forEach(element => observer.observe(element));
}
