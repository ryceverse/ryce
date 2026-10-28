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
    colors: {},
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
};
