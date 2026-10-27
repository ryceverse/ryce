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

// Texts shown in the popup (change them here)
const LABELS = {
  joined: 'Bergabung',
  gallery: 'Gallery',
  watch: 'Watch on YouTube ↗',
  share: 'Share profile',
  close: 'Close',
  savedAndCopied: 'Picture saved, link copied',
  linkCopied: 'Link copied',
  shareFailed: 'Could not share',
  localOnly: 'Link copied. Picture sharing works on the live website',
};

// Icons for the two round buttons
const SHARE_ICON = `
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14 4.5 21 10.5l-7 6v-3.7c-5.2-.2-8.4 1.4-10.5 5.2.5-5.7 4-9.6 10.5-10.3z"/>
  </svg>`;

const CLOSE_ICON = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
       stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"/>
  </svg>`;

let currentGame = null;
let lightboxIndex = 0;

// ---------- Small builders for each part of the popup ----------
// ---------- Profile data of one game ----------
// New format: game.profile = { avatar, name, bio, joined, copyName, stats: [...] }
// Old format (game.info rows) still works and is converted here.
function legacyProfile(game) {
  const rows = game.info || [];
  const nickname = rows.find((row) => /^nick/i.test(row.label));
  const joined = rows.find((row) => /^(join|bergabung)/i.test(row.label));

  return {
    name: nickname ? nickname.value : '',
    copyName: Boolean(nickname && nickname.copy),
    joined: joined ? joined.value : '',
    stats: rows.filter((row) => row !== nickname && row !== joined),
  };
}

function getPerson(game) {
  const own = game.profile || legacyProfile(game);

  return {
    avatar: own.avatar || '',
    name: own.name || profile.name,
    bio: own.bio || '',
    joined: own.joined || '',
    copyName: Boolean(own.copyName),
    stats: (own.stats || []).filter((stat) => stat.value || stat.progress != null),
  };
}

// ---------- Profile card (avatar, name, bio, stats, joined) ----------
function copyButton(value, label) {
  return `
    <button class="copy-btn" data-copy="${esc(value)}"
            aria-label="Copy ${esc(label)}" title="Copy">${COPY_ICON}</button>`;
}

function buildStat(stat) {
  const parts = [];

  if (stat.value) {
    parts.push(`<span>${esc(stat.value)}</span>`);
  }

  if (stat.progress != null) {
    const percent = Math.max(0, Math.min(100, Number(stat.progress) || 0));
    parts.push(`
      <span class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
        <span class="bar-fill" style="--p:${percent}"></span>
      </span>`);
  }

  if (stat.copy && stat.value) {
    parts.push(copyButton(stat.value, stat.label));
  }

  return `
    <div class="stat">
      <dt>${esc(stat.label)}</dt>
      <dd>${parts.join('')}</dd>
    </div>`;
}

function buildProfileCard(game) {
  const person = getPerson(game);
  const hasAnything = person.avatar || person.bio || person.joined || person.stats.length;
  if (!hasAnything && !(game.profile && game.profile.name)) return '';

  const initial = esc((person.name || game.title).charAt(0).toUpperCase());
  const avatar = person.avatar ? `<img data-asset="${esc(person.avatar)}" alt="">` : '';

  return `
    <section class="profile-card">
      <div class="avatar-ring">
        <span class="avatar-initial">${initial}</span>
        ${avatar}
      </div>

      <div class="profile-main">
        <h3 class="profile-name">${esc(person.name)}${person.copyName ? copyButton(person.name, 'name') : ''}</h3>
        ${person.bio ? `<p class="profile-bio">${esc(person.bio)}</p>` : ''}
        ${person.stats.length ? `<dl class="stats">${person.stats.map(buildStat).join('')}</dl>` : ''}
      </div>

      ${person.joined ? `
      <div class="joined">
        <small>${esc(LABELS.joined)}</small>
        <strong>${esc(person.joined)}</strong>
      </div>` : ''}
    </section>`;
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
           target="_blank" rel="noopener noreferrer">${esc(LABELS.watch)}</a>
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
  const id = preview.dataset.youtube;

  // YouTube refuses to play ("Error 153") when the page has no web address.
  // That is the case when index.html is opened as a local file, so the
  // video simply opens on YouTube instead.
  if (location.protocol === 'file:') {
    window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener');
    return;
  }

  const frame = document.createElement('iframe');

  // The referrer policy must be set BEFORE the address (YouTube needs it)
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.title = `${currentGame.title} video`;
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  frame.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1&origin=${encodeURIComponent(location.origin)}`;

  preview.replaceWith(frame);
}

function buildGallery(game) {
  if (!game.gallery || !game.gallery.length) return '';

  const shots = game.gallery.map((src, index) => `
    <button class="shot" data-index="${index}" aria-label="Open picture ${index + 1}">
      <img data-asset="${esc(src)}" alt="${esc(game.title)} picture ${index + 1}" loading="lazy">
    </button>`).join('');

  return `
    <h3 class="dlg-label">${esc(LABELS.gallery)}</h3>
    <div class="gallery">${shots}</div>`;
}

// ---------- Small message at the bottom ----------
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  detailDialog.appendChild(toast);
  setTimeout(() => toast.remove(), 2400);
}

// ---------- Open the detail popup ----------
// Order: banner (title) -> profile card -> description -> video -> gallery
function openDetails(game) {
  currentGame = game;

  detailBody.innerHTML = `
    <div class="dlg-actions">
      <button class="round-btn" id="detail-share"
              aria-label="${esc(LABELS.share)}" title="${esc(LABELS.share)}">${SHARE_ICON}</button>
      <button class="round-btn" id="detail-close"
              aria-label="${esc(LABELS.close)}" title="${esc(LABELS.close)}">${CLOSE_ICON}</button>
    </div>

    <header class="dlg-banner">
      <div class="banner-art" id="banner-art"></div>
      <h2>${esc(game.title)}</h2>
      <span class="tag glass">${esc(game.genre)}</span>
    </header>

    ${buildProfileCard(game)}

    <div class="dlg-content">
      ${game.description ? `<p class="desc">${esc(game.description)}</p>` : ''}
      ${buildVideo(game)}
      ${buildGallery(game)}
      ${game.url ? `<p><a href="${esc(game.url)}" target="_blank" rel="noopener noreferrer">Open game profile</a></p>` : ''}
    </div>`;

  // Same wallpaper as the page behind
  paintImage(document.getElementById('banner-art'), game.background, game.focus || 'center');

  resolveImages(detailBody);
  loadYoutubeThumbnails(detailBody);
  loadVideoPosters(detailBody);
  prepareShareCard(game);

  detailDialog.showModal();
  detailDialog.scrollTop = 0;
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
  const shareButton = event.target.closest('#detail-share');
  const copyTarget = event.target.closest('.copy-btn');
  const shot = event.target.closest('.shot');
  const preview = event.target.closest('.video-preview');

  if (closeButton) {
    detailDialog.close();
  }

  if (shareButton) {
    shareProfile(currentGame);
  }

  if (copyTarget) {
    const worked = await copyText(copyTarget.dataset.copy);
    copyTarget.innerHTML = worked ? CHECK_ICON : '✕';
    copyTarget.classList.toggle('done', worked);

    setTimeout(() => {
      copyTarget.innerHTML = COPY_ICON;
      copyTarget.classList.remove('done');
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
