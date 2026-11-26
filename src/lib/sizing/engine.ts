import {
  BodyMeasurements,
  Brand,
  ClothingCategory,
  DimensionBreakdown,
  GenderCategory,
  Product,
  RecommendationResult,
  SizeChart,
  SizeChartEntry,
} from '../types';
import { BRANDS, PRODUCTS, SIZE_CHARTS } from '../data/brands';

interface EngineOptions {
  brandId: string;
  category: ClothingCategory;
  productId?: string;
  measurements: BodyMeasurements;
}

export interface ChartResolution {
  chart: SizeChart;
  /** Human-readable note when the chart was borrowed from another category or department. */
  note?: string;
}

const CATEGORY_LABEL: Record<ClothingCategory, string> = {
  tops: 'tops',
  bottoms: 'bottoms',
  outerwear: 'outerwear',
  dresses: 'dresses',
};

/** Unisex garments follow menswear grading at every brand in the catalogue. */
export const chartGenderFor = (gender: GenderCategory | undefined): Exclude<GenderCategory, 'unisex'> =>
  gender === 'womenswear' ? 'womenswear' : 'menswear';

const findBrandChart = (brandId: string, category: ClothingCategory, gender: GenderCategory) =>
  SIZE_CHARTS.find(
    (sc) => sc.brandId === brandId && sc.category === category && sc.gender === gender && !sc.isProductSpecific
  );

/**
 * Picks the size chart for a brand/category/department.
 *
 * Only ever returns a chart that belongs to the requested brand. (Previously a
 * missing chart silently fell back to the first chart in the catalogue, so e.g.
 * Levi's tops were sized with Zara's chart and every brand's outerwear used
 * Zara's tops chart.) Returns null when the brand has nothing usable.
 */
export function resolveChart(
  brandId: string,
  category: ClothingCategory,
  gender: GenderCategory | undefined,
  productId?: string
): ChartResolution | null {
  if (productId) {
    const productChart = SIZE_CHARTS.find((sc) => sc.productId === productId && sc.category === category);
    if (productChart) return { chart: productChart };
  }

  const dept = chartGenderFor(gender);
  const brandName = BRANDS.find((b) => b.id === brandId)?.name ?? brandId;

  const direct = findBrandChart(brandId, category, dept);
  if (direct) return { chart: direct };

  // Jackets, coats and dresses are graded on the same body chart as tops.
  if (category === 'outerwear' || category === 'dresses') {
    const tops = findBrandChart(brandId, 'tops', dept);
    if (tops) {
      return {
        chart: tops,
        note: `${brandName} grades ${CATEGORY_LABEL[category]} on its tops body chart; a layering allowance has been applied.`,
      };
    }
  }

  const otherDept = dept === 'menswear' ? 'womenswear' : 'menswear';
  const other = findBrandChart(brandId, category, otherDept);
  if (other) {
    return {
      chart: other,
      note: `${brandName} has no ${dept} ${CATEGORY_LABEL[category]} chart on file, so ${otherDept} grading was used.`,
    };
  }

  return null;
}

const humanize = (s: string) => s.replace(/_/g, ' ');

/** "Zara" -> "Zara's", "Levi's" -> "Levi's" (not "Levi's's"). */
export const possessive = (name: string) => (/'s$/i.test(name) ? name : `${name}'s`);

export function recommendSize(options: EngineOptions): RecommendationResult | null {
  const { brandId, category, productId, measurements } = options;

  const brand: Brand | undefined = BRANDS.find((b) => b.id === brandId);
  if (!brand) return null;

  const product: Product | undefined = productId ? PRODUCTS.find((p) => p.id === productId) : undefined;

  const resolution = resolveChart(brandId, category, measurements.gender, productId);
  if (!resolution || resolution.chart.entries.length === 0) return null;
  const activeChart = resolution.chart;

  const isProductSpecificData = !!activeChart.isProductSpecific;
  const missingNotices: string[] = [];
  const isUpper = category === 'tops' || category === 'outerwear' || category === 'dresses';

  if (!measurements.chest && isUpper) {
    missingNotices.push('Chest measurement is missing (critical for tops)');
  }
  if (!measurements.waist && category === 'bottoms') {
    missingNotices.push('Waist measurement is missing (critical for bottoms)');
  }
  if (!measurements.shoulder && isUpper && activeChart.entries.some((e) => e.shoulderMin !== undefined)) {
    missingNotices.push('Shoulder width was estimated based on standard proportional grading');
  }
  if (!measurements.hip && category === 'bottoms') {
    missingNotices.push('Hip measurement was estimated based on waist proportion');
  }

  // Layering allowance: a coat goes over a shirt or knit, so aim a little bigger.
  const layeringOffset = category === 'outerwear' ? -2 : 0;

  interface ScoredEntry {
    entry: SizeChartEntry;
    index: number;
    totalScore: number;
    breakdowns: DimensionBreakdown[];
    fitTension: number; // negative = too tight, 0 = neutral/ideal, positive = roomy
  }

  // Each dimension is only scored when the chart actually provides a range for it,
  // so missing data never shows up as an invented range in the breakdown table.
  const scoredEntries: ScoredEntry[] = activeChart.entries.map((entry, index) => {
    const breakdowns: DimensionBreakdown[] = [];
    let weightedScoreSum = 0;
    let totalWeights = 0;
    let fitTensionSum = 0;

    // A. CHEST (tops, outerwear, dresses)
    if (isUpper && (entry.chestMin !== undefined || entry.garmentChest !== undefined)) {
      const weight = category === 'outerwear' ? 0.4 : 0.45;
      totalWeights += weight;

      const chestVal = measurements.chest || (measurements.gender === 'womenswear' ? 88 : 96);
      const min = entry.chestMin ?? entry.garmentChest! - 8;
      const max = entry.chestMax ?? entry.garmentChest! - 2;
      const target = (min + max) / 2;

      let prefOffset = 0;
      if (measurements.fitPreference === 'slim') prefOffset = -1.5;
      if (measurements.fitPreference === 'relaxed') prefOffset = +2.5;
      if (measurements.fitPreference === 'oversized') prefOffset = +4.5;

      const effectiveTarget = target + prefOffset + layeringOffset;
      const delta = chestVal - effectiveTarget;

      let dimScore: number;
      let status: DimensionBreakdown['status'];
      let feedback: string;

      if (chestVal < min - 2) {
        status = 'too_large';
        dimScore = Math.max(30, 100 - Math.abs(chestVal - min) * 12);
        feedback = 'Excess fabric slack across the chest and armpits.';
        fitTensionSum += 2;
      } else if (chestVal < min) {
        status = 'roomy';
        dimScore = 86;
        feedback = 'Comfortable ease with slight room around the chest.';
        fitTensionSum += 1;
      } else if (chestVal > max + 3) {
        status = 'too_tight';
        dimScore = Math.max(15, 100 - Math.abs(chestVal - max) * 16);
        feedback = 'Restricting fit. High risk of button gaping and chest pull.';
        fitTensionSum -= 3;
      } else if (chestVal > max) {
        status = 'snug';
        dimScore = 82;
        feedback = 'Fitted contour with minimal ease across the pecs.';
        fitTensionSum -= 1;
      } else {
        status = 'perfect';
        dimScore = 98 - Math.abs(delta) * 3;
        feedback = 'Optimal garment ease aligned with your body contour.';
      }

      breakdowns.push({
        dimension: 'Chest',
        userMeasurement: chestVal,
        brandRange: { min, max, target: Math.round(target) },
        delta: Math.round(delta * 10) / 10,
        status,
        feedback,
        weight,
      });

      weightedScoreSum += dimScore * weight;
    }

    // B. SHOULDER WIDTH (tops, outerwear) — only when the chart lists shoulders
    if (isUpper && entry.shoulderMin !== undefined) {
      const weight = category === 'outerwear' ? 0.35 : 0.3;
      totalWeights += weight;

      const shoulderVal = measurements.shoulder || (measurements.gender === 'womenswear' ? 39 : 44);
      const min = entry.shoulderMin;
      const max = entry.shoulderMax ?? min + 2;
      const target = (min + max) / 2;
      const delta = shoulderVal - target;

      let dimScore: number;
      let status: DimensionBreakdown['status'];
      let feedback = 'Shoulder seam sits precisely at the acromion bone.';

      if (shoulderVal > max + 2) {
        status = 'too_tight';
        dimScore = Math.max(25, 100 - (shoulderVal - max) * 18);
        feedback = 'Seam rides up onto the clavicle; constricts shoulder roll.';
        fitTensionSum -= 2;
      } else if (shoulderVal > max) {
        status = 'snug';
        dimScore = 84;
        feedback = 'Trim European shoulder line.';
        fitTensionSum -= 1;
      } else if (shoulderVal < min - 2) {
        status = 'too_large';
        dimScore = 70;
        feedback = 'Shoulder seam drops past the shoulder edge.';
        fitTensionSum += 2;
      } else if (shoulderVal < min) {
        status = 'roomy';
        dimScore = 88;
        feedback = 'Slight relaxed drop on the shoulder point.';
        fitTensionSum += 1;
      } else {
        status = 'perfect';
        dimScore = 96 - Math.abs(delta) * 4;
      }

      breakdowns.push({
        dimension: 'Shoulder',
        userMeasurement: shoulderVal,
        brandRange: { min, max, target: Math.round(target * 10) / 10 },
        delta: Math.round(delta * 10) / 10,
        status,
        feedback,
        weight,
      });

      weightedScoreSum += dimScore * weight;
    }

    // C. WAIST (bottoms primarily; tops when the chart lists it)
    if (entry.waistMin !== undefined || entry.garmentWaist !== undefined) {
      const waistVal = measurements.waist || (measurements.gender === 'womenswear' ? 70 : 82);
      const weight = category === 'bottoms' ? 0.5 : 0.15;
      totalWeights += weight;

      const min = entry.waistMin ?? entry.garmentWaist! - 2;
      const max = entry.waistMax ?? entry.garmentWaist! + 2;
      const target = (min + max) / 2;

      let prefOffset = 0;
      if (category === 'bottoms') {
        if (measurements.fitPreference === 'slim') prefOffset = -0.5;
        if (measurements.fitPreference === 'relaxed') prefOffset = +1.5;
      }

      const delta = waistVal - (target + prefOffset);
      let dimScore: number;
      let status: DimensionBreakdown['status'];
      let feedback = 'Comfortable waistband sitting without cutting into waist.';

      if (waistVal > max + 2) {
        status = 'too_tight';
        dimScore = Math.max(10, 100 - (waistVal - max) * 20);
        feedback =
          category === 'bottoms' ? 'Waistband will pinch tightly and restrict breathing.' : 'Torso pull around midsection.';
        fitTensionSum -= 3;
      } else if (waistVal > max) {
        status = 'snug';
        dimScore = 80;
        feedback = 'Snug waistband; zero tolerance for after-meal expansion.';
        fitTensionSum -= 1;
      } else if (waistVal < min - 3) {
        status = 'too_large';
        dimScore = Math.max(35, 100 - (min - waistVal) * 14);
        feedback =
          category === 'bottoms' ? 'Requires belt cinching; causes fabric bunching.' : 'Excess fabric slack around stomach.';
        fitTensionSum += 2;
      } else if (waistVal < min) {
        status = 'roomy';
        dimScore = 88;
        feedback = 'Relaxed ease through waistband.';
        fitTensionSum += 1;
      } else {
        status = 'perfect';
        dimScore = 98 - Math.abs(delta) * 3;
      }

      breakdowns.push({
        dimension: 'Waist',
        userMeasurement: waistVal,
        brandRange: { min, max, target: Math.round(target) },
        delta: Math.round(delta * 10) / 10,
        status,
        feedback,
        weight,
      });

      weightedScoreSum += dimScore * weight;
    }

    // D. HIP (bottoms)
    if (category === 'bottoms' && entry.hipMin !== undefined) {
      const weight = 0.35;
      totalWeights += weight;

      const hipVal = measurements.hip || (measurements.waist ? measurements.waist + 16 : 98);
      const min = entry.hipMin;
      const max = entry.hipMax ?? min + 4;
      const target = (min + max) / 2;
      const delta = hipVal - target;

      let dimScore: number;
      let status: DimensionBreakdown['status'];
      let feedback = 'Clean seat drape with proper rise comfort.';

      if (hipVal > max + 2) {
        status = 'too_tight';
        dimScore = Math.max(20, 100 - (hipVal - max) * 16);
        feedback = 'Tight pull across seat and thighs.';
        fitTensionSum -= 2;
      } else if (hipVal > max) {
        status = 'snug';
        dimScore = 82;
        feedback = 'Form-hugging through hips.';
        fitTensionSum -= 1;
      } else if (hipVal < min - 2) {
        status = 'too_large';
        dimScore = 75;
        feedback = 'Loose sag in the seat and posterior thighs.';
        fitTensionSum += 2;
      } else if (hipVal < min) {
        status = 'roomy';
        dimScore = 88;
        feedback = 'Relaxed seat and thigh volume.';
        fitTensionSum += 1;
      } else {
        status = 'perfect';
        dimScore = 96 - Math.abs(delta) * 3;
      }

      breakdowns.push({
        dimension: 'Hip',
        userMeasurement: hipVal,
        brandRange: { min, max, target: Math.round(target) },
        delta: Math.round(delta * 10) / 10,
        status,
        feedback,
        weight,
      });

      weightedScoreSum += dimScore * weight;
    }

    // E. INSEAM (bottoms with per-size inseam ranges)
    if (category === 'bottoms' && entry.inseamMin !== undefined && measurements.inseam) {
      const weight = 0.15;
      totalWeights += weight;
      const inseamVal = measurements.inseam;
      const min = entry.inseamMin;
      const max = entry.inseamMax ?? min + 6;
      const target = (min + max) / 2;
      const delta = inseamVal - target;

      let status: DimensionBreakdown['status'] = 'perfect';
      let feedback = 'Clean break at the footwear collar.';
      if (inseamVal > max + 3) {
        status = 'too_tight'; // leg too short for the user
        feedback = 'Cropped ankle exposure; short inseam length.';
      } else if (inseamVal < min - 3) {
        status = 'too_large'; // leg too long for the user
        feedback = 'Full fabric stacking over shoes; may require tailor hemming.';
      }

      breakdowns.push({
        dimension: 'Inseam',
        userMeasurement: inseamVal,
        brandRange: { min, max, target: Math.round(target) },
        delta: Math.round(delta * 10) / 10,
        status,
        feedback,
        weight,
      });

      weightedScoreSum += Math.max(60, 100 - Math.abs(delta) * 4) * weight;
    }

    const totalScore = totalWeights > 0 ? weightedScoreSum / totalWeights : 70;

    return {
      entry,
      index,
      totalScore: Math.round(totalScore * 10) / 10,
      breakdowns,
      fitTension: fitTensionSum,
    };
  });

  // Highest suitability first; ties go to the smaller size (chart order).
  const ranked = [...scoredEntries].sort((a, b) => b.totalScore - a.totalScore || a.index - b.index);

  const bestMatch = ranked[0];
  const secondBest = ranked[1];

  // Leg length for denim-style charts (Levi's W32 / L32).
  let recommendedLength: string | undefined;
  const breakdowns = [...bestMatch.breakdowns];
  if (category === 'bottoms' && activeChart.lengthOptions?.length && measurements.inseam) {
    const inseamVal = measurements.inseam;
    const best = activeChart.lengthOptions.reduce((acc, opt) =>
      Math.abs(opt.inseam - inseamVal) < Math.abs(acc.inseam - inseamVal) ? opt : acc
    );
    recommendedLength = best.label;
    const delta = Math.round((inseamVal - best.inseam) * 10) / 10;

    let status: DimensionBreakdown['status'] = 'perfect';
    let feedback = `L${best.label} gives a clean break at the shoe.`;
    if (delta > 3) {
      status = 'too_tight';
      feedback = `Even L${best.label} sits above the ankle; look for a longer length.`;
    } else if (delta < -3) {
      status = 'too_large';
      feedback = `L${best.label} will stack over your shoes; plan for a hem.`;
    }

    breakdowns.push({
      dimension: 'Inseam',
      userMeasurement: inseamVal,
      brandRange: { min: best.inseam - 2.5, max: best.inseam + 2.5, target: best.inseam },
      delta,
      status,
      feedback,
      weight: 0,
    });
  }

  let confidenceScore = Math.min(99, Math.max(45, Math.round(bestMatch.totalScore)));
  if (missingNotices.length > 0) {
    confidenceScore = Math.max(50, confidenceScore - missingNotices.length * 8);
  }

  let confidenceLevel: 'High' | 'Moderate' | 'Low' = 'High';
  if (confidenceScore < 72) confidenceLevel = 'Low';
  else if (confidenceScore < 85) confidenceLevel = 'Moderate';

  // Alternative size recommendation
  let alternativeSize: RecommendationResult['alternativeSize'];
  if (secondBest) {
    if (secondBest.index > bestMatch.index) {
      alternativeSize = {
        size: secondBest.entry.size,
        direction: 'size_up',
        reason:
          measurements.fitPreference === 'relaxed' || measurements.fitPreference === 'oversized'
            ? `Consider ${secondBest.entry.size} for an authentic streetwear drape or layering over mid-layers.`
            : category === 'bottoms'
            ? `Size up to ${secondBest.entry.size} for a more forgiving waistband and seat.`
            : `Size up to ${secondBest.entry.size} if you have broader shoulders or prefer an unconstricted drape.`,
      };
    } else if (secondBest.index < bestMatch.index) {
      alternativeSize = {
        size: secondBest.entry.size,
        direction: 'size_down',
        reason:
          category === 'bottoms'
            ? `Choose ${secondBest.entry.size} for a closer waistband; rigid denim and stretch fabrics relax with wear.`
            : `Choose ${secondBest.entry.size} if you want a sharper, closer-fitting silhouette.`,
      };
    }
  }

  // Assess fit character
  let fitAssessment: RecommendationResult['fitAssessment'];
  if (measurements.fitPreference === 'slim' || bestMatch.fitTension < -1) {
    fitAssessment = 'Fitted / Snug';
  } else if (measurements.fitPreference === 'oversized' || bestMatch.fitTension > 2) {
    fitAssessment = 'Oversized Silhouette';
  } else if (measurements.fitPreference === 'relaxed' || bestMatch.fitTension > 0) {
    fitAssessment = 'Relaxed Drape';
  } else {
    fitAssessment = 'True Tailored';
  }

  // Transparent editorial reasoning
  const brandName = brand.name;
  const sizeName = bestMatch.entry.size;
  let summaryReason: string;

  if (isUpper) {
    const chestBreakdown = breakdowns.find((b) => b.dimension === 'Chest');
    const shoulderBreakdown = breakdowns.find((b) => b.dimension === 'Shoulder');

    summaryReason = `${possessive(brandName)} ${sizeName} accommodates your ${chestBreakdown?.userMeasurement ?? measurements.chest}cm chest with ${
      measurements.fitPreference === 'slim' ? 'tailored European contours' : 'ideal ergonomic ease'
    }.`;

    if (shoulderBreakdown && shoulderBreakdown.status === 'perfect') {
      summaryReason += ` Shoulder alignment is exact at ${shoulderBreakdown.userMeasurement}cm.`;
    }
  } else {
    const waistBreakdown = breakdowns.find((b) => b.dimension === 'Waist');
    const sizeLabel = recommendedLength ? `${sizeName} × L${recommendedLength}` : sizeName;
    summaryReason = `${brandName} size ${sizeLabel} provides a precise ${
      waistBreakdown?.userMeasurement ?? measurements.waist
    }cm waistband fit with natural seat ease around the hips.`;
  }

  const easeExplanation = isProductSpecificData
    ? `Calculated using verified product-specific garment patterns. Accounting for intentional fabric ease (+${
        measurements.fitPreference === 'oversized' ? '12-16cm' : '4-8cm'
      }) beyond raw skin-to-tape dimensions.`
    : `Calculated against ${possessive(brandName)} master anatomical grading charts, calibrated with ${humanize(
        brand.sizingTendency
      )} ease curves.`;

  return {
    brand,
    category,
    product,
    recommendedSize: sizeName,
    recommendedLength,
    confidenceScore,
    confidenceLevel,
    alternativeSize,
    fitAssessment,
    summaryReason,
    easeExplanation,
    dimensionBreakdowns: breakdowns,
    missingMeasurementsNotice: missingNotices.length > 0 ? missingNotices : undefined,
    isProductSpecificData,
    chartId: activeChart.id,
    chartNote: resolution.note,
    calculatedAt: '',
  };
}

export function batchRecommendSizes(
  measurements: BodyMeasurements,
  category: ClothingCategory = 'tops'
): RecommendationResult[] {
  return BRANDS.map((brand) => recommendSize({ brandId: brand.id, category, measurements })).filter(
    (r): r is RecommendationResult => r !== null
  );
}
