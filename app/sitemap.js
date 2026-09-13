const siteUrl = 'https://balloonspace.in';

export default function sitemap() {
  const routes = [
    '/',
    '/about',
    '/bunting',
    '/inquiry',
    '/location',
    '/search',
    '/themes',
    '/manage',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
