'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function MemeEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialUrl  = searchParams.get('url')  || '';
  const initialName = searchParams.get('name') || '';
  const memeId      = searchParams.get('id')   || '';
  const boxCount    = parseInt(searchParams.get('boxCount') || searchParams.get('boxes') || '2');

  const [texts, setTexts]               = useState<string[]>(Array(boxCount).fill(''));
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('template_id', memeId);
    texts.forEach((text) => formData.append('texts', text));
    try {
      const response = await fetch('/api/caption', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) {
        setGeneratedUrl(data.data.url);
      } else {
        alert('Error: ' + (data.error_message || 'Failed to generate meme'));
      }
    } catch (err) {
      console.error(err);
      alert('Failed. Check your .env.local credentials.');
    } finally {
      setLoading(false);
    }
  };

  const currentDisplayUrl = generatedUrl || initialUrl;

  return (
    <div className="min-h-screen p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity"
        >
          ← Back to Gallery
        </button>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Preview */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="min-h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden">
                {currentDisplayUrl ? (
                  <img
                    src={currentDisplayUrl}
                    alt="Meme Preview"
                    className="max-w-full max-h-[500px] object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-xs font-bold opacity-20">LOADING TEMPLATE...</p>
                  </div>
                )}
              </div>

              {loading && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-2xl z-10">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 shadow-lg flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full" />
                    <span className="text-sm font-bold">Creating...</span>
                  </div>
                </div>
              )}
            </div>

            {generatedUrl && (
              <div className="flex gap-3">
                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-indigo-600 text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                >
                  Download
                </a>
                <button
                  onClick={() => setGeneratedUrl(null)}
                  className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{initialName || 'Create Meme'}</h2>
              <p className="text-sm opacity-50">Enter text below to generate your meme.</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid gap-3">
                {texts.map((text, index) => (
                  <div key={index} className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-bold opacity-40">
                      BOX {index + 1}
                    </label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => {
                        const newTexts = [...texts];
                        newTexts[index] = e.target.value;
                        setTexts(newTexts);
                      }}
                      placeholder={`Text ${index + 1}`}
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm"
                      required
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-base hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Meme'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function GenerateMeme() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MemeEditorContent />
    </Suspense>
  );
}