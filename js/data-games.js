// =====================================================
// GAME LIST
// -----------------------------------------------------
// Add a game      = copy one { ... } block and paste it below
// Hide a game     = visible: false
// Remove a game   = delete its { ... } block
// Change position = order (smaller number comes first)
// Show first      = featured: true
//
// background  = big wallpaper behind the page (also the popup banner)
// cover       = small picture on the tile
// focus       = (optional) which part of the wallpaper stays visible,
//               e.g. focus: 'center top' or 'center 30%'
//
// profile     = the card in the detail popup. An empty value hides that part.
//   avatar    = profile picture (png / jpg / webp ...)
//   shape     = shape of the profile picture:  'circle' | 'square' | 'rounded'
//               (match it to the hole of the border: round border = 'circle', square border = 'square')
//   radius    = (optional) own corner roundness in %, 0 = square ... 50 = circle. Wins over shape.
//   size      = profile picture size in px (standard 128). Phones shrink it automatically.
//   name      = nickname      copyName: true adds a copy icon next to it
//   bio       = short text under the name
//   joined    = year shown as "Bergabung"
//   badges    = small icons next to the name. Every game can use a DIFFERENT picture + size:
//                 ['verified']                                   -> assets/Icon/Verified.png (found by name)
//                 ['./assets/Icon/Verified (White).png']         -> any file you write (png / jpg / webp / svg)
//                 [{ file: './assets/Icon/Verified (White).png', size: 28 }]   -> own file + own size (px)
//                 []                                             -> no badge
//                 [{ file: '...', title: 'Verified Player' }]  -> text in the box when the mouse is on the label
//               x / y = position in px: y: 3 = 3 px LOWER, y: -3 = higher, x: 4 = 4 px to the right
//                 [{ file: '...', y: 3 }]   (default for all: look.badges.x / y in data-look.js)
//               title = hover text (tap on phones). Empty '' = no box. Not written = 'Verified'.
//               size = height in px, standard 24 (width follows the picture). Several badges are possible.
//   frame     = decorative border around the profile picture:
//                 image   : path of the border picture (empty = no border)
//                 show    : false = hide the border without deleting it
//                 sparkle : false = no twinkling lights on this border
//                 size    : border width in px, FREE (any number). 0 = automatic (fits the hole by itself)
//                           the number is for the profile picture size above (size: 128) and grows/shrinks with it
//                 offsetX / offsetY : move the border in px, offsetX: 3 = 3 px right, offsetY: -2 = 2 px up
//                 sparkleSize : size of the twinkling lights, 1 = standard, 2 = twice as big, 0.5 = half
//                 scale / fill : only when size is 0 (automatic): scale 1 = standard, fill 0.98 = standard
//                 Easiest way to find the numbers: open tools/frame-tuner.html (live preview + copy the result)
//
// SIZE GUIDE (so editing is easy)
//   Profile picture file : 512 x 512 px, SQUARE (the site crops/shapes it). Minimum 256 x 256.
//   Profile picture show : size: 128 (standard) -> use 96 for small, 160 for big
//   Border file          : 512 x 512 up to 1024 x 1024 px, transparent PNG / WebP, hole in the middle,
//                          hole about 60 - 70% of the picture width. The hole is found automatically.
//   Border show size     : you decide: frame.size (px). Example: profile size 128 + border size 200.
//                          Not exactly in the middle? Move it with frame.offsetX / offsetY.
//   Badge picture file   : 256 x 256 px or bigger, transparent PNG. Show size: 24 px (standard).
//   stats     = rows under the bio:
//                 { label: 'UID', value: '123', copy: true }        -> copy icon (copies the value)
//                 { label: 'ID', value: '123 (45)', copy: '123' }   -> copy icon (copies only '123')
//                 { label: 'Skill', progress: 90 }                  -> bar (0 - 100)
//                 { label: 'Stats', progress: 85, value: '85 point' }
//                                                                   -> Stats  [bar]  85 point
//                 { label: 'Stats', progress: 85, value: '85 point', valueSide: 'left' }
//                                                                   -> Stats  85 point  [bar]
//
// description = text under the profile card
// gallery     = pictures in the popup (click = big preview)
// video       = YouTube link / video ID, or a file like './assets/clip.mp4'
//               (optional videoThumb: './assets/....jpg' = own thumbnail for a file)
// =====================================================

const games = [

  {
    id: 'genshin',
    title: 'Genshin Impact',
    genre: 'Action RPG',

    background: './assets/Genshin Impact/Wallpaper/Wallpaper.png',
    cover: './assets/Genshin Impact/Cover/Cover.png',

    profile: {
      avatar: './assets/Genshin Impact/Profile/Profile.png',
      shape: 'circle',
      size: 128,
      name: 'Ryce',
      copyName: false,
      bio: 'Hanya Pengembara yang lewat',
      joined: '2016',
      badges: [{ file: './assets/Icon/Verified.png', size: 20, title: 'Verified Genshin Player' }],
      frame: {
        image: './assets/Genshin Impact/Border/Border.png',
        show: true,
        sparkle: true,
        size: 0,          // border width in px (0 = automatic)
        offsetX: 0,
        offsetY: 0,
        sparkleSize: 1,   // size of the twinkling lights (1 = standard)
      },
      stats: [
        { label: 'UID', value: '820476661', copy: true },
        { label: 'AR', value: '60' },
        { label: 'Exprolasi', progress: 90 },
      ],
    },
    description: '',

    gallery: [
      './assets/Genshin Impact/foto1.jpg',
      './assets/Genshin Impact/foto2.jpg',
      './assets/Genshin Impact/foto3.jpg',
      './assets/Genshin Impact/foto4.jpg',
      './assets/Genshin Impact/foto5.jpg',
      './assets/Genshin Impact/foto6.jpg',
      './assets/Genshin Impact/foto7.jpg',
      './assets/Genshin Impact/foto8.jpg',
      './assets/Genshin Impact/foto9.jpg',
    ],
    video: 'https://youtu.be/1IBSFJGbla8?si=Stsn1mUCdnr1jvei',
    url: '',

    visible: true,
    featured: true,
    order: 1,
  },

  {
    id: 'hsr',
    title: 'Honkai: Star Rail',
    genre: 'Turn-based RPG',

    background: './assets/Honkai Star Rail/Wallpaper/foto1.jpg',
    cover: './assets/Honkai Star Rail/Cover/Cover.png',

    profile: {
      avatar: './assets/Honkai Star Rail/Profile/Profile.png',
      shape: 'circle',
      size: 128,
      name: 'Ryce',
      copyName: false,
      bio: 'Rehat Sejenak',
      joined: '2018',
      badges: [{ file: './assets/Icon/Verified (White).png', size: 20, title: 'Verified Honkai Player' }],
      frame: {
        image: '',
        show: true,
        sparkle: true,
      },
      stats: [
        { label: 'UID', value: '808783651', copy: true },
        { label: 'TL', value: '70' },
        { label: 'Exprolasi', progress: 70 },
      ],
    },
    description: '',

    gallery: [
      './assets/Honkai Star Rail/foto1.jpg',
      './assets/Honkai Star Rail/foto2.jpg',
      './assets/Honkai Star Rail/foto3.jpg',
      './assets/Honkai Star Rail/foto4.jpg',
      './assets/Honkai Star Rail/foto5.jpg',
      './assets/Honkai Star Rail/foto6.jpg',
      './assets/Honkai Star Rail/foto7.jpg',
      './assets/Honkai Star Rail/foto8.jpg',
      './assets/Honkai Star Rail/foto9.jpg',
    ],
    video: '',
    url: '',

    visible: true,
    featured: true,
    order: 2,
  },

  {
    id: 'mlbb',
    title: 'Mobile Legends: Bang Bang',
    genre: 'MOBA',

    background: './assets/Mobile Legends/Wallpaper/foto1.jpg',
    cover: './assets/Mobile Legends/Cover/foto1.jpg',

    profile: {
      avatar: './assets/Mobile Legends/Profile/Profile.png',
      shape: 'square',
      size: 128,
      name: 'Ryce',
      copyName: false,
      bio: 'Tournament MVP Midlaner • 1st Place — MLBB Banjarmasin',
      joined: '2016',
      badges: [{ file: './assets/Icon/TopGlobal.png', size: 20, title: 'Top Global Selena' }],
      frame: {
        image: './assets/Mobile Legends/Border/Stardom.png',
        show: true,
        sparkle: true,
        size: 0,          // border width in px (0 = automatic)
        offsetX: 0,
        offsetY: 0,
        sparkleSize: 1,   // size of the twinkling lights (1 = standard)
      },
      stats: [
        { label: 'ID', value: '97255743 (2504)', copy: '97255743' },
        { label: 'Rank', value: 'Mythical Immortal' },
        { label: 'Point', progress: 80, value:'1518' },
        
      ],
    },
    description: '',

    gallery: [
      './assets/Mobile Legends/foto1.jpg',
      './assets/Mobile Legends/foto2.jpg',
      './assets/Mobile Legends/foto3.jpg',
      './assets/Mobile Legends/foto4.jpg',
      './assets/Mobile Legends/foto5.jpg',
      './assets/Mobile Legends/foto6.jpg',
      './assets/Mobile Legends/foto7.jpg',
    ],
    video: '',
    url: '',

    visible: true,
    featured: true,
    order: 3,
  },

  {
    id: 'coc',
    title: 'Clash of Clans',
    genre: 'Strategy',

    background: './assets/Clash Of Clans/Wallpaper/Dragon Duke.webp',
    cover: './assets/Clash Of Clans/Wallpaper/Dragon Duke.webp',

    profile: {
      avatar: './assets/Clash Of Clans/Profile/Profile.png',
      shape: 'circle',
      size: 128,
      name: 'Ryce',
      copyName: false,
      bio: 'Hanya Pemain Biasa',
      joined: '2016',
      badges: ['verified'],
      frame: {
        image: '',
        show: true,
        sparkle: true,
      },
      stats: [
        { label: 'Player Tag', value: '#C89RRY8', copy: true },       
        { label: 'Town Hall', value: '17' },
        { label: 'Stats', progress: 80 },
      ],
    },
    description: '',

    gallery: [
      './assets/Clash Of Clans/foto1.jpg',
      './assets/Clash Of Clans/foto2.jpg',
      './assets/Clash Of Clans/foto3.jpg',
    ],
    video: '',
    url: '',

    visible: true,
    featured: true,
    order: 4,
  },

  {
    id: 'ls',
    title: 'Lost Saga',
    genre: 'Strategy',

    background: './assets/Lost Saga/Wallpaper/foto4.jpg',
    cover: './assets/Lost Saga/Cover/foto1.jpg',

    profile: {
      avatar: './assets/Lost Saga/Profile/Profile.png',
      shape: 'circle',
      size: 128,
      name: 'LexusDarkTao',
      copyName: true,
      bio: 'Selamat Istirahat COL!',
      joined: '2010',
      badges: [],
      frame: {
        image: '',
        show: true,
        sparkle: true,
      },
      stats: [
        { label: 'Rank', value: 'COL Class 2' },
        { label: 'Stats', progress: 90 },
      ],
    },
    description: '',

    gallery: [
      './assets/Lost Saga/foto1.jpg',
      './assets/Lost Saga/foto2.jpg',
      './assets/Lost Saga/foto3.jpg',
      './assets/Lost Saga/foto4.jpg',
      './assets/Lost Saga/foto5.jpg',
      './assets/Lost Saga/foto6.jpg',
      './assets/Lost Saga/foto7.jpg',
      './assets/Lost Saga/foto8.jpg',
    ],
    video: '',
    url: '',

    visible: true,
    featured: true,
    order: 5,
  },

  {
    id: 'chess',
    title: 'Chess',
    genre: 'Strategy',

    background: './assets/Chess/Wallpaper/foto1.jpg',
    cover: './assets/Chess/Cover/foto2.png',

    profile: {
      avatar: './assets/Chess/Profile/Profile.png',
      shape: 'circle',
      size: 128,
      name: 'fikrispt',
      copyName: true,
      bio: 'Mencoba Berfikir',
      joined: '2023',
      badges: [],
      frame: {
        image: '',
        show: true,
        sparkle: true,
      },
      stats: [
        { label: 'Rating', value: '1500' },
        { label: 'Skill', progress: 60 },  
      ],
    },
    description: '',

    gallery: [
      './assets/Chess/foto1.jpg',
      './assets/Chess/foto2.jpg',
      './assets/Chess/foto3.jpg',
    ],
    video: '',
    url: '',

    visible: true,
    featured: true,
    order: 6,
  },

];

// Only visible games, featured first, then by order
const getGames = () =>
  games
    .filter((game) => game.visible)
    .sort((a, b) => (b.featured - a.featured) || (a.order - b.order));
