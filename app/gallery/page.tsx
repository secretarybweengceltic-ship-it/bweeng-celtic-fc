"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type GalleryImage = {
  src: string;
  name: string;
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadImages() {
      const { data, error } = await supabase.storage
        .from("gallery")
        .list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });
  
      console.log("Supabase data:", data);
      console.log("Supabase error:", error);
  
      if (error) {
        console.error("Error loading images:", error);
        return;
      }
  
      const urls =
        data?.map((file) => {
          const { data } = supabase.storage
            .from("gallery")
            .getPublicUrl(file.name);
  
          return {
            src: data.publicUrl,
            name: file.name,
          };
        }) || [];
  
      console.log("Generated URLs:", urls);
  
      setImages(urls);
    }
  
    loadImages();
  }, []);


  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Club Gallery
      </h1>

      {/* Gallery Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(image.src)}
            className="cursor-pointer bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <div className="relative w-full h-72">
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

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
        >
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={selectedImage}
              alt="Selected"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
