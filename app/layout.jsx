import './globals.css';

export const metadata = {
  metadataBase: new URL('https://balloonspace.in'),
  title: {
    default: 'The Balloon Space | Balloon Decorations & Party Themes',
    template: '%s | The Balloon Space',
  },
  description:
    'Discover beautiful balloon decorations, party themes and celebration ideas from The Balloon Space. Create memorable moments for birthdays, weddings and every special event.',
  keywords: [
    'balloon decoration',
    'party decoration',
    'birthday decoration',
    'balloon themes',
    'event decoration',
    'The Balloon Space',
  ],
  applicationName: 'The Balloon Space',
  authors: [{ name: 'The Balloon Space' }],
  creator: 'The Balloon Space',
  publisher: 'The Balloon Space',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/images/new_logo.webp',
    apple: '/images/new_logo.webp',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://balloonspace.in',
    siteName: 'The Balloon Space',
    title: 'The Balloon Space | Balloon Decorations & Party Themes',
    description:
      'Beautiful balloon decorations, party themes and celebration ideas for birthdays, weddings and special events.',
    images: [
      {
        url: '/images/new_logo.webp',
        width: 512,
        height: 512,
        alt: 'The Balloon Space logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'The Balloon Space | Balloon Decorations & Party Themes',
    description:
      'Beautiful balloon decorations and party themes for every special celebration.',
    images: ['/images/new_logo.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
