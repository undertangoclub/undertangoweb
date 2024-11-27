import "./globals.css";

export const metadata = {
  title: "UnderTango Club",
  description: "Cosmología de integrantes de UnderTango Club",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="bg-gray-900">{children}</body>
    </html>
  );
}
