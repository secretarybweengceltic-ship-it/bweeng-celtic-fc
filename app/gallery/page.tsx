import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default async function GalleryPage() {
  // Get list of files from "gallery" bucket
  const { data, error } = await supabase.storage
    .from("gallery")
    .list("", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    console.error(error);
    return <p className="text-red-500">Failed to load gallery.</p>;
  }

  // Build public URLs
  const images =
    data?.map((file) => {
      const { data: publicUrl } = supabase.storage
        .from("gallery")
        .getPublicUrl(file.name);

      return {
        src: publicUrl.publicUrl,
        name: file.name,
      };
    }) || [];

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Club Gallery
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
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
    </main>
  );
}
