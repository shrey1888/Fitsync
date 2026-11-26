import { BRANDS } from '../data/brands';
import {
  BodyMeasurements,
  Brand,
  DimensionBreakdown,
  GenderCategory,
  RecommendationResult,
  SizeChartEntry,
} from '../types';
import { chartGenderFor, recommendSize, resolveChart } from './engine';

/**
 * Size Translator: "H&M S fits me — what do I wear at Zara, Uniqlo, Levi's...?"
 *
 * 1. Look up the reference size on the reference brand's chart.
 * 2. Turn its ranges into an estimated body (midpoint of each range, nudged up or
 *    down if the user says the reference size is a bit tight or a bit loose).
 * 3. Run that estimated body through the normal sizing engine for every other
 *    brand, so translations use the same scoring as measured profiles.
 */

export type TranslatableCategory = 'tops' | 'bottoms';
export type FitFeedback = 'tight' | 'perfect' | 'loose';

export interface TranslationInput {
  brandId: string;
  category: TranslatableCategory;
  size: string;
  gender: GenderCategory;
  fit: FitFeedback;
}

export interface ImpliedBody {
  chest: number;
  waist: number;
  hip: number;
  shoulder: number;
  /** Which of the values above came straight from the reference chart (the rest are proportional estimates). */
  fromChart: Array<'chest' | 'waist' | 'hip' | 'shoulder'>;
}

export interface BrandTranslation {
  brand: Brand;
  result: RecommendationResult;
  /** The dimension that drives the size (chest for tops, waist for bottoms). */
  primary?: DimensionBreakdown;
  /** Present when the estimate sits at the edge of the recommended size. */
  betweenSizes?: { size: string; direction: 'size_up' | 'size_down' };
}

export interface TranslationOutput {
  referenceBrand: Brand;
  referenceEntry: SizeChartEntry;
  referenceChartNote?: string;
  implied: ImpliedBody;
  translations: BrandTranslation[];
}

/** Sizes the reference brand sells in this category and department, in chart order. */
export function availableSizes(brandId: string, category: TranslatableCategory, gender: GenderCategory): string[] {
  return resolveChart(brandId, category, gender)?.chart.entries.map((e) => e.size) ?? [];
}

/** Brands that can act as a reference or target for a category. */
export function brandsForCategory(category: TranslatableCategory, gender: GenderCategory): Brand[] {
  return BRANDS.filter((b) => b.categories.includes(category) && resolveChart(b.id, category, gender));
}

const FIT_POSITION: Record<FitFeedback, { t: number; nudge: number }> = {
  loose: { t: 0, nudge: -1 }, // body sits at the bottom of the range (or just below)
  perfect: { t: 0.5, nudge: 0 },
  tight: { t: 1, nudge: 1 }, // body sits at the top of the range (or just above)
};

const round1 = (v: number) => Math.round(v * 10) / 10;

function pointIn(min: number | undefined, max: number | undefined, fit: FitFeedback): number | undefined {
  if (min === undefined) return undefined;
  const hi = max ?? min;
  const { t, nudge } = FIT_POSITION[fit];
  return round1(min + (hi - min) * t + nudge);
}

export function estimateBody(entry: SizeChartEntry, gender: GenderCategory, fit: FitFeedback): ImpliedBody {
  const womens = chartGenderFor(gender) === 'womenswear';
  const fromChart: ImpliedBody['fromChart'] = [];

  const chartChest = pointIn(entry.chestMin, entry.chestMax, fit);
  const chartWaist = pointIn(entry.waistMin, entry.waistMax, fit);
  const chartHip = pointIn(entry.hipMin, entry.hipMax, fit);
  const chartShoulder = pointIn(entry.shoulderMin, entry.shoulderMax, fit);

  if (chartChest !== undefined) fromChart.push('chest');
  if (chartWaist !== undefined) fromChart.push('waist');
  if (chartHip !== undefined) fromChart.push('hip');
  if (chartShoulder !== undefined) fromChart.push('shoulder');

  // Typical drop ratios fill any dimension the reference chart doesn't list.
  const waist = chartWaist ?? round1((chartChest ?? (womens ? 88 : 96)) - (womens ? 18 : 14));
  const chest = chartChest ?? round1(waist + (womens ? 18 : 14));
  const hip = chartHip ?? round1(waist + (womens ? 24 : 16));
  const shoulder = chartShoulder ?? round1(chest * (womens ? 0.45 : 0.46));

  return { chest, waist, hip, shoulder, fromChart };
}

export function translateSize(input: TranslationInput): TranslationOutput | null {
  const referenceBrand = BRANDS.find((b) => b.id === input.brandId);
  const resolution = resolveChart(input.brandId, input.category, input.gender);
  const referenceEntry = resolution?.chart.entries.find((e) => e.size === input.size);
  if (!referenceBrand || !resolution || !referenceEntry) return null;

  const implied = estimateBody(referenceEntry, input.gender, input.fit);

  const body: BodyMeasurements = {
    height: 0,
    chest: implied.chest,
    waist: implied.waist,
    hip: implied.hip,
    shoulder: implied.shoulder,
    inseam: 0, // unknown from a size label, so no leg-length suggestion
    gender: chartGenderFor(input.gender),
    // The reference size already reflects how the user likes clothes to fit.
    fitPreference: 'regular',
    unit: 'cm',
  };

  const primaryDimension = input.category === 'tops' ? 'Chest' : 'Waist';

  const translations: BrandTranslation[] = [];
  for (const brand of BRANDS) {
    if (brand.id === referenceBrand.id || !brand.categories.includes(input.category)) continue;
    const result = recommendSize({ brandId: brand.id, category: input.category, measurements: body });
    if (!result) continue;

    const primary = result.dimensionBreakdowns.find((d) => d.dimension === primaryDimension);
    let betweenSizes: BrandTranslation['betweenSizes'];
    const alt = result.alternativeSize;
    if (primary && alt) {
      const span = primary.brandRange.max - primary.brandRange.min || 1;
      const pos = (primary.userMeasurement - primary.brandRange.min) / span;
      // Flag the neighbouring size when the estimate is in the outer 20% of the range
      // (or outside it) on the side that neighbour lies.
      if (alt.direction === 'size_up' && pos >= 0.8) betweenSizes = { size: alt.size, direction: 'size_up' };
      if (alt.direction === 'size_down' && pos <= 0.2) betweenSizes = { size: alt.size, direction: 'size_down' };
    }

    translations.push({ brand, result, primary, betweenSizes });
  }

  return {
    referenceBrand,
    referenceEntry,
    referenceChartNote: resolution.note,
    implied,
    translations,
  };
}
