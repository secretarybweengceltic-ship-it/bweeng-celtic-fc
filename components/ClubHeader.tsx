import Image from "next/image";

interface ClubHeaderProps {
  title: string;
  subtitle?: string;
}

export default function ClubHeader({ title, subtitle }: ClubHeaderProps) {
  return (
    <section className="relative">

      {/* Yellow outer */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400">

        {/* Blue inner */}
        <div className="bg-[#0B2A6F]/95">

          {/* Top stripe */}
          <div className="h-2 bg-yellow-400 w-full" />

          <div className="mx-auto max-w-7xl px-4 py-8 md:py-10 flex items-center gap-6">

            {/* Crest */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0
                            transition-transform duration-300 hover:scale-105
                            [filter:drop-shadow(0_0_10px_rgba(250,204,21,1))]">
              <Image
                src="/crest.png"
                alt="Bweeng Celtic FC crest"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Text */}
            <div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                {title}
              </h1>

              {/* Welcome text */}
              {subtitle && (
                <p className="mt-2 text-yellow-300 font-semibold">
                  {subtitle}
                </p>
              )}

              <div className="mt-3 h-2 w-32 bg-yellow-400 rounded" />

            </div>

          </div>

          {/* Bottom stripe */}
          <div className="h-2 bg-yellow-400 w-full" />

        </div>

      </div>

    </section>
  );
}
