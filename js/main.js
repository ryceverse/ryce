// =====================================================
// PAGE CONTENT (everything between header and footer)
// Reorder / add / remove sections in SECTIONS below.
// =====================================================

const visibleGames = getGames();
const visibleSocials = getSocials();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Soft colour shown while a picture loads (or when there is no picture)
function gradientFor(index) {
  const hue = (index * 47 + 350) % 360;
  return `radial-gradient(circle at 70% 25%, hsl(${hue} 40% 26%), transparent 60%),
          linear-gradient(145deg, hsl(${hue} 22% 14%), #0b0b0f)`;
}

// ---------- Section 1: wallpaper + game tiles ----------
function buildStage() {
  const tiles = visibleGames.map((game, index) => `
    <button class="tile" data-index="${index}" aria-pressed="false"
            style="--n:${index}; background:${gradientFor(index)}">
      <span>${esc(game.title)}</span>
    </button>`).join('');

  return `
    <section class="stage" id="games">
      <div class="bg" id="bg"></div>
      <div class="shade"></div>
      <div class="stage-info" id="info" aria-live="polite"></div>
      <div class="shelf" id="shelf" role="group" aria-label="My games">${tiles}</div>
    </section>`;
}

// ---------- Section 2: social media cards ----------
function buildSocialCard(social, index) {
  const hue = (index * 60 + 350) % 360;
  const fallback = `linear-gradient(135deg, hsl(${hue} 30% 22%), #101014)`;

  return `
    <a class="scard glass" style="--n:${index}" href="${esc(social.url)}"
       target="_blank" rel="noopener noreferrer" draggable="false">
      <div class="thumb" id="thumb-${index}" style="background:${fallback}">
        ${social.thumb ? '' : socialIcon(social)}
      </div>
      <div class="meta">
        <span class="cat">${esc(social.category)}</span>
        <strong>${esc(social.name)}</strong>
        <small>${esc(social.username || 'Open profile')}</small>
      </div>
    </a>`;
}

function buildConnect() {
  return `
    <section id="connect" class="section">
      <h2>Find Me Online</h2>
      <div class="rail" id="rail">${visibleSocials.map(buildSocialCard).join('')}</div>
    </section>`;
}

// ---------- Put the sections on the page ----------
const SECTIONS = [buildStage, buildConnect];
document.getElementById('top').innerHTML = SECTIONS.map((build) => build()).join('');

const bg = document.getElementById('bg');
const info = document.getElementById('info');
const shelf = document.getElementById('shelf');
const rail = document.getElementById('rail');
const tiles = [...shelf.querySelectorAll('.tile')];

// Pictures are found (and extension / case fixed) by assets.js
visibleGames.forEach((game, index) => paintImage(tiles[index], game.cover || game.background, 'center top'));
visibleSocials.forEach((social, index) => {
  if (social.thumb) paintImage(document.getElementById(`thumb-${index}`), social.thumb);
});
resolveImages(document);

// ---------- Drag to slide with the mouse (touch uses normal swipe) ----------
function makeSlider(element) {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let lastX = 0;
  let speed = 0;
  let moved = 0;
  let frame = 0;

  element.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button) return;
    cancelAnimationFrame(frame);
    isDown = true;
    moved = 0;
    speed = 0;
    startX = lastX = event.clientX;
    startScroll = element.scrollLeft;
  });

  window.addEventListener('pointermove', (event) => {
    if (!isDown) return;
    moved = Math.max(moved, Math.abs(event.clientX - startX));
    if (moved > 5) element.classList.add('grab');

    element.scrollLeft = startScroll - (event.clientX - startX);
    speed = lastX - event.clientX;
    lastX = event.clientX;
  });

  window.addEventListener('pointerup', () => {
    if (!isDown) return;
    isDown = false;

    // Keep gliding a little after release
    const glide = () => {
      element.scrollLeft += speed;
      speed *= 0.93;
      if (Math.abs(speed) > 0.4) frame = requestAnimationFrame(glide);
      else element.classList.remove('grab');
    };

    if (reduceMotion || moved <= 5) element.classList.remove('grab');
    else glide();
  });

  // A drag must not count as a click
  element.addEventListener('click', (event) => {
    if (moved > 5) {
      event.preventDefault();
      event.stopPropagation();
      moved = 0;
    }
  }, true);
}

makeSlider(shelf);
makeSlider(rail);

// ---------- Wallpaper behind the page ----------
// The new picture is fully loaded BEFORE it fades in, so you never see
// a black flash. Older layers are removed only after the fade is done.
let wallpaperRequest = 0;

async function showWallpaper(game, index) {
  const request = ++wallpaperRequest;

  const url = await resolveAsset(game.background);
  if (url) await preloadImage(url);
  if (request !== wallpaperRequest) return;   // another game was chosen meanwhile

  const layer = document.createElement('div');
  layer.className = 'layer';
  layer.style.background = url
    ? `url("${url}") ${game.focus || 'center'} / cover no-repeat`
    : gradientFor(index);
  bg.appendChild(layer);

  requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('in')));

  setTimeout(() => {
    while (layer.previousElementSibling) layer.previousElementSibling.remove();
  }, 1100);
}

// ---------- Choose a game ----------
let currentIndex = -1;

// Scrolls ONLY the tile row. (scrollIntoView also scrolled the whole page
// sideways on iPhone, which made the page jump.)
function centerTile(tile) {
  const target = tile.offsetLeft - (shelf.clientWidth - tile.offsetWidth) / 2;
  shelf.scrollTo({
    left: Math.max(0, target),
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
}

function selectGame(index, { scroll = true } = {}) {
  if (!visibleGames.length) return;

  currentIndex = (index + visibleGames.length) % visibleGames.length;
  const game = visibleGames[currentIndex];

  showWallpaper(game, currentIndex);

  info.innerHTML = `
    <div class="eyebrow">${esc(profile.name)} · ${esc(profile.tagline)}</div>
    <h1>${esc(game.title)}</h1>
    <span class="tag glass">${esc(game.genre)}</span>
    <p>${game.description ? esc(game.description) : ''}</p>
    <button class="btn glass" id="more">View Details</button>`;
  document.getElementById('more').onclick = () => openDetails(game);

  tiles.forEach((tile, i) => {
    tile.classList.toggle('active', i === currentIndex);
    tile.setAttribute('aria-pressed', i === currentIndex);
  });

  if (scroll) centerTile(tiles[currentIndex]);
}

shelf.addEventListener('click', (event) => {
  const tile = event.target.closest('.tile');
  if (tile) selectGame(Number(tile.dataset.index));
});

shelf.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
  selectGame(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
  tiles[currentIndex].focus({ preventScroll: true });
});

if (visibleGames.length) {
  selectGame(0, { scroll: false });
} else {
  info.innerHTML = '<h1>RYCE</h1><p>No games to show yet.</p>';
}

// ---------- Social cards slide in when scrolled into view ----------
const connectSection = document.getElementById('connect');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      connectSection.classList.add('in');
      observer.disconnect();
    }
  }, { threshold: 0.2 });
  observer.observe(connectSection);
} else {
  connectSection.classList.add('in');
}
