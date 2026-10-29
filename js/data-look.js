// =====================================================
// LOOK: icons and social card backgrounds
// -----------------------------------------------------
// Everything here can be changed without touching other files.
// =====================================================

const look = {

  // ---------- Icons (social media, support, footer) ----------
  icons: {
    // Folder with your icon pictures. A picture is found by its NAME
    // (youtube.png, YouTube.svg, "icon youtube.webp" ...), any format, any upper/lower case.
    // No picture found = the built-in simple icon is used.
    // One special icon: write  icon: './assets/Icon/other-name.png'  in data-socials.js
    folder: './assets/Icon/',

    // Colour of ALL icons:
    //   'white'    = white
    //   'black'    = black
    //   'original' = the colours of the picture itself
    color: 'white',

    // Different colour for single icons, for example:
    //   { youtube: 'original', discord: 'black' }
    // (a social entry can also have  iconColor: 'original'  in data-socials.js)
    colors: {  
      hoyolab: 'original',
      discord: 'original',
      tiktok: 'original',
            },
  },

  // ---------- Background picture of every social card ("Find Me Online") ----------
  // Replace the files (or paths) whenever you like. Any format works.
  // A social entry with  thumb: '...'  in data-socials.js wins over this list.
  // 'default' is used for every platform that is not in the list.
  socialBackgrounds: {
    youtube: './assets/Social/youtube.webp',
    tiktok: './assets/Social/tiktok.webp',
    instagram: './assets/Social/instagram.webp',
    facebook: './assets/Social/facebook.webp',
    hoyolab: './assets/Social/hoyolab.webp',
    discord: './assets/Social/discord.webp',
    default: './assets/Social/default.webp',
  },

  // ---------- Profile borders (the decorative ring around the profile picture) ----------
  // Every game has its own switch in data-games.js (profile.frame). These are the master switches.
  frames: {
    enabled: true,   // false = hide the border on EVERY game
    sparkle: true,   // false = no twinkling lights on EVERY border
    sparkleSize: 1,  // size of the twinkling lights on EVERY border: 1 = standard, 1.5 = bigger, 0.7 = smaller
  },

  // ---------- Badges next to the name (verified ...) ----------
  // Every game can pick its own badge picture + size in data-games.js (profile.badges).
  // These are only the DEFAULTS.
  badges: {
    color: 'original',   // 'original' | 'white' | 'black'
    size: 24,            // default height of the badge in px (standard)
    x: 0,                // default position: + = right, - = left (px)
    y: 0,                // default position: + = DOWN, - = up (px). Each badge can have its own x / y in data-games.js
  },

  // ---------- Profile picture (defaults, every game can override in data-games.js) ----------
  avatar: {
    shape: 'circle',     // 'circle' | 'square' | 'rounded'
    size: 128,           // size on desktop in px (standard). Phones shrink it automatically.
  },
};
