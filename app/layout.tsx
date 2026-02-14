import "./globals.css";
import ClubHeader from "../components/ClubHeader";

export const metadata = {
  title: "Bweeng Celtic FC",
  description: "Official club website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <ClubHeader />
        {children}
        <footer className="bg-white border-t">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Bweeng Celtic FC
          </div>
        </footer>
      </body>
    </html>
  );
}
