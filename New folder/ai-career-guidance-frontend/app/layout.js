import "./globals.css";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }) {

  return (
    <html>
      <body className="bg-gray-100">

        <Navbar />

        <div className="p-6">
          {children}
        </div>

      </body>
    </html>
  );
}
