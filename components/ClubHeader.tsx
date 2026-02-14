"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Child = {
  label: string;
  href: string;
};

type NavItem =
  | { label: string; href: string }
  | { label: string; children: Child[] };

export default function ClubHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "Club Info", href: "/club-info" },
      { label: "Committee", href: "/committee" },
      { label: "History", href: "/history" },
    ],
  },
  { label: "Announcements", href: "/announcements" },
  { label: "Gallery", href: "/gallery" },
  { label: "Social", href: "/social" },
  { label: "Registration", href: "/registration" },
  { label: "Contact", href: "/contact" },
];


  return (
    <header className="w-full">
      {/* Top info bar */}
      <div className="bg-[#0B2A6F] text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 py-2 flex justify-between">
          <div>Bweeng Celtic FC • Bweeng, Co. Cork</div>

          <div className="flex gap-3">
            <a href="#" className="hover:text-yellow-300">
              Facebook
            </a>
            <a href="#" className="hover:text-yellow-300">
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center">
          {/* Crest + name */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/crest.png"
              alt="Bweeng Celtic FC crest"
              width={50}
              height={50}
              priority
            />

            <div>
              <div className="text-xs text-gray-500">Official Club Site</div>
              <div className="font-extrabold text-lg text-[#0B2A6F]">
                BWEENG CELTIC FC
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="ml-auto hidden md:flex gap-6 font-bold">
            {nav.map((item) => {
              if ("children" in item) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <button className="text-[#0B2A6F] hover:text-yellow-500">
                      {item.label}
                    </button>

                    {openMenu === item.label && (
                      <div className="absolute bg-white border shadow rounded mt-2 min-w-[180px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 hover:bg-yellow-100"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[#0B2A6F] hover:text-yellow-500"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Admin button */}
          <Link
            href="/admin"
            className="ml-4 px-4 py-2 rounded font-extrabold bg-yellow-400 text-[#0B2A6F]"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
