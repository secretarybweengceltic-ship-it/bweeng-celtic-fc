"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const closeModal = () => setSelectedIndex(null);

  const goNext = () => {
    if (selectedIndex === null) return;
    if (selectedIndex < images.length - 1) {
      setDirection("left");
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goPrev = () => {
    if (selectedIndex === null) return;
    if (selectedIndex > 0) {
      setDirection("right");
      setSelectedIndex(selectedIndex - 1);
    }
  };

  // Keyboard navigation
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

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) goNext();
    else if (distance < -minSwipeDistance) goPrev();
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        Club Gallery
      </h1>

      {/* Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3">
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
          className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center z-50 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close */}
          <button
            onClick={closeModal}
            className="absolute top-5 right-6 text-white text-3xl z-50"
          >
            ✕
          </button>

          {/* Animated Image Wrapper */}
          <div className="relative w-full max-w-6xl h-[70vh] sm:h-[80vh] px-4 flex items-center justify-center overflow-hidden">

            <div
              key={selectedIndex}
              className={`
                absolute inset-0 transition-all duration-300 ease-in-out
                ${direction === "left" ? "animate-slide-left" : ""}
                ${direction === "right" ? "animate-slide-right" : ""}
              `}
            >
              <Image
                src={images[selectedIndex].src}
                alt={images[selectedIndex].name}
                fill
                className="object-contain transition-opacity duration-300 opacity-100"
              />
            </div>

          </div>

          {/* Navigation */}
          <div className="flex justify-between w-full max-w-xs mt-8 px-8">
            <button
              onClick={goPrev}
              disabled={selectedIndex === 0}
              className="text-white text-4xl disabled:opacity-30"
            >
              ←
            </button>

            <button
              onClick={goNext}
              disabled={selectedIndex === images.length - 1}
              className="text-white text-4xl disabled:opacity-30"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes slideLeft {
          from {
            transform: translateX(40px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideRight {
          from {
            transform: translateX(-40px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-left {
          animation: slideLeft 0.3s ease-in-out;
        }

        .animate-slide-right {
          animation: slideRight 0.3s ease-in-out;
        }
      `}</style>
    </main>
  );
}
