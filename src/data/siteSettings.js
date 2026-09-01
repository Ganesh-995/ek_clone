import defaultProducts from './products.json' with { type: 'json' };

export const defaultHeroImages = [
  '/images/butterfly.png',
  '/images/turtle.png',
  '/images/box.png',
  '/images/hotair.png'
];

export const defaultHangerCards = defaultProducts.slice(0, 20).map(({ image, title, description }) => ({
  image,
  title,
  description: description || ''
}));