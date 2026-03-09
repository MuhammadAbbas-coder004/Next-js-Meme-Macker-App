// app/generatememe/page.tsx
"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GenerateMeme = () => {
  const searchParams = useSearchParams();

  const url = searchParams.get("url") || "";
  const boxCount = parseInt(searchParams.get("boxCount") || "2"); // default 2 boxes

  // Input fields state
  const [texts, setTexts] = useState<string[]>(Array(boxCount).fill(""));

  // Update input text
  const handleChange = (i: number, value: string) => {
    const newTexts = [...texts];
    newTexts[i] = value;
    setTexts(newTexts);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Create Your Meme
      </h1>

      {url ? (
        <div className="relative bg-white rounded-xl shadow-md p-6 w-full max-w-md">
          {/* Meme Image */}
          <div className="relative w-full h-64">
            <Image
              src={url}
              alt="meme"
              fill
              className="object-cover rounded-md"
            />

            {/* Overlay Texts */}
            {texts.map((text, i) => (
              <div
                key={i}
                className="absolute left-1/2 text-white font-bold text-lg md:text-xl uppercase px-2 text-center"
                style={{
                  top: `${(i + 1) * (64 / (boxCount + 1))}px`, // spread vertically
                  transform: "translateX(-50%)",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                }}
              >
                {text}
              </div>
            ))}
          </div>

          {/* Input fields */}
          <div className="mt-4">
            {texts.map((text, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Text for box ${i + 1}`}
                value={text}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>

          {/* Optional: Save / Generate Button */}
          <button
            className="w-full mt-2 bg-indigo-600 text-white py-2.5 rounded-md hover:bg-indigo-700 transition font-medium"
            onClick={() => alert("This is a live preview. Text is already on image!")}
          >
            Done
          </button>
        </div>
      ) : (
        <p className="text-gray-500 mt-4 text-center">
          No meme selected. Please go back and choose a template.
        </p>
      )}
    </div>
  );
};

export default GenerateMeme;