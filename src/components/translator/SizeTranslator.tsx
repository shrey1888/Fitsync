'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Info, Repeat } from 'lucide-react';
import { BRANDS } from '@/lib/data/brands';
import { GenderCategory } from '@/lib/types';
import { chartGenderFor, possessive } from '@/lib/sizing/engine';
import {
  availableSizes,
  brandsForCategory,
  FitFeedback,
  TranslatableCategory,
  translateSize,
} from '@/lib/sizing/translator';
import { useFitSync } from '@/lib/store/useFitStore';

type Dept = Exclude<GenderCategory, 'unisex'>;

const FIT_OPTIONS: { id: FitFeedback; label: string; note: string }[] = [
  { id: 'tight', label: 'A bit tight', note: 'Snug, I could go up' },
  { id: 'perfect', label: 'Fits just right', note: 'This is my size' },
  { id: 'loose', label: 'A bit loose', note: 'Roomy, I could go down' },
];

const DIM_LABEL = { chest: 'Chest', waist: 'Waist', hip: 'Hip', shoulder: 'Shoulder' } as const;

/** Default to S (the example everyone reaches for), otherwise the middle size. */
const defaultSize = (sizes: string[]) => (sizes.includes('S') ? 'S' : sizes[Math.floor(sizes.length / 2)] ?? '');

export default function SizeTranslator() {
  const searchParams = useSearchParams();
  const { measurements, isLoaded } = useFitSync();

  if (!isLoaded) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mx-auto" />
        <span className="font-mono text-xs uppercase tracking-widest text-[#6E6D68]">Loading size charts...</span>
      </div>
    );
  }

  const urlBrand = searchParams.get('brand');
  const urlCategory = searchParams.get('category');

  return (
    <TranslatorInner
      key={`${urlBrand}-${urlCategory}`}
      initialBrandId={BRANDS.some((b) => b.id === urlBrand) ? urlBrand! : 'hm'}
      initialCategory={urlCategory === 'bottoms' ? 'bottoms' : 'tops'}
      initialDept={chartGenderFor(measurements?.gender)}
    />
  );
}

function TranslatorInner({
  initialBrandId,
  initialCategory,
  initialDept,
}: {
  initialBrandId: string;
  initialCategory: TranslatableCategory;
  initialDept: Dept;
}) {
  const [dept, setDept] = useState<Dept>(initialDept);
  const [category, setCategory] = useState<TranslatableCategory>(initialCategory);
  const [brandId, setBrandId] = useState(initialBrandId);
  const [pickedSize, setPickedSize] = useState<string>('');
  const [fit, setFit] = useState<FitFeedback>('perfect');

  const brands = brandsForCategory(category, dept);
  const activeBrandId = brands.some((b) => b.id === brandId) ? brandId : brands[0]?.id ?? '';
  const sizes = availableSizes(activeBrandId, category, dept);
  // A size picked for another brand/category may not exist here; fall back gracefully.
  const size = sizes.includes(pickedSize) ? pickedSize : defaultSize(sizes);

  const output = size ? translateSize({ brandId: activeBrandId, category, size, gender: dept, fit }) : null;
  const refBrand = BRANDS.find((b) => b.id === activeBrandId);

  return (
    <div className="space-y-10">
      {/* INPUT CARD */}
      <div className="bg-white border border-[#E8E6DF] p-6 sm:p-8 shadow-xs space-y-7">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E6DF] pb-5">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#6E6D68]">
              No tape measure needed
            </span>
            <h2 className="font-serif text-2xl font-light text-[#121212] mt-0.5">
              Tell us one size that fits you
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="inline-flex border border-[#E8E6DF] p-0.5 bg-[#FAF9F6]" role="group" aria-label="Department">
              {(['menswear', 'womenswear'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={dept === d}
                  onClick={() => setDept(d)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-wider transition-all ${
                    dept === d ? 'bg-[#121212] text-white' : 'text-[#6E6D68] hover:text-[#121212]'
                  }`}
                >
                  {d === 'menswear' ? 'Men' : 'Women'}
                </button>
              ))}
            </div>
            <div className="inline-flex border border-[#E8E6DF] p-0.5 bg-[#FAF9F6]" role="group" aria-label="Category">
              {(
                [
                  { id: 'tops', label: 'Tops' },
                  { id: 'bottoms', label: 'Bottoms' },
                ] as const
              ).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-wider transition-all ${
                    category === c.id ? 'bg-[#121212] text-white' : 'text-[#6E6D68] hover:text-[#121212]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. Brand */}
        <div>
          <span className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-semibold mb-3">
            1. A brand you already wear
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={activeBrandId === b.id}
                onClick={() => setBrandId(b.id)}
                className={`p-3 text-center border transition-all ${
                  activeBrandId === b.id
                    ? 'border-[#121212] bg-[#121212] text-white'
                    : 'border-[#E8E6DF] bg-[#FAF9F6] text-[#121212] hover:border-[#121212]'
                }`}
              >
                <span className="font-serif text-sm font-bold uppercase tracking-wider">{b.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Size */}
        <div>
          <span className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-semibold mb-3">
            2. Your {refBrand?.name} {category === 'tops' ? 'tops' : 'bottoms'} size
          </span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={size === s}
                onClick={() => setPickedSize(s)}
                className={`min-w-14 px-4 py-2.5 font-mono text-sm border transition-all ${
                  size === s
                    ? 'border-[#121212] bg-[#121212] text-white'
                    : 'border-[#E8E6DF] bg-[#FAF9F6] text-[#121212] hover:border-[#121212]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Fit */}
        <div>
          <span className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-semibold mb-3">
            3. How does it fit?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {FIT_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={fit === f.id}
                onClick={() => setFit(f.id)}
                className={`p-3 text-left border transition-all ${
                  fit === f.id
                    ? 'border-[#121212] bg-white ring-1 ring-[#121212]'
                    : 'border-[#E8E6DF] bg-[#FAF9F6] hover:border-[#121212]'
                }`}
              >
                <span className="block text-sm font-medium text-[#121212]">{f.label}</span>
                <span className="block text-[11px] text-[#6E6D68] mt-0.5">{f.note}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS */}
      {output && refBrand && (
        <motion.div
          key={`${activeBrandId}-${category}-${dept}-${size}-${fit}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white border-2 border-[#121212] shadow-lg overflow-hidden"
        >
          <div className="bg-[#121212] text-[#FAF9F6] px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Repeat className="w-4 h-4 text-[#9F8253] shrink-0" />
              <p className="text-sm">
                Because <span className="font-semibold">{refBrand.name} {size}</span>{' '}
                {fit === 'perfect' ? 'fits you' : fit === 'tight' ? 'is a bit tight' : 'is a bit loose'}, your estimated
                body is:
              </p>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              {(category === 'tops' ? (['chest', 'waist', 'shoulder'] as const) : (['waist', 'hip'] as const)).map(
                (k) => (
                  <span
                    key={k}
                    title={output.implied.fromChart.includes(k) ? `From ${possessive(refBrand.name)} chart` : 'Proportional estimate'}
                    className="px-2.5 py-1 border border-white/20 bg-white/5"
                  >
                    {DIM_LABEL[k]} ~{output.implied[k]}cm
                    {!output.implied.fromChart.includes(k) && <span className="text-[#9B9A93]"> est.</span>}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {output.translations.map((t) => {
                const sizeLabel = t.result.recommendedSize;
                return (
                  <div
                    key={t.brand.id}
                    className="border border-[#E8E6DF] bg-[#FAF9F6] p-5 flex flex-col justify-between hover:border-[#121212] transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif text-lg font-bold uppercase tracking-wider text-[#121212] leading-tight">
                          {t.brand.name}
                        </span>
                        <span
                          className={`shrink-0 text-[9px] font-mono uppercase px-1.5 py-0.5 border ${
                            t.result.confidenceLevel === 'High'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                              : t.result.confidenceLevel === 'Moderate'
                              ? 'border-amber-200 bg-amber-50 text-amber-900'
                              : 'border-rose-200 bg-rose-50 text-rose-900'
                          }`}
                        >
                          {t.result.confidenceLevel} · {t.result.confidenceScore}%
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#6E6D68] block mt-0.5">{t.brand.country}</span>

                      <div className="py-4 my-3 border-y border-[#E8E6DF]">
                        <span className="text-[9px] uppercase tracking-wider text-[#9B9A93] block font-mono">
                          Your size
                        </span>
                        <span className="font-serif text-4xl font-black text-[#121212]">{sizeLabel}</span>
                      </div>

                      {t.primary && (
                        <p className="text-[11px] text-[#6E6D68] leading-relaxed font-mono">
                          {t.primary.dimension} ~{t.primary.userMeasurement}cm → {t.brand.name} {sizeLabel} covers{' '}
                          {t.primary.brandRange.min}–{t.primary.brandRange.max}cm
                        </p>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#E8E6DF] min-h-9">
                      {t.betweenSizes ? (
                        <p className="text-[11px] text-[#9F8253]">
                          Between sizes: try {t.betweenSizes.size} if you prefer it{' '}
                          {t.betweenSizes.direction === 'size_up' ? 'roomier' : 'closer-fitting'}.
                        </p>
                      ) : (
                        <p className="text-[11px] text-[#6E6D68]">Comfortably inside this size.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#FAF9F6] border border-[#E8E6DF] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 text-xs text-[#4A4944]">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#9F8253]" />
                <p>
                  Translations are estimated from each brand&apos;s size chart, using the range of {refBrand.name}{' '}
                  {size}. For exact results (and leg lengths for denim), save your real measurements once.
                  {output.referenceChartNote ? ` ${output.referenceChartNote}` : ''}
                </p>
              </div>
              <Link
                href="/onboarding"
                className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-wider bg-[#121212] text-white hover:bg-[#2B2B2B] transition-colors"
              >
                <span>Measure Once</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
