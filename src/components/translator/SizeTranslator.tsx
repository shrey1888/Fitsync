'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Info, Repeat } from 'lucide-react';
import { GenderCategory, MeasurementUnit } from '@/lib/types';
import { possessive } from '@/lib/sizing/engine';
import {
  availableSizes,
  brandsForCategory,
  CATEGORY_META,
  chartDeptFor,
  FitFeedback,
  MeasurementKey,
  RegionCode,
  TRANSLATOR_BRANDS,
  TranslatorCategory,
  translateSize,
} from '@/lib/sizing/translator';
import { useFitSync } from '@/lib/store/useFitStore';

type Dept = Exclude<GenderCategory, 'unisex'>;

const FIT_OPTIONS: { id: FitFeedback; label: string; note: string }[] = [
  { id: 'tight', label: 'A bit tight', note: 'Snug, I could go up' },
  { id: 'perfect', label: 'Fits just right', note: 'This is my size' },
  { id: 'loose', label: 'A bit loose', note: 'Roomy, I could go down' },
];

const REGIONS: { id: RegionCode; label: string }[] = [
  { id: 'EU', label: 'EU' },
  { id: 'US', label: 'US' },
  { id: 'UK', label: 'UK' },
  { id: 'IN', label: 'India' },
];

const DIM_LABEL: Record<MeasurementKey, string> = {
  chest: 'Chest',
  shoulder: 'Shoulder',
  waist: 'Waist',
  hip: 'Hip',
  sleeve: 'Sleeve',
  length: 'Length',
};

const VALID_CATEGORIES = new Set<string>(CATEGORY_META.map((c) => c.id));

function parseInitialCategory(raw: string | null): TranslatorCategory {
  if (raw && VALID_CATEGORIES.has(raw)) return raw as TranslatorCategory;
  if (raw === 'bottoms') return 'jeans';
  return 'tshirts';
}

const defaultSize = (sizes: string[]) =>
  sizes.includes('M') ? 'M' : sizes.includes('S') ? 'S' : sizes[Math.floor(sizes.length / 2)] ?? '';

export default function SizeTranslator() {
  const searchParams = useSearchParams();
  const { measurements, isLoaded } = useFitSync();

  if (!isLoaded) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mx-auto" />
        <span className="font-mono text-xs uppercase tracking-widest text-[#6E6D68]">
          Loading size charts...
        </span>
      </div>
    );
  }

  const urlBrand = searchParams.get('brand');
  const urlCategory = searchParams.get('category');

  return (
    <TranslatorInner
      key={`${urlBrand}-${urlCategory}`}
      initialBrandId={TRANSLATOR_BRANDS.some((b) => b.id === urlBrand) ? urlBrand! : 'zara'}
      initialCategory={parseInitialCategory(urlCategory)}
      initialDept={chartDeptFor(measurements?.gender)}
    />
  );
}

function TranslatorInner({
  initialBrandId,
  initialCategory,
  initialDept,
}: {
  initialBrandId: string;
  initialCategory: TranslatorCategory;
  initialDept: Dept;
}) {
  const [dept, setDept] = useState<Dept>(initialDept);
  const [category, setCategory] = useState<TranslatorCategory>(initialCategory);
  const [region, setRegion] = useState<RegionCode>('EU');
  const [unit, setUnit] = useState<MeasurementUnit>('cm');
  const [brandId, setBrandId] = useState(initialBrandId);
  const [pickedSize, setPickedSize] = useState<string>('');
  const [fit, setFit] = useState<FitFeedback>('perfect');

  const fmt = (cm: number) => (unit === 'cm' ? `${cm}cm` : `${Math.round((cm / 2.54) * 10) / 10}in`);
  const fmtNum = (cm: number) => (unit === 'cm' ? `${cm}` : `${Math.round((cm / 2.54) * 10) / 10}`);

  const refBrands = brandsForCategory(category, dept);
  const activeBrandId = refBrands.some((b) => b.id === brandId) ? brandId : refBrands[0]?.id ?? '';
  const sizes = availableSizes(activeBrandId, category, dept);
  const size = sizes.includes(pickedSize) ? pickedSize : defaultSize(sizes);

  const output = size
    ? translateSize({ brandId: activeBrandId, category, size, gender: dept, fit, region })
    : null;
  const refBrand = TRANSLATOR_BRANDS.find((b) => b.id === activeBrandId);
  const catMeta = CATEGORY_META.find((c) => c.id === category)!;

  return (
    <div className="space-y-10">
      {/* INPUT CARD */}
      <div className="bg-white border border-[#E8E6DF] p-6 sm:p-8 shadow-xs space-y-7">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#E8E6DF] pb-5">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#6E6D68]">
              Brand &amp; Category-Specific Conversion
            </span>
            <h2 className="font-serif text-2xl font-light text-[#121212] mt-0.5">
              Tell us one garment size that fits you
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Department */}
            <div
              className="inline-flex border border-[#E8E6DF] p-0.5 bg-[#FAF9F6]"
              role="group"
              aria-label="Department"
            >
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

            {/* Unit */}
            <div
              className="inline-flex border border-[#E8E6DF] p-0.5 bg-[#FAF9F6]"
              role="group"
              aria-label="Measurement Unit"
            >
              {(['cm', 'inch'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={unit === u}
                  onClick={() => setUnit(u)}
                  className={`px-2.5 py-1.5 text-[11px] uppercase font-mono tracking-wider transition-all ${
                    unit === u ? 'bg-[#121212] text-white' : 'text-[#6E6D68] hover:text-[#121212]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            {/* Region */}
            <div
              className="inline-flex items-center border border-[#E8E6DF] p-0.5 bg-[#FAF9F6]"
              role="group"
              aria-label="Sizing Region"
            >
              <Globe className="w-3.5 h-3.5 text-[#6E6D68] mx-2" />
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  aria-pressed={region === r.id}
                  onClick={() => setRegion(r.id)}
                  className={`px-2.5 py-1.5 text-[11px] uppercase tracking-wider transition-all ${
                    region === r.id ? 'bg-[#121212] text-white' : 'text-[#6E6D68] hover:text-[#121212]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. Category */}
        <div>
          <span className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-semibold mb-3">
            1. Select clothing category
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_META.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${
                  category === c.id
                    ? 'border-[#121212] bg-[#121212] text-white font-medium'
                    : 'border-[#E8E6DF] bg-[#FAF9F6] text-[#121212] hover:border-[#121212]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Brand */}
        <div>
          <span className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-semibold mb-3">
            2. A brand you already wear ({catMeta.label})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {refBrands.map((b) => (
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
                <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">
                  {b.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Size */}
        <div>
          <span className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-semibold mb-3">
            3. Your {refBrand?.name} {catMeta.label} size
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

        {/* 4. Fit */}
        <div>
          <span className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-semibold mb-3">
            4. How does it fit?
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
          key={`${activeBrandId}-${category}-${dept}-${size}-${fit}-${region}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white border-2 border-[#121212] shadow-lg overflow-hidden"
        >
          <div className="bg-[#121212] text-[#FAF9F6] px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Repeat className="w-4 h-4 text-[#9F8253] shrink-0" />
              <p className="text-sm">
                Estimated body from{' '}
                <span className="font-semibold">
                  {refBrand.name} {catMeta.label} {size}
                </span>{' '}
                ({region} scale,{' '}
                {fit === 'perfect' ? 'fits just right' : fit === 'tight' ? 'a bit tight' : 'a bit loose'}):
              </p>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              {catMeta.relevantDimensions.map((k) => {
                const val = output.implied[k];
                if (val === undefined) return null;
                return (
                  <span
                    key={k}
                    title={
                      output.implied.fromChart.includes(k)
                        ? `From ${possessive(refBrand.name)} ${catMeta.label} chart`
                        : 'Proportional estimate'
                    }
                    className="px-2.5 py-1 border border-white/20 bg-white/5"
                  >
                    {DIM_LABEL[k]} ~{fmt(val)}
                    {!output.implied.fromChart.includes(k) && (
                      <span className="text-[#9B9A93]"> est.</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {output.translations.map((t) => {
                if (t.status === 'unavailable') {
                  return (
                    <div
                      key={t.brand.id}
                      className="border border-dashed border-[#D8D6CF] bg-[#FAF9F6]/60 p-5 flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-serif text-lg font-bold uppercase tracking-wider text-[#121212] block">
                          {t.brand.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#6E6D68] block mt-0.5">
                          {t.brand.country} · {t.brand.nativeRegion}
                        </span>
                        <div className="py-5 my-3 border-y border-[#E8E6DF]">
                          <p className="text-xs font-mono text-[#6E6D68]">
                            Size information unavailable.
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#9B9A93]">
                        No verified {catMeta.label.toLowerCase()} chart on file for {t.brand.name}.
                      </p>
                    </div>
                  );
                }

                const sizeLabel = t.recommendedSize!;
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
                            t.confidenceLevel === 'High'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                              : t.confidenceLevel === 'Moderate'
                              ? 'border-amber-200 bg-amber-50 text-amber-900'
                              : 'border-rose-200 bg-rose-50 text-rose-900'
                          }`}
                        >
                          {t.confidenceLevel} · {t.confidenceScore}% est.
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#6E6D68] block mt-0.5">
                        {t.brand.country} · {t.brand.nativeRegion} chart
                      </span>

                      <div className="py-4 my-3 border-y border-[#E8E6DF] flex items-baseline justify-between gap-2">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#9B9A93] block font-mono">
                            Estimated Size
                          </span>
                          <span className="font-serif text-4xl font-black text-[#121212]">
                            {sizeLabel}
                          </span>
                        </div>
                        {t.regionalEquivalent && (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-[#E8E6DF] text-[#6E6D68]">
                            ≈ {t.regionalEquivalent}
                          </span>
                        )}
                      </div>

                      {/* Category-relevant measurement comparisons */}
                      <div className="space-y-1">
                        {t.comparisons.slice(0, 3).map((comp) => (
                          <p
                            key={comp.dimension}
                            className="text-[11px] text-[#6E6D68] leading-snug font-mono"
                          >
                            {comp.label} ~{fmt(comp.estimatedValue)} → {fmtNum(comp.targetMin)}–{fmt(comp.targetMax)}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#E8E6DF] min-h-10">
                      {t.betweenSizes ? (
                        <p className="text-[11px] text-[#9F8253] leading-snug">
                          Close to {t.betweenSizes.size}: {t.betweenSizes.explanation}
                        </p>
                      ) : (
                        <p className="text-[11px] text-[#6E6D68]">
                          Closest match on {possessive(t.brand.name)} {catMeta.label.toLowerCase()} chart.
                        </p>
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
                  <span className="font-semibold text-[#121212]">Estimate Notice:</span> Because only a
                  brand and size label were provided ({refBrand.name} {catMeta.label} {size}), these
                  conversions are estimates derived from each brand&apos;s category-specific chart and
                  regional ({region}) grading — never 100% exact without body measurements.
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
