'use client';

import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SizeFinder from '@/components/finder/SizeFinder';

function FinderLoading() {
  return (
    <div className="max-w-5xl mx-auto py-20 text-center space-y-4">
      <div className="w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mx-auto" />
      <span className="font-mono text-xs uppercase tracking-widest text-[#6E6D68]">
        Loading Calibration Engine...
      </span>
    </div>
  );
}

export default function FinderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8 mb-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
              Universal Garment Matcher
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#121212] tracking-tight">
              Cross-Brand Size Finder
            </h1>
            <p className="text-xs text-[#6E6D68] max-w-lg mx-auto leading-relaxed">
              Select any fashion house and garment category. FITSYNC compares your stored physical
              measurements against verified manufacturer grading charts and pattern ease.
            </p>
          </div>

          <Suspense fallback={<FinderLoading />}>
            <SizeFinder />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
