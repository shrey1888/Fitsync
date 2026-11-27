import { Brand, GenderCategory } from '../types';

export type TranslatorCategory =
  | 'tshirts'
  | 'shirts'
  | 'jackets'
  | 'hoodies'
  | 'sweatshirts'
  | 'jeans'
  | 'trousers';

export type RegionCode = 'EU' | 'US' | 'UK' | 'IN';

export interface TranslatorBrand extends Pick<Brand, 'id' | 'name' | 'country' | 'sizingNote'> {
  nativeRegion: RegionCode;
}

export interface TranslatorChartEntry {
  size: string;
  chestMin?: number;
  chestMax?: number;
  shoulderMin?: number;
  shoulderMax?: number;
  waistMin?: number;
  waistMax?: number;
  hipMin?: number;
  hipMax?: number;
  sleeveMin?: number;
  sleeveMax?: number;
  lengthMin?: number;
  lengthMax?: number;
}

export interface TranslatorChart {
  brandId: string;
  category: TranslatorCategory;
  gender: Exclude<GenderCategory, 'unisex'>;
  sourceNote: string;
  isVerified: boolean;
  entries: TranslatorChartEntry[];
}

export const TRANSLATOR_BRANDS: TranslatorBrand[] = [
  {
    id: 'zara',
    name: 'Zara',
    country: 'Spain',
    nativeRegion: 'EU',
    sizingNote: 'European slim-tailored block; narrower shoulders and trim chest.',
  },
  {
    id: 'hm',
    name: 'H&M',
    country: 'Sweden',
    nativeRegion: 'EU',
    sizingNote: 'Scandinavian commercial grading; slightly shorter torso, distinct chest steps.',
  },
  {
    id: 'uniqlo',
    name: 'Uniqlo',
    country: 'Japan',
    nativeRegion: 'EU',
    sizingNote: 'Japanese LifeWear metric grading; straighter boxy block with consistent chest.',
  },
  {
    id: 'nike',
    name: 'Nike',
    country: 'United States',
    nativeRegion: 'US',
    sizingNote: 'US athletic cut; generous chest/shoulder room and longer sleeve/body length.',
  },
  {
    id: 'adidas',
    name: 'Adidas',
    country: 'Germany',
    nativeRegion: 'EU',
    sizingNote: 'European sportswear block; athletic chest with relaxed torso ease.',
  },
  {
    id: 'levis',
    name: "Levi's",
    country: 'United States',
    nativeRegion: 'US',
    sizingNote: 'US heritage denim & workwear; numeric waist inches and generous tops.',
  },
  {
    id: 'puma',
    name: 'Puma',
    country: 'Germany',
    nativeRegion: 'EU',
    sizingNote: 'European performance cut; slightly tapered waist and streamlined sleeves.',
  },
  {
    id: 'mango',
    name: 'Mango',
    country: 'Spain',
    nativeRegion: 'EU',
    sizingNote: 'Mediterranean tailored cut; slim chest and waist similar to Zara.',
  },
  {
    id: 'asos',
    name: 'ASOS Design',
    country: 'United Kingdom',
    nativeRegion: 'UK',
    sizingNote: 'UK high-street block; directional proportions with longer body lengths.',
  },
];

export const CATEGORY_META: {
  id: TranslatorCategory;
  label: string;
  group: 'upper' | 'lower';
  relevantDimensions: Array<'chest' | 'shoulder' | 'waist' | 'hip' | 'sleeve' | 'length'>;
}[] = [
  {
    id: 'tshirts',
    label: 'T-shirts',
    group: 'upper',
    relevantDimensions: ['chest', 'shoulder', 'length'],
  },
  {
    id: 'shirts',
    label: 'Shirts',
    group: 'upper',
    relevantDimensions: ['chest', 'shoulder', 'waist', 'sleeve', 'length'],
  },
  {
    id: 'jackets',
    label: 'Jackets',
    group: 'upper',
    relevantDimensions: ['chest', 'shoulder', 'sleeve', 'length'],
  },
  {
    id: 'hoodies',
    label: 'Hoodies',
    group: 'upper',
    relevantDimensions: ['chest', 'shoulder', 'sleeve', 'length'],
  },
  {
    id: 'sweatshirts',
    label: 'Sweatshirts',
    group: 'upper',
    relevantDimensions: ['chest', 'shoulder', 'sleeve', 'length'],
  },
  {
    id: 'jeans',
    label: 'Jeans',
    group: 'lower',
    relevantDimensions: ['waist', 'hip', 'length'],
  },
  {
    id: 'trousers',
    label: 'Trousers',
    group: 'lower',
    relevantDimensions: ['waist', 'hip', 'length'],
  },
];

type R = [number, number];

function entry(
  size: string,
  dims: {
    chest?: R;
    shoulder?: R;
    waist?: R;
    hip?: R;
    sleeve?: R;
    length?: R;
  }
): TranslatorChartEntry {
  const e: TranslatorChartEntry = { size };
  if (dims.chest) [e.chestMin, e.chestMax] = dims.chest;
  if (dims.shoulder) [e.shoulderMin, e.shoulderMax] = dims.shoulder;
  if (dims.waist) [e.waistMin, e.waistMax] = dims.waist;
  if (dims.hip) [e.hipMin, e.hipMax] = dims.hip;
  if (dims.sleeve) [e.sleeveMin, e.sleeveMax] = dims.sleeve;
  if (dims.length) [e.lengthMin, e.lengthMax] = dims.length;
  return e;
}

function chart(
  brandId: string,
  category: TranslatorCategory,
  gender: Exclude<GenderCategory, 'unisex'>,
  sourceNote: string,
  entries: TranslatorChartEntry[],
  isVerified = true
): TranslatorChart {
  return { brandId, category, gender, sourceNote, isVerified, entries };
}

/**
 * Brand-specific & category-specific size charts (in cm).
 * Deliberately models real-world grading differences across EU, US, UK, and JP brands
 * so conversions reflect actual measurement overlap rather than S=S / M=M.
 */
export const TRANSLATOR_CHARTS: TranslatorChart[] = [
  // =========================================================================
  // MENSWEAR — T-SHIRTS
  // =========================================================================
  chart('zara', 'tshirts', 'menswear', 'Zara Men T-Shirts EU Slim-Regular Chart', [
    entry('S', { chest: [90, 94], shoulder: [42, 43.5], length: [67, 69] }),
    entry('M', { chest: [96, 100], shoulder: [44, 45.5], length: [69, 71] }),
    entry('L', { chest: [101, 106], shoulder: [46, 47.5], length: [71, 73] }),
    entry('XL', { chest: [107, 113], shoulder: [48, 50], length: [73, 76] }),
  ]),
  chart('hm', 'tshirts', 'menswear', 'H&M Men T-Shirts Standard Chart', [
    entry('XS', { chest: [84, 87], shoulder: [40, 41.5], length: [65, 67] }),
    entry('S', { chest: [88, 91], shoulder: [42, 43.5], length: [67, 69] }),
    entry('M', { chest: [92, 96], shoulder: [43.5, 45], length: [69, 71] }),
    entry('L', { chest: [97, 103], shoulder: [45.5, 47.5], length: [71, 73] }),
    entry('XL', { chest: [104, 111], shoulder: [48, 50], length: [73, 76] }),
  ]),
  chart('uniqlo', 'tshirts', 'menswear', 'Uniqlo Men LifeWear T-Shirts Chart', [
    entry('XS', { chest: [80, 88], shoulder: [41, 42.5], length: [64, 66] }),
    entry('S', { chest: [88, 94], shoulder: [42.5, 44], length: [66, 68] }),
    entry('M', { chest: [95, 101], shoulder: [44, 46], length: [68, 70] }),
    entry('L', { chest: [102, 108], shoulder: [46, 48], length: [71, 73] }),
    entry('XL', { chest: [109, 116], shoulder: [48, 50.5], length: [74, 76] }),
  ]),
  chart('nike', 'tshirts', 'menswear', 'Nike Men US Athletic T-Shirts Chart', [
    entry('S', { chest: [88, 96], shoulder: [43, 45], length: [70, 72] }),
    entry('M', { chest: [96, 104], shoulder: [45, 47], length: [72, 74] }),
    entry('L', { chest: [104, 112], shoulder: [47, 49.5], length: [74, 76] }),
    entry('XL', { chest: [112, 122], shoulder: [49.5, 52], length: [76, 79] }),
  ]),
  chart('adidas', 'tshirts', 'menswear', 'Adidas Men Sportswear T-Shirts Chart', [
    entry('S', { chest: [87, 94], shoulder: [42, 44], length: [69, 71] }),
    entry('M', { chest: [95, 102], shoulder: [44, 46], length: [71, 73] }),
    entry('L', { chest: [103, 110], shoulder: [46, 48.5], length: [73, 75] }),
    entry('XL', { chest: [111, 120], shoulder: [48.5, 51], length: [75, 78] }),
  ]),
  chart('levis', 'tshirts', 'menswear', "Levi's Men Graphic & Classic Tees Chart", [
    entry('S', { chest: [89, 95], shoulder: [42.5, 44.5], length: [68, 70] }),
    entry('M', { chest: [96, 102], shoulder: [44.5, 46.5], length: [70, 72] }),
    entry('L', { chest: [103, 110], shoulder: [46.5, 49], length: [72, 75] }),
    entry('XL', { chest: [111, 119], shoulder: [49, 51.5], length: [75, 78] }),
  ]),
  chart('puma', 'tshirts', 'menswear', 'Puma Men Performance & Essentials Tees Chart', [
    entry('S', { chest: [89, 94], shoulder: [42, 43.5], length: [68, 70] }),
    entry('M', { chest: [95, 100], shoulder: [44, 45.5], length: [70, 72] }),
    entry('L', { chest: [101, 108], shoulder: [46, 48], length: [72, 74] }),
    entry('XL', { chest: [109, 117], shoulder: [48.5, 50.5], length: [74, 77] }),
  ]),
  chart('mango', 'tshirts', 'menswear', 'Mango Man T-Shirts Tailored Chart', [
    entry('S', { chest: [89, 93], shoulder: [42, 43.5], length: [67, 69] }),
    entry('M', { chest: [94, 98], shoulder: [43.5, 45], length: [69, 71] }),
    entry('L', { chest: [99, 104], shoulder: [45.5, 47.5], length: [71, 73] }),
    entry('XL', { chest: [105, 111], shoulder: [48, 50], length: [73, 75] }),
  ]),
  chart('asos', 'tshirts', 'menswear', 'ASOS Design Men UK T-Shirts Chart', [
    entry('XS', { chest: [86, 91], shoulder: [41, 42.5], length: [67, 69] }),
    entry('S', { chest: [91, 96], shoulder: [42.5, 44], length: [69, 71] }),
    entry('M', { chest: [96, 101], shoulder: [44, 46], length: [71, 73] }),
    entry('L', { chest: [101, 106], shoulder: [46, 48], length: [73, 75] }),
    entry('XL', { chest: [106, 112], shoulder: [48, 50], length: [75, 77] }),
  ]),

  // =========================================================================
  // MENSWEAR — SHIRTS (Tailored / Button-Down — adds Waist & Sleeve)
  // =========================================================================
  chart('zara', 'shirts', 'menswear', 'Zara Men Tailored Shirts Chart', [
    entry('S', { chest: [88, 92], shoulder: [42, 43], waist: [75, 79], sleeve: [61, 62.5], length: [72, 74] }),
    entry('M', { chest: [93, 97], shoulder: [43.5, 44.5], waist: [80, 84], sleeve: [62.5, 64], length: [74, 76] }),
    entry('L', { chest: [98, 103], shoulder: [45, 46.5], waist: [85, 90], sleeve: [64, 65.5], length: [76, 78] }),
    entry('XL', { chest: [104, 110], shoulder: [47, 48.5], waist: [91, 97], sleeve: [65.5, 67], length: [78, 80] }),
  ]),
  chart('hm', 'shirts', 'menswear', 'H&M Men Regular & Slim Shirts Chart', [
    entry('S', { chest: [88, 92], shoulder: [42, 43.5], waist: [76, 80], sleeve: [61, 62.5], length: [72, 74] }),
    entry('M', { chest: [93, 98], shoulder: [44, 45.5], waist: [81, 86], sleeve: [62.5, 64], length: [74, 76] }),
    entry('L', { chest: [99, 105], shoulder: [46, 48], waist: [87, 93], sleeve: [64, 65.5], length: [76, 78] }),
    entry('XL', { chest: [106, 113], shoulder: [48.5, 50.5], waist: [94, 101], sleeve: [65.5, 67], length: [78, 80] }),
  ]),
  chart('uniqlo', 'shirts', 'menswear', 'Uniqlo Men Oxford & Dress Shirts Chart', [
    entry('S', { chest: [88, 94], shoulder: [43, 44.5], waist: [76, 82], sleeve: [60, 61.5], length: [71, 73] }),
    entry('M', { chest: [94, 100], shoulder: [44.5, 46], waist: [82, 87], sleeve: [61.5, 63], length: [73, 75] }),
    entry('L', { chest: [100, 106], shoulder: [46.5, 48], waist: [88, 94], sleeve: [63, 64.5], length: [75, 77] }),
    entry('XL', { chest: [106, 114], shoulder: [48.5, 50.5], waist: [95, 102], sleeve: [64.5, 66], length: [77, 79] }),
  ]),
  chart('levis', 'shirts', 'menswear', "Levi's Men Western & Chambray Shirts Chart", [
    entry('S', { chest: [90, 96], shoulder: [43, 44.5], waist: [77, 83], sleeve: [62, 63.5], length: [73, 75] }),
    entry('M', { chest: [97, 103], shoulder: [45, 46.5], waist: [84, 90], sleeve: [63.5, 65], length: [75, 77] }),
    entry('L', { chest: [104, 111], shoulder: [47, 49], waist: [91, 98], sleeve: [65, 66.5], length: [77, 79] }),
    entry('XL', { chest: [112, 120], shoulder: [49.5, 51.5], waist: [99, 107], sleeve: [66.5, 68], length: [79, 81] }),
  ]),
  chart('mango', 'shirts', 'menswear', 'Mango Man Tailored Shirts Chart', [
    entry('S', { chest: [88, 92], shoulder: [42, 43], waist: [75, 79], sleeve: [61, 62.5], length: [72, 74] }),
    entry('M', { chest: [93, 97], shoulder: [43.5, 45], waist: [80, 84], sleeve: [62.5, 64], length: [74, 76] }),
    entry('L', { chest: [98, 103], shoulder: [45.5, 47], waist: [85, 90], sleeve: [64, 65.5], length: [76, 78] }),
    entry('XL', { chest: [104, 110], shoulder: [47.5, 49.5], waist: [91, 96], sleeve: [65.5, 67], length: [78, 80] }),
  ]),
  chart('asos', 'shirts', 'menswear', 'ASOS Design Men Shirts Chart', [
    entry('S', { chest: [91, 96], shoulder: [42.5, 44], waist: [76, 81], sleeve: [62, 63.5], length: [73, 75] }),
    entry('M', { chest: [96, 101], shoulder: [44, 46], waist: [81, 86], sleeve: [63.5, 65], length: [75, 77] }),
    entry('L', { chest: [101, 106], shoulder: [46, 48], waist: [86, 91], sleeve: [65, 66.5], length: [77, 79] }),
    entry('XL', { chest: [106, 112], shoulder: [48, 50], waist: [91, 97], sleeve: [66.5, 68], length: [79, 81] }),
  ]),

  // =========================================================================
  // MENSWEAR — JACKETS (Outerwear layering & sleeve-length sensitive)
  // =========================================================================
  chart('zara', 'jackets', 'menswear', 'Zara Men Outerwear & Jackets Chart (Trim Cut)', [
    entry('S', { chest: [88, 92], shoulder: [43, 44], sleeve: [62, 63.5], length: [64, 66] }),
    entry('M', { chest: [93, 97], shoulder: [44.5, 45.5], sleeve: [63.5, 65], length: [66, 68] }),
    entry('L', { chest: [98, 103], shoulder: [46, 47.5], sleeve: [65, 66.5], length: [68, 70] }),
    entry('XL', { chest: [104, 110], shoulder: [48, 49.5], sleeve: [66.5, 68], length: [70, 72] }),
  ]),
  chart('hm', 'jackets', 'menswear', 'H&M Men Jackets & Coats Chart', [
    entry('S', { chest: [88, 93], shoulder: [43, 44.5], sleeve: [62, 63.5], length: [65, 67] }),
    entry('M', { chest: [94, 99], shoulder: [44.5, 46], sleeve: [63.5, 65], length: [67, 69] }),
    entry('L', { chest: [100, 106], shoulder: [46.5, 48.5], sleeve: [65, 66.5], length: [69, 71] }),
    entry('XL', { chest: [107, 114], shoulder: [49, 51], sleeve: [66.5, 68], length: [71, 74] }),
  ]),
  chart('uniqlo', 'jackets', 'menswear', 'Uniqlo Men Ultra Light & Outerwear Chart', [
    entry('S', { chest: [86, 92], shoulder: [43, 44.5], sleeve: [60.5, 62], length: [64, 66] }),
    entry('M', { chest: [93, 99], shoulder: [45, 46.5], sleeve: [62, 63.5], length: [66, 68] }),
    entry('L', { chest: [100, 106], shoulder: [47, 48.5], sleeve: [63.5, 65], length: [68, 70] }),
    entry('XL', { chest: [107, 114], shoulder: [49, 51], sleeve: [65, 66.5], length: [70, 73] }),
  ]),
  chart('nike', 'jackets', 'menswear', 'Nike Men Outerwear & Windrunners Chart (US Roomy)', [
    entry('S', { chest: [89, 96], shoulder: [44, 46], sleeve: [63, 64.5], length: [67, 69] }),
    entry('M', { chest: [97, 104], shoulder: [46, 48], sleeve: [64.5, 66], length: [69, 71] }),
    entry('L', { chest: [105, 113], shoulder: [48, 50.5], sleeve: [66, 67.5], length: [71, 73] }),
    entry('XL', { chest: [114, 123], shoulder: [50.5, 53], sleeve: [67.5, 69.5], length: [73, 76] }),
  ]),
  chart('adidas', 'jackets', 'menswear', 'Adidas Men Track & Shell Jackets Chart', [
    entry('S', { chest: [88, 94], shoulder: [43, 45], sleeve: [62.5, 64], length: [66, 68] }),
    entry('M', { chest: [95, 102], shoulder: [45, 47], sleeve: [64, 65.5], length: [68, 70] }),
    entry('L', { chest: [103, 110], shoulder: [47, 49.5], sleeve: [65.5, 67], length: [70, 72] }),
    entry('XL', { chest: [111, 119], shoulder: [49.5, 52], sleeve: [67, 68.5], length: [72, 75] }),
  ]),
  chart('levis', 'jackets', 'menswear', "Levi's Men Trucker Jackets Chart", [
    entry('S', { chest: [89, 95], shoulder: [43.5, 45], sleeve: [62, 63.5], length: [61, 63] }),
    entry('M', { chest: [96, 102], shoulder: [45.5, 47], sleeve: [63.5, 65], length: [63, 65] }),
    entry('L', { chest: [103, 110], shoulder: [47.5, 49.5], sleeve: [65, 66.5], length: [65, 67] }),
    entry('XL', { chest: [111, 119], shoulder: [50, 52], sleeve: [66.5, 68], length: [67, 69] }),
  ]),
  chart('puma', 'jackets', 'menswear', 'Puma Men Training & Track Jackets Chart', [
    entry('S', { chest: [88, 93], shoulder: [42.5, 44], sleeve: [62, 63.5], length: [66, 68] }),
    entry('M', { chest: [94, 99], shoulder: [44.5, 46], sleeve: [63.5, 65], length: [68, 70] }),
    entry('L', { chest: [100, 107], shoulder: [46.5, 48.5], sleeve: [65, 66.5], length: [70, 72] }),
    entry('XL', { chest: [108, 116], shoulder: [49, 51], sleeve: [66.5, 68], length: [72, 74] }),
  ]),
  chart('mango', 'jackets', 'menswear', 'Mango Man Blazers & Jackets Chart', [
    entry('S', { chest: [88, 92], shoulder: [42.5, 43.5], sleeve: [62, 63.5], length: [68, 70] }),
    entry('M', { chest: [93, 97], shoulder: [44, 45.5], sleeve: [63.5, 65], length: [70, 72] }),
    entry('L', { chest: [98, 103], shoulder: [46, 47.5], sleeve: [65, 66.5], length: [72, 74] }),
    entry('XL', { chest: [104, 110], shoulder: [48, 49.5], sleeve: [66.5, 68], length: [74, 76] }),
  ]),
  chart('asos', 'jackets', 'menswear', 'ASOS Design Men Jackets Chart', [
    entry('S', { chest: [91, 96], shoulder: [43, 44.5], sleeve: [63, 64.5], length: [66, 68] }),
    entry('M', { chest: [96, 101], shoulder: [44.5, 46.5], sleeve: [64.5, 66], length: [68, 70] }),
    entry('L', { chest: [101, 107], shoulder: [46.5, 48.5], sleeve: [66, 67.5], length: [70, 72] }),
    entry('XL', { chest: [108, 114], shoulder: [49, 51], sleeve: [67.5, 69], length: [72, 74] }),
  ]),

  // =========================================================================
  // MENSWEAR — HOODIES
  // =========================================================================
  chart('zara', 'hoodies', 'menswear', 'Zara Men Hoodies Chart', [
    entry('S', { chest: [90, 95], shoulder: [44, 46], sleeve: [61, 62.5], length: [66, 68] }),
    entry('M', { chest: [96, 101], shoulder: [46, 48], sleeve: [62.5, 64], length: [68, 70] }),
    entry('L', { chest: [102, 108], shoulder: [48, 50], sleeve: [64, 65.5], length: [70, 72] }),
    entry('XL', { chest: [109, 115], shoulder: [50, 52], sleeve: [65.5, 67], length: [72, 74] }),
  ]),
  chart('hm', 'hoodies', 'menswear', 'H&M Men Relaxed Hoodies Chart', [
    entry('S', { chest: [89, 94], shoulder: [43.5, 45.5], sleeve: [61, 62.5], length: [66, 68] }),
    entry('M', { chest: [95, 100], shoulder: [45.5, 47.5], sleeve: [62.5, 64], length: [68, 70] }),
    entry('L', { chest: [101, 107], shoulder: [47.5, 49.5], sleeve: [64, 65.5], length: [70, 73] }),
    entry('XL', { chest: [108, 115], shoulder: [50, 52], sleeve: [65.5, 67], length: [73, 76] }),
  ]),
  chart('uniqlo', 'hoodies', 'menswear', 'Uniqlo Men Pullover Hoodies Chart', [
    entry('S', { chest: [88, 94], shoulder: [43.5, 45], sleeve: [59.5, 61], length: [65, 67] }),
    entry('M', { chest: [95, 101], shoulder: [45.5, 47], sleeve: [61, 62.5], length: [67, 69] }),
    entry('L', { chest: [102, 108], shoulder: [47.5, 49.5], sleeve: [62.5, 64], length: [69, 71] }),
    entry('XL', { chest: [109, 116], shoulder: [49.5, 51.5], sleeve: [64, 65.5], length: [71, 74] }),
  ]),
  chart('nike', 'hoodies', 'menswear', 'Nike Men Club Fleece Hoodies Chart', [
    entry('S', { chest: [89, 96], shoulder: [44, 46], sleeve: [62, 64], length: [67, 69] }),
    entry('M', { chest: [97, 104], shoulder: [46, 48.5], sleeve: [64, 65.5], length: [69, 71] }),
    entry('L', { chest: [105, 113], shoulder: [48.5, 51], sleeve: [65.5, 67.5], length: [71, 74] }),
    entry('XL', { chest: [114, 123], shoulder: [51, 53.5], sleeve: [67.5, 69.5], length: [74, 77] }),
  ]),
  chart('adidas', 'hoodies', 'menswear', 'Adidas Men Essentials Hoodies Chart', [
    entry('S', { chest: [88, 94], shoulder: [43, 45], sleeve: [62, 63.5], length: [66, 68] }),
    entry('M', { chest: [95, 102], shoulder: [45, 47], sleeve: [63.5, 65], length: [68, 70] }),
    entry('L', { chest: [103, 110], shoulder: [47, 49.5], sleeve: [65, 66.5], length: [70, 73] }),
    entry('XL', { chest: [111, 119], shoulder: [49.5, 52], sleeve: [66.5, 68.5], length: [73, 75] }),
  ]),
  chart('puma', 'hoodies', 'menswear', 'Puma Men Fleece Hoodies Chart', [
    entry('S', { chest: [89, 94], shoulder: [43, 44.5], sleeve: [61.5, 63], length: [66, 68] }),
    entry('M', { chest: [95, 100], shoulder: [45, 46.5], sleeve: [63, 64.5], length: [68, 70] }),
    entry('L', { chest: [101, 108], shoulder: [47, 49], sleeve: [64.5, 66], length: [70, 72] }),
    entry('XL', { chest: [109, 117], shoulder: [49, 51], sleeve: [66, 68], length: [72, 75] }),
  ]),
  chart('asos', 'hoodies', 'menswear', 'ASOS Design Men Hoodies Chart', [
    entry('S', { chest: [91, 96], shoulder: [44, 46], sleeve: [62, 64], length: [67, 69] }),
    entry('M', { chest: [96, 101], shoulder: [46, 48], sleeve: [64, 65.5], length: [69, 71] }),
    entry('L', { chest: [101, 107], shoulder: [48, 50], sleeve: [65.5, 67], length: [71, 73] }),
    entry('XL', { chest: [108, 114], shoulder: [50, 52], sleeve: [67, 69], length: [73, 75] }),
  ]),

  // =========================================================================
  // MENSWEAR — SWEATSHIRTS
  // =========================================================================
  chart('zara', 'sweatshirts', 'menswear', 'Zara Men Crewneck Sweatshirts Chart', [
    entry('S', { chest: [90, 94], shoulder: [43.5, 45], sleeve: [61, 62.5], length: [66, 68] }),
    entry('M', { chest: [95, 100], shoulder: [45.5, 47], sleeve: [62.5, 64], length: [68, 70] }),
    entry('L', { chest: [101, 107], shoulder: [47.5, 49], sleeve: [64, 65.5], length: [70, 72] }),
    entry('XL', { chest: [108, 114], shoulder: [49.5, 51.5], sleeve: [65.5, 67], length: [72, 74] }),
  ]),
  chart('hm', 'sweatshirts', 'menswear', 'H&M Men Sweatshirts Chart', [
    entry('S', { chest: [88, 92], shoulder: [42.5, 44], sleeve: [61, 62.5], length: [66, 68] }),
    entry('M', { chest: [93, 97], shoulder: [44.5, 46], sleeve: [62.5, 64], length: [68, 70] }),
    entry('L', { chest: [98, 104], shoulder: [46.5, 48.5], sleeve: [64, 65.5], length: [70, 72] }),
    entry('XL', { chest: [105, 112], shoulder: [49, 51], sleeve: [65.5, 67], length: [72, 75] }),
  ]),
  chart('uniqlo', 'sweatshirts', 'menswear', 'Uniqlo Men Sweatshirts Chart', [
    entry('S', { chest: [88, 94], shoulder: [43, 44.5], sleeve: [59.5, 61], length: [65, 67] }),
    entry('M', { chest: [95, 101], shoulder: [45, 46.5], sleeve: [61, 62.5], length: [67, 69] }),
    entry('L', { chest: [102, 108], shoulder: [47, 48.5], sleeve: [62.5, 64], length: [69, 71] }),
    entry('XL', { chest: [109, 116], shoulder: [49, 51], sleeve: [64, 65.5], length: [71, 74] }),
  ]),
  chart('nike', 'sweatshirts', 'menswear', 'Nike Men Club Crew Sweatshirts Chart', [
    entry('S', { chest: [89, 96], shoulder: [44, 46], sleeve: [62, 63.5], length: [67, 69] }),
    entry('M', { chest: [97, 104], shoulder: [46, 48], sleeve: [63.5, 65.5], length: [69, 71] }),
    entry('L', { chest: [105, 113], shoulder: [48.5, 50.5], sleeve: [65.5, 67], length: [71, 73] }),
    entry('XL', { chest: [114, 123], shoulder: [51, 53], sleeve: [67, 69], length: [73, 76] }),
  ]),
  chart('adidas', 'sweatshirts', 'menswear', 'Adidas Men Crewneck Sweatshirts Chart', [
    entry('S', { chest: [88, 94], shoulder: [43, 45], sleeve: [62, 63.5], length: [66, 68] }),
    entry('M', { chest: [95, 102], shoulder: [45, 47], sleeve: [63.5, 65], length: [68, 70] }),
    entry('L', { chest: [103, 110], shoulder: [47, 49.5], sleeve: [65, 66.5], length: [70, 72] }),
    entry('XL', { chest: [111, 119], shoulder: [49.5, 52], sleeve: [66.5, 68], length: [72, 75] }),
  ]),
  chart('puma', 'sweatshirts', 'menswear', 'Puma Men Crew Sweatshirts Chart', [
    entry('S', { chest: [89, 94], shoulder: [42.5, 44], sleeve: [61.5, 63], length: [66, 68] }),
    entry('M', { chest: [95, 100], shoulder: [44.5, 46], sleeve: [63, 64.5], length: [68, 70] }),
    entry('L', { chest: [101, 108], shoulder: [46.5, 48.5], sleeve: [64.5, 66], length: [70, 72] }),
    entry('XL', { chest: [109, 117], shoulder: [49, 51], sleeve: [66, 68], length: [72, 74] }),
  ]),
  chart('asos', 'sweatshirts', 'menswear', 'ASOS Design Men Sweatshirts Chart', [
    entry('S', { chest: [91, 96], shoulder: [43.5, 45.5], sleeve: [62, 63.5], length: [67, 69] }),
    entry('M', { chest: [96, 101], shoulder: [45.5, 47.5], sleeve: [63.5, 65], length: [69, 71] }),
    entry('L', { chest: [101, 107], shoulder: [47.5, 49.5], sleeve: [65, 66.5], length: [71, 73] }),
    entry('XL', { chest: [108, 114], shoulder: [49.5, 51.5], sleeve: [66.5, 68.5], length: [73, 75] }),
  ]),

  // =========================================================================
  // MENSWEAR — JEANS
  // =========================================================================
  chart('zara', 'jeans', 'menswear', 'Zara Men Denim Jeans (EU Numeric) Chart', [
    entry('38', { waist: [75, 78], hip: [91, 94], length: [101, 103] }),
    entry('40', { waist: [79, 82], hip: [95, 98], length: [102, 104] }),
    entry('42', { waist: [83, 86], hip: [99, 102], length: [103, 105] }),
    entry('44', { waist: [87, 90], hip: [103, 106], length: [104, 106] }),
    entry('46', { waist: [91, 95], hip: [107, 111], length: [105, 107] }),
  ]),
  chart('hm', 'jeans', 'menswear', 'H&M Men Denim Jeans (Waist Inches) Chart', [
    entry('29', { waist: [73, 75], hip: [89, 92], length: [101, 103] }),
    entry('30', { waist: [76, 78], hip: [92, 95], length: [102, 104] }),
    entry('31', { waist: [79, 81], hip: [95, 97], length: [102, 104] }),
    entry('32', { waist: [82, 84], hip: [98, 100], length: [103, 105] }),
    entry('33', { waist: [85, 87], hip: [101, 103], length: [104, 106] }),
    entry('34', { waist: [88, 91], hip: [104, 107], length: [105, 107] }),
  ]),
  chart('uniqlo', 'jeans', 'menswear', 'Uniqlo Men Selvedge & Stretch Jeans Chart', [
    entry('29', { waist: [73, 75], hip: [89, 91], length: [100, 102] }),
    entry('30', { waist: [76, 78], hip: [92, 94], length: [101, 103] }),
    entry('31', { waist: [79, 81], hip: [95, 97], length: [102, 104] }),
    entry('32', { waist: [82, 84], hip: [98, 100], length: [102, 104] }),
    entry('33', { waist: [85, 87], hip: [101, 103], length: [103, 105] }),
    entry('34', { waist: [88, 90], hip: [104, 106], length: [104, 106] }),
  ]),
  chart('levis', 'jeans', 'menswear', "Levi's Men 501/511 Denim Waist Chart", [
    entry('29', { waist: [72, 74], hip: [88, 91], length: [101, 103] }),
    entry('30', { waist: [75, 77], hip: [91, 94], length: [102, 104] }),
    entry('31', { waist: [78, 80], hip: [94, 97], length: [102, 104] }),
    entry('32', { waist: [81, 84], hip: [97, 100], length: [103, 105] }),
    entry('33', { waist: [84, 86], hip: [100, 103], length: [104, 106] }),
    entry('34', { waist: [87, 90], hip: [103, 106], length: [105, 107] }),
  ]),
  chart('mango', 'jeans', 'menswear', 'Mango Man Denim Jeans (EU Numeric) Chart', [
    entry('38', { waist: [74, 77], hip: [90, 93], length: [101, 103] }),
    entry('40', { waist: [78, 81], hip: [94, 97], length: [102, 104] }),
    entry('42', { waist: [82, 85], hip: [98, 101], length: [103, 105] }),
    entry('44', { waist: [86, 89], hip: [102, 105], length: [104, 106] }),
    entry('46', { waist: [90, 94], hip: [106, 110], length: [105, 107] }),
  ]),
  chart('asos', 'jeans', 'menswear', 'ASOS Design Men Jeans Chart', [
    entry('W28', { waist: [69, 73], hip: [84, 88], length: [101, 103] }),
    entry('W30', { waist: [74, 78], hip: [89, 93], length: [102, 104] }),
    entry('W32', { waist: [79, 83], hip: [94, 98], length: [103, 105] }),
    entry('W34', { waist: [84, 88], hip: [99, 103], length: [104, 106] }),
    entry('W36', { waist: [89, 93], hip: [104, 108], length: [105, 107] }),
  ]),

  // =========================================================================
  // MENSWEAR — TROUSERS
  // =========================================================================
  chart('zara', 'trousers', 'menswear', 'Zara Men Tailored Trousers Chart', [
    entry('38', { waist: [75, 78], hip: [91, 94], length: [99, 101] }),
    entry('40', { waist: [79, 82], hip: [95, 98], length: [100, 102] }),
    entry('42', { waist: [83, 86], hip: [99, 102], length: [101, 103] }),
    entry('44', { waist: [87, 90], hip: [103, 106], length: [102, 104] }),
    entry('46', { waist: [91, 95], hip: [107, 111], length: [103, 105] }),
  ]),
  chart('hm', 'trousers', 'menswear', 'H&M Men Chinos & Trousers Chart', [
    entry('S', { waist: [75, 79], hip: [91, 95], length: [100, 102] }),
    entry('M', { waist: [80, 85], hip: [96, 100], length: [101, 103] }),
    entry('L', { waist: [86, 92], hip: [101, 106], length: [102, 104] }),
    entry('XL', { waist: [93, 100], hip: [107, 113], length: [103, 105] }),
  ]),
  chart('uniqlo', 'trousers', 'menswear', 'Uniqlo Men Smart Ankle & Chino Trousers Chart', [
    entry('S', { waist: [73, 78], hip: [89, 94], length: [97, 99] }),
    entry('M', { waist: [79, 84], hip: [95, 99], length: [99, 101] }),
    entry('L', { waist: [85, 91], hip: [100, 105], length: [101, 103] }),
    entry('XL', { waist: [92, 99], hip: [106, 112], length: [103, 105] }),
  ]),
  chart('mango', 'trousers', 'menswear', 'Mango Man Suit & Chino Trousers Chart', [
    entry('38', { waist: [74, 77], hip: [90, 93], length: [99, 101] }),
    entry('40', { waist: [78, 81], hip: [94, 97], length: [100, 102] }),
    entry('42', { waist: [82, 85], hip: [98, 101], length: [101, 103] }),
    entry('44', { waist: [86, 89], hip: [102, 105], length: [102, 104] }),
    entry('46', { waist: [90, 94], hip: [106, 110], length: [103, 105] }),
  ]),
  chart('asos', 'trousers', 'menswear', 'ASOS Design Men Smart Trousers Chart', [
    entry('W28', { waist: [69, 73], hip: [84, 88], length: [99, 101] }),
    entry('W30', { waist: [74, 78], hip: [89, 93], length: [100, 102] }),
    entry('W32', { waist: [79, 83], hip: [94, 98], length: [101, 103] }),
    entry('W34', { waist: [84, 88], hip: [99, 103], length: [102, 104] }),
    entry('W36', { waist: [89, 93], hip: [104, 108], length: [103, 105] }),
  ]),

  // =========================================================================
  // WOMENSWEAR — T-SHIRTS
  // =========================================================================
  chart('zara', 'tshirts', 'womenswear', 'Zara Women T-Shirts EU Chart', [
    entry('XS', { chest: [80, 83], shoulder: [36, 37.5], length: [57, 59] }),
    entry('S', { chest: [84, 87], shoulder: [37.5, 39], length: [59, 61] }),
    entry('M', { chest: [88, 92], shoulder: [39, 40.5], length: [61, 63] }),
    entry('L', { chest: [93, 98], shoulder: [41, 42.5], length: [63, 65] }),
    entry('XL', { chest: [99, 104], shoulder: [43, 44.5], length: [65, 67] }),
  ]),
  chart('hm', 'tshirts', 'womenswear', 'H&M Women T-Shirts Chart', [
    entry('XS', { chest: [78, 82], shoulder: [35.5, 37], length: [57, 59] }),
    entry('S', { chest: [83, 86], shoulder: [37, 38.5], length: [59, 61] }),
    entry('M', { chest: [87, 90], shoulder: [38.5, 40], length: [61, 63] }),
    entry('L', { chest: [91, 97], shoulder: [40.5, 42.5], length: [63, 65] }),
    entry('XL', { chest: [98, 104], shoulder: [43, 45], length: [65, 67] }),
  ]),
  chart('uniqlo', 'tshirts', 'womenswear', 'Uniqlo Women T-Shirts Chart', [
    entry('XS', { chest: [76, 80], shoulder: [35, 36.5], length: [56, 58] }),
    entry('S', { chest: [81, 85], shoulder: [36.5, 38], length: [58, 60] }),
    entry('M', { chest: [86, 90], shoulder: [38.5, 40], length: [60, 62] }),
    entry('L', { chest: [91, 96], shoulder: [40.5, 42], length: [62, 64] }),
    entry('XL', { chest: [97, 102], shoulder: [42.5, 44], length: [64, 66] }),
  ]),
  chart('nike', 'tshirts', 'womenswear', 'Nike Women Athletic Tees Chart', [
    entry('XS', { chest: [76, 83], shoulder: [36, 37.5], length: [60, 62] }),
    entry('S', { chest: [84, 90], shoulder: [38, 39.5], length: [62, 64] }),
    entry('M', { chest: [91, 97], shoulder: [40, 41.5], length: [64, 66] }),
    entry('L', { chest: [98, 104], shoulder: [42, 44], length: [66, 68] }),
    entry('XL', { chest: [105, 113], shoulder: [44, 46.5], length: [68, 70] }),
  ]),
  chart('adidas', 'tshirts', 'womenswear', 'Adidas Women Sportswear Tees Chart', [
    entry('XS', { chest: [78, 82], shoulder: [36, 37.5], length: [59, 61] }),
    entry('S', { chest: [83, 87], shoulder: [37.5, 39], length: [61, 63] }),
    entry('M', { chest: [88, 93], shoulder: [39.5, 41], length: [63, 65] }),
    entry('L', { chest: [94, 100], shoulder: [41.5, 43.5], length: [65, 67] }),
    entry('XL', { chest: [101, 107], shoulder: [44, 46], length: [67, 69] }),
  ]),
  chart('levis', 'tshirts', 'womenswear', "Levi's Women Classic Tees Chart", [
    entry('XS', { chest: [80, 84], shoulder: [36, 37.5], length: [58, 60] }),
    entry('S', { chest: [85, 89], shoulder: [38, 39.5], length: [60, 62] }),
    entry('M', { chest: [90, 95], shoulder: [40, 41.5], length: [62, 64] }),
    entry('L', { chest: [96, 102], shoulder: [42, 43.5], length: [64, 66] }),
    entry('XL', { chest: [103, 109], shoulder: [44, 46], length: [66, 68] }),
  ]),
  chart('puma', 'tshirts', 'womenswear', 'Puma Women Training Tees Chart', [
    entry('XS', { chest: [78, 82], shoulder: [35.5, 37], length: [58, 60] }),
    entry('S', { chest: [83, 87], shoulder: [37.5, 39], length: [60, 62] }),
    entry('M', { chest: [88, 92], shoulder: [39.5, 41], length: [62, 64] }),
    entry('L', { chest: [93, 98], shoulder: [41.5, 43], length: [64, 66] }),
    entry('XL', { chest: [99, 105], shoulder: [43.5, 45.5], length: [66, 68] }),
  ]),
  chart('mango', 'tshirts', 'womenswear', 'Mango Women T-Shirts Chart', [
    entry('XS', { chest: [80, 83], shoulder: [36, 37.5], length: [57, 59] }),
    entry('S', { chest: [84, 87], shoulder: [37.5, 39], length: [59, 61] }),
    entry('M', { chest: [88, 92], shoulder: [39, 40.5], length: [61, 63] }),
    entry('L', { chest: [93, 97], shoulder: [41, 42.5], length: [63, 65] }),
    entry('XL', { chest: [98, 103], shoulder: [43, 44.5], length: [65, 67] }),
  ]),
  chart('asos', 'tshirts', 'womenswear', 'ASOS Design Women UK T-Shirts Chart', [
    entry('UK 6', { chest: [76, 79], shoulder: [35, 36.5], length: [57, 59] }),
    entry('UK 8', { chest: [80, 83], shoulder: [36.5, 38], length: [59, 61] }),
    entry('UK 10', { chest: [84, 88], shoulder: [38, 39.5], length: [61, 63] }),
    entry('UK 12', { chest: [89, 93], shoulder: [40, 41.5], length: [63, 65] }),
    entry('UK 14', { chest: [94, 98], shoulder: [42, 43.5], length: [65, 67] }),
    entry('UK 16', { chest: [99, 104], shoulder: [44, 45.5], length: [67, 69] }),
  ]),

  // =========================================================================
  // WOMENSWEAR — SHIRTS, JACKETS, HOODIES, SWEATSHIRTS, JEANS, TROUSERS
  // =========================================================================
  chart('zara', 'shirts', 'womenswear', 'Zara Women Shirts & Blouses Chart', [
    entry('XS', { chest: [80, 83], shoulder: [36, 37], waist: [61, 64], sleeve: [58, 59.5], length: [62, 64] }),
    entry('S', { chest: [84, 87], shoulder: [37.5, 38.5], waist: [65, 68], sleeve: [59.5, 61], length: [64, 66] }),
    entry('M', { chest: [88, 92], shoulder: [39, 40.5], waist: [69, 73], sleeve: [61, 62.5], length: [66, 68] }),
    entry('L', { chest: [93, 98], shoulder: [41, 42.5], waist: [74, 79], sleeve: [62.5, 64], length: [68, 70] }),
  ]),
  chart('hm', 'shirts', 'womenswear', 'H&M Women Shirts Chart', [
    entry('XS', { chest: [78, 82], shoulder: [35.5, 37], waist: [62, 66], sleeve: [58, 59.5], length: [62, 64] }),
    entry('S', { chest: [83, 86], shoulder: [37, 38.5], waist: [67, 70], sleeve: [59.5, 61], length: [64, 66] }),
    entry('M', { chest: [87, 91], shoulder: [38.5, 40], waist: [71, 75], sleeve: [61, 62.5], length: [66, 68] }),
    entry('L', { chest: [92, 98], shoulder: [40.5, 42.5], waist: [76, 82], sleeve: [62.5, 64], length: [68, 70] }),
  ]),
  chart('uniqlo', 'shirts', 'womenswear', 'Uniqlo Women Rayon & Oxford Shirts Chart', [
    entry('XS', { chest: [76, 80], shoulder: [35, 36.5], waist: [58, 62], sleeve: [56, 57.5], length: [61, 63] }),
    entry('S', { chest: [81, 85], shoulder: [36.5, 38], waist: [63, 66], sleeve: [57.5, 59], length: [63, 65] }),
    entry('M', { chest: [86, 90], shoulder: [38.5, 40], waist: [67, 71], sleeve: [59, 60.5], length: [65, 67] }),
    entry('L', { chest: [91, 96], shoulder: [40.5, 42], waist: [72, 77], sleeve: [60.5, 62], length: [67, 69] }),
  ]),
  chart('mango', 'shirts', 'womenswear', 'Mango Women Shirts Chart', [
    entry('XS', { chest: [80, 83], shoulder: [36, 37], waist: [61, 64], sleeve: [58, 59.5], length: [62, 64] }),
    entry('S', { chest: [84, 87], shoulder: [37.5, 38.5], waist: [65, 68], sleeve: [59.5, 61], length: [64, 66] }),
    entry('M', { chest: [88, 92], shoulder: [39, 40.5], waist: [69, 73], sleeve: [61, 62.5], length: [66, 68] }),
    entry('L', { chest: [93, 97], shoulder: [41, 42.5], waist: [74, 78], sleeve: [62.5, 64], length: [68, 70] }),
  ]),
  chart('asos', 'shirts', 'womenswear', 'ASOS Design Women Shirts Chart', [
    entry('UK 8', { chest: [80, 83], shoulder: [36.5, 38], waist: [62, 65], sleeve: [59, 60.5], length: [63, 65] }),
    entry('UK 10', { chest: [84, 88], shoulder: [38, 39.5], waist: [66, 70], sleeve: [60.5, 62], length: [65, 67] }),
    entry('UK 12', { chest: [89, 93], shoulder: [40, 41.5], waist: [71, 75], sleeve: [62, 63.5], length: [67, 69] }),
    entry('UK 14', { chest: [94, 98], shoulder: [42, 43.5], waist: [76, 80], sleeve: [63.5, 65], length: [69, 71] }),
  ]),

  // Womenswear Jackets
  chart('zara', 'jackets', 'womenswear', 'Zara Women Jackets & Blazers Chart', [
    entry('XS', { chest: [79, 82], shoulder: [36.5, 37.5], sleeve: [59, 60.5], length: [56, 58] }),
    entry('S', { chest: [83, 86], shoulder: [38, 39], sleeve: [60.5, 62], length: [58, 60] }),
    entry('M', { chest: [87, 91], shoulder: [39.5, 41], sleeve: [62, 63.5], length: [60, 62] }),
    entry('L', { chest: [92, 97], shoulder: [41.5, 43], sleeve: [63.5, 65], length: [62, 64] }),
  ]),
  chart('hm', 'jackets', 'womenswear', 'H&M Women Jackets Chart', [
    entry('XS', { chest: [78, 82], shoulder: [36, 37.5], sleeve: [59, 60.5], length: [57, 59] }),
    entry('S', { chest: [83, 86], shoulder: [37.5, 39], sleeve: [60.5, 62], length: [59, 61] }),
    entry('M', { chest: [87, 91], shoulder: [39, 40.5], sleeve: [62, 63.5], length: [61, 63] }),
    entry('L', { chest: [92, 98], shoulder: [41, 43], sleeve: [63.5, 65], length: [63, 65] }),
  ]),
  chart('uniqlo', 'jackets', 'womenswear', 'Uniqlo Women Outerwear Chart', [
    entry('XS', { chest: [76, 80], shoulder: [35.5, 37], sleeve: [57, 58.5], length: [56, 58] }),
    entry('S', { chest: [81, 85], shoulder: [37, 38.5], sleeve: [58.5, 60], length: [58, 60] }),
    entry('M', { chest: [86, 90], shoulder: [39, 40.5], sleeve: [60, 61.5], length: [60, 62] }),
    entry('L', { chest: [91, 96], shoulder: [41, 42.5], sleeve: [61.5, 63], length: [62, 64] }),
  ]),
  chart('nike', 'jackets', 'womenswear', 'Nike Women Jackets Chart', [
    entry('XS', { chest: [76, 83], shoulder: [36.5, 38], sleeve: [60, 61.5], length: [60, 62] }),
    entry('S', { chest: [84, 90], shoulder: [38.5, 40], sleeve: [61.5, 63], length: [62, 64] }),
    entry('M', { chest: [91, 97], shoulder: [40.5, 42], sleeve: [63, 64.5], length: [64, 66] }),
    entry('L', { chest: [98, 104], shoulder: [42.5, 44.5], sleeve: [64.5, 66], length: [66, 68] }),
  ]),
  chart('adidas', 'jackets', 'womenswear', 'Adidas Women Track Jackets Chart', [
    entry('XS', { chest: [78, 82], shoulder: [36.5, 38], sleeve: [59.5, 61], length: [59, 61] }),
    entry('S', { chest: [83, 87], shoulder: [38, 39.5], sleeve: [61, 62.5], length: [61, 63] }),
    entry('M', { chest: [88, 93], shoulder: [40, 41.5], sleeve: [62.5, 64], length: [63, 65] }),
    entry('L', { chest: [94, 100], shoulder: [42, 44], sleeve: [64, 65.5], length: [65, 67] }),
  ]),
  chart('puma', 'jackets', 'womenswear', 'Puma Women Jackets Chart', [
    entry('XS', { chest: [78, 82], shoulder: [36, 37.5], sleeve: [59, 60.5], length: [59, 61] }),
    entry('S', { chest: [83, 87], shoulder: [38, 39.5], sleeve: [60.5, 62], length: [61, 63] }),
    entry('M', { chest: [88, 92], shoulder: [40, 41.5], sleeve: [62, 63.5], length: [63, 65] }),
    entry('L', { chest: [93, 98], shoulder: [42, 43.5], sleeve: [63.5, 65], length: [65, 67] }),
  ]),

  // Womenswear Jeans
  chart('zara', 'jeans', 'womenswear', 'Zara Women Jeans (EU 34–42) Chart', [
    entry('34', { waist: [61, 64], hip: [88, 91], length: [98, 100] }),
    entry('36', { waist: [65, 68], hip: [92, 95], length: [99, 101] }),
    entry('38', { waist: [69, 73], hip: [96, 99], length: [100, 102] }),
    entry('40', { waist: [74, 78], hip: [100, 104], length: [101, 103] }),
    entry('42', { waist: [79, 84], hip: [105, 110], length: [102, 104] }),
  ]),
  chart('hm', 'jeans', 'womenswear', 'H&M Women Jeans Chart', [
    entry('34', { waist: [63, 66], hip: [88, 91], length: [98, 100] }),
    entry('36', { waist: [67, 70], hip: [92, 95], length: [99, 101] }),
    entry('38', { waist: [71, 75], hip: [96, 100], length: [100, 102] }),
    entry('40', { waist: [76, 80], hip: [101, 105], length: [101, 103] }),
    entry('42', { waist: [81, 86], hip: [106, 111], length: [102, 104] }),
  ]),
  chart('levis', 'jeans', 'womenswear', "Levi's Women Denim Waist Chart", [
    entry('25', { waist: [63.5, 66], hip: [88.5, 91], length: [98, 100] }),
    entry('26', { waist: [66.5, 68.5], hip: [91.5, 93.5], length: [99, 101] }),
    entry('27', { waist: [69, 71], hip: [94, 96], length: [99, 101] }),
    entry('28', { waist: [71.5, 73.5], hip: [96.5, 98.5], length: [100, 102] }),
    entry('29', { waist: [74, 76], hip: [99, 101], length: [100, 102] }),
    entry('30', { waist: [76.5, 78.5], hip: [101.5, 103.5], length: [101, 103] }),
  ]),
  chart('uniqlo', 'jeans', 'womenswear', 'Uniqlo Women Jeans Chart', [
    entry('24', { waist: [60, 62], hip: [85, 87], length: [97, 99] }),
    entry('25', { waist: [63, 65], hip: [88, 90], length: [98, 100] }),
    entry('26', { waist: [66, 68], hip: [91, 93], length: [99, 101] }),
    entry('27', { waist: [69, 71], hip: [94, 96], length: [99, 101] }),
    entry('28', { waist: [72, 74], hip: [97, 99], length: [100, 102] }),
  ]),
  chart('mango', 'jeans', 'womenswear', 'Mango Women Jeans Chart', [
    entry('34', { waist: [61, 64], hip: [87, 90], length: [98, 100] }),
    entry('36', { waist: [65, 68], hip: [91, 94], length: [99, 101] }),
    entry('38', { waist: [69, 73], hip: [95, 98], length: [100, 102] }),
    entry('40', { waist: [74, 78], hip: [99, 103], length: [101, 103] }),
  ]),
  chart('asos', 'jeans', 'womenswear', 'ASOS Design Women Jeans Chart', [
    entry('W26', { waist: [65, 67], hip: [90, 92], length: [99, 101] }),
    entry('W28', { waist: [70, 72], hip: [95, 97], length: [100, 102] }),
    entry('W30', { waist: [75, 77], hip: [100, 102], length: [101, 103] }),
    entry('W32', { waist: [80, 82], hip: [105, 107], length: [102, 104] }),
  ]),
];

