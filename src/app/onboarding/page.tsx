'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MeasurementForm from '@/components/onboarding/MeasurementForm';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
              Precision Anatomical Protocol
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#121212] tracking-tight">
              Calibrate Your Measurements
            </h1>
            <p className="text-xs text-[#6E6D68] max-w-lg mx-auto leading-relaxed">
              Input your physical dimensions once. Our engine uses these numbers to calculate garment
              ease and match with verified manufacturer pattern files.
            </p>
          </div>

          <MeasurementForm onSavedRedirect="/finder" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
