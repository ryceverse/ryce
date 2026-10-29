// =====================================================
// PROFILE BORDER + SPARKLES
// -----------------------------------------------------
// A border is a picture (PNG, WebP ...) with an empty hole in the middle.
// The site finds the hole by itself and fits the profile picture into it,
// so any border picture works, without measuring anything.
// Sparkles are tiny twinkling stars that pop up at random places ON the border.
// Settings: look.frames in data-look.js, and profile.frame in data-games.js
// =====================================================

const FRAME_HOLE_FILL = 0.98;      // the hole is a bit smaller than the picture, so the picture tucks under the ring
const FRAME_ANALYSIS_SIZE = 192;   // the border is analysed at this size (fast)
const frameInfoCache = new Map();

// ---------- Is the border of this profile visible? ----------
// Returns { image, sparkle } or null (global switch + switch of the game)
function activeFrame(person) {
  const frame = person.frame;
  const settings = look.frames || {};

  if (!frame || !frame.image || frame.show === false) return null;
  if (settings.enabled === false) return null;

  return {
    image: frame.image,
    sparkle: frame.sparkle !== false && settings.sparkle !== false,
  };
}

// ---------- Find the hole in the middle of the border picture ----------
function analyseFrame(image) {
  const scale = Math.min(1, FRAME_ANALYSIS_SIZE / Math.max(image.width, image.height));
  const w = Math.max(1, Math.round(image.width * scale));
  const h = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, w, h);

  // Throws when the picture comes from another website (or a local file): handled by the caller
  const data = ctx.getImageData(0, 0, w, h).data;
  const alpha = (x, y) => data[(y * w + x) * 4 + 3];
  const SEE_THROUGH = 24;

  const startX = Math.floor(w / 2);
  const startY = Math.floor(h / 2);
  if (alpha(startX, startY) >= SEE_THROUGH) return null;   // the middle is not empty

  // Flood fill: every empty pixel that is connected to the middle belongs to the hole
  const seen = new Uint8Array(w * h);
  const queue = [startY * w + startX];
  seen[queue[0]] = 1;

  let minX = w, maxX = 0, minY = h, maxY = 0, touchesEdge = false;

  for (let head = 0; head < queue.length; head++) {
    const x = queue[head] % w;
    const y = Math.floor(queue[head] / w);

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touchesEdge = true;

    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
      const id = ny * w + nx;
      if (!seen[id] && alpha(nx, ny) < SEE_THROUGH) {
        seen[id] = 1;
        queue.push(id);
      }
    });
  }

  if (touchesEdge) return null;   // the ring has a gap, the hole leaked outside

  // Places for sparkles: solid, bright pixels of the border (metal, gold, crystal)
  const solid = [];
  const bright = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] < 200) continue;
      const point = [(x / w) * 100, (y / h) * 100];
      solid.push(point);
      if (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2] > 110) bright.push(point);
    }
  }

  return {
    holeDiameter: (maxX - minX + 1 + (maxY - minY + 1)) / 2 / w,   // relative to the picture width
    centerX: (minX + maxX + 1) / 2 / w,                            // 0 - 1
    centerY: (minY + maxY + 1) / 2 / h,
    points: bright.length >= 25 ? bright : solid,
  };
}

// ---------- Where to put the border so the hole sits exactly on the profile picture ----------
// All numbers are relative to the size of the profile picture (1 = same size).
function fitFrame(image, found) {
  const hole = found ? found.holeDiameter : 0.62;                 // unknown border: guess
  const centerX = found ? found.centerX : 0.5;
  const centerY = found ? found.centerY : 0.5;

  const w = FRAME_HOLE_FILL / hole;
  const h = (w * image.height) / image.width;
  const x = 0.5 - centerX * w;
  const y = 0.5 - centerY * h;
  const extra = Math.max(-x, -y, x + w - 1, y + h - 1, 0);        // how far the border sticks out

  return { w, h, x, y, extra };
}

// Points on a circle, used when the real border could not be analysed
function ringPoints(fit) {
  const points = [];
  for (let i = 0; i < 90; i++) {
    const angle = (i / 90) * Math.PI * 2;
    points.push([50 + Math.cos(angle) * 40, 50 + Math.sin(angle) * 40]);
  }
  return points;
}

async function loadFrameInfo(path) {
  const url = await resolveAsset(path);
  const image = url ? await loadPicture(path) : null;
  if (!image) return null;

  let found = null;
  try {
    found = analyseFrame(image);
  } catch (error) {
    found = null;   // local file / other website: fall back to a guess
  }

  const fit = fitFrame(image, found);
  return { url, fit, points: found ? found.points : ringPoints(fit) };
}

// { url, fit, points } or null (cached)
function getFrameInfo(path) {
  if (!frameInfoCache.has(path)) frameInfoCache.set(path, loadFrameInfo(path));
  return frameInfoCache.get(path);
}

// ---------- Sparkles ----------
function addSparkle(layer, points) {
  const [x, y] = points[Math.floor(Math.random() * points.length)];

  const star = document.createElement('span');
  star.className = 'sparkle';
  star.style.left = `${x}%`;
  star.style.top = `${y}%`;
  star.style.setProperty('--k', (0.07 + Math.random() * 0.07).toFixed(3));        // size
  star.style.setProperty('--dur', `${(1.1 + Math.random() * 0.9).toFixed(2)}s`);  // how long it shines

  star.addEventListener('animationend', () => star.remove());
  layer.appendChild(star);
}

function startSparkles(layer, points) {
  if (!points.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tick = () => {
    if (!layer.isConnected) return;   // the popup was closed: stop

    if (!document.hidden && layer.children.length < 5) addSparkle(layer, points);
    setTimeout(tick, 280 + Math.random() * 520);
  };
  tick();
}

// ---------- Put the borders on the profile pictures of a container ----------
function applyFrames(container = document) {
  container.querySelectorAll('.avatar-ring[data-frame]').forEach(async (ring) => {
    const info = await getFrameInfo(ring.dataset.frame);
    if (!ring.isConnected) return;

    // Border picture missing: back to the simple round ring
    if (!info) {
      ring.classList.remove('has-frame');
      return;
    }

    const { fit } = info;
    ring.style.setProperty('--frame-w', fit.w);
    ring.style.setProperty('--frame-h', fit.h);
    ring.style.setProperty('--frame-x', fit.x);
    ring.style.setProperty('--frame-y', fit.y);
    ring.style.setProperty('--frame-extra', fit.extra);

    ring.insertAdjacentHTML('beforeend', `
      <div class="avatar-frame">
        <img src="${info.url}" alt="">
        <span class="sparkles"></span>
      </div>`);

    if (ring.dataset.sparkle === '1') startSparkles(ring.querySelector('.sparkles'), info.points);
  });
}
