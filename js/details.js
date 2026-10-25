// =====================================================
// DETAIL POPUP  +  GALLERY LIGHTBOX
// openDetails(game) is called from main.js
// =====================================================

// ---------- Create both popups once ----------
document.body.insertAdjacentHTML('beforeend', `
  <dialog id="detail" class="dlg glass">
    <div class="dlg-body" id="detail-body"></div>
  </dialog>

  <dialog id="lightbox" class="lightbox">
    <button class="lb-btn lb-close" id="lb-close" aria-label="Close picture">✕</button>
    <button class="lb-btn lb-prev" id="lb-prev" aria-label="Previous picture">‹</button>
    <img id="lb-img" alt="">
    <button class="lb-btn lb-next" id="lb-next" aria-label="Next picture">›</button>
    <div class="lb-count" id="lb-count"></div>
  </dialog>
`);

const detailDialog = document.getElementById('detail');
const detailBody = document.getElementById('detail-body');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCount = document.getElementById('lb-count');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

// Icons for the copy button
const COPY_ICON = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="3"/>
    <path d="M5 15V6a2 2 0 0 1 2-2h9"/>
  </svg>`;

const CHECK_ICON = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5"/>
  </svg>`;

let currentGame = null;
let lightboxIndex = 0;

// ---------- Small builders for each part of the popup ----------
function buildInfo(game) {
  const rows = (game.info || []).filter((row) => row.value);
  if (!rows.length) return '';

  const items = rows.map((row) => {
    const copyButton = row.copy
      ? `<button class="copy-btn"
                 data-copy="${esc(row.value)}"
                 aria-label="Copy ${esc(row.label)}"
                 title="Copy">${COPY_ICON}</button>`
      : '';

    return `
      <div class="info-row">
        <dt>${esc(row.label)}</dt>
        <dd>
          <span>${esc(row.value)}</span>
          ${copyButton}
        </dd>
      </div>`;
  }).join('');

  return `<dl class="info">${items}</dl>`;
}

function buildVideo(game) {
  if (!game.video) return '';

  const isFile = /\.(mp4|webm)$/i.test(game.video);
  if (isFile) {
    return `<video controls preload="metadata" data-asset="${esc(game.video)}"></video>`;
  }
  return `
    <iframe src="https://www.youtube-nocookie.com/embed/${esc(game.video)}"
            title="${esc(game.title)} video"
            allowfullscreen
            loading="lazy"></iframe>`;
}

function buildGallery(game) {
  if (!game.gallery || !game.gallery.length) return '';

  const shots = game.gallery.map((src, index) => `
    <button class="shot" data-index="${index}" aria-label="Open picture ${index + 1}">
      <img data-asset="${esc(src)}" alt="${esc(game.title)} picture ${index + 1}" loading="lazy">
    </button>`).join('');

  return `
    <h3 class="dlg-label">Gallery</h3>
    <div class="gallery">${shots}</div>`;
}

// ---------- Open the detail popup ----------
function openDetails(game) {
  currentGame = game;

  detailBody.innerHTML = `
    <button class="btn glass dlg-close" id="detail-close">Close</button>
    <h2>${esc(game.title)}</h2>
    <span class="tag glass">${esc(game.genre)}</span>

    ${buildInfo(game)}
    ${game.description ? `<p class="desc">${esc(game.description)}</p>` : ''}
    ${buildVideo(game)}
    ${buildGallery(game)}
    ${game.url ? `<p><a href="${esc(game.url)}" target="_blank" rel="noopener noreferrer">Open game profile</a></p>` : ''}`;

  resolveImages(detailBody);
  detailDialog.showModal();
}

// ---------- Copy to clipboard ----------
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for browsers that block the clipboard (e.g. opened as a local file)
    const box = document.createElement('textarea');
    box.value = text;
    box.style.position = 'fixed';
    box.style.opacity = '0';
    detailBody.appendChild(box);
    box.select();
    const worked = document.execCommand('copy');
    box.remove();
    return worked;
  }
}

// ---------- Clicks inside the detail popup ----------
detailBody.addEventListener('click', async (event) => {
  const closeButton = event.target.closest('#detail-close');
  const copyButton = event.target.closest('.copy-btn');
  const shot = event.target.closest('.shot');

  if (closeButton) {
    detailDialog.close();
  }

  if (copyButton) {
    const worked = await copyText(copyButton.dataset.copy);
    copyButton.innerHTML = worked ? CHECK_ICON : '✕';
    copyButton.classList.toggle('done', worked);

    setTimeout(() => {
      copyButton.innerHTML = COPY_ICON;
      copyButton.classList.remove('done');
    }, 1600);
  }

  if (shot) {
    openLightbox(Number(shot.dataset.index));
  }
});

// Click on the dark area outside the popup = close
detailDialog.addEventListener('click', (event) => {
  if (event.target === detailDialog) detailDialog.close();
});

// Stop videos when the popup closes
detailDialog.addEventListener('close', () => {
  detailBody.innerHTML = '';
});

// ---------- Lightbox (big picture, blurred page behind) ----------
async function showShot(index) {
  const pictures = currentGame.gallery;
  lightboxIndex = (index + pictures.length) % pictures.length;
  const wanted = lightboxIndex;

  lbCount.textContent = `${lightboxIndex + 1} / ${pictures.length}`;

  const hasMany = pictures.length > 1;
  lbPrev.hidden = !hasMany;
  lbNext.hidden = !hasMany;

  // Find the real file (wrong extension or upper/lower case is fixed here)
  const url = await resolveAsset(pictures[wanted]);
  if (wanted !== lightboxIndex) return;   // user already moved on

  lbImg.src = url || pictures[wanted];

  // Restart the small fade animation on every picture
  lbImg.classList.remove('swap');
  void lbImg.offsetWidth;
  lbImg.classList.add('swap');
}

function openLightbox(index) {
  showShot(index);
  lightbox.showModal();
}

lbPrev.addEventListener('click', () => showShot(lightboxIndex - 1));
lbNext.addEventListener('click', () => showShot(lightboxIndex + 1));
document.getElementById('lb-close').addEventListener('click', () => lightbox.close());

// Click on the empty area = close
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

// Arrow keys = previous / next (Esc closes by default)
lightbox.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showShot(lightboxIndex - 1);
  if (event.key === 'ArrowRight') showShot(lightboxIndex + 1);
});
