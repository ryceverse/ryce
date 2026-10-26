// =====================================================
// SHARED LAYOUT: Header, Navigation, Footer
// Independent from the page content (main.js).
// =====================================================

// Safe text for HTML (used everywhere)
const esc = (text) =>
  String(text ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

// Three labels under the footer logo (each gets a small dot)
const FOOTER_TAGS = ['Gaming', 'Content', 'Community'];

// Text at the very bottom ({year} becomes the current year)
const FOOTER_COPYRIGHT = '© {year} Ryceverse. All Rights Reserved.';

// Menu links: [label, section id]
const NAV_LINKS = [
  ['Games', '#games'],
  ['Connect', '#connect'],
];

// ---------- Header ----------
function renderHeader() {
  return `
    <a class="logo" href="#top" aria-label="Ryceverse, back to top">
      <img src="images/ryceverse-wordmark.webp" alt="Ryceverse" height="24">
    </a>`;
}

// ---------- Navigation ----------
function renderNavigation() {
  const links = NAV_LINKS
    .map(([label, href]) => `<a href="${href}">${label}</a>`)
    .join('');

  return `
    <button class="nav-toggle" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav id="nav" class="nav" aria-label="Main">${links}</nav>`;
}

function initNavigation() {
  const button = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');

  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    button.setAttribute('aria-expanded', open);
    button.textContent = open ? 'Close' : 'Menu';
  };

  button.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') setOpen(false);
  });
}

// ---------- Footer: logo, labels, links, social icons, copyright (all centered) ----------
function renderFooter() {
  const tags = FOOTER_TAGS.map((tag) => `<li>${esc(tag)}</li>`).join('');

  const pageLinks = NAV_LINKS
    .map(([label, href]) => `<a href="${href}">${label}</a>`)
    .join('');

  const socialLinks = getSocials()
    .map((social) => `
      <li>
        <a class="foot-icon"
           href="${esc(social.url)}"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="${esc(social.name)}"
           title="${esc(social.name)}">
          ${socialIcon(social)}
        </a>
      </li>`)
    .join('');

  const copyright = FOOTER_COPYRIGHT.replace('{year}', new Date().getFullYear());

  return `
    <div class="foot-brand">
      <img class="foot-logo" src="images/ryceverse-wordmark.webp" alt="Ryceverse" height="36">
      <ul class="foot-tags">${tags}</ul>
    </div>

    <nav class="foot-nav" aria-label="Footer">${pageLinks}</nav>
    <ul class="footer-links">${socialLinks}</ul>
    <small class="foot-copy">${esc(copyright)}</small>`;
}

// ---------- Put everything on the page ----------
document.getElementById('site-header').innerHTML = renderHeader() + renderNavigation();
document.getElementById('site-footer').innerHTML = renderFooter();
resolveImages(document.getElementById('site-footer'));
initNavigation();
