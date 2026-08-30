import './globals.css';

export const metadata = {
  title: 'The Balloon Space',
  description: 'Event decoration and balloon showcase platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
