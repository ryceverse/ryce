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

// Icon on top of the video thumbnail
const PLAY_ICON = `
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/>
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

// Understands a YouTube link in any form (watch?v=, youtu.be/, shorts/, embed/, live/),
// just the 11-character video ID, or a video file (.mp4 / .webm / .mov)
function parseVideo(value) {
  const text = String(value || '').trim();
  if (!text) return { type: 'none' };

  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(text)) return { type: 'file', src: text };
  if (/^[\w-]{11}$/.test(text)) return { type: 'youtube', id: text };

  try {
    const url = new URL(text.startsWith('http') ? text : `https://${text}`);
    const host = url.hostname.replace(/^(www|m)\./, '');
    const parts = url.pathname.split('/').filter(Boolean);
    let id = '';

    if (host === 'youtu.be') {
      id = parts[0];
    } else if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const isPathStyle = ['embed', 'shorts', 'live', 'v'].includes(parts[0]);
      id = url.searchParams.get('v') || (isPathStyle ? parts[1] : '');
    }

    if (/^[\w-]{11}$/.test(id || '')) return { type: 'youtube', id };
  } catch (error) {
    // not a link, fall through
  }

  console.warn(`[video] Could not understand this video value: ${value}`);
  return { type: 'none' };
}

function buildVideo(game) {
  const video = parseVideo(game.video);

  // YouTube: thumbnail first, the real player loads only after a click
  if (video.type === 'youtube') {
    return `
      <div class="video-box">
        <button class="video-preview" data-youtube="${esc(video.id)}" aria-label="Play video: ${esc(game.title)}">
          <img data-id="${esc(video.id)}" alt="">
          <span class="play-icon" aria-hidden="true">${PLAY_ICON}</span>
        </button>
        <a class="video-link" href="https://www.youtube.com/watch?v=${esc(video.id)}"
           target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
      </div>`;
  }

  // Video file: the browser shows a frame of the video (or your own videoThumb picture)
  if (video.type === 'file') {
    const poster = game.videoThumb ? `data-poster="${esc(game.videoThumb)}"` : '';
    return `
      <video controls playsinline preload="metadata"
             data-asset="${esc(video.src)}" data-fragment="#t=0.5" ${poster}></video>`;
  }

  return '';
}

// Thumbnail: best quality first, normal quality if that one does not exist
function loadYoutubeThumbnails(container) {
  container.querySelectorAll('.video-preview img').forEach((image) => {
    const fallback = `https://i.ytimg.com/vi/${image.dataset.id}/hqdefault.jpg`;

    image.onerror = () => {
      image.onerror = null;
      image.src = fallback;
    };
    image.onload = () => {
      // YouTube answers with a tiny grey picture when the big one is missing
      if (image.naturalWidth <= 120 && image.src !== fallback) image.src = fallback;
    };
    image.src = `https://i.ytimg.com/vi/${image.dataset.id}/maxresdefault.jpg`;
  });
}

// Own thumbnail for a video file (optional field: videoThumb)
function loadVideoPosters(container) {
  container.querySelectorAll('video[data-poster]').forEach(async (video) => {
    const url = await resolveAsset(video.dataset.poster);
    if (url) video.poster = url;
  });
}

// Click on the thumbnail: swap it for the real player and start playing
function playYoutube(preview) {
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${preview.dataset.youtube}?autoplay=1&rel=0&playsinline=1`;
  frame.title = `${currentGame.title} video`;
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  preview.replaceWith(frame);
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
  loadYoutubeThumbnails(detailBody);
  loadVideoPosters(detailBody);
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
  const preview = event.target.closest('.video-preview');

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

  if (preview) {
    playYoutube(preview);
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
