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
