'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BRANDS, PRODUCTS, SIZE_CHARTS } from '@/lib/data/brands';
import { Brand, ClothingCategory } from '@/lib/types';
import { recommendSize, chartGenderFor, possessive } from '@/lib/sizing/engine';
import { useFitSync, DEFAULT_MEASUREMENTS } from '@/lib/store/useFitStore';
import {
  Check,
  ShieldCheck,
  ArrowRight,
  Bookmark,
  Copy,
  Sliders,
  Info,
  CheckCircle2,
  Repeat,
} from 'lucide-react';
import { motion } from 'framer-motion';

const FINDER_CATEGORIES: { id: ClothingCategory; label: string }[] = [
  { id: 'tops', label: 'Tops & Shirts' },
  { id: 'bottoms', label: 'Pants, Denim & Trousers' },
  { id: 'outerwear', label: 'Coats & Jackets' },
];

/**
 * Category to open the finder on: `wanted` when the brand sells it, otherwise the
 * brand's primary category (e.g. denim for Levi's).
 */
function pickCategory(brand: Brand, wanted: string | null | undefined): ClothingCategory {
  const finderIds = FINDER_CATEGORIES.map((c) => c.id);
  const supported = brand.categories.filter((c) => finderIds.includes(c));
  if (wanted && supported.includes(wanted as ClothingCategory)) return wanted as ClothingCategory;
  return supported[0] ?? 'tops';
}

/**
 * Reads ?brand=&category= and remounts the finder whenever they change, so
 * following a link to another brand while already on /finder (e.g. from the
 * footer) actually switches the selection.
 */
export default function SizeFinder() {
  const searchParams = useSearchParams();
  const urlBrand = searchParams.get('brand');
  const brand = BRANDS.find((b) => b.id === urlBrand) ?? BRANDS[0];
  const category = pickCategory(brand, searchParams.get('category'));

  return <SizeFinderInner key={`${brand.id}-${category}`} initialBrandId={brand.id} initialCategory={category} />;
}

function SizeFinderInner({
  initialBrandId,
  initialCategory,
}: {
  initialBrandId: string;
  initialCategory: ClothingCategory;
}) {
  const { measurements, isLoaded, addRecommendationHistory, recordBrandVisit } = useFitSync();

  const [selectedBrandId, setSelectedBrandId] = useState<string>(initialBrandId);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>(initialCategory);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [hasSavedToHistory, setHasSavedToHistory] = useState(false);

  const currentBrand = BRANDS.find((b) => b.id === selectedBrandId) || BRANDS[0];

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrandId(brandId);
    const nextBrand = BRANDS.find((b) => b.id === brandId) || BRANDS[0];
    setSelectedCategory(pickCategory(nextBrand, selectedCategory));
    setSelectedProductId('');
    setHasSavedToHistory(false);
    recordBrandVisit(brandId);
  };

  const handleSelectCategory = (category: ClothingCategory) => {
    setSelectedCategory(category);
    setSelectedProductId('');
    setHasSavedToHistory(false);
  };

  // Products available for this brand and category
  const availableProducts = PRODUCTS.filter(
    (p) => p.brandId === selectedBrandId && p.category === selectedCategory
  );

  const currentMeasurements = measurements ?? DEFAULT_MEASUREMENTS;
  const userDept = chartGenderFor(currentMeasurements.gender);

  const result = recommendSize({
    brandId: selectedBrandId,
    category: selectedCategory,
    productId: selectedProductId || undefined,
    measurements: currentMeasurements,
  });
  const activeChart = result ? SIZE_CHARTS.find((c) => c.id === result.chartId) : undefined;
  const sizeLabel = result
    ? result.recommendedLength
      ? `${result.recommendedSize} × L${result.recommendedLength}`
      : result.recommendedSize
    : '';

  if (!isLoaded) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mx-auto" />
        <span className="font-mono text-xs uppercase tracking-widest text-[#6E6D68]">Loading your profile...</span>
      </div>
    );
  }

  // Handle Save recommendation to history
  const handleSaveRecommendation = () => {
    if (!result) return;
    addRecommendationHistory({
      brandId: currentBrand.id,
      brandName: currentBrand.name,
      productId: selectedProductId || undefined,
      productName: availableProducts.find((p) => p.id === selectedProductId)?.name,
      category: selectedCategory,
      recommendedSize: sizeLabel,
      confidenceLevel: result.confidenceLevel,
      confidenceScore: result.confidenceScore,
    });
    setHasSavedToHistory(true);
    setTimeout(() => setHasSavedToHistory(false), 3000);
  };

  const handleCopySummary = async () => {
    if (!result) return;
    const text = `FITSYNC Recommendation:\nBrand: ${currentBrand.name}\nSize: ${sizeLabel}\nFit: ${result.fitAssessment}\nConfidence: ${result.confidenceLevel} (${result.confidenceScore}%)\nMeasurements: Chest ${currentMeasurements.chest}cm, Waist ${currentMeasurements.waist}cm.`;
    try {
      // navigator.clipboard is undefined on plain-http origins other than localhost.
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy your recommendation:', text);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Active Profile Banner */}
      <div className="bg-white border border-[#E8E6DF] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#9F8253]">
              Active Body Calibration
            </span>
            <div className="flex flex-wrap gap-x-3 text-xs font-mono text-[#121212] font-medium mt-0.5">
              <span>Chest: {currentMeasurements.chest}cm</span>
              <span>Waist: {currentMeasurements.waist}cm</span>
              <span>Shoulder: {currentMeasurements.shoulder}cm</span>
              <span>Height: {currentMeasurements.height}cm</span>
              <span className="text-[#9F8253] uppercase">
                [{currentMeasurements.fitPreference} fit]
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/onboarding"
          className="inline-flex items-center text-xs uppercase tracking-wider text-[#121212] border border-[#D8D6CF] px-3.5 py-1.5 hover:bg-[#121212] hover:text-white transition-colors self-start sm:self-center"
        >
          <Sliders className="w-3.5 h-3.5 mr-1.5" />
          Edit Measurements
        </Link>
      </div>

      {/* 3-Step Selection Grid */}
      <div className="bg-white border border-[#E8E6DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#E8E6DF] pb-4">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#6E6D68]">
            Interactive Matcher
          </span>
          <h2 className="font-serif text-2xl font-light text-[#121212] mt-0.5">
            Select Brand & Clothing Category
          </h2>
        </div>

        {/* 1. BRAND SELECTOR */}
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-semibold mb-3">
            1. Select Fashion House / Brand
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {BRANDS.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => handleSelectBrand(brand.id)}
                className={`p-3 text-center border transition-all flex flex-col items-center justify-center ${
                  selectedBrandId === brand.id
                    ? 'border-[#121212] bg-[#121212] text-white shadow-xs'
                    : 'border-[#E8E6DF] bg-[#FAF9F6] text-[#121212] hover:border-[#121212]'
                }`}
              >
                <span className="font-serif text-sm font-bold uppercase tracking-wider">
                  {brand.name}
                </span>
                <span
                  className={`text-[9px] font-mono mt-1 ${
                    selectedBrandId === brand.id ? 'text-[#D8D6CF]' : 'text-[#6E6D68]'
                  }`}
                >
                  {brand.country}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. CATEGORY SELECTOR */}
        <div className="pt-2">
          <label className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-semibold mb-3">
            2. Clothing Category
          </label>
          <div className="flex flex-wrap gap-2.5">
            {FINDER_CATEGORIES.map((cat) => {
              const isSupported = currentBrand.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  disabled={!isSupported}
                  title={isSupported ? undefined : `${currentBrand.name} doesn't sell this category`}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-4 py-2.5 text-xs uppercase tracking-wider border transition-all text-left ${
                    selectedCategory === cat.id
                      ? 'border-[#121212] bg-[#121212] text-white'
                      : isSupported
                      ? 'border-[#E8E6DF] bg-[#FAF9F6] text-[#121212] hover:border-[#121212]'
                      : 'border-[#F0EFEB] bg-[#F7F6F2] text-[#B4B2AA] cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="font-medium block">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. PRODUCT-SPECIFIC SELECTOR (IF AVAILABLE) */}
        {availableProducts.length > 0 && (
          <div className="pt-2 border-t border-[#F0EFEB]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-[0.18em] text-[#121212] font-semibold flex items-center gap-1.5">
                3. Specific Garment Cut
                <span className="text-[10px] text-[#9F8253] font-mono lowercase tracking-normal">
                  (prioritizes exact pattern data)
                </span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedProductId('')}
                className={`p-3 text-left border text-xs transition-all ${
                  selectedProductId === ''
                    ? 'border-[#121212] bg-[#FAF9F6] font-semibold'
                    : 'border-[#E8E6DF] bg-white hover:border-[#121212] text-[#6E6D68]'
                }`}
              >
                <span className="block text-[#121212]">Master Brand Sizing</span>
                <span className="text-[10px] text-[#6E6D68]">General anatomical grading standard</span>
              </button>

              {availableProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProductId(p.id)}
                  className={`p-3 text-left border text-xs transition-all ${
                    selectedProductId === p.id
                      ? 'border-[#121212] bg-[#FAF9F6] font-semibold ring-1 ring-[#121212]'
                      : 'border-[#E8E6DF] bg-white hover:border-[#121212] text-[#6E6D68]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="block text-[#121212] font-medium">{p.name}</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-[#F0EFEB] shrink-0">
                      {p.fitCut}
                    </span>
                  </div>
                  {p.gender !== 'unisex' && p.gender !== userDept && (
                    <span className="text-[9px] uppercase font-mono text-[#9F8253] block mt-0.5">
                      {p.gender} cut
                    </span>
                  )}
                  <span className="text-[10px] text-[#6E6D68] mt-0.5 block">{p.fabric}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CORE RESULT DISPLAY */}
      {!result ? (
        <div className="bg-white border-2 border-[#121212] p-10 text-center space-y-3">
          <Info className="w-5 h-5 mx-auto text-[#9F8253]" />
          <h3 className="font-serif text-2xl text-[#121212]">No size chart on file</h3>
          <p className="text-xs text-[#6E6D68] max-w-md mx-auto">
            We don&apos;t have a {currentBrand.name} chart for this category yet, so we won&apos;t guess a size
            from another brand&apos;s grading.
          </p>
        </div>
      ) : (
      <motion.div
        key={`${selectedBrandId}-${selectedCategory}-${selectedProductId}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-2 border-[#121212] shadow-lg overflow-hidden"
      >
        {/* Editorial Top Banner */}
        <div className="bg-[#121212] text-[#FAF9F6] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] uppercase tracking-[0.22em] font-medium">
              FITSYNC CALIBRATED RESULT
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-[#9B9A93]">Fit Confidence:</span>
            <span className="px-2.5 py-0.5 bg-white/10 text-emerald-300 font-semibold border border-white/20">
              {result.confidenceLevel} ({result.confidenceScore}%)
            </span>
          </div>
        </div>

        {/* Main Recommendation Hero Area */}
        <div className="p-8 sm:p-12 border-b border-[#E8E6DF] grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FAF9F6]">
          <div className="md:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#6E6D68] block">
              YOUR RECOMMENDED SIZE
            </span>
            <div className="space-y-1">
              <h3 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider text-[#121212] font-light">
                {currentBrand.name}
              </h3>
              <div className="flex items-baseline space-x-4">
                <span className="font-serif text-7xl sm:text-8xl font-black text-[#121212] tracking-tighter leading-none">
                  {result.recommendedSize}
                  {result.recommendedLength && (
                    <span className="text-3xl sm:text-4xl font-bold text-[#6E6D68] tracking-normal ml-2">
                      × L{result.recommendedLength}
                    </span>
                  )}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#9F8253] font-semibold">
                    {result.fitAssessment}
                  </span>
                  <span className="text-[11px] text-[#6E6D68] font-mono">
                    {result.isProductSpecificData ? 'Product Ease Calibrated' : 'Standard Anatomical Grade'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#4A4944] leading-relaxed pt-2">
              {result.summaryReason}
            </p>
            {result.recommendedLength && (
              <p className="text-xs font-mono text-[#6E6D68]">
                W{result.recommendedSize} = waist size · L{result.recommendedLength} = leg length for your{' '}
                {currentMeasurements.inseam}cm inseam
              </p>
            )}
          </div>

          {/* Alternative Size Box & Confidence Breakdown */}
          <div className="md:col-span-5 bg-white border border-[#E8E6DF] p-6 space-y-4">
            {result.alternativeSize ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#6E6D68]">
                    Alternative Option
                  </span>
                  <span className="text-xs font-serif font-bold text-[#121212] px-2 py-0.5 bg-[#FAF9F6] border border-[#E8E6DF]">
                    Size {result.alternativeSize.size}
                  </span>
                </div>
                <p className="text-xs text-[#6E6D68] leading-relaxed">
                  {result.alternativeSize.reason}
                </p>
              </div>
            ) : (
              <div className="text-xs text-[#6E6D68]">
                Size {result.recommendedSize} is overwhelmingly your optimal fit profile with no
                immediate adjacent overlap.
              </div>
            )}

            {/* Ease Note */}
            <div className="bg-[#FAF9F6] p-3 border-l-2 border-[#9F8253] text-[11px] text-[#6E6D68] space-y-1">
              <span className="font-semibold text-[#121212] uppercase tracking-wider block text-[10px]">
                Ease Calibration
              </span>
              <p>{result.easeExplanation}</p>
            </div>
          </div>
        </div>

        {/* DIMENSIONAL COMPARISON BREAKDOWN TABLE */}
        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6DF] pb-4">
            <div>
              <h4 className="font-serif text-xl font-medium text-[#121212]">
                Measurement Comparison vs. Brand Sizing Range
              </h4>
              <p className="text-xs text-[#6E6D68] mt-0.5">
                Transparent comparison of your body tape measurements against{' '}
                {possessive(currentBrand.name)} pattern bounds.
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1 self-start sm:self-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9F8253]">All values in CM</span>
              {activeChart && !activeChart.isVerified && (
                <span
                  title={activeChart.sourceNote}
                  className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 border border-amber-200 bg-amber-50 text-amber-900"
                >
                  Approximate chart
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FAF9F6] border-b border-[#E8E6DF] text-[#6E6D68] text-[10px] uppercase">
                <tr>
                  <th className="p-3">Body Dimension</th>
                  <th className="p-3">Your Tape</th>
                  <th className="p-3">{currentBrand.name} Size {result.recommendedSize} Range</th>
                  <th className="p-3">Delta / Variance</th>
                  <th className="p-3">Fit Assessment</th>
                  <th className="p-3 hidden sm:table-cell">Tailor Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6DF]">
                {result.dimensionBreakdowns.map((dim) => {
                  const getStatusBadge = (status: typeof dim.status) => {
                    switch (status) {
                      case 'perfect':
                        return { label: 'Optimal Match', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
                      case 'snug':
                        return { label: 'Tailored / Trim', class: 'bg-amber-50 text-amber-800 border-amber-200' };
                      case 'roomy':
                        return { label: 'Comfort Ease', class: 'bg-blue-50 text-blue-800 border-blue-200' };
                      case 'too_tight':
                        return { label: 'High Tension', class: 'bg-rose-50 text-rose-800 border-rose-200' };
                      default:
                        return { label: 'Excess Slack', class: 'bg-gray-100 text-gray-800 border-gray-300' };
                    }
                  };

                  const badge = getStatusBadge(dim.status);

                  return (
                    <tr key={dim.dimension} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="p-3 font-bold text-[#121212]">{dim.dimension}</td>
                      <td className="p-3 font-semibold text-[#121212]">
                        {dim.userMeasurement} cm
                      </td>
                      <td className="p-3 text-[#6E6D68]">
                        {dim.brandRange.min} – {dim.brandRange.max} cm
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-semibold ${
                            dim.delta === 0
                              ? 'text-emerald-700'
                              : dim.delta > 0
                              ? 'text-amber-700'
                              : 'text-blue-700'
                          }`}
                        >
                          {dim.delta > 0 ? `+${dim.delta}` : dim.delta} cm
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 border ${badge.class}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3 text-[#6E6D68] hidden sm:table-cell">
                        {dim.feedback}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {result.chartNote && (
            <div className="bg-[#FAF9F6] border border-[#E8E6DF] p-4 text-xs text-[#4A4944] flex items-start space-x-3">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#9F8253]" />
              <p>{result.chartNote}</p>
            </div>
          )}

          {/* Missing measurements advisory if any */}
          {result.missingMeasurementsNotice && (
            <div className="bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start space-x-3">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[10px]">
                  Uncertainty Advisory:
                </span>
                <ul className="list-disc list-inside space-y-0.5 mt-1">
                  {result.missingMeasurementsNotice.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-6 border-t border-[#E8E6DF] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleSaveRecommendation}
                className="inline-flex items-center px-5 py-2.5 text-xs uppercase tracking-wider bg-[#121212] text-white hover:bg-[#2B2B2B] transition-colors"
              >
                {hasSavedToHistory ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                    Saved to Dashboard
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 mr-2" />
                    Save This Sizing
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center px-4 py-2.5 text-xs uppercase tracking-wider border border-[#D8D6CF] text-[#121212] hover:border-[#121212] transition-colors bg-white"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Copied Summary!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy Result
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/translate?brand=${currentBrand.id}&category=${selectedCategory === 'bottoms' ? 'bottoms' : 'tops'}`}
                className="text-xs uppercase tracking-wider text-[#6E6D68] hover:text-[#121212] inline-flex items-center"
              >
                <Repeat className="w-3.5 h-3.5 mr-1.5" />
                <span>Translate a Known Size</span>
              </Link>
              <Link
                href="/dashboard"
                className="text-xs uppercase tracking-wider text-[#6E6D68] hover:text-[#121212] inline-flex items-center"
              >
                <span>View All Brands Matrix</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
      )}
    </div>
  );
}

