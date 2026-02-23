import "./globals.css";
import Navbar from "../components/Navbar";
import AutoClubHeader from "../components/AutoClubHeader";

export const metadata = {
  title: {
    default: "Bweeng Celtic FC",
    template: "%s | Bweeng Celtic FC",
  },
  description: "Official website of Bweeng Celtic FC",
  icons: {
    icon: "/crest.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen flex flex-col">
        <Navbar />
        <AutoClubHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
