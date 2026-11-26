'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRANDS, SIZE_CHARTS, PRODUCTS } from '@/lib/data/brands';
import { Brand, ClothingCategory } from '@/lib/types';
import { useFitSync } from '@/lib/store/useFitStore';
import { Search, Bookmark, ArrowRight, Ruler, ShieldCheck, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEPT_ORDER = { menswear: 0, womenswear: 1, unisex: 2 } as const;
const CATEGORY_ORDER = { tops: 0, bottoms: 1, outerwear: 2, dresses: 3 } as const;

export default function BrandDirectory() {
  const { savedBrands, toggleSaveBrand, recordBrandVisit } = useFitSync();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTendency, setSelectedTendency] = useState<string>('all');
  const [activeChartModalBrand, setActiveChartModalBrand] = useState<Brand | null>(null);
  // Brand ids whose hero photo failed to load; they get a typographic fallback.
  const [brokenImages, setBrokenImages] = useState<string[]>([]);

  // Close the size chart modal with Escape.
  useEffect(() => {
    if (!activeChartModalBrand) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveChartModalBrand(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeChartModalBrand]);

  // Filter brands
  const filteredBrands = BRANDS.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || brand.categories.includes(selectedCategory as ClothingCategory);

    const matchesTendency =
      selectedTendency === 'all' || brand.sizingTendency === selectedTendency;

    return matchesSearch && matchesCategory && matchesTendency;
  });

  const getTendencyBadge = (tendency: Brand['sizingTendency']) => {
    switch (tendency) {
      case 'runs_small':
        return { label: 'Runs 1/2 Size Small', class: 'bg-amber-50 text-amber-900 border-amber-200' };
      case 'runs_large':
        return { label: 'Runs Generous / Large', class: 'bg-blue-50 text-blue-900 border-blue-200' };
      case 'athletic_taper':
        return { label: 'Athletic Cut', class: 'bg-purple-50 text-purple-900 border-purple-200' };
      default:
        return { label: 'True to Size', class: 'bg-emerald-50 text-emerald-900 border-emerald-200' };
    }
  };

  return (
    <div className="space-y-10">
      {/* Search and Filters Bar */}
      <div className="bg-white border border-[#E8E6DF] p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9B9A93] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by brand name, country, or sizing standard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E8E6DF] focus:border-[#121212] pl-10 pr-4 py-2.5 text-xs font-mono outline-hidden transition-colors"
            />
          </div>

          {/* Sizing Tendency Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase tracking-wider text-[#6E6D68] hidden sm:inline">
              Tendency:
            </span>
            <select
              value={selectedTendency}
              onChange={(e) => setSelectedTendency(e.target.value)}
              className="bg-[#FAF9F6] border border-[#E8E6DF] px-3 py-2.5 text-xs outline-hidden focus:border-[#121212]"
            >
              <option value="all">All Sizing Tendencies</option>
              <option value="runs_small">Runs Slim / Small</option>
              <option value="true_to_size">True to Standard</option>
              <option value="runs_large">Runs Generous / Large</option>
              <option value="athletic_taper">Athletic Taper</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0EFEB]">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#9B9A93] mr-2">
            Category:
          </span>
          {[
            { id: 'all', label: 'All Garments' },
            { id: 'tops', label: 'Tops & Shirts' },
            { id: 'bottoms', label: 'Pants & Denim' },
            { id: 'outerwear', label: 'Outerwear & Coats' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs uppercase tracking-wider transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#121212] text-white font-medium'
                  : 'bg-[#FAF9F6] text-[#6E6D68] hover:text-[#121212] border border-[#E8E6DF]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredBrands.map((brand) => {
          const isSaved = savedBrands.includes(brand.id);
          const tendency = getTendencyBadge(brand.sizingTendency);
          const brandProducts = PRODUCTS.filter((p) => p.brandId === brand.id);

          return (
            <motion.div
              key={brand.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#E8E6DF] flex flex-col justify-between overflow-hidden group shadow-xs hover:border-[#121212]"
            >
              {/* Card Header & Visual */}
              <div className="relative h-44 overflow-hidden bg-[#2B2B2B] border-b border-[#E8E6DF]">
                {brokenImages.includes(brand.id) ? (
                  <div
                    aria-hidden="true"
                    className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3A3A3A] to-[#121212] font-serif text-6xl font-black tracking-tighter text-white/15"
                  >
                    {brand.name.slice(0, 2).toUpperCase()}
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={brand.heroImage}
                    alt=""
                    loading="lazy"
                    onError={() => setBrokenImages((prev) => (prev.includes(brand.id) ? prev : [...prev, brand.id]))}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-focus-within:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Bookmark button */}
                <button
                  type="button"
                  onClick={() => toggleSaveBrand(brand.id)}
                  title={isSaved ? 'Remove from saved' : 'Save brand'}
                  aria-label={isSaved ? `Remove ${brand.name} from saved` : `Save ${brand.name}`}
                  aria-pressed={isSaved}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isSaved
                      ? 'bg-white text-[#121212]'
                      : 'bg-black/40 text-white hover:bg-black/70'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                {/* Brand Overlay Title — stacked so long names never collide with the country line */}
                <div className="absolute bottom-3 left-4 right-14">
                  <span className="block text-[10px] uppercase font-mono tracking-widest text-[#FAF9F6]/80 truncate">
                    {brand.country} • est. {brand.founded}
                  </span>
                  <h3 className="font-serif text-2xl font-bold tracking-[0.1em] uppercase text-white leading-tight mt-0.5 break-words">
                    {brand.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Tendency Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 border whitespace-nowrap ${tendency.class}`}
                    >
                      {tendency.label}
                    </span>
                    <span className="text-[10px] text-[#9B9A93] font-mono">
                      {brandProducts.length} {brandProducts.length === 1 ? 'model' : 'models'}
                    </span>
                  </div>

                  <p className="text-xs text-[#6E6D68] leading-relaxed line-clamp-2">
                    {brand.sizingPhilosophy}
                  </p>

                  <div className="bg-[#FAF9F6] p-2.5 border-l-2 border-[#121212] text-[11px] text-[#121212]">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider text-[#6E6D68]">
                      Fit Advisory
                    </span>
                    <p className="line-clamp-2 text-[#4A4944]">{brand.sizingNote}</p>
                  </div>

                  {/* Categories badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {brand.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#FAF9F6] border border-[#E8E6DF] text-[#6E6D68]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#E8E6DF] space-y-2">
                  <Link
                    href={`/finder?brand=${brand.id}`}
                    onClick={() => recordBrandVisit(brand.id)}
                    className="w-full inline-flex items-center justify-center py-2.5 px-4 text-xs uppercase tracking-[0.16em] bg-[#121212] text-white hover:bg-[#2B2B2B] transition-colors group/btn"
                  >
                    <span>Calculate My Size</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveChartModalBrand(brand)}
                      className="inline-flex items-center justify-center py-1.5 text-[10px] uppercase tracking-wider text-[#6E6D68] hover:text-[#121212] transition-colors"
                    >
                      <Ruler className="w-3 h-3 mr-1.5 shrink-0" />
                      Size Chart
                    </button>
                    <Link
                      href={`/translate?brand=${brand.id}`}
                      title={`Already know your ${brand.name} size? See your size in every other brand.`}
                      className="inline-flex items-center justify-center py-1.5 text-[10px] uppercase tracking-wider text-[#6E6D68] hover:text-[#121212] transition-colors"
                    >
                      <Repeat className="w-3 h-3 mr-1.5 shrink-0" />
                      Translate Size
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SIZE CHART MODAL INSPECTOR */}
      <AnimatePresence>
        {activeChartModalBrand && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveChartModalBrand(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${activeChartModalBrand.name} size charts`}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF9F6] border border-[#E8E6DF] max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setActiveChartModalBrand(null)}
                aria-label="Close size charts"
                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-[#D8D6CF] flex items-center justify-center text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#9F8253]">
                      Brand Size Charts
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl font-bold uppercase tracking-tight text-[#121212] mt-1 pr-10">
                    {activeChartModalBrand.name} Specifications
                  </h3>
                  <p className="text-xs text-[#6E6D68] mt-1">
                    {activeChartModalBrand.tagline} • Country of Origin:{' '}
                    {activeChartModalBrand.country}
                  </p>
                </div>

                {/* Sizing notes callout */}
                <div className="bg-white p-4 border border-[#E8E6DF] space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#121212]">
                    Garment Ease & Grading Standard:
                  </span>
                  <p className="text-xs text-[#6E6D68]">
                    {activeChartModalBrand.sizingPhilosophy} {activeChartModalBrand.sizingNote}
                  </p>
                </div>

                {/* Size Table */}
                <div className="space-y-4">
                  {SIZE_CHARTS.filter((sc) => sc.brandId === activeChartModalBrand.id)
                    .sort(
                      (a, b) =>
                        Number(a.isProductSpecific) - Number(b.isProductSpecific) ||
                        DEPT_ORDER[a.gender] - DEPT_ORDER[b.gender] ||
                        CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category]
                    )
                    .map((chart) => (
                      <div key={chart.id} className="border border-[#E8E6DF] bg-white">
                        <div className="bg-[#F3F1EC] px-4 py-2.5 border-b border-[#E8E6DF] flex items-center justify-between">
                          <span className="font-mono text-xs uppercase font-semibold text-[#121212]">
                            {chart.isProductSpecific
                              ? `${PRODUCTS.find((p) => p.id === chart.productId)?.name ?? 'Product'} (Product Pattern)`
                              : `${chart.category} — ${chart.gender}`}
                          </span>
                          <span className="flex items-center gap-2 text-[10px] font-mono text-[#6E6D68]">
                            <span
                              title={chart.sourceNote}
                              className={`px-1.5 py-0.5 border uppercase ${
                                chart.isVerified
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                                  : 'border-amber-200 bg-amber-50 text-amber-900'
                              }`}
                            >
                              {chart.isVerified ? 'Verified' : 'Approximate'}
                            </span>
                            CM
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-[#FAF9F6] border-b border-[#E8E6DF] text-[#6E6D68] text-[10px] uppercase">
                              <tr>
                                <th className="p-3">Size</th>
                                {chart.entries[0]?.chestMin !== undefined && (
                                  <th className="p-3">Chest Range</th>
                                )}
                                {chart.entries[0]?.waistMin !== undefined && (
                                  <th className="p-3">Waist Range</th>
                                )}
                                {chart.entries[0]?.shoulderMin !== undefined && (
                                  <th className="p-3">Shoulder Range</th>
                                )}
                                {chart.entries[0]?.hipMin !== undefined && (
                                  <th className="p-3">Hip Range</th>
                                )}
                                {chart.entries[0]?.inseamMin !== undefined && (
                                  <th className="p-3">Inseam Range</th>
                                )}
                                {chart.entries[0]?.garmentChest !== undefined && (
                                  <th className="p-3">Garment Chest Ease</th>
                                )}
                                {chart.lengthOptions && <th className="p-3">Leg Lengths</th>}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8E6DF]">
                              {chart.entries.map((entry) => (
                                <tr key={entry.size} className="hover:bg-[#FAF9F6]">
                                  <td className="p-3 font-bold text-[#121212]">{entry.size}</td>
                                  {entry.chestMin !== undefined && (
                                    <td className="p-3">
                                      {entry.chestMin} – {entry.chestMax} cm
                                    </td>
                                  )}
                                  {entry.waistMin !== undefined && (
                                    <td className="p-3">
                                      {entry.waistMin} – {entry.waistMax} cm
                                    </td>
                                  )}
                                  {entry.shoulderMin !== undefined && (
                                    <td className="p-3">
                                      {entry.shoulderMin} – {entry.shoulderMax} cm
                                    </td>
                                  )}
                                  {entry.hipMin !== undefined && (
                                    <td className="p-3">
                                      {entry.hipMin} – {entry.hipMax} cm
                                    </td>
                                  )}
                                  {entry.inseamMin !== undefined && (
                                    <td className="p-3">
                                      {entry.inseamMin} – {entry.inseamMax} cm
                                    </td>
                                  )}
                                  {entry.garmentChest !== undefined && (
                                    <td className="p-3 font-semibold text-[#9F8253]">
                                      {entry.garmentChest} cm
                                    </td>
                                  )}
                                  {chart.lengthOptions && (
                                    <td className="p-3 text-[#6E6D68]">
                                      {chart.lengthOptions.map((l) => `L${l.label}`).join(' / ')}
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  <p className="text-[11px] text-[#6E6D68]">
                    Coats &amp; jackets are sized on each brand&apos;s tops chart with an added layering allowance.
                  </p>
                </div>

                {/* Bottom modal CTA */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E8E6DF]">
                  <span className="text-xs text-[#6E6D68]">
                    Source: {activeChartModalBrand.name} published size guides
                  </span>
                  <Link
                    href={`/finder?brand=${activeChartModalBrand.id}`}
                    onClick={() => setActiveChartModalBrand(null)}
                    className="inline-flex items-center px-5 py-2.5 text-xs uppercase tracking-wider bg-[#121212] text-white hover:bg-[#2B2B2B]"
                  >
                    <span>Run Calculation for {activeChartModalBrand.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

