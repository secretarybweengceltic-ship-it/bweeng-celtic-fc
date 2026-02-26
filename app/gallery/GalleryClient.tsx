"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

type GalleryImage = {
  src: string;
  name: string;
};

export default function GalleryClient({
  images,
}: {
  images: GalleryImage[];
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const closeModal = () => setSelectedIndex(null);

  const goNext = () => {
    if (selectedIndex === null) return;
    if (selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goPrev = () => {
    if (selectedIndex === null) return;
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  // Keyboard support (desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  // Swipe support (mobile)
  const swipeHandlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    trackMouse: true,
  });

  return (
    <main className="min-h-screen bg-black text-white p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-center">
        Club Gallery
      </h1>

      {/* Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="cursor-pointer bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <div className="relative w-full h-40 sm:h-72">
              <Image
                src={image.src}
                alt={image.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <div
          {...swipeHandlers}
          className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center z-50"
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-5 right-6 text-white text-3xl"
          >
            ✕
          </button>

          {/* Desktop Arrows */}
          <div className="hidden sm:block">
            {selectedIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-5xl"
              >
                ←
              </button>
            )}

            {selectedIndex < images.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-5xl"
              >
                →
              </button>
            )}
          </div>

          {/* Image */}
          <div className="relative w-full max-w-6xl h-[70vh] sm:h-[80vh] px-4">
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].name}
              fill
              className="object-contain"
            />
          </div>

          {/* Mobile Bottom Controls */}
          <div className="flex sm:hidden gap-10 mt-6">
            {selectedIndex > 0 && (
              <button
                onClick={goPrev}
                className="text-white text-3xl"
              >
                ←
              </button>
            )}

            {selectedIndex < images.length - 1 && (
              <button
                onClick={goNext}
                className="text-white text-3xl"
              >
                →
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
