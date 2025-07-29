import Image from "next/image";
import fs from "fs";
import path from "path";

export default async function Lookbook() {
  const dir = path.join(process.cwd(), "public", "lookbook");
  let images: string[] = [];
  try {
    images = await fs.promises.readdir(dir);
  } catch {
    images = [];
  }

  return (
    <main className="section-light min-h-screen px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-2">LOOKBOOK</h1>
      <p className="text-center text-gray-600 mb-8">Explore our latest pieces.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {images.map((src) => (
          <div key={src} className="overflow-hidden rounded-lg">
            <Image
              src={`/lookbook/${src}`}
              alt="Lookbook image"
              width={800}
              height={800}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </main>
  );
}

