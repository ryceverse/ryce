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

  heart: svgIcon(`
    <path d="M12 20s-7-4.400-7-10a4 4 0 0 1 7-2.600A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>`),
};

// Returns the icon for one social entry
function socialIcon(social) {
  if (social.icon) {
    return `<img class="social-img" data-asset="${esc(social.icon)}" alt="">`;
  }
  return ICONS[social.id] || esc(social.name[0]);
}
