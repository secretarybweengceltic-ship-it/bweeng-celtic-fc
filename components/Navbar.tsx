"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const SHOP_URL =
  "https://www.dssports.ie/collections/bweeng-celtic-fc?srsltid=AfmBOoogatzR0KXjpOPUvWOhmVu2WW6qYZneK1xEpvSaiYZsNFsIi2E5";
  const FACEBOOK_URL =
    "https://www.facebook.com/people/Bweeng-Celtic-FC/61579285980162/";
  const INSTAGRAM_URL = "https://www.instagram.com/bweeng_celtic_fc/";
  const TIKTOK_URL = "https://www.tiktok.com/@bweeng.celtic.fc";

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!mobileOpen) return;
      const target = e.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navLink = (href: string) =>
    `relative pb-1 font-bold transition-colors duration-200
     after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-full
     after:origin-left after:scale-x-0 after:bg-yellow-400
     after:transition-transform after:duration-300
     hover:after:scale-x-100
     ${
       isActive(href)
         ? "after:scale-x-100 text-[#061C4D]"
         : "text-[#0B2A6F]"
     }`;

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <nav ref={navRef} className="mx-auto max-w-7xl px-4">

        <div className="h-16 flex items-center justify-between">

          {/* Crest + Name */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/crest.png"
                alt="Bweeng Celtic FC crest"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-extrabold text-[#0B2A6F]">
              Bweeng Celtic FC
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">

            <ul className="flex items-center gap-6">

              <li>
                <Link href="/" className={navLink("/")}>
                  Home
                </Link>
              </li>

              <li>
                <Link href="/announcements" className={navLink("/announcements")}>
                  News
                </Link>
              </li>

              {/* About Dropdown */}
              <li className="relative group">

                <Link href="/about" className={navLink("/about")}>
                  About
                </Link>

                {/* hover bridge */}
                <div className="absolute left-0 top-full h-3 w-56" />

                <div className="absolute left-0 top-full hidden group-hover:block z-50 min-w-56 bg-white border rounded-xl shadow-md py-2">

                  <Link
                    href="/about"
                    className="block px-4 py-2 hover:bg-slate-100 font-semibold"
                  >
                    About
                  </Link>

                  <Link
                    href="/club-history"
                    className="block px-4 py-2 hover:bg-slate-100 font-semibold"
                  >
                    Club History
                  </Link>

                  <Link
                    href="/committee"
                    className="block px-4 py-2 hover:bg-slate-100 font-semibold"
                  >
                    Club Committee
                  </Link>

                  {/* FIXED Club Documents Link */}
                  <Link
                    href="/about/documents"
                    className="block px-4 py-2 hover:bg-slate-100 font-semibold"
                  >
                    Club Documents
                  </Link>

                </div>
              </li>

              <li>
                <Link href="/fixtures" className={navLink("/fixtures")}>
                  Fixtures
                </Link>
              </li>

              <li>
                <Link href="/gallery" className={navLink("/gallery")}>
                  Gallery
                </Link>
              </li>


<li>
  <a
    href={SHOP_URL}
    target="_blank"
    rel="noreferrer"
    className="relative pb-1 font-bold transition-colors duration-200
      after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-full
      after:origin-left after:scale-x-0 after:bg-yellow-400
      after:transition-transform after:duration-300
      hover:after:scale-x-100 text-[#0B2A6F]"
  >
    Club Shop
  </a>
</li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-4">

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition"
              >
                <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.6V12h2.6V9.8c0-2.6 1.6-4 3.9-4 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z"/>
                </svg>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition"
              >
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.8a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0z"/>
                </svg>
              </a>

              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition"
              >
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 3c.5 3 2.7 5.1 5.5 5.4V11c-1.9 0-3.7-.6-5.1-1.8v6.1c0 3.4-2.8 6.2-6.2 6.2S4.5 18.7 4.5 15.3s2.8-6.2 6.2-6.2c.4 0 .8 0 1.2.1v2.9c-.4-.2-.8-.3-1.2-.3-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3V3h2.5z"/>
                </svg>
              </a>

            </div>

            {/* Admin Button */}
            <Link
              href="/admin"
              className="bg-yellow-400 text-[#0B2A6F] font-extrabold px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Admin Login
            </Link>

          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden border px-3 py-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>

        </div>

        {/* Mobile Menu */}
        {mobileOpen && (

          <div className="md:hidden border-t pb-4 font-bold text-[#0B2A6F]">

            <Link href="/" onClick={closeMobile} className="block px-4 py-2 hover:bg-slate-50">Home</Link>

            <Link href="/announcements" onClick={closeMobile} className="block px-4 py-2 hover:bg-slate-50">News</Link>

            <Link href="/about" onClick={closeMobile} className="block px-4 py-2 hover:bg-slate-50">About</Link>

            <Link href="/club-history" onClick={closeMobile} className="block px-4 py-2 hover:bg-slate-50">Club History</Link>

            <Link href="/committee" onClick={closeMobile} className="block px-4 py-2 hover:bg-slate-50">Club Committee</Link>

            {/* FIXED Mobile Documents Link */}
            <Link href="/about/documents" onClick={closeMobile} className="block px-4 py-2 hover:bg-slate-50">
              Club Documents
            </Link>

            <Link href="/fixtures" onClick={closeMobile} className="block px-4 py-2 hover:bg-slate-50">Fixtures</Link>

            <Link href="/gallery" onClick={closeMobile} className="block px-4 py-2 hover:bg-slate-50">Gallery</Link>

            <a
  href={SHOP_URL}
  target="_blank"
  rel="noreferrer"
  onClick={closeMobile}
  className="block px-4 py-2 hover:bg-slate-50"
>
  Club Shop
</a>

          </div>

        )}

      </nav>
    </header>
  );
}