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
  const [downloading, setDownloading]   = useState(false);
  const [progress, setProgress]         = useState(0);

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
      alert('Failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Download with progress bar
  const handleDownload = async () => {
    if (!generatedUrl) return;
    setDownloading(true);
    setProgress(0);

    // Fake smooth progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + Math.random() * 15;
      });
    }, 150);

    try {
      const res = await fetch(generatedUrl);
      const blob = await res.blob();
      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'meme.jpg';
        a.click();
        setDownloading(false);
        setProgress(0);
      }, 600);
    } catch {
      clearInterval(interval);
      // fallback
      window.open(generatedUrl, '_blank');
      setDownloading(false);
      setProgress(0);
    }
  };

  const currentDisplayUrl = generatedUrl || initialUrl;
  const allFilled = texts.every((t) => t.trim().length > 0);

  return (
    <div className="min-h-screen bg-[#0c0c0f]">

      {/* Glow BG */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-yellow-500/8 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/6 rounded-full blur-[110px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-yellow-600/4 rounded-full blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* ── Navbar row ── */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => router.push('/')}
            className="group inline-flex items-center gap-3 text-zinc-400 hover:text-yellow-400 transition-colors duration-200"
          >
            <span className="w-9 h-9 rounded-full border border-zinc-700 group-hover:border-yellow-400/60 group-hover:bg-yellow-400/5 flex items-center justify-center text-lg transition-all">
              ←
            </span>
            <span className="text-sm font-semibold tracking-wide">Back to Templates</span>
          </button>

          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
            Meme Studio
          </div>
        </div>

        {/* ── Title ── */}
        <div className="mb-10">
          <h1
            className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {initialName || 'Create Your Meme'}
          </h1>
          <p className="text-zinc-500 text-sm">
            Fill in the text boxes below → hit Generate → download your meme 
          </p>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── LEFT: Preview ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-4 rounded-full bg-yellow-400" />
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Live Preview</p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 relative group">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-400/40 rounded-tl-2xl z-10" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-400/40 rounded-tr-2xl z-10" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-400/40 rounded-bl-2xl z-10" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-400/40 rounded-br-2xl z-10" />

              <div className="min-h-[380px] flex items-center justify-center p-6">
                {currentDisplayUrl ? (
                  <img
                    src={currentDisplayUrl}
                    alt="Meme Preview"
                    className="max-w-full max-h-[480px] object-contain rounded-xl shadow-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Loading template...</p>
                  </div>
                )}
              </div>

              {/* Generating overlay */}
              {loading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl z-20 gap-4">
                  <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent animate-spin rounded-full" />
                  <p className="text-white font-bold text-sm tracking-wide">Generating your meme...</p>
                  <p className="text-zinc-400 text-xs">This takes just a second</p>
                </div>
              )}
            </div>

            {/* ── Download Section ── */}
            {generatedUrl && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">

                {/* Progress bar */}
                {downloading && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span className="font-semibold">Downloading...</span>
                      <span className="font-black text-yellow-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${progress}%`,
                          background: "linear-gradient(90deg, #facc15, #f97316)",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {/* Download button */}
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-black uppercase tracking-wider hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-400/20 transition-all disabled:opacity-60 disabled:scale-100"
                    style={{ background: "linear-gradient(135deg, #facc15, #f97316)" }}
                  >
                    {downloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        {/* Download icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Download Meme
                      </>
                    )}
                  </button>

                  {/* Reset button */}
                  <button
                    onClick={() => setGeneratedUrl(null)}
                    className="px-5 py-3 rounded-xl border border-zinc-700 text-zinc-400 font-bold text-sm hover:border-red-500/50 hover:text-red-400 transition-colors"
                  >
                    ✕ Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/*RIGHT Form  */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-4 rounded-full bg-yellow-400" />
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Add Your Text</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
                {texts.map((text, index) => (
                  <div key={index} className="group/input">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-yellow-400/80">
                        ✦ Box {index + 1}
                      </label>
                      {text.trim() && (
                        <span className="text-[10px] text-green-400 font-bold">✓ Ready</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => {
                        const newTexts = [...texts];
                        newTexts[index] = e.target.value;
                        setTexts(newTexts);
                      }}
                      placeholder={`Enter text for box ${index + 1}...`}
                      className="w-full bg-zinc-800/80 border border-zinc-700 focus:border-yellow-400/60 focus:bg-zinc-800 text-white rounded-xl px-4 py-3.5 outline-none transition-all text-sm placeholder:text-zinc-600"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2 px-1">
                {texts.map((t, i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background: t.trim()
                        ? "linear-gradient(90deg, #facc15, #f97316)"
                        : "#27272a",
                    }}
                  />
                ))}
              </div>
              <p className="text-zinc-600 text-xs px-1">
                {texts.filter(t => t.trim()).length} of {boxCount} boxes filled
              </p>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading || !allFilled}
                className="w-full py-4 rounded-xl font-black text-base text-black uppercase tracking-wider transition-all disabled:opacity-40 disabled:scale-100 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-400/25"
                style={{ background: "linear-gradient(135deg, #facc15 0%, #f97316 100%)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full" />
                    Generating...
                  </span>
                ) : (
                  '✦ Generate Meme'
                )}
              </button>

              <p className="text-center text-zinc-700 text-xs">
                Powered by imgflip API · Free & instant
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function GenerateMeme() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MemeEditorContent />
    </Suspense>
  );
}