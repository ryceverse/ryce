// =====================================================
// SOCIAL MEDIA ICONS
// -----------------------------------------------------
// Built-in simple icons, picked by the social "id" in data-socials.js.
// Want your own logo? In data-socials.js add:  icon: './assets/Logo/youtube.png'
// =====================================================

// Wraps drawing shapes in one shared <svg> setup
const svgIcon = (shapes) => `
  <svg viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       stroke-width="1.7"
       stroke-linecap="round"
       stroke-linejoin="round"
       aria-hidden="true">
    ${shapes}
  </svg>`;

const ICONS = {
  youtube: svgIcon(`
    <rect x="2.5" y="5" width="19" height="14" rx="4"/>
    <path d="M10 9.2v5.6l5-2.8z"/>`),

  tiktok: svgIcon(`
    <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/>
    <path d="M14 4c.4 2.4 1.9 3.9 4.5 4.2"/>`),

  instagram: svgIcon(`
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor"/>`),

  facebook: svgIcon(`
    <path d="M14 21v-7h2.5l.5-3H14V9.2c0-.9.4-1.5 1.6-1.5H17V5.1C16.6 5 15.8 5 15 5c-2.3 0-3.7 1.4-3.7 3.8V11H9v3h2.3v7"/>`),

  hoyolab: svgIcon(`
    <circle cx="12" cy="12" r="9"/>
    <path d="M9 8v8M15 8v8M9 12h6"/>`),

  discord: svgIcon(`
    <path d="M7 6.8c1.6-.8 3.2-1.2 5-1.2s3.4.4 5 1.2c1.3 2.1 2 4.3 2.4 7-1.4 1.2-3 2-4.8 2.5l-.8-1.5c-1 .2-2 .2-3.6 0l-.8 1.5c-1.8-.5-3.4-1.3-4.8-2.5C5 11.100 5.700 8.900 7 6.800z"/>
    <circle cx="9.200" cy="11.500" r="1" fill="currentColor"/>
    <circle cx="14.800" cy="11.500" r="1" fill="currentColor"/>`),

  qr: svgIcon(`
    <rect x="4" y="4" width="6" height="6" rx="1"/>
    <rect x="14" y="4" width="6" height="6" rx="1"/>
    <rect x="4" y="14" width="6" height="6" rx="1"/>
    <path d="M14 14h2v2h-2zM18 14h2v2M16 18h4v2h-4zM14 18v2"/>`),

  // Verified badge (filled, always blue and white)
  verified: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1d9bf0" d="M12 2l2.4 1.7 2.9-.1 1 2.7 2.4 1.7-.9 2.8.9 2.8-2.4 1.7-1 2.7-2.9-.1L12 22l-2.4-1.7-2.9.1-1-2.7-2.4-1.7.9-2.8-.9-2.8 2.4-1.7 1-2.7 2.9.1z"/>
      <path d="M8 12.2l2.7 2.7L16 9.6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

  heart: svgIcon(`
    <path d="M12 20s-7-4.400-7-10a4 4 0 0 1 7-2.600A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>`),
};

ICONS.saweria = ICONS.heart;

// ---------- Icon colour ----------
// look.icons.color is the default, look.icons.colors changes single icons,
// and an entry can have  iconColor: 'original'  itself.
function iconColorOf(item) {
  const own = item.iconColor || (look.icons.colors && look.icons.colors[item.id]);
  return ['white', 'black', 'original'].includes(own) ? own : look.icons.color || 'white';
}

// Gives back the HTML of an icon. The built-in icon shows right away,
// resolveIcons() swaps it for your own picture when one is found.
//   item = { id, name, icon (optional own picture path), iconColor (optional) }
function renderIcon(item) {
  const fallback = ICONS[item.id] || `<span class="icon-letter">${esc(String(item.name || '?').charAt(0))}</span>`;
  const own = item.icon ? ` data-icon-file="${esc(item.icon)}"` : '';

  return `
    <span class="icon icon-${iconColorOf(item)}"
          data-icon-id="${esc(item.id || '')}"
          data-icon-name="${esc(item.name || '')}"${own}>${fallback}</span>`;
}

// Same as before, used by the footer and the social cards
function socialIcon(social) {
  return renderIcon(social);
}

// ---------- Find the picture of an icon in look.icons.folder ----------
// Matches by name, ignoring upper/lower case, spaces and the file format.
// First an exact name (youtube), then a name that contains it (icon-youtube-2).
async function findIconFile(names) {
  const index = await assetIndexReady;
  if (!index) return '';

  const folder = cleanPath(look.icons.folder).toLowerCase().replace(/\/?$/, '/');
  const simple = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const rank = (file) => {
    const position = ASSET_EXTENSIONS.indexOf(extensionOf(file));
    return position === -1 ? 99 : position;
  };

  const files = [...index.byFullPath.entries()]
    .filter(([key]) => key.startsWith(folder) && IMAGE_PATTERN.test(key))
    .map(([key, real]) => ({ real, name: simple(stripExtension(key.split('/').pop())) }))
    .sort((a, b) => rank(a.real) - rank(b.real));

  const wanted = names.map(simple).filter(Boolean);

  for (const name of wanted) {
    const exact = files.find((file) => file.name === name);
    if (exact) return encodeURI(exact.real);
  }
  for (const name of wanted) {
    const partial = files.find((file) => file.name.includes(name));
    if (partial) return encodeURI(partial.real);
  }
  return '';
}

function resolveIcons(container = document) {
  container.querySelectorAll('[data-icon-id]').forEach(async (holder) => {
    const own = holder.dataset.iconFile;
    const url = own
      ? await resolveAsset(own)
      : await findIconFile([holder.dataset.iconId, holder.dataset.iconName]);

    if (url) holder.innerHTML = `<img class="social-img" src="${url}" alt="">`;
  });
}
