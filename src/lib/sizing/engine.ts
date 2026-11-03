import {
  BodyMeasurements,
  Brand,
  ClothingCategory,
  DimensionBreakdown,
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

export function recommendSize(options: EngineOptions): RecommendationResult {
  const { brandId, category, productId, measurements } = options;

  // 1. Resolve Brand
  const brand = BRANDS.find((b) => b.id === brandId) || {
    id: brandId,
    slug: brandId,
    name: brandId.toUpperCase(),
    country: 'International',
    tagline: 'Global fashion standard',
    sizingPhilosophy: 'Standard sizing grading',
    sizingTendency: 'true_to_size',
    sizingNote: 'Standard retail ease',
    categories: [category],
    heroImage: '',
    website: '',
    founded: 2000,
  };

  // 2. Resolve Product if specified
  const product: Product | undefined = productId
    ? PRODUCTS.find((p) => p.id === productId)
    : undefined;

  // 3. Resolve Size Chart (Product-specific chart takes priority over general brand chart)
  let activeChart: SizeChart | undefined;

  if (productId) {
    activeChart = SIZE_CHARTS.find(
      (sc) => sc.productId === productId && sc.category === category
    );
  }

  if (!activeChart) {
    activeChart = SIZE_CHARTS.find(
      (sc) =>
        sc.brandId === brandId &&
        sc.category === category &&
        sc.gender === (measurements.gender || 'menswear') &&
        !sc.isProductSpecific
    );
  }

  // Fallback to any brand chart for this category
  if (!activeChart) {
    activeChart = SIZE_CHARTS.find(
      (sc) => sc.brandId === brandId && sc.category === category
    );
  }

  // Safety fallback if brand has no specific chart
  if (!activeChart) {
    activeChart = SIZE_CHARTS.find((sc) => sc.category === category) || SIZE_CHARTS[0];
  }

  const isProductSpecificData = !!activeChart.isProductSpecific;
  const missingNotices: string[] = [];

  // Track missing measurements
  if (!measurements.chest && (category === 'tops' || category === 'outerwear')) {
    missingNotices.push('Chest measurement is missing (critical for tops)');
  }
  if (!measurements.waist && category === 'bottoms') {
    missingNotices.push('Waist measurement is missing (critical for bottoms)');
  }
  if (!measurements.shoulder && (category === 'tops' || category === 'outerwear')) {
    missingNotices.push('Shoulder width was estimated based on standard proportional grading');
  }
  if (!measurements.hip && category === 'bottoms') {
    missingNotices.push('Hip measurement was estimated based on waist proportion');
  }

  // 4. Calculate Suitability Score for each size entry
  interface ScoredEntry {
    entry: SizeChartEntry;
    totalScore: number;
    breakdowns: DimensionBreakdown[];
    fitTension: number; // negative = too tight, 0 = neutral/ideal, positive = roomy
  }

  const scoredEntries: ScoredEntry[] = activeChart.entries.map((entry) => {
    const breakdowns: DimensionBreakdown[] = [];
    let weightedScoreSum = 0;
    let totalWeights = 0;
    let fitTensionSum = 0;

    // A. CHEST (For Tops & Outerwear)
    if (category === 'tops' || category === 'outerwear') {
      const weight = category === 'tops' ? 0.45 : 0.40;
      totalWeights += weight;

      const chestVal = measurements.chest || (measurements.gender === 'womenswear' ? 88 : 96);
      const min = entry.chestMin ?? (entry.garmentChest ? entry.garmentChest - 8 : 90);
      const max = entry.chestMax ?? (entry.garmentChest ? entry.garmentChest - 2 : 96);
      const target = (min + max) / 2;

      // Adjust target by fit preference
      let prefOffset = 0;
      if (measurements.fitPreference === 'slim') prefOffset = -1.5;
      if (measurements.fitPreference === 'relaxed') prefOffset = +2.5;
      if (measurements.fitPreference === 'oversized') prefOffset = +4.5;

      const effectiveTarget = target + prefOffset;
      const delta = chestVal - effectiveTarget;

      let dimScore = 100;
      let status: DimensionBreakdown['status'] = 'perfect';
      let feedback = 'Ideal chest drape and armscye freedom.';

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

    // B. SHOULDER WIDTH (For Tops & Outerwear)
    if ((category === 'tops' || category === 'outerwear') && (entry.shoulderMin || measurements.shoulder)) {
      const weight = category === 'tops' ? 0.30 : 0.35;
      totalWeights += weight;

      const shoulderVal = measurements.shoulder || 44;
      const min = entry.shoulderMin ?? (entry.chestMin ? entry.chestMin * 0.46 : 42);
      const max = entry.shoulderMax ?? min + 2;
      const target = (min + max) / 2;
      const delta = shoulderVal - target;

      let dimScore = 100;
      let status: DimensionBreakdown['status'] = 'perfect';
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

    // C. WAIST (For Bottoms, Tops, Outerwear)
    const waistVal = measurements.waist || (measurements.gender === 'womenswear' ? 70 : 82);
    if (category === 'bottoms' || entry.waistMin || category === 'tops') {
      const weight = category === 'bottoms' ? 0.50 : 0.15;
      totalWeights += weight;

      const min = entry.waistMin ?? (entry.garmentWaist ? entry.garmentWaist - 2 : 78);
      const max = entry.waistMax ?? (entry.garmentWaist ? entry.garmentWaist + 2 : min + 4);
      const target = (min + max) / 2;

      let prefOffset = 0;
      if (category === 'bottoms') {
        if (measurements.fitPreference === 'slim') prefOffset = -0.5;
        if (measurements.fitPreference === 'relaxed') prefOffset = +1.5;
      }

      const delta = waistVal - (target + prefOffset);
      let dimScore = 100;
      let status: DimensionBreakdown['status'] = 'perfect';
      let feedback = 'Comfortable waistband sitting without cutting into waist.';

      if (waistVal > max + 2) {
        status = 'too_tight';
        dimScore = Math.max(10, 100 - (waistVal - max) * 20);
        feedback = category === 'bottoms' ? 'Waistband will pinch tightly and restrict breathing.' : 'Torso pull around midsection.';
        fitTensionSum -= 3;
      } else if (waistVal > max) {
        status = 'snug';
        dimScore = 80;
        feedback = 'Snug waistband; zero tolerance for after-meal expansion.';
        fitTensionSum -= 1;
      } else if (waistVal < min - 3) {
        status = 'too_large';
        dimScore = Math.max(35, 100 - (min - waistVal) * 14);
        feedback = category === 'bottoms' ? 'Requires belt cinching; causes fabric bunching.' : 'Excess fabric slack around stomach.';
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

    // D. HIP (Primarily Bottoms)
    if (category === 'bottoms') {
      const weight = 0.35;
      totalWeights += weight;

      const hipVal = measurements.hip || (measurements.waist ? measurements.waist + 16 : 98);
      const min = entry.hipMin ?? 94;
      const max = entry.hipMax ?? min + 4;
      const target = (min + max) / 2;
      const delta = hipVal - target;

      let dimScore = 100;
      let status: DimensionBreakdown['status'] = 'perfect';
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

    // E. INSEAM / HEIGHT (For Bottoms / Long Garments)
    if (category === 'bottoms' && measurements.inseam) {
      const weight = 0.15;
      totalWeights += weight;
      const inseamVal = measurements.inseam;
      const min = entry.inseamMin ?? 78;
      const max = entry.inseamMax ?? 84;
      const target = (min + max) / 2;
      const delta = inseamVal - target;

      let status: DimensionBreakdown['status'] = 'perfect';
      let feedback = 'Clean break at the footwear collar.';

      if (inseamVal > max + 3) {
        status = 'too_tight'; // represents too short for user
        feedback = 'Cropped ankle exposure; short inseam length.';
      } else if (inseamVal < min - 3) {
        status = 'too_large'; // represents too long for user
        feedback = 'Full fabric stacking over shoes; may require tailor hemming.';
      }

      const dimScore = Math.max(60, 100 - Math.abs(delta) * 4);

      breakdowns.push({
        dimension: 'Inseam',
        userMeasurement: inseamVal,
        brandRange: { min, max, target: Math.round(target) },
        delta: Math.round(delta * 10) / 10,
        status,
        feedback,
        weight,
      });

      weightedScoreSum += dimScore * weight;
    }

    const totalScore = totalWeights > 0 ? weightedScoreSum / totalWeights : 70;

    return {
      entry,
      totalScore: Math.round(totalScore * 10) / 10,
      breakdowns,
      fitTension: fitTensionSum,
    };
  });

  // Sort by highest suitability score
  scoredEntries.sort((a, b) => b.totalScore - a.totalScore);

  const bestMatch = scoredEntries[0];
  const secondBest = scoredEntries[1];

  // Derive confidence level
  let confidenceScore = Math.min(99, Math.max(45, Math.round(bestMatch.totalScore)));
  if (missingNotices.length > 0) {
    confidenceScore = Math.max(50, confidenceScore - missingNotices.length * 8);
  }

  let confidenceLevel: 'High' | 'Moderate' | 'Low' = 'High';
  if (confidenceScore < 72) confidenceLevel = 'Low';
  else if (confidenceScore < 85) confidenceLevel = 'Moderate';

  // Determine alternative size recommendation
  let alternativeSize: RecommendationResult['alternativeSize'];
  if (secondBest) {
    const bestIndex = activeChart.entries.findIndex((e) => e.size === bestMatch.entry.size);
    const secondIndex = activeChart.entries.findIndex((e) => e.size === secondBest.entry.size);

    if (secondIndex > bestIndex) {
      // Sizing up
      alternativeSize = {
        size: secondBest.entry.size,
        direction: 'size_up',
        reason:
          measurements.fitPreference === 'relaxed' || measurements.fitPreference === 'oversized'
            ? `Consider ${secondBest.entry.size} for an authentic streetwear drape or layering over mid-layers.`
            : `Size up to ${secondBest.entry.size} if you have broader shoulders or prefer an unconstricted drape.`,
      };
    } else if (secondIndex < bestIndex) {
      // Sizing down
      alternativeSize = {
        size: secondBest.entry.size,
        direction: 'size_down',
        reason: `Choose ${secondBest.entry.size} if you desire a sharper, form-fitting European taper.`,
      };
    }
  }

  // Assess fit character
  let fitAssessment: RecommendationResult['fitAssessment'] = 'Natural Regular';
  if (measurements.fitPreference === 'slim' || bestMatch.fitTension < -1) {
    fitAssessment = 'Fitted / Snug';
  } else if (measurements.fitPreference === 'oversized' || bestMatch.fitTension > 2) {
    fitAssessment = 'Oversized Silhouette';
  } else if (measurements.fitPreference === 'relaxed' || bestMatch.fitTension > 0) {
    fitAssessment = 'Relaxed Drape';
  } else {
    fitAssessment = 'True Tailored';
  }

  // Generate transparent editorial reasoning
  const brandName = brand.name;
  const sizeName = bestMatch.entry.size;
  let summaryReason = '';

  if (category === 'tops' || category === 'outerwear') {
    const chestBreakdown = bestMatch.breakdowns.find((b) => b.dimension === 'Chest');
    const shoulderBreakdown = bestMatch.breakdowns.find((b) => b.dimension === 'Shoulder');

    summaryReason = `${brandName}'s ${sizeName} accommodates your ${chestBreakdown?.userMeasurement ?? measurements.chest}cm chest with ${
      measurements.fitPreference === 'slim' ? 'tailored European contours' : 'ideal ergonomic ease'
    }.`;

    if (shoulderBreakdown && shoulderBreakdown.status === 'perfect') {
      summaryReason += ` Shoulder alignment is exact at ${shoulderBreakdown.userMeasurement}cm.`;
    }
  } else {
    const waistBreakdown = bestMatch.breakdowns.find((b) => b.dimension === 'Waist');
    const hipBreakdown = bestMatch.breakdowns.find((b) => b.dimension === 'Hip');

    summaryReason = `${brandName} size ${sizeName} provides a precise ${
      waistBreakdown?.userMeasurement ?? measurements.waist
    }cm waistband fit with natural seat ease around the hips.`;
  }

  const easeExplanation = isProductSpecificData
    ? `Calculated using verified product-specific garment patterns. Accounting for intentional fabric ease (+${
        measurements.fitPreference === 'oversized' ? '12-16cm' : '4-8cm'
      }) beyond raw skin-to-tape dimensions.`
    : `Calculated against ${brandName}'s master anatomical grading charts, calibrated with ${brand.sizingTendency.replace('_', ' ')} ease curves.`;

  return {
    brand,
    category,
    product,
    recommendedSize: sizeName,
    confidenceScore,
    confidenceLevel,
    alternativeSize,
    fitAssessment,
    summaryReason,
    easeExplanation,
    dimensionBreakdowns: bestMatch.breakdowns,
    missingMeasurementsNotice: missingNotices.length > 0 ? missingNotices : undefined,
    isProductSpecificData,
    calculatedAt: '',
  };
}

export function batchRecommendSizes(
  measurements: BodyMeasurements,
  category: ClothingCategory = 'tops'
): RecommendationResult[] {
  return BRANDS.map((brand) =>
    recommendSize({
      brandId: brand.id,
      category,
      measurements,
    })
  );
}
