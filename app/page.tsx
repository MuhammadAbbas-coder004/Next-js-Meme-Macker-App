// app/page.tsx
import Image from "next/image";
import React from "react";
import Button from "./component/Button"; // Button import

type Meme = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
};

const Page = async () => {
  const data = await fetch("https://api.imgflip.com/get_memes");
  const res = await data.json();
  const memes: Meme[] = res.data.memes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 py-16 px-6">
      
      {/* Heading */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Meme Generator
        </h1>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Choose a template and start creating hilarious memes in seconds.
        </p>
      </div>

      {/* Meme Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {memes.map((item) => (
          <div
            key={item.id}
            className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
          >
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                src={item.url}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
                {item.box_count} boxes
              </div>
            </div>

            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
                {item.name}
              </h3>

              <div className="mt-4 h-[2px] w-12 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>

              {/* Button */}
              <Button
                title="Generate Meme"
                href={`/generatememe?url=${encodeURIComponent(item.url)}&id=${item.id}&boxCount=${item.box_count}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;