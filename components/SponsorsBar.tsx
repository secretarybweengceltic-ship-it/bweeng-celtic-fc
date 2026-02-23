"use client";

import { useEffect, useState } from "react";

type Sponsor = {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string | null;
};

export default function SponsorsBar() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/sponsors", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setSponsors(json.sponsors ?? []);
    })();
  }, []);

  if (!sponsors.length) return null;

  return (
    <section className="bg-white border-y mt-8 py-6 overflow-hidden">
      <h2 className="text-center font-extrabold text-[#0B2A6F] mb-4">
        Our Sponsors
      </h2>

      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-track">
          {/* Group A */}
          <div className="marquee-group">
            {sponsors.map((s) => (
              <a
                key={`a-${s.id}`}
                href={s.website_url || "#"}
                target={s.website_url ? "_blank" : undefined}
                rel={s.website_url ? "noreferrer" : undefined}
                className="marquee-item"
                title={s.name}
                onClick={(e) => {
                  if (!s.website_url) e.preventDefault();
                }}
              >
                <img
                  src={s.logo_url}
                  alt={s.name}
                  className="h-12 w-32 object-contain"
                  draggable={false}
                />
              </a>
            ))}
          </div>

          {/* Group B (duplicate for seamless loop) */}
          <div className="marquee-group" aria-hidden="true">
            {sponsors.map((s) => (
              <a
                key={`b-${s.id}`}
                href={s.website_url || "#"}
                target={s.website_url ? "_blank" : undefined}
                rel={s.website_url ? "noreferrer" : undefined}
                className="marquee-item"
                title={s.name}
                onClick={(e) => {
                  if (!s.website_url) e.preventDefault();
                }}
              >
                <img
                  src={s.logo_url}
                  alt={s.name}
                  className="h-12 w-32 object-contain"
                  draggable={false}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}