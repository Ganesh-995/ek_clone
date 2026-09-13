import defaultProducts from './products.json' with { type: 'json' };

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

export const defaultHangerCards = defaultProducts.slice(0, 20).map(({ image, title, description }) => ({
  image,
  title,
  description: description || ''
}));