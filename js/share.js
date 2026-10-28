// =====================================================
// SHARE PROFILE
// -----------------------------------------------------
// Builds a picture card that looks like the detail popup
// (wallpaper, avatar, name, bio, stats, skill bar, join year)
// and shares it together with a link that opens this game.
//   Phone   -> the normal share menu (picture + link)
//   Laptop  -> the picture is downloaded and the link is copied
// Note: the picture needs the site to be online (GitHub Pages).
// =====================================================

const CARD_WIDTH = 1080;
const CARD_FONT = '"Segoe UI", system-ui, -apple-system, sans-serif';

// Address of the live site (used when the page is opened as a local file)
const SITE_URL = 'https://ryceverse.github.io/ryce/';

// true on the real website, false when index.html is opened from the computer (file://)
const isOnline = () => location.protocol === 'http:' || location.protocol === 'https:';

// Link that opens this game's popup (see the end of main.js)
function shareLink(game) {
  const base = isOnline() ? location.href.split('#')[0] : SITE_URL;
  return `${base}#${game.id}`;
}

// ---------- Drawing helpers ----------
async function loadPicture(path) {
  const url = await resolveAsset(path);
  if (!url) return null;

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// "center top" -> 0, "center 30%" -> 0.3, anything else -> 0.5
function focusY(focus) {
  const text = String(focus || '');
  if (/top/.test(text)) return 0;
  if (/bottom/.test(text)) return 1;
  const match = text.match(/(\d+)%\s*$/);
  return match ? Number(match[1]) / 100 : 0.5;
}

// Fills a box with a picture (like CSS "cover")
function drawCover(ctx, image, x, y, w, h, focus = 'center') {
  const scale = Math.max(w / image.width, h / image.height);
  const drawW = image.width * scale;
  const drawH = image.height * scale;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(image, x + (w - drawW) / 2, y + (h - drawH) * focusY(focus), drawW, drawH);
  ctx.restore();
}

function wrapLines(ctx, text, maxWidth, maxLines) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const attempt = line ? `${line} ${word}` : word;
    if (!line || ctx.measureText(attempt).width <= maxWidth) {
      line = attempt;
    } else {
      lines.push(line);
      line = word;
    }
  });
  if (line) lines.push(line);

  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] += '…';
  }
  return lines;
}

function drawBar(ctx, x, y, w, h, percent) {
  roundedRect(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.fill();

  const fillWidth = Math.max(h, (w * Math.min(100, Math.max(0, percent))) / 100);
  const gradient = ctx.createLinearGradient(x, 0, x + w, 0);
  gradient.addColorStop(0, '#3b6cf0');
  gradient.addColorStop(1, '#a5dcff');

  roundedRect(ctx, x, y, fillWidth, h, h / 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

// Soft blurred copy of what is already drawn in a box
// (small copy scaled up = blur, and it works in every browser)
function drawBlurredBox(ctx, x, y, w, h) {
  const small = document.createElement('canvas');
  small.width = Math.max(1, Math.round(w / 18));
  small.height = Math.max(1, Math.round(h / 18));
  small.getContext('2d').drawImage(ctx.canvas, x, y, w, h, 0, 0, small.width, small.height);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(small, 0, 0, small.width, small.height, x, y, w, h);
}

// ---------- The picture card ----------
async function makeShareCard(game) {
  const person = getPerson(game);
  const stats = person.stats.filter((stat) => stat.value || stat.progress != null);

  const [wallpaper, avatar, logo] = await Promise.all([
    loadPicture(game.background),
    loadPicture(person.avatar),
    loadPicture('images/ryceverse-wordmark.webp'),
  ]);

  // ----- 1) Measure first, so the card is exactly as tall as it needs to be -----
  const measure = document.createElement('canvas').getContext('2d');
  const card = { x: 60, y: 300, w: CARD_WIDTH - 120, pad: 48, avatar: 240 };
  const textX = card.x + card.pad + card.avatar + 48;
  const textWidth = card.x + card.w - card.pad - textX;

  const nameWidth = person.joined ? textWidth - 190 : textWidth;
  let nameSize = 64;
  measure.font = `700 ${nameSize}px ${CARD_FONT}`;
  while (nameSize > 34 && measure.measureText(person.name).width > nameWidth) {
    nameSize -= 2;
    measure.font = `700 ${nameSize}px ${CARD_FONT}`;
  }

  measure.font = `400 32px ${CARD_FONT}`;
  const bioLines = wrapLines(measure, person.bio, textWidth, 2);

  const nameBaseline = card.y + card.pad + 56;
  const bioStart = nameBaseline + 46;
  const bioEnd = bioLines.length ? bioStart + (bioLines.length - 1) * 42 : nameBaseline;
  const statsTop = bioEnd + 58;
  const textBottom = stats.length ? statsTop + (stats.length - 1) * 62 : bioEnd;
  const cardBottom = Math.max(card.y + card.pad * 2 + card.avatar, textBottom + card.pad);
  card.h = cardBottom - card.y;
  const height = Math.max(1080, cardBottom + 300);
  const heroHeight = cardBottom + 70;   // the wallpaper reaches behind the whole card

  // ----- 2) Draw -----
  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0b0d12';
  ctx.fillRect(0, 0, CARD_WIDTH, height);

  // Wallpaper on top, fading into the dark background
  if (wallpaper) drawCover(ctx, wallpaper, 0, 0, CARD_WIDTH, heroHeight, game.focus);
  const fade = ctx.createLinearGradient(0, 0, 0, heroHeight);
  fade.addColorStop(0, 'rgba(8,10,16,0.35)');
  fade.addColorStop(0.55, 'rgba(8,10,16,0.45)');
  fade.addColorStop(1, 'rgba(11,13,18,1)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, CARD_WIDTH, heroHeight);

  // Title + genre
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 64px ${CARD_FONT}`;
  ctx.fillText(game.title, 72, 120);

  ctx.font = `600 28px ${CARD_FONT}`;
  const pillWidth = ctx.measureText(game.genre).width + 48;
  roundedRect(ctx, 72, 150, pillWidth, 52, 26);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(game.genre, 96, 186);

  // Profile card
  // Glass: blurred wallpaper inside the card + a light dark tint
  ctx.save();
  roundedRect(ctx, card.x, card.y, card.w, card.h, 40);
  ctx.clip();
  drawBlurredBox(ctx, card.x, card.y, card.w, card.h);
  ctx.restore();

  roundedRect(ctx, card.x, card.y, card.w, card.h, 40);
  ctx.fillStyle = 'rgba(14,17,26,0.42)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Avatar (round)
  const radius = card.avatar / 2;
  const cx = card.x + card.pad + radius;
  const cy = card.y + card.pad + radius;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  if (avatar) {
    drawCover(ctx, avatar, cx - radius, cy - radius, radius * 2, radius * 2);
  } else {
    ctx.fillStyle = '#1a1d26';
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.fillStyle = '#8a8fa0';
    ctx.font = `700 100px ${CARD_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((person.name || game.title).charAt(0).toUpperCase(), cx, cy + 4);
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.stroke();

  // Name + bio
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${nameSize}px ${CARD_FONT}`;
  ctx.fillText(person.name, textX, nameBaseline);

  ctx.font = `400 32px ${CARD_FONT}`;
  ctx.fillStyle = '#cfd3dc';
  bioLines.forEach((line, index) => ctx.fillText(line, textX, bioStart + index * 42));

  // Joined (top right of the card)
  if (person.joined) {
    const right = card.x + card.w - card.pad;
    ctx.textAlign = 'right';
    ctx.font = `400 24px ${CARD_FONT}`;
    ctx.fillStyle = '#9aa0b0';
    ctx.fillText(LABELS.joined, right, card.y + card.pad + 24);
    ctx.font = `700 36px ${CARD_FONT}`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(person.joined), right, card.y + card.pad + 66);
    ctx.textAlign = 'left';
  }

  // Stats: label, value, progress bar
  stats.forEach((stat, index) => {
    const y = statsTop + index * 62;
    let valueX = textX + 190;

    ctx.font = `500 32px ${CARD_FONT}`;
    ctx.fillStyle = '#8f95a6';
    ctx.fillText(stat.label, textX, y);

    if (stat.value) {
      ctx.font = `700 34px ${CARD_FONT}`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(String(stat.value), valueX, y);
      valueX += ctx.measureText(String(stat.value)).width + 24;
    }

    if (stat.progress != null) {
      const barWidth = Math.min(320, card.x + card.w - card.pad - valueX);
      drawBar(ctx, valueX, y - 22, barWidth, 18, Number(stat.progress) || 0);
    }
  });

  // Footer: logo + site address
  if (logo) {
    const logoHeight = 64;
    const logoWidth = (logo.width * logoHeight) / logo.height;
    ctx.drawImage(logo, (CARD_WIDTH - logoWidth) / 2, height - 190, logoWidth, logoHeight);
  }
  ctx.textAlign = 'center';
  ctx.font = `400 28px ${CARD_FONT}`;
  ctx.fillStyle = '#8f95a6';
  ctx.fillText(shareLink(game).replace(/^https?:\/\//, '').replace(/#.*$/, ''), CARD_WIDTH / 2, height - 70);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('no picture'))), 'image/png');
  });
}

// ---------- Share button ----------
// The card is made when the popup opens, so it is ready when you tap share
const shareCards = new Map();

function prepareShareCard(game) {
  if (!isOnline() || shareCards.has(game.id)) return;

  const task = makeShareCard(game);
  task.catch(() => {});   // problems are handled when the button is used
  shareCards.set(game.id, task);
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function shareProfile(game) {
  const link = shareLink(game);
  const person = getPerson(game);
  const title = person.name ? `${game.title} · ${person.name}` : game.title;

  // A page opened as a local file (file://) must NOT use the share menu:
  // Chrome crashes the tab ("Aw, Snap!"). Only the link of the live site is copied.
  if (!isOnline()) {
    await copyText(link);
    showToast(LABELS.localOnly);
    return;
  }

  prepareShareCard(game);

  let file = null;
  try {
    const blob = await shareCards.get(game.id);
    file = new File([blob], `${game.id}-profile.png`, { type: 'image/png' });
  } catch (error) {
    file = null;   // card could not be made (for example the page is opened as a local file)
  }

  try {
    // 1) Phone: the normal share menu with the picture
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title, text: `${title}\n${link}` });
      return;
    }

    // 2) No picture sharing: save the picture and copy the link
    if (file) {
      downloadFile(file);
      await copyText(link);
      showToast(LABELS.savedAndCopied);
      return;
    }

    // 3) No picture at all: share or copy only the link
    if (navigator.share) {
      await navigator.share({ title, url: link });
      return;
    }
    await copyText(link);
    showToast(LABELS.linkCopied);
  } catch (error) {
    if (error.name !== 'AbortError') showToast(LABELS.shareFailed);   // AbortError = menu closed
  }
}
