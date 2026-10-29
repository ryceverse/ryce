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
//   avatar    = round profile picture
//   name      = nickname      copyName: true adds a copy icon next to it
//   bio       = short text under the name
//   joined    = year shown as "Bergabung"
//   badges    = small icons next to the name, e.g. ['verified'] (picture: assets/Icon/Verified.png)
//               [] = no badge. Several are possible: ['verified', 'discord']
//   frame     = decorative border around the profile picture:
//                 image   : path of the border picture (empty = no border)
//                 show    : false = hide the border without deleting it
//                 sparkle : false = no twinkling lights on this border
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
      name: 'Ryce',
      copyName: false,
      bio: 'Hanya Pengembara yang lewat',
      joined: '2016',
      badges: ['verified'],  
      frame: {
        image: './assets/Genshin Impact/Border/Border1.webp',
        show: true,
        sparkle: true,
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
      name: 'Ryce',
      copyName: false,
      bio: 'Rehat Sejenak',
      joined: '2018',
      badges: [
        {
        icon: 'verified',
        file: './assets/Icon/Verified(White).png',
        title: 'Verified White',
        },
      ],
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
      name: 'Ryce',
      copyName: false,
      bio: 'Tournament MVP • Midlaner • 1st Place — MLBB Banjarmasin',
      joined: '2016',
      badges: ['verified'],
      frame: {
        image: './assets/Mobile Legends/Border/BorderMLBB.png',
        show: true,
        sparkle: true,
      },
      stats: [
        { label: 'ID', value: '97255743 (2504)', copy: '97255743' },
        { label: 'Rank', value: 'Mythical Immortal' },
        { label: 'Point', progress: 85, value:'1518' },
        
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
