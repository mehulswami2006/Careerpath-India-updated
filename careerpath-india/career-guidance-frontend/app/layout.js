import '../styles/globals.css';
import ThemeInit from '../components/ThemeInit';

export const metadata = {
  title: 'CareerPath India - AI Career Guidance & Tutor Platform',
  description: 'India\'s premier AI-powered career guidance and tutor hiring platform for students.',
  keywords: 'career guidance, tutor hiring, aptitude test, career recommendation, India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
