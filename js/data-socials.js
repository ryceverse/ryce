// Edit url/username/thumb. visible:false = hide. order = position. category = group title.
// thumb: optional image, e.g. './images/youtube-thumb.jpg'
const socials = [
  { id: 'youtube', name: 'YouTube', category: 'Content', url: 'https://www.youtube.com/@ryceverse', username: '@ryceverse', thumb: '', visible: true, order: 1 },
  { id: 'tiktok', name: 'TikTok', category: 'Content', url: 'https://www.tiktok.com/@ryceverse', username: '@ryceverse', icon: 'assets/Icon/TikTok (White).png', thumb: '', visible: true, order: 2 },
  { id: 'instagram', name: 'Instagram', category: 'Social', url: 'https://www.instagram.com/ryceverse', username: '@ryceverse', thumb: '', visible: true, order: 3 },
  { id: 'facebook', name: 'Facebook', category: 'Social', url: 'https://www.facebook.com/profile.php?id=100087081587936', username: '', thumb: '', visible: true, order: 4 },
  { id: 'hoyolab', name: 'HoYoLAB', category: 'Gaming Community', url: 'https://www.hoyolab.com/accountCenter/postList?id=103093284', username: '', thumb: '', visible: true, order: 5 },
  { id: 'discord', name: 'Discord', category: 'Community', url: 'https://discord.gg/qfNTkhkaz', username: 'Join Discord', thumb: '', visible: true, order: 6 },
];
const validUrl = (u) => { try { return ['http:', 'https:'].includes(new URL(u).protocol); } catch { return false; } };
const getSocials = () => socials.filter((s) => s.visible && validUrl(s.url)).sort((a, b) => a.order - b.order);
