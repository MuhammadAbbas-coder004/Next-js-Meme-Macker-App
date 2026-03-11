import Image from "next/image";
import React from "react";
import Button from "./component/Button";

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
    <div className="min-h-screen bg-[#0c0c0f]">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pb-20 pt-16">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-20 left-20 w-[300px] h-[300px] bg-orange-600/8 rounded-full blur-[100px]" />
          <div className="absolute top-10 right-20 w-[250px] h-[250px] bg-yellow-400/8 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-full mb-10">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            100+ Free Templates
          </div>

          {/* Heading */}
          <h1 className="text-7xl md:text-[100px] font-black leading-none tracking-tighter mb-6 text-white"
            style={{ fontFamily: "Georgia, serif" }}>
            Create
            <br />
            <span style={{
              backgroundImage: "linear-gradient(135deg, #facc15 0%, #f97316 50%, #ef4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Viral Memes
            </span>
          </h1>

          <p className="text-zinc-400 text-xl max-w-xl mx-auto leading-relaxed mb-12">
            Pick any template below, add your text, and download your meme instantly — completely free.
          </p>

          {/* Stats */}
          <div className="inline-flex items-center gap-0 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-4">
            {[
              { num: "100+", label: "Templates" },
              { num: "Free", label: "Always" },
              { num: "Fast", label: "Download" },
            ].map((s, i) => (
              <div key={s.label}
                className={`px-8 py-4 text-center ${i !== 2 ? "border-r border-zinc-800" : ""}`}>
                <div className="text-xl font-black text-yellow-400">{s.num}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION LABEL ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
          <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold tracking-widest uppercase">
            <span className="text-yellow-400">✦</span>
            Choose Your Meme
            <span className="text-yellow-400">✦</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
        </div>
      </div>

      {/* ── MEME GRID ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {memes.map((item) => (
            <div
              key={item.id}
              className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/10 flex flex-col"
            >
              {/* Fixed size image box - same for all cards */}
              <div className="relative w-full h-56 bg-zinc-950 flex items-center justify-center overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/0 via-yellow-400/0 to-yellow-400/0 group-hover:from-yellow-400/0 group-hover:via-yellow-400/5 group-hover:to-transparent transition-all duration-500" />

                {/* Box count badge */}
                <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {item.box_count} box
                </div>
              </div>

              {/* Card bottom */}
              <div className="p-3 border-t border-zinc-800 flex flex-col gap-2 flex-1">
                <h3 className="text-zinc-200 font-semibold text-xs leading-snug line-clamp-2">
                  {item.name}
                </h3>
                <Button
                  title="Make Meme →"
                  href={`/generatememe?url=${encodeURIComponent(item.url)}&id=${item.id}&boxCount=${item.box_count}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <div className="border-t border-zinc-800 py-8 text-center">
        <p className="text-zinc-600 text-xs tracking-widest uppercase">
          Meme Factory — Make the internet laugh
        </p>
      </div>

    </div>
  );
};

export default Page;