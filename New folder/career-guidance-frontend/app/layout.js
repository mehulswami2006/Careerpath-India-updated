import "../styles/globals.css";

export const metadata = {
  title: "CareerAI – Guidance & Tutor Platform",
  description: "AI-powered career guidance and private tutoring platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body>{children}</body>
    </html>
  );
}
