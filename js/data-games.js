	// =====================================================
// GAME LIST
// -----------------------------------------------------
// Add a game      = copy one { ... } block and paste it below
// Hide a game     = visible: false
// Remove a game   = delete its { ... } block
// Change position = order (smaller number comes first)
// Show first      = featured: true
//
// background = big wallpaper behind the page
// cover      = small picture on the tile
// info       = rows in the detail popup (empty value = row is hidden)
//              copy: true adds a "Copy" button next to the value
// description= text under the info rows
// gallery    = pictures in the popup (click = big preview)
// video      = YouTube video ID (e.g. 'dQw4w9WgXcQ') or a file like './assets/clip.mp4'
// =====================================================

const games = [

  {
    id: 'genshin',
    title: 'Genshin Impact',
    genre: 'Action RPG',

    background: './assets/Genshin Impact/Wallpaper/Ronova.webp',
    cover: './assets/Genshin Impact/Wallpaper/Ronova.webp',

    info: [
      { label: 'Nickname', value: 'Ryce', copy: false },
      { label: 'UID', value: '820476661', copy: true },
      { label: 'Joined', value: '2016',},
    ],
    description: '',

    gallery: [
      './assets/Genshin Impact/foto1.jpg',
      './assets/Genshin Impact/foto2.jpg',
      './assets/Genshin Impact/foto3.jpg',
    ],
    video: '',
    url: '',

    visible: true,
    featured: true,
    order: 1,
  },

  {
    id: 'hsr',
    title: 'Honkai: Star Rail',
    genre: 'Turn-based RPG',

    background: './assets/Honkai Star Rail/Wallpaper/Herta.jpg',
    cover: './assets/Honkai Star Rail/Wallpaper/Herta.jpg',

    info: [
      { label: 'Nickname', value: 'Ryce', copy: false },
      { label: 'UID', value: '808783651', copy: true },
      { label: 'Joined', value: '2018', copy: false },
    ],
    description: '',

    gallery: [
      './assets/Honkai Star Rail/foto1.jpg',
      './assets/Honkai Star Rail/foto2.jpg',
      './assets/Honkai Star Rail/foto3.jpg',
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

    background: './assets/Mobile Legends/Wallpaper/Ling.jpg',
    cover: './assets/Mobile Legends/Wallpaper/Ling.jpg',

    info: [
      { label: 'Nickname', value: 'Ryce', copy: false },
      { label: 'ID', value: '97255743 (2504)', copy: true },
      { label: 'Joined', value: '2016',},
    ],
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

    info: [
      { label: 'Nickname', value: 'Ryce', copy: false },
      { label: 'Player Tag', value: '#C89RRY8', copy: true },
      { label: 'Joined', value: '2016', copy: false },
    ],
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

    background: './assets/Lost Saga/Wallpaper/foto1.webp',
    cover: './assets/Lost Saga/Cover/foto1.jpg',

    info: [
      { label: 'Nickname', value: 'LexusDarkTao', copy: true },
      { label: 'Joined', value: '2010', copy: false },
    ],
    description: '',

    gallery: [
      './assets/Lost Saga/foto1.jpg',
      './assets/Lost Saga/foto2.jpg',
      './assets/Lost Saga/foto3.jpg',
    ],
    video: '',
    url: '',

    visible: true,
    featured: true,
    order: 5,
  },	
	

];

// Only visible games, featured first, then by order
const getGames = () =>
  games
    .filter((game) => game.visible)
    .sort((a, b) => (b.featured - a.featured) || (a.order - b.order));
