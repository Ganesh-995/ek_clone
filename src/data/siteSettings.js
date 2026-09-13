// NOTE: Hero images, hanger cards, products and themes are independent
// data sets managed separately from the Manage page. Do not derive one
// from another (e.g. do not slice defaultProducts for hanger cards) —
// that causes the same images/titles to show up on multiple card types.

export const defaultHeroImages = [
  '/images/butterfly.png',
  '/images/turtle.png',
  '/images/box.png',
  '/images/hotair.png',
  '/images/instagram-post-1.jpg',
  '/images/instagram-post-2.jpg',
  '/images/instagram-post-3.jpg',
  '/images/instagram-post-4.jpg',
  '/images/instagram-post-5.jpg',
  '/images/instagram-post-6.jpg'
];

export const defaultHangerCards = [
  { image: '/images/butterfly.png', title: 'Butterfly Hanger', description: 'Colorful butterfly cutout hangers for a whimsical touch.' },
  { image: '/images/turtle.png', title: 'Turtle Hanger', description: 'Playful turtle-shaped hangers for kids parties.' },
  { image: '/images/box.png', title: 'Gift Box Hanger', description: 'Gift box hangers to add a festive surprise element.' },
  { image: '/images/hotair.png', title: 'Hot Air Balloon Hanger', description: 'Hot air balloon hangers for a dreamy party backdrop.' },
  { image: '/images/instagram-post-7.jpg', title: 'Bunting Hanger', description: 'Bunting-style hangers strung together for entrances.' },
  { image: '/images/instagram-post-8.jpg', title: 'Garland Hanger', description: 'Garland hangers for a lush, layered decoration look.' }
];