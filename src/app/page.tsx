'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRANDS } from '@/lib/data/brands';
import { recommendSize } from '@/lib/sizing/engine';
import {
  ArrowRight,
  ShieldCheck,
  Ruler,
  ChevronDown,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  // Interactive Hero Preview State (defaults to prompt's archetype: 175cm, 96cm chest, 82cm waist)
  const [heroChest, setHeroChest] = useState(96);
  const [heroWaist, setHeroWaist] = useState(82);

  // Dynamic recommendations for the hero interactive widget
  const previewZara = recommendSize({
    brandId: 'zara',
    category: 'tops',
    measurements: {
      height: 175,
      chest: heroChest,
      waist: heroWaist,
      shoulder: 44,
      hip: 98,
      inseam: 80,
      gender: 'menswear',
      fitPreference: 'regular',
      unit: 'cm',
    },
  });

  const previewHM = recommendSize({
    brandId: 'hm',
    category: 'tops',
    measurements: {
      height: 175,
      chest: heroChest,
      waist: heroWaist,
      shoulder: 44,
      hip: 98,
      inseam: 80,
      gender: 'menswear',
      fitPreference: 'regular',
      unit: 'cm',
    },
  });

  const previewUniqlo = recommendSize({
    brandId: 'uniqlo',
    category: 'tops',
    measurements: {
      height: 175,
      chest: heroChest,
      waist: heroWaist,
      shoulder: 44,
      hip: 98,
      inseam: 80,
      gender: 'menswear',
      fitPreference: 'regular',
      unit: 'cm',
    },
  });

  const previewLevis = recommendSize({
    brandId: 'levis',
    category: 'bottoms',
    measurements: {
      height: 175,
      chest: heroChest,
      waist: heroWaist,
      shoulder: 44,
      hip: 98,
      inseam: 80,
      gender: 'menswear',
      fitPreference: 'regular',
      unit: 'cm',
    },
  });

  // Accordion FAQ states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does FITSYNC differ from standard brand size charts?',
      a: 'Standard size charts only show raw body ranges. They completely ignore garment ease (the intentional slack designed into clothing for movement and silhouette) and fit preferences. FITSYNC accounts for garment ease, shoulder drop, torso length, and individual brand grading tendencies (e.g., Zara’s narrower European armscye vs. Uniqlo’s boxy straight drop).',
    },
    {
      q: 'Why am I an M in Zara but an L in H&M?',
      a: 'Fashion brands design for different target customer demographics and historical grading blocks. Zara cuts slimmer European silhouettes with narrower shoulders and tapered waists. H&M uses Scandinavian commercial grading with more relaxed ease through the torso, meaning someone with a 96cm chest will find an M trim in Zara, but might choose L in H&M depending on drape preference.',
    },
    {
      q: 'Do I have to re-enter my measurements every time I shop?',
      a: 'Never. With FITSYNC, you measure once. Your anatomical profile is stored securely in your private vault. Whenever you want to purchase from any brand, your profile is instantly cross-referenced against verified size charts.',
    },
    {
      q: 'How does FITSYNC handle garment ease vs body measurements?',
      a: 'Skin-to-tape dimensions are not the same as finished garment measurements. A shirt with a 96cm garment chest would be skin-tight on a 96cm chest. FITSYNC applies verified ease curves (+4cm to +6cm for slim, +6cm to +10cm for regular, and +12cm to +16cm for relaxed) to determine the exact pattern match.',
    },
    {
      q: 'Is my measurement data private?',
      a: '100% private. FITSYNC utilizes client-side encryption and Supabase Row Level Security (RLS). Only your authenticated session can access your body calibration profile.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-[#E8E6DF]">
          {/* Subtle editorial backdrop text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-[18vw] font-serif font-black text-[#F3F1EC]/60 whitespace-nowrap leading-none z-0">
            FITSYNC
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Editorial Headline & Value Prop */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 border border-[#121212] px-3 py-1 bg-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9F8253]" />
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#121212] font-semibold">
                    The Universal Fashion Sizing Engine
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#121212] tracking-tight leading-[1.05]">
                  One body. <br />
                  Every brand. <br />
                  <span className="font-editorial-italic font-normal">The perfect fit.</span>
                </h1>

                <p className="text-sm sm:text-base text-[#6E6D68] max-w-xl font-light leading-relaxed">
                  Stop guessing your size. Measure once and discover your perfect fit across Zara,
                  H&M, Uniqlo, Levi’s, and every global fashion house — calibrated with real garment ease.
                </p>

                {/* Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/finder"
                    className="inline-flex items-center justify-center px-8 py-4 text-xs uppercase tracking-[0.2em] bg-[#121212] text-[#FAF9F6] border border-[#121212] hover:bg-[#2B2B2B] transition-all shadow-md group font-medium"
                  >
                    <span>Find My Size</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/brands"
                    className="inline-flex items-center justify-center px-8 py-4 text-xs uppercase tracking-[0.2em] bg-white text-[#121212] border border-[#D8D6CF] hover:border-[#121212] transition-colors font-medium"
                  >
                    <span>Explore Brands</span>
                  </Link>
                </div>

                <Link
                  href="/translate"
                  className="inline-flex items-center text-xs text-[#6E6D68] hover:text-[#121212] transition-colors"
                >
                  <span>
                    No tape measure? Tell us a size you wear (like <span className="font-semibold">H&amp;M S</span>) and
                    we&apos;ll translate it to every brand
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 shrink-0" />
                </Link>

                {/* Sub-credibility ticker */}
                <div className="pt-8 border-t border-[#E8E6DF] flex flex-wrap items-center gap-6 text-[11px] font-mono text-[#6E6D68]">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Verified Brand Size Charts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-3.5 h-3.5 text-[#121212]" />
                    <span>Garment Ease Calibration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-[#9F8253]" />
                    <span>Zero Vanity Sizing Bias</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Real-Time Sizing Demonstration Card */}
              <div className="lg:col-span-5">
                <div className="bg-white border-2 border-[#121212] p-6 sm:p-8 shadow-2xl relative">
                  <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-4 mb-6">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#9F8253] block">
                        Live Engine Demo
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#121212]">
                        See Sizing Shift in Real-Time
                      </h3>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  </div>

                  {/* Interactive Sliders */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1 text-[#121212]">
                        <span>Chest Circumference:</span>
                        <span className="font-bold">{heroChest} cm</span>
                      </div>
                      <input
                        type="range"
                        min={86}
                        max={114}
                        value={heroChest}
                        onChange={(e) => setHeroChest(Number(e.target.value))}
                        className="w-full accent-[#121212] cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1 text-[#121212]">
                        <span>Waist Circumference:</span>
                        <span className="font-bold">{heroWaist} cm</span>
                      </div>
                      <input
                        type="range"
                        min={74}
                        max={102}
                        value={heroWaist}
                        onChange={(e) => setHeroWaist(Number(e.target.value))}
                        className="w-full accent-[#121212] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Dynamic Output Cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Zara */}
                    <div className="bg-[#FAF9F6] border border-[#E8E6DF] p-3 text-center">
                      <span className="text-[10px] uppercase font-serif tracking-wider text-[#6E6D68] block">
                        ZARA
                      </span>
                      <span className="font-serif text-3xl font-black text-[#121212] block my-0.5">
                        {previewZara?.recommendedSize ?? '—'}
                      </span>
                      <span className="text-[9px] font-mono text-[#9F8253] block">
                        {previewZara?.fitAssessment}
                      </span>
                    </div>

                    {/* H&M */}
                    <div className="bg-[#FAF9F6] border border-[#E8E6DF] p-3 text-center">
                      <span className="text-[10px] uppercase font-serif tracking-wider text-[#6E6D68] block">
                        H&M
                      </span>
                      <span className="font-serif text-3xl font-black text-[#121212] block my-0.5">
                        {previewHM?.recommendedSize ?? '—'}
                      </span>
                      <span className="text-[9px] font-mono text-[#9F8253] block">
                        {previewHM?.fitAssessment}
                      </span>
                    </div>

                    {/* Uniqlo */}
                    <div className="bg-[#FAF9F6] border border-[#E8E6DF] p-3 text-center">
                      <span className="text-[10px] uppercase font-serif tracking-wider text-[#6E6D68] block">
                        UNIQLO
                      </span>
                      <span className="font-serif text-3xl font-black text-[#121212] block my-0.5">
                        {previewUniqlo?.recommendedSize ?? '—'}
                      </span>
                      <span className="text-[9px] font-mono text-[#9F8253] block">
                        {previewUniqlo?.fitAssessment}
                      </span>
                    </div>

                    {/* Levi's */}
                    <div className="bg-[#FAF9F6] border border-[#E8E6DF] p-3 text-center">
                      <span className="text-[10px] uppercase font-serif tracking-wider text-[#6E6D68] block">
                        LEVI’S
                      </span>
                      <span className="font-serif text-3xl font-black text-[#121212] block my-0.5">
                        {previewLevis?.recommendedSize ?? '—'}
                      </span>
                      <span className="text-[9px] font-mono text-[#9F8253] block">
                        Numeric Waist
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#6E6D68] mt-4 leading-relaxed text-center">
                    The same individual requires different alpha sizes across brands due to
                    European vs Scandinavian vs Japanese grading standards.
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#E8E6DF]">
                    <Link
                      href="/onboarding"
                      className="w-full inline-flex items-center justify-center py-2.5 text-xs uppercase tracking-wider bg-[#121212] text-white hover:bg-[#2B2B2B] transition-colors"
                    >
                      <span>Lock In Your Real Measurements</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRAND COMPATIBILITY MARQUEE / DIRECTORY PREVIEW */}
        <section className="py-16 bg-white border-b border-[#E8E6DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
                Universal Brand Directory
              </span>
              <h2 className="font-serif text-3xl font-light text-[#121212]">
                Compatible With Every Wardrobe Standard
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {BRANDS.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/finder?brand=${brand.id}`}
                  className="p-4 bg-[#FAF9F6] border border-[#E8E6DF] hover:border-[#121212] hover:bg-white transition-all text-center group flex flex-col items-center justify-center"
                >
                  <span className="font-serif text-base font-bold uppercase tracking-wider text-[#121212] group-hover:scale-105 transition-transform">
                    {brand.name}
                  </span>
                  <span className="text-[9px] font-mono text-[#6E6D68] mt-1">
                    {brand.country}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/brands"
                className="text-xs uppercase tracking-[0.18em] text-[#121212] underline hover:text-[#9F8253] transition-colors font-medium"
              >
                Inspect All Size Charts & Brand Sizing Tendencies →
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (EDITORIAL 3-STEP NARRATIVE) */}
        <section id="how-it-works" className="py-24 bg-[#FAF9F6] border-b border-[#E8E6DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-b border-[#E8E6DF] pb-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
                  Methodology
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#121212] tracking-tight mt-1">
                  How FITSYNC Solves Sizing
                </h2>
              </div>
              <p className="text-xs text-[#6E6D68] max-w-md font-light leading-relaxed">
                We bridge the gap between body dimensions and garment patterns using transparent
                garment ease modeling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white border border-[#E8E6DF] p-8 space-y-4 hover:border-[#121212] transition-colors">
                <span className="font-serif text-4xl font-light text-[#9F8253]">01</span>
                <h3 className="font-serif text-xl font-medium text-[#121212]">
                  Measure Once with Visual Guidance
                </h3>
                <p className="text-xs text-[#6E6D68] leading-relaxed">
                  Enter your chest, waist, shoulder, hip, and inseam just once using our interactive
                  tailor illustration guide. No tape measure? You can also input well-fitting garment
                  measurements.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-[#E8E6DF] p-8 space-y-4 hover:border-[#121212] transition-colors">
                <span className="font-serif text-4xl font-light text-[#9F8253]">02</span>
                <h3 className="font-serif text-xl font-medium text-[#121212]">
                  Garment Ease & Cut Calibration
                </h3>
                <p className="text-xs text-[#6E6D68] leading-relaxed">
                  Skin measurements don’t match cloth. Our engine factors in intentional design ease
                  — whether slim (+3cm), regular (+8cm), or relaxed (+14cm) — and matches against
                  product-specific pattern files.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-[#E8E6DF] p-8 space-y-4 hover:border-[#121212] transition-colors">
                <span className="font-serif text-4xl font-light text-[#9F8253]">03</span>
                <h3 className="font-serif text-xl font-medium text-[#121212]">
                  Universal Sizing Everywhere
                </h3>
                <p className="text-xs text-[#6E6D68] leading-relaxed">
                  Instantly obtain your exact size recommendation across Zara, H&M, Uniqlo,
                  Levi’s, Nike, and more. Never guess, never order two sizes, never return.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY FITSYNC (THE INDUSTRY PROBLEM) */}
        <section className="py-24 bg-white border-b border-[#E8E6DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
                  The Sizing Crisis
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#121212] tracking-tight leading-tight">
                  Vanity sizing is broken. <br />
                  Data fixes it.
                </h2>
                <p className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed">
                  Over 40% of online apparel orders are returned due to incorrect fit.
                  Brands inflate their sizing labels to flatter egos, while European and Japanese
                  houses preserve traditional anatomical grading.
                </p>
                <p className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed">
                  FITSYNC cuts through brand marketing ambiguity with pure dimensional accuracy. We
                  measure the cloth against your body — so you wear clothes that actually fit.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E8E6DF]">
                  <div>
                    <span className="font-serif text-3xl font-bold text-[#121212] block">42%</span>
                    <span className="text-[10px] font-mono text-[#6E6D68] uppercase">
                      Online return rate
                    </span>
                  </div>
                  <div>
                    <span className="font-serif text-3xl font-bold text-[#121212] block">3.4x</span>
                    <span className="text-[10px] font-mono text-[#6E6D68] uppercase">
                      Brand variance
                    </span>
                  </div>
                  <div>
                    <span className="font-serif text-3xl font-bold text-[#121212] block">100%</span>
                    <span className="text-[10px] font-mono text-[#6E6D68] uppercase">
                      Measurement privacy
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                {/* Fashion editorial imagery card */}
                <div className="relative border border-[#E8E6DF] p-3 bg-[#FAF9F6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
                    alt="Editorial Fashion"
                    className="w-full h-96 object-cover grayscale"
                  />
                  <div className="p-4 bg-white border border-[#E8E6DF] mt-3">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#9F8253] block">
                      Fashion Tech Philosophy
                    </span>
                    <p className="font-serif text-sm italic text-[#121212] mt-1">
                      “True luxury is not a designer label. True luxury is a garment cut to your
                      exact physical proportions.”
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDITORIAL DEMO TESTIMONIALS */}
        <section className="py-24 bg-[#FAF9F6] border-b border-[#E8E6DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-16">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
                Customer Voices
              </span>
              <h2 className="font-serif text-3xl font-light text-[#121212]">
                Trusted by Discerning Shoppers
              </h2>
              <span className="text-[10px] font-mono text-[#9B9A93] uppercase tracking-wider block">
                (Demo Editorial Content)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    'I used to order both M and L from Zara and return whichever failed. FITSYNC accurately recommended Zara M while pointing me to Levi’s 32 waist with zero guesswork.',
                  author: 'Julian Vance',
                  role: 'Architect & Minimalist Dresser',
                  location: 'Berlin',
                },
                {
                  quote:
                    'The distinction between raw body measurements and garment ease is a revelation. Knowing that Uniqlo oversized tees already have +16cm ease saved me from sizing up needlessly.',
                  author: 'Elena Rostova',
                  role: 'Fashion Stylist',
                  location: 'Paris',
                },
                {
                  quote:
                    'Having my complete sizing passport across 8 brands in one single dashboard saves hours of checking conversion charts and return labels.',
                  author: 'Marcus Chen',
                  role: 'Creative Director',
                  location: 'Tokyo',
                },
              ].map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E8E6DF] p-8 flex flex-col justify-between space-y-6 hover:border-[#121212] transition-colors"
                >
                  <p className="font-serif text-sm leading-relaxed text-[#121212] italic">
                    “{t.quote}”
                  </p>

                  <div className="border-t border-[#E8E6DF] pt-4">
                    <span className="font-serif font-bold text-sm text-[#121212] block">
                      {t.author}
                    </span>
                    <span className="text-[11px] font-mono text-[#6E6D68] block mt-0.5">
                      {t.role} • {t.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-24 bg-white border-b border-[#E8E6DF]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-16">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
                Transparency
              </span>
              <h2 className="font-serif text-3xl font-light text-[#121212]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-[#E8E6DF] border-y border-[#E8E6DF]">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <span className="font-serif text-lg font-medium text-[#121212] group-hover:text-[#9F8253] transition-colors">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#6E6D68] transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#121212]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-[#6E6D68] leading-relaxed pt-3 font-light">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-24 bg-[#121212] text-[#FAF9F6] text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
              Begin Your Universal Fit Calibration
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-tight">
              Measure once. <br />
              Find your size everywhere.
            </h2>
            <p className="text-xs sm:text-sm text-[#9B9A93] max-w-lg mx-auto font-light leading-relaxed">
              Create your private body calibration passport now. No credit card required. Free for all
              shoppers.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/onboarding"
                className="px-8 py-4 text-xs uppercase tracking-[0.2em] bg-white text-[#121212] hover:bg-[#FAF9F6] transition-colors font-medium shadow-md w-full sm:w-auto"
              >
                Start Measurement Onboarding
              </Link>
              <Link
                href="/finder"
                className="px-8 py-4 text-xs uppercase tracking-[0.2em] border border-[#3A3A3A] text-white hover:border-white transition-colors font-medium w-full sm:w-auto"
              >
                Test Size Finder Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
