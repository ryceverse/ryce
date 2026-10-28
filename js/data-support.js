// =====================================================
// SUPPORT & DONATE (the section under "Find Me Online")
// -----------------------------------------------------
// visible : false = hide the whole section
// title   : heading     text : sentence under it (empty = hidden)
// cards   : any number of equal cards (2 cards = two equal columns).
//           Every card has:  title, text, icon, iconColor, button
//
//   type: 'link'  -> big icon tile + a button that opens a web page
//        background : (optional) picture behind the icon
//        button     : { label, url }
//
//   type: 'qr'    -> the QR picture + a button that opens it big (with Save)
//        image      : path to the QR picture (any format)
//        hint       : small text on the picture
//        button     : { label }
//
//   icon      : name of an icon (see look.icons.folder / icons.js), e.g. 'saweria', 'qr'
//   iconColor : (optional) 'white' | 'black' | 'original'
// =====================================================

const support = {
  visible: true,
  title: 'Support & Donate',
  text: 'Enjoy the content? Support Ryceverse.',

  cards: [
    {
      type: 'link',
      title: 'Saweria',
      text: 'Support through a quick donation.',
      icon: 'saweria',
      background: '',
      button: { label: 'Donate via Saweria', url: 'https://saweria.co/ryceverse' },
    },
    {
      type: 'qr',
      title: 'QRIS',
      text: 'Scan with any e-wallet or banking app.',
      icon: 'qr',
      image: './assets/QR/QRIS - Fixs.Arts.jpg',
      hint: 'Tap to enlarge',
      button: { label: 'View QR code' },
    },
  ],
};
