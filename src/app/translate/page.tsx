'use client';

import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SizeTranslator from '@/components/translator/SizeTranslator';

function TranslatorLoading() {
  return (
    <div className="py-20 text-center space-y-4">
      <div className="w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mx-auto" />
      <span className="font-mono text-xs uppercase tracking-widest text-[#6E6D68]">Loading size charts...</span>
    </div>
  );
}

export default function TranslatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
              Cross-Brand Size Translator
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#121212] tracking-tight">
              Wear an M at Zara? See your size everywhere.
            </h1>
            <p className="text-xs text-[#6E6D68] max-w-lg mx-auto leading-relaxed">
              Pick a category, brand, and the size that fits you. FITSYNC converts using
              category-specific measurements (chest, shoulder, waist, hip, sleeve, and length)
              against each brand&apos;s chart.
            </p>
          </div>

          <Suspense fallback={<TranslatorLoading />}>
            <SizeTranslator />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
