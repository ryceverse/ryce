// PAGE CONTENT. Reorder/add/remove sections in SECTIONS without touching layout.js.
const list = getGames();
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const artOf = (g, i, key) => g[key]
  ? `url('${g[key]}') ${key === 'cover' ? 'center top' : 'center'}/cover`
  : `radial-gradient(circle at 70% 25%,hsl(${(i * 47 + 350) % 360} 40% 26%),transparent 60%),linear-gradient(145deg,hsl(${(i * 47 + 350) % 360} 22% 14%),#0b0b0f)`;

const sectionStage = () => `<section class="stage" id="games"><div class="bg" id="bg"></div><div class="shade"></div>
  <div class="stage-info" id="info" aria-live="polite"></div>
  <div class="shelf" id="shelf" role="group" aria-label="My games">
  ${list.map((g, i) => `<button class="tile" data-i="${i}" aria-pressed="false" style="--n:${i};background:${esc(artOf(g, i, 'cover'))}"><span>${esc(g.title)}</span></button>`).join('')}</div></section>`;

const sectionConnect = () => `<section id="connect" class="section"><h2>Find Me Online</h2><div class="rail" id="rail">
  ${getSocials().map((s, i) => `<a class="scard glass" style="--n:${i}" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" draggable="false">
  <div class="thumb" style="background:${s.thumb ? `url('${esc(s.thumb)}') center/cover` : `linear-gradient(135deg,hsl(${(i * 60 + 350) % 360} 30% 22%),#101014)`}">${s.thumb ? '' : socialIcon(s)}</div>
  <div class="meta"><span class="cat">${esc(s.category)}</span><strong>${esc(s.name)}</strong><small>${esc(s.username || 'Open profile')}</small></div></a>`).join('')}</div></section>`;

const SECTIONS = [sectionStage, sectionConnect];
document.getElementById('top').innerHTML = SECTIONS.map((fn) => fn()).join('');

// ---- Drag-to-slide with momentum (mouse). Touch uses native swipe. ----
function makeSlider(el) {
  let down = false, sx = 0, sl = 0, vx = 0, lx = 0, moved = 0, raf = 0;
  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button) return;
    cancelAnimationFrame(raf); down = true; moved = 0; sx = lx = e.clientX; sl = el.scrollLeft; vx = 0;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    moved = Math.max(moved, Math.abs(e.clientX - sx));
    if (moved > 5) el.classList.add('grab');
    el.scrollLeft = sl - (e.clientX - sx); vx = lx - e.clientX; lx = e.clientX;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return; down = false;
    const glide = () => { el.scrollLeft += vx; vx *= 0.93; if (Math.abs(vx) > 0.4) raf = requestAnimationFrame(glide); else el.classList.remove('grab'); };
    if (calm || moved <= 5) el.classList.remove('grab'); else glide();
  });
  el.addEventListener('click', (e) => { if (moved > 5) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
}
makeSlider(document.getElementById('shelf'));
makeSlider(document.getElementById('rail'));

// ---- Game selection ----
let current = -1;
function select(i, scroll = true) {
  if (!list.length) return;
  i = (i + list.length) % list.length; current = i;
  const g = list[i], bg = document.getElementById('bg'), layer = document.createElement('div');
  layer.className = 'layer'; layer.style.background = artOf(g, i, 'background'); bg.appendChild(layer);
  requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('in')));
  setTimeout(() => { while (bg.children.length > 1) bg.removeChild(bg.firstChild); }, 1000);
  document.getElementById('info').innerHTML = `<div class="eyebrow">${esc(profile.name)} · ${esc(profile.tagline)}</div>
    <h1>${esc(g.title)}</h1><span class="tag glass">${esc(g.genre)}</span>${g.description ? `<p>${esc(g.description)}</p>` : '<p></p>'}
    <button class="btn glass" id="more">View Details</button>`;
  document.getElementById('more').onclick = () => openDetails(g);
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach((t, n) => { t.classList.toggle('active', n === i); t.setAttribute('aria-pressed', n === i); });
  if (scroll) tiles[i].scrollIntoView({ inline: 'center', block: 'nearest', behavior: calm ? 'auto' : 'smooth' });
}

const shelf = document.getElementById('shelf');
shelf.addEventListener('click', (e) => { const t = e.target.closest('.tile'); if (t) select(+t.dataset.i); });
shelf.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  select(current + (e.key === 'ArrowRight' ? 1 : -1)); document.querySelectorAll('.tile')[current].focus();
});
if (list.length) select(0, false); else document.getElementById('info').innerHTML = '<h1>RYCE</h1><p>No games to show yet.</p>';

// ---- Reveal social cards when scrolled into view ----
const conn = document.getElementById('connect');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { conn.classList.add('in'); io.disconnect(); } }, { threshold: 0.2 });
  io.observe(conn);
} else conn.classList.add('in');
