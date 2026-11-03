export type MeasurementUnit = 'cm' | 'inch';
export type WeightUnit = 'kg' | 'lbs';

export type GenderCategory = 'menswear' | 'womenswear' | 'unisex';

export type FitPreference = 'slim' | 'regular' | 'relaxed' | 'oversized';

export type ClothingCategory = 'tops' | 'bottoms' | 'outerwear' | 'dresses';

export interface BodyMeasurements {
  height: number; // stored in cm
  weight?: number; // stored in kg
  chest: number; // stored in cm
  waist: number; // stored in cm
  shoulder: number; // stored in cm
  hip: number; // stored in cm
  inseam: number; // stored in cm
  gender: GenderCategory;
  fitPreference: FitPreference;
  unit: MeasurementUnit;
  lastUpdated?: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  country: string;
  tagline: string;
  sizingPhilosophy: string;
  sizingTendency: 'runs_small' | 'true_to_size' | 'runs_large' | 'athletic_taper';
  sizingNote: string;
  categories: ClothingCategory[];
  heroImage: string;
  website: string;
  founded: number;
}

export interface Product {
  id: string;
  brandId: string;
  slug: string;
  name: string;
  category: ClothingCategory;
  gender: GenderCategory;
  fitCut: FitPreference;
  fabric: string;
  description: string;
  image: string;
  price: string;
  hasProductSpecificChart: boolean;
}

export interface SizeChartEntry {
  size: string;
  chestMin?: number;
  chestMax?: number;
  waistMin?: number;
  waistMax?: number;
  hipMin?: number;
  hipMax?: number;
  shoulderMin?: number;
  shoulderMax?: number;
  inseamMin?: number;
  inseamMax?: number;
  heightMin?: number;
  heightMax?: number;
  garmentChest?: number;
  garmentWaist?: number;
  garmentLength?: number;
}

export interface SizeChart {
  id: string;
  brandId: string;
  category: ClothingCategory;
  gender: GenderCategory;
  productId?: string;
  isProductSpecific: boolean;
  isVerified: boolean;
  sourceNote: string;
  entries: SizeChartEntry[];
}

export interface DimensionBreakdown {
  dimension: 'Chest' | 'Waist' | 'Shoulder' | 'Hip' | 'Inseam' | 'Height';
  userMeasurement: number; // cm
  brandRange: {
    min: number;
    max: number;
    target: number;
  };
  delta: number; // difference from target
  status: 'too_tight' | 'snug' | 'perfect' | 'roomy' | 'too_large';
  feedback: string;
  weight: number; // importance weight in this garment category
}

export interface RecommendationResult {
  brand: Brand;
  category: ClothingCategory;
  product?: Product;
  recommendedSize: string;
  confidenceScore: number; // 0 - 100
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  alternativeSize?: {
    size: string;
    direction: 'size_up' | 'size_down';
    reason: string;
  };
  fitAssessment: 'Fitted / Snug' | 'True Tailored' | 'Natural Regular' | 'Relaxed Drape' | 'Oversized Silhouette';
  summaryReason: string;
  easeExplanation: string;
  dimensionBreakdowns: DimensionBreakdown[];
  missingMeasurementsNotice?: string[];
  isProductSpecificData: boolean;
  calculatedAt: string;
}

export interface SavedRecommendation {
  id: string;
  brandId: string;
  brandName: string;
  productId?: string;
  productName?: string;
  category: ClothingCategory;
  recommendedSize: string;
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  confidenceScore: number;
  createdAt: string;
}

