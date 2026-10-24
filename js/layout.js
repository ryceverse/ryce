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

// ---------- Footer: logo + social icons ----------
function renderFooter() {
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

  return `
    <img class="foot-logo" src="images/ryceverse-icon.webp" alt="Ryceverse logo">
    <ul class="footer-links">${socialLinks}</ul>
    <small>© ${new Date().getFullYear()}</small>`;
}

// ---------- Put everything on the page ----------
document.getElementById('site-header').innerHTML = renderHeader() + renderNavigation();
document.getElementById('site-footer').innerHTML = renderFooter();
initNavigation();
