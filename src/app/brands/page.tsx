'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BrandDirectory from '@/components/brands/BrandDirectory';

export default function BrandsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="border-b border-[#E8E6DF] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
                Sizing Intelligence Directory
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#121212] tracking-tight mt-1">
                Verified Fashion Houses
              </h1>
            </div>
            <p className="text-xs text-[#6E6D68] max-w-md font-light leading-relaxed">
              Explore European, Scandinavian, Japanese, and American sizing philosophies.
              Inspect verified manufacturer grading charts and calculate your exact size.
            </p>
          </div>

          <BrandDirectory />
        </div>
      </main>

      <Footer />
    </div>
  );
}
