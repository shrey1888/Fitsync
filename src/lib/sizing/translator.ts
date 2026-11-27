import { GenderCategory } from '../types';
import {
  CATEGORY_META,
  RegionCode,
  TRANSLATOR_BRANDS,
  TRANSLATOR_CHARTS,
  TranslatorBrand,
  TranslatorCategory,
  TranslatorChart,
  TranslatorChartEntry,
} from './translatorData';

export type { TranslatorCategory, RegionCode } from './translatorData';
export { CATEGORY_META, TRANSLATOR_BRANDS } from './translatorData';

export type FitFeedback = 'tight' | 'perfect' | 'loose';
export type MeasurementKey = 'chest' | 'shoulder' | 'waist' | 'hip' | 'sleeve' | 'length';

export interface TranslationInput {
  brandId: string;
  category: TranslatorCategory;
  size: string;
  gender: GenderCategory;
  fit: FitFeedback;
  region?: RegionCode;
}

export interface ImpliedMeasurements {
  chest?: number;
  shoulder?: number;
  waist?: number;
  hip?: number;
  sleeve?: number;
  length?: number;
  fromChart: MeasurementKey[];
}

export interface DimensionComparison {
  dimension: MeasurementKey;
  label: string;
  estimatedValue: number;
  targetMin: number;
  targetMax: number;
  delta: number;
  status: 'too_tight' | 'snug' | 'perfect' | 'roomy' | 'too_large';
}

export interface BrandTranslation {
  brand: TranslatorBrand;
  status: 'available' | 'unavailable';
  unavailableReason?: string;
  recommendedSize?: string;
  regionalEquivalent?: string;
  confidenceScore?: number; // capped below 95% when estimated from size label
  confidenceLevel?: 'High' | 'Moderate' | 'Low';
  primary?: DimensionComparison;
  comparisons: DimensionComparison[];
  chartNote?: string;
  betweenSizes?: {
    size: string;
    direction: 'size_up' | 'size_down';
    explanation: string;
  };
}

export interface TranslationOutput {
  referenceBrand: TranslatorBrand;
  referenceEntry: TranslatorChartEntry;
  referenceChartNote: string;
  category: TranslatorCategory;
  region: RegionCode;
  implied: ImpliedMeasurements;
  translations: BrandTranslation[];
}

const DIM_LABELS: Record<MeasurementKey, string> = {
  chest: 'Chest',
  shoulder: 'Shoulder',
  waist: 'Waist',
  hip: 'Hip',
  sleeve: 'Sleeve',
  length: 'Length',
};

const CATEGORY_WEIGHTS: Record<TranslatorCategory, Partial<Record<MeasurementKey, number>>> = {
  tshirts: { chest: 0.55, shoulder: 0.3, length: 0.15 },
  shirts: { chest: 0.4, shoulder: 0.25, waist: 0.2, sleeve: 0.1, length: 0.05 },
  jackets: { chest: 0.45, shoulder: 0.25, sleeve: 0.2, length: 0.1 },
  hoodies: { chest: 0.5, shoulder: 0.2, sleeve: 0.15, length: 0.15 },
  sweatshirts: { chest: 0.5, shoulder: 0.2, sleeve: 0.15, length: 0.15 },
  jeans: { waist: 0.55, hip: 0.35, length: 0.1 },
  trousers: { waist: 0.55, hip: 0.35, length: 0.1 },
};

/**
 * Regional offset (in cm) when interpreting a user's reference size label
 * relative to the brand's native grading region.
 * e.g. India sizing typically runs ~1.5cm trimmer than EU and ~3cm trimmer than US.
 */
const REGION_OFFSET_CM: Record<RegionCode, number> = {
  IN: -1.5,
  EU: 0,
  UK: 0.5,
  US: 1.5,
};

export const chartDeptFor = (gender: GenderCategory | undefined): Exclude<GenderCategory, 'unisex'> =>
  gender === 'womenswear' ? 'womenswear' : 'menswear';

function findTranslatorChart(
  brandId: string,
  category: TranslatorCategory,
  gender: GenderCategory
): TranslatorChart | null {
  const dept = chartDeptFor(gender);
  return (
    TRANSLATOR_CHARTS.find(
      (c) => c.brandId === brandId && c.category === category && c.gender === dept
    ) ?? null
  );
}

/** Brands that have a reliable size chart for the given category and department. */
export function brandsForCategory(
  category: TranslatorCategory,
  gender: GenderCategory
): TranslatorBrand[] {
  return TRANSLATOR_BRANDS.filter((b) => findTranslatorChart(b.id, category, gender) !== null);
}

/** Sizes available for a brand in the given category and department. */
export function availableSizes(
  brandId: string,
  category: TranslatorCategory,
  gender: GenderCategory
): string[] {
  return findTranslatorChart(brandId, category, gender)?.entries.map((e) => e.size) ?? [];
}

const FIT_POSITION: Record<FitFeedback, { t: number; nudge: number }> = {
  loose: { t: 0.15, nudge: -1 },
  perfect: { t: 0.5, nudge: 0 },
  tight: { t: 0.85, nudge: 1 },
};

const round1 = (v: number) => Math.round(v * 10) / 10;

function pickValue(min: number | undefined, max: number | undefined, fit: FitFeedback, regionalDelta: number): number | undefined {
  if (min === undefined) return undefined;
  const hi = max ?? min;
  const { t, nudge } = FIT_POSITION[fit];
  return round1(min + (hi - min) * t + nudge + regionalDelta);
}

function getEntryRange(entry: TranslatorChartEntry, dim: MeasurementKey): [number, number] | null {
  const map: Record<MeasurementKey, [number | undefined, number | undefined]> = {
    chest: [entry.chestMin, entry.chestMax],
    shoulder: [entry.shoulderMin, entry.shoulderMax],
    waist: [entry.waistMin, entry.waistMax],
    hip: [entry.hipMin, entry.hipMax],
    sleeve: [entry.sleeveMin, entry.sleeveMax],
    length: [entry.lengthMin, entry.lengthMax],
  };
  const [min, max] = map[dim];
  if (min === undefined) return null;
  return [min, max ?? min];
}

function estimateFromReference(
  entry: TranslatorChartEntry,
  category: TranslatorCategory,
  gender: GenderCategory,
  fit: FitFeedback,
  regionalDelta: number
): ImpliedMeasurements {
  const meta = CATEGORY_META.find((c) => c.id === category)!;
  const fromChart: MeasurementKey[] = [];
  const result: ImpliedMeasurements = { fromChart };

  for (const dim of meta.relevantDimensions) {
    const range = getEntryRange(entry, dim);
    if (range) {
      // Apply regional delta primarily to circumference dimensions (chest, waist, hip)
      const delta = dim === 'chest' || dim === 'waist' || dim === 'hip' ? regionalDelta : 0;
      const val = pickValue(range[0], range[1], fit, delta);
      if (val !== undefined) {
        result[dim] = val;
        fromChart.push(dim);
      }
    }
  }

  // Fill any missing category-relevant dimensions using anatomical proportions
  const womens = chartDeptFor(gender) === 'womenswear';
  if (meta.group === 'upper') {
    const chest = result.chest ?? (womens ? 88 : 96);
    if (result.chest === undefined) result.chest = chest;
    if (meta.relevantDimensions.includes('shoulder') && result.shoulder === undefined) {
      result.shoulder = round1(chest * (womens ? 0.44 : 0.455));
    }
    if (meta.relevantDimensions.includes('waist') && result.waist === undefined) {
      result.waist = round1(chest - (womens ? 18 : 14));
    }
  } else {
    const waist = result.waist ?? (womens ? 70 : 82);
    if (result.waist === undefined) result.waist = waist;
    if (meta.relevantDimensions.includes('hip') && result.hip === undefined) {
      result.hip = round1(waist + (womens ? 24 : 16));
    }
  }

  return result;
}

function scoreEntry(
  entry: TranslatorChartEntry,
  implied: ImpliedMeasurements,
  category: TranslatorCategory
): { score: number; comparisons: DimensionComparison[] } {
  const weights = CATEGORY_WEIGHTS[category];
  const comparisons: DimensionComparison[] = [];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [dimKey, weight] of Object.entries(weights) as Array<[MeasurementKey, number]>) {
    const userVal = implied[dimKey];
    const range = getEntryRange(entry, dimKey);
    if (userVal === undefined || !range || !weight) continue;

    const [min, max] = range;
    const mid = (min + max) / 2;
    const delta = round1(userVal - mid);
    totalWeight += weight;

    let dimScore = 100;
    let status: DimensionComparison['status'] = 'perfect';

    if (userVal < min - 2) {
      status = 'too_large';
      dimScore = Math.max(20, 100 - (min - userVal) * 14);
    } else if (userVal < min) {
      status = 'roomy';
      dimScore = Math.max(70, 92 - (min - userVal) * 8);
    } else if (userVal > max + 2) {
      status = 'too_tight';
      dimScore = Math.max(15, 100 - (userVal - max) * 18);
    } else if (userVal > max) {
      status = 'snug';
      dimScore = Math.max(68, 90 - (userVal - max) * 10);
    } else {
      // Inside range: peak at midpoint, taper gently toward edges
      const halfSpan = Math.max(1, (max - min) / 2);
      const normDist = Math.abs(userVal - mid) / halfSpan;
      dimScore = 98 - normDist * 10;
    }

    comparisons.push({
      dimension: dimKey,
      label: DIM_LABELS[dimKey],
      estimatedValue: userVal,
      targetMin: min,
      targetMax: max,
      delta,
      status,
    });

    weightedSum += dimScore * weight;
  }

  const score = totalWeight > 0 ? weightedSum / totalWeight : 0;
  return { score, comparisons };
}

function formatRegionalEquivalent(size: string, brandRegion: RegionCode, userRegion: RegionCode): string | undefined {
  if (brandRegion === userRegion) return undefined;
  const alphaOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const idx = alphaOrder.indexOf(size);
  if (idx !== -1) {
    // India alpha labels often sit one step higher than US labels
    if (brandRegion === 'US' && userRegion === 'IN' && idx + 1 < alphaOrder.length) {
      return `IN ${alphaOrder[idx + 1]}`;
    }
    if (brandRegion === 'EU' && userRegion === 'US' && idx - 1 >= 0) {
      return `US ${alphaOrder[idx - 1]}`;
    }
    if (brandRegion === 'EU' && userRegion === 'IN' && idx + 1 < alphaOrder.length) {
      return `IN ${alphaOrder[idx + 1]}`;
    }
  }

  // UK women's numeric dress/tee sizing (UK 6..18 <-> EU 34..46 / US 2..14)
  const ukMatch = /^UK\s*(\d+)$/i.exec(size);
  if (ukMatch) {
    const uk = Number(ukMatch[1]);
    if (userRegion === 'EU') return `EU ${uk + 28}`;
    if (userRegion === 'US') return `US ${Math.max(0, uk - 4)}`;
    if (userRegion === 'IN') return `IN ${uk + 28}`;
  }

  // EU men's/women's trouser numeric (34..48) <-> US/IN waist inches
  if (/^\d{2}$/.test(size)) {
    const num = Number(size);
    if (brandRegion === 'EU' && num >= 34 && num <= 48 && (userRegion === 'US' || userRegion === 'UK' || userRegion === 'IN')) {
      return `${userRegion} ${num - 10}`;
    }
    if (brandRegion === 'US' && num >= 24 && num <= 38 && userRegion === 'EU') {
      return `EU ${num + 10}`;
    }
  }

  return `${brandRegion} ${size}`;
}

export function translateSize(input: TranslationInput): TranslationOutput | null {
  const region: RegionCode = input.region ?? 'EU';
  const referenceBrand = TRANSLATOR_BRANDS.find((b) => b.id === input.brandId);
  const referenceChart = findTranslatorChart(input.brandId, input.category, input.gender);
  const referenceEntry = referenceChart?.entries.find((e) => e.size === input.size);

  if (!referenceBrand || !referenceChart || !referenceEntry) return null;

  // Regional adjustment if the user's selected region differs from the reference brand's native region
  const regionalDelta = REGION_OFFSET_CM[region] - REGION_OFFSET_CM[referenceBrand.nativeRegion];
  const implied = estimateFromReference(referenceEntry, input.category, input.gender, input.fit, regionalDelta);

  const meta = CATEGORY_META.find((c) => c.id === input.category)!;
  const primaryDim: MeasurementKey = meta.group === 'upper' ? 'chest' : 'waist';

  const translations: BrandTranslation[] = [];

  for (const brand of TRANSLATOR_BRANDS) {
    if (brand.id === referenceBrand.id) continue;

    const targetChart = findTranslatorChart(brand.id, input.category, input.gender);
    if (!targetChart || targetChart.entries.length === 0) {
      translations.push({
        brand,
        status: 'unavailable',
        unavailableReason: 'Size information unavailable.',
        comparisons: [],
      });
      continue;
    }

    const scored = targetChart.entries.map((e, index) => {
      const { score, comparisons } = scoreEntry(e, implied, input.category);
      return { entry: e, index, score, comparisons };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    const runnerUp = scored[1];

    // Never claim 100% accuracy when converting from a size label without tape measurements
    const confidenceScore = Math.min(93, Math.max(48, Math.round(best.score * 0.94)));
    const confidenceLevel: 'High' | 'Moderate' | 'Low' =
      confidenceScore >= 82 ? 'High' : confidenceScore >= 68 ? 'Moderate' : 'Low';

    const primary = best.comparisons.find((c) => c.dimension === primaryDim);

    // Explain if two sizes are close or the estimate sits near the boundary
    let betweenSizes: BrandTranslation['betweenSizes'];
    if (runnerUp && primary) {
      const scoreGap = best.score - runnerUp.score;
      const span = primary.targetMax - primary.targetMin || 1;
      const pos = (primary.estimatedValue - primary.targetMin) / span;
      const isUpperBound = runnerUp.index > best.index && (pos >= 0.75 || scoreGap <= 6);
      const isLowerBound = runnerUp.index < best.index && (pos <= 0.25 || scoreGap <= 6);

      if (isUpperBound) {
        betweenSizes = {
          size: runnerUp.entry.size,
          direction: 'size_up',
          explanation: `${best.entry.size} gives a closer fit; choose ${runnerUp.entry.size} for extra ${primary.label.toLowerCase()} room.`,
        };
      } else if (isLowerBound) {
        betweenSizes = {
          size: runnerUp.entry.size,
          direction: 'size_down',
          explanation: `${best.entry.size} gives comfortable ease; choose ${runnerUp.entry.size} for a trimmer silhouette.`,
        };
      }
    }

    translations.push({
      brand,
      status: 'available',
      recommendedSize: best.entry.size,
      regionalEquivalent: formatRegionalEquivalent(best.entry.size, brand.nativeRegion, region),
      confidenceScore,
      confidenceLevel,
      primary,
      comparisons: best.comparisons,
      chartNote: targetChart.sourceNote,
      betweenSizes,
    });
  }

  return {
    referenceBrand,
    referenceEntry,
    referenceChartNote: referenceChart.sourceNote,
    category: input.category,
    region,
    implied,
    translations,
  };
}
