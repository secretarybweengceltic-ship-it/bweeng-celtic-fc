import { supabase } from "@/lib/supabaseClient";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const { data, error } = await supabase.storage
    .from("gallery")
    .list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    console.error(error);
    return <p className="text-red-500">Failed to load gallery.</p>;
  }

  const images =
    data?.map((file) => {
      const { data } = supabase.storage
        .from("gallery")
        .getPublicUrl(file.name);

      return {
        src: data.publicUrl,
        name: file.name,
      };
    }) || [];

  return <GalleryClient images={images} />;
}
