// =====================================================
// SUPPORT & DONATE (the section under "Find Me Online")
// -----------------------------------------------------
// visible : false  = hide the whole section
// title   : heading of the section
// text    : short sentence above the buttons (empty = hidden)
// buttons : any number of buttons, each { label, url, icon }
//           icon is optional: 'heart', or any id from icons.js
// qr      : the QR picture (any format: .png .jpg .webp .svg)
//           image = path, label = name under it, hint = small text
//           empty image = the QR card is hidden
// =====================================================

const support = {
  visible: true,
  title: 'Support & Donate',
  text: 'Enjoy the content? Support Ryceverse.',

  buttons: [
    { label: 'Donate via Saweria', url: 'https://saweria.co/ryceverse', icon: 'heart' },
  ],

  qr: {
    image: './assets/QR/QRIS - Fixs.Arts.jpg',
    label: 'QRIS',
    hint: 'Tap to enlarge',
  },
};
