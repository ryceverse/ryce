// =====================================================
// ASSET RESOLVER
// -----------------------------------------------------
// Wrote a picture path slightly wrong? No problem:
//   wrong extension       Dragon Duke.jpg   ->  Dragon Duke.webp
//   wrong upper/lower     Clash of Clans    ->  Clash Of Clans
// The real file is found automatically.
//
// How it works:
//   1. The list of files in your GitHub repo is read once
//      (and remembered in the browser for 10 minutes).
//   2. If that list is not available, the other extensions
//      are tried one by one.
// =====================================================

// Your GitHub repo (used only to read the file list)
const ASSET_SOURCE = {
  owner: 'ryceverse',
  repo: 'ryce',
  branch: 'main',
};

const ASSET_EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png', 'avif', 'gif'];
const ASSET_FOLDERS = ['assets/', 'images/'];
const ASSET_CACHE_KEY = 'ryce-asset-files-v1';
const ASSET_CACHE_MINUTES = 10;
const ASSET_API_TIMEOUT = 4000;
const IMAGE_PATTERN = /\.(webp|jpe?g|png|avif|gif)$/i;

// ---------- Small helpers for paths ----------
function cleanPath(path) {
  let text = String(path).trim().replace(/\\/g, '/');
  try {
    text = decodeURI(text);
  } catch (error) {
    // keep the text as it is
  }
  return text.replace(/^\.?\//, '');
}

const lowerKey = (path) => cleanPath(path).toLowerCase();
const stripExtension = (path) => path.replace(/\.[a-z0-9]+$/i, '');

function extensionOf(path) {
  const match = path.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
}

// ---------- The file list of the repo ----------
function buildIndex(files) {
  const byFullPath = new Map();  // 'assets/a/b.webp' (lowercase) -> real path
  const byName = new Map();      // 'assets/a/b' (lowercase)      -> all real paths

  files.forEach((file) => {
    const key = file.toLowerCase();
    byFullPath.set(key, file);

    const name = stripExtension(key);
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(file);
  });

  return { byFullPath, byName };
}

function readCachedFiles() {
  try {
    const saved = JSON.parse(localStorage.getItem(ASSET_CACHE_KEY));
    const fresh = saved && Date.now() - saved.time < ASSET_CACHE_MINUTES * 60000;
    return fresh ? saved.files : null;
  } catch (error) {
    return null;
  }
}

function saveCachedFiles(files) {
  try {
    localStorage.setItem(ASSET_CACHE_KEY, JSON.stringify({ time: Date.now(), files }));
  } catch (error) {
    // storage is blocked, that is fine
  }
}

async function fetchRepoFiles() {
  const { owner, repo, branch } = ASSET_SOURCE;
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ASSET_API_TIMEOUT);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;

    const data = await response.json();
    return data.tree
      .filter((item) => item.type === 'blob')
      .map((item) => item.path)
      .filter((path) => ASSET_FOLDERS.some((folder) => path.toLowerCase().startsWith(folder)));
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function loadAssetIndex() {
  const cached = readCachedFiles();
  if (cached) return buildIndex(cached);

  const files = await fetchRepoFiles();
  if (!files) return null;

  saveCachedFiles(files);
  return buildIndex(files);
}

// Starts right away, so it is ready when the first picture is needed
const assetIndexReady = loadAssetIndex();

// ---------- Look a path up ----------
function findInIndex(index, path) {
  const key = lowerKey(path);
  if (index.byFullPath.has(key)) return index.byFullPath.get(key);

  // Same name, other extension: prefer webp, then jpg, png...
  const sameName = index.byName.get(stripExtension(key));
  if (!sameName) return '';

  const rank = (file) => {
    const position = ASSET_EXTENSIONS.indexOf(extensionOf(file));
    return position === -1 ? 99 : position;
  };
  return sameName.slice().sort((a, b) => rank(a) - rank(b))[0];
}

// Loads (and decodes) a picture. Resolves true / false, never throws.
function preloadImage(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);

    const image = new Image();
    image.onerror = () => resolve(false);
    image.onload = () => {
      if (image.decode) image.decode().then(() => resolve(true), () => resolve(true));
      else resolve(true);
    };
    image.src = url;
  });
}

// Fallback when the file list is not available: try other extensions
async function probeImage(path) {
  const clean = cleanPath(path);
  const base = stripExtension(clean);
  const tries = [clean, ...ASSET_EXTENSIONS.map((ext) => `${base}.${ext}`)];

  for (const candidate of new Set(tries)) {
    const url = encodeURI(candidate);
    if (await preloadImage(url)) return url;
  }
  return '';
}

async function findAsset(path) {
  const index = await assetIndexReady;
  const found = index ? findInIndex(index, path) : '';
  if (found) return encodeURI(found);

  // Not an image (e.g. a video): we cannot test it, use it as written
  if (!IMAGE_PATTERN.test(path)) return encodeURI(cleanPath(path));

  const probed = await probeImage(path);
  if (!probed) console.warn(`[assets] File not found: ${path}`);
  return probed;
}

// ---------- Used by the rest of the site ----------
const resolvedAssets = new Map();

// Gives back the real, working URL for a path ('' when nothing is found)
function resolveAsset(path) {
  if (!path) return Promise.resolve('');
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return Promise.resolve(path);

  if (!resolvedAssets.has(path)) resolvedAssets.set(path, findAsset(path));
  return resolvedAssets.get(path);
}

// <img data-asset="path"> and <video data-asset="path"> get their real src
function resolveImages(container = document) {
  container.querySelectorAll('[data-asset]').forEach(async (element) => {
    const url = await resolveAsset(element.dataset.asset);
    if (url) element.src = url + (element.dataset.fragment || '');
  });
}

// Puts a picture as the background of an element (keeps the old look if missing)
async function paintImage(element, path, position = 'center') {
  const url = await resolveAsset(path);
  if (!url) return false;

  element.style.background = `url("${url}") ${position} / cover no-repeat`;
  return true;
}
