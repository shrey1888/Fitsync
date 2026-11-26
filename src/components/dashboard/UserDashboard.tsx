'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFitSync, DEFAULT_MEASUREMENTS } from '@/lib/store/useFitStore';
import { BRANDS } from '@/lib/data/brands';
import { ClothingCategory, BodyMeasurements, RecommendationResult } from '@/lib/types';
import { recommendSize } from '@/lib/sizing/engine';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import {
  Sliders,
  Bookmark,
  History,
  ArrowRight,
  Database,
  Lock,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserDashboard() {
  const { measurements, isLoaded, savedBrands, toggleSaveBrand, history } = useFitSync();

  const [activeMatrixCategory, setActiveMatrixCategory] = useState<ClothingCategory>('tops');
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const activeMeasurements: BodyMeasurements = measurements ?? DEFAULT_MEASUREMENTS;

  // Compute Universal Matrix recommendations for every brand that sells the category
  const matrixRecommendations = BRANDS.filter((brand) => brand.categories.includes(activeMatrixCategory))
    .map((brand) =>
      recommendSize({
        brandId: brand.id,
        category: activeMatrixCategory,
        measurements: activeMeasurements,
      })
    )
    .filter((rec): rec is RecommendationResult => rec !== null);

  const sqlSchemaSnippet = `-- Supabase RLS Schema for FITSYNC
CREATE TABLE public.body_measurements (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  height numeric(5,2) NOT NULL,
  chest numeric(5,2) NOT NULL,
  waist numeric(5,2) NOT NULL,
  shoulder numeric(5,2),
  hip numeric(5,2),
  inseam numeric(5,2),
  fit_preference text DEFAULT 'regular',
  unit text DEFAULT 'cm',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own measurements"
  ON public.body_measurements FOR ALL
  USING (auth.uid() = user_id);`;

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(sqlSchemaSnippet);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } catch {
      // Clipboard API unavailable (non-secure origin); the SQL block is selectable instead.
    }
  };

  if (!isLoaded) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mx-auto" />
        <span className="font-mono text-xs uppercase tracking-widest text-[#6E6D68]">Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Dashboard Editorial Header */}
      <div className="bg-white border border-[#E8E6DF] p-6 sm:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253]">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Measurement Vault</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#121212] tracking-tight mt-1">
            Universal Fit Passport
          </h1>
          <p className="text-xs text-[#6E6D68] mt-1 max-w-xl">
            One set of calibrated measurements matched across Zara, H&M, Uniqlo, Levi’s, and global
            fashion houses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Cloud Sync Status */}
          <button
            type="button"
            onClick={() => setShowSqlModal(true)}
            className="inline-flex items-center text-xs font-mono px-3.5 py-2 border border-[#E8E6DF] bg-[#FAF9F6] hover:border-[#121212] transition-colors"
          >
            <Database className="w-3.5 h-3.5 mr-2 text-[#9F8253]" />
            <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Ready'}</span>
          </button>

          <Link
            href="/onboarding"
            className="inline-flex items-center px-5 py-2.5 text-xs uppercase tracking-[0.16em] bg-[#121212] text-white hover:bg-[#2B2B2B] transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 mr-2" />
            <span>Calibrate Measurements</span>
          </Link>
        </div>
      </div>

      {/* SECTION 1: MY MEASUREMENTS BREAKDOWN */}
      <div className="bg-white border border-[#E8E6DF] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6DF] pb-4">
          <div>
            <h2 className="font-serif text-2xl text-[#121212] font-normal">
              My Stored Anatomical Dimensions
            </h2>
            <p className="text-xs text-[#6E6D68] mt-0.5">
              Verified metrics used by the recommendation engine for garment ease calculations.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="text-xs uppercase tracking-wider text-[#9F8253] hover:text-[#121212] underline self-start sm:self-center font-mono"
          >
            Update Values
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Chest / Bust', val: `${activeMeasurements.chest} cm`, note: 'Primary Anchor' },
            { label: 'Waist', val: `${activeMeasurements.waist} cm`, note: 'Natural navel line' },
            { label: 'Shoulders', val: `${activeMeasurements.shoulder} cm`, note: 'Biacromial width' },
            { label: 'Hip / Seat', val: `${activeMeasurements.hip} cm`, note: 'Maximum seat' },
            { label: 'Inseam', val: `${activeMeasurements.inseam} cm`, note: 'Inner leg seam' },
            { label: 'Height', val: `${activeMeasurements.height} cm`, note: 'Crown-to-ground' },
          ].map((m) => (
            <div key={m.label} className="bg-[#FAF9F6] border border-[#E8E6DF] p-4 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#6E6D68] block">
                {m.label}
              </span>
              <span className="font-mono text-xl font-bold text-[#121212] mt-1 block">
                {m.val}
              </span>
              <span className="text-[9px] text-[#9B9A93] font-mono mt-0.5 block">{m.note}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#F3F1EC] p-3.5 border border-[#E8E6DF] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#6E6D68] gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold uppercase tracking-wider text-[#121212] font-mono text-[10px]">
              Active Fit Silhouette:
            </span>
            <span className="px-2 py-0.5 bg-white border border-[#D8D6CF] text-[#121212] font-medium uppercase font-mono text-[10px]">
              {activeMeasurements.fitPreference} Fit
            </span>
            <span className="hidden md:inline">
              (Garment ease calibrated: +
              {activeMeasurements.fitPreference === 'oversized'
                ? '18cm'
                : activeMeasurements.fitPreference === 'relaxed'
                ? '12cm'
                : activeMeasurements.fitPreference === 'slim'
                ? '3cm'
                : '6-8cm'}
              )
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#9B9A93]">
            Last updated: {activeMeasurements.lastUpdated ? new Date(activeMeasurements.lastUpdated).toLocaleDateString() : 'Active session'}
          </span>
        </div>
      </div>

      {/* SECTION 2: UNIVERSAL SIZE MATRIX (CORE DELIVERABLE) */}
      <div className="bg-white border-2 border-[#121212] p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6DF] pb-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9F8253] font-semibold">
              Live Cross-Brand Comparison
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#121212] mt-0.5">
              My Recommended Size Across Top Brands
            </h2>
            <p className="text-xs text-[#6E6D68] mt-1">
              Notice how your single body measurements dynamically shift across brand grading rules.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="inline-flex border border-[#E8E6DF] p-1 bg-[#FAF9F6]">
            {[
              { id: 'tops', label: 'Tops' },
              { id: 'bottoms', label: 'Bottoms' },
              { id: 'outerwear', label: 'Coats' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveMatrixCategory(cat.id as ClothingCategory)}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition-all ${
                  activeMatrixCategory === cat.id
                    ? 'bg-[#121212] text-white shadow-xs'
                    : 'text-[#6E6D68] hover:text-[#121212]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Brand Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {matrixRecommendations.map((rec) => {
            const isSaved = savedBrands.includes(rec.brand.id);

            return (
              <motion.div
                key={rec.brand.id}
                whileHover={{ y: -3 }}
                className="border border-[#E8E6DF] bg-[#FAF9F6] p-5 flex flex-col justify-between hover:border-[#121212] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold uppercase tracking-wider text-[#121212]">
                      {rec.brand.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSaveBrand(rec.brand.id)}
                      aria-label={isSaved ? `Remove ${rec.brand.name} from saved` : `Save ${rec.brand.name}`}
                      className="text-[#9B9A93] hover:text-[#121212]"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-[#121212]' : ''}`} />
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-[#6E6D68] block mt-0.5">
                    {rec.brand.country} • {rec.category}
                  </span>

                  {/* Size Hero */}
                  <div className="py-4 my-2 border-y border-[#E8E6DF] flex items-baseline justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#9B9A93] block font-mono">
                        Recommended Size
                      </span>
                      <span className="font-serif text-4xl font-black text-[#121212]">
                        {rec.recommendedSize}
                        {rec.recommendedLength && (
                          <span className="text-base font-bold text-[#6E6D68] ml-1">×L{rec.recommendedLength}</span>
                        )}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-white border border-[#D8D6CF] text-emerald-800 font-semibold block">
                        {rec.confidenceLevel} Fit
                      </span>
                      <span className="text-[10px] text-[#6E6D68] font-mono mt-1 block">
                        {rec.confidenceScore}% Score
                      </span>
                    </div>
                  </div>

                  {/* Editorial Note */}
                  <p className="text-[11px] text-[#6E6D68] leading-relaxed line-clamp-2">
                    {rec.summaryReason}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E8E6DF] flex items-center justify-between">
                  <span className="text-[9px] uppercase font-mono text-[#9F8253]">
                    {rec.fitAssessment}
                  </span>
                  <Link
                    href={`/finder?brand=${rec.brand.id}&category=${rec.category}`}
                    className="text-[11px] uppercase tracking-wider text-[#121212] font-semibold hover:text-[#9F8253] inline-flex items-center"
                  >
                    Details <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: SAVED BRANDS & RECOMMENDATION HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Saved & Recent Brands (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E8E6DF] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-3">
              <h3 className="font-serif text-lg font-medium text-[#121212]">
                Saved Brands ({savedBrands.length})
              </h3>
              <Link href="/brands" className="text-xs text-[#9F8253] hover:underline font-mono">
                Browse All
              </Link>
            </div>

            <div className="space-y-2">
              {savedBrands.length === 0 && (
                <p className="text-xs text-[#6E6D68] py-4 text-center">
                  No saved brands yet. Tap the bookmark on any brand card to keep it here.
                </p>
              )}
              {savedBrands.map((bId) => {
                const b = BRANDS.find((brand) => brand.id === bId);
                if (!b) return null;
                return (
                  <div
                    key={b.id}
                    className="p-3 bg-[#FAF9F6] border border-[#E8E6DF] flex items-center justify-between hover:border-[#121212] transition-colors"
                  >
                    <div>
                      <span className="font-serif font-bold text-sm text-[#121212]">{b.name}</span>
                      <span className="text-[10px] text-[#6E6D68] font-mono block">
                        {b.sizingPhilosophy.slice(0, 45)}...
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/finder?brand=${b.id}`}
                        className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-[#121212] text-white hover:bg-[#2B2B2B]"
                      >
                        Size
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleSaveBrand(b.id)}
                        aria-label={`Remove ${b.name} from saved`}
                        className="text-[#9B9A93] hover:text-[#121212] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chronological Recommendation History (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E6DF] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-3">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-[#121212]" />
              <h3 className="font-serif text-lg font-medium text-[#121212]">
                Calculation Log & History
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#6E6D68]">
              {history.length} Saved Records
            </span>
          </div>

          <div className="divide-y divide-[#E8E6DF]">
            {history.length === 0 ? (
              <p className="text-xs text-[#6E6D68] py-8 text-center">
                No past recommendations logged yet. Run a calculation in Size Finder to log!
              </p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between hover:bg-[#FAF9F6] px-2 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-bold text-sm text-[#121212]">
                        {item.brandName}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#F0EFEB] text-[#6E6D68]">
                        {item.category}
                      </span>
                      {item.productName && (
                        <span className="text-xs text-[#9B9A93] italic hidden sm:inline">
                          — {item.productName}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#9B9A93] font-mono block">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="font-serif text-xl font-black text-[#121212]">
                        {item.recommendedSize}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-mono block">
                        {item.confidenceScore}% Match
                      </span>
                    </div>

                    <Link
                      href={`/finder?brand=${item.brandId}&category=${item.category}`}
                      className="p-1.5 border border-[#D8D6CF] hover:border-[#121212] transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#121212]" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SUPABASE SQL & CLOUD CONNECTION MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#121212] max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => setShowSqlModal(false)}
              className="absolute top-6 right-6 text-sm font-mono hover:text-[#9F8253]"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#9F8253]">
                Database Architecture
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#121212] mt-1">
                Supabase & Row Level Security Setup
              </h3>
              <p className="text-xs text-[#6E6D68] mt-1">
                FITSYNC is configured with an offline-first storage engine that syncs to Supabase
                when credentials are provided in your environment variables.
              </p>
            </div>

            <div className="bg-[#FAF9F6] border border-[#E8E6DF] p-4 text-xs font-mono space-y-2">
              <span className="text-[10px] uppercase text-[#6E6D68] block">Required .env.local:</span>
              <div className="bg-white p-2.5 border border-[#E8E6DF] select-all">
                NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
                <br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[#121212]">
                  PostgreSQL Tables & RLS Policies (Preview)
                </span>
                <button
                  type="button"
                  onClick={copySql}
                  className="text-xs font-mono text-[#9F8253] hover:underline flex items-center gap-1"
                >
                  {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedSql ? 'Copied SQL' : 'Copy Full SQL'}
                </button>
              </div>
              <pre className="bg-[#121212] text-[#FAF9F6] p-4 text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                {sqlSchemaSnippet}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-5 py-2 text-xs uppercase tracking-wider bg-[#121212] text-white hover:bg-[#2B2B2B]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

