import { Brand, ClothingCategory, GenderCategory, Product, SizeChart, SizeChartEntry } from '../types';

export const BRANDS: Brand[] = [
  {
    id: 'zara',
    slug: 'zara',
    name: 'Zara',
    country: 'Spain',
    tagline: 'Contemporary European fast-fashion with tailored silhouettes',
    sizingPhilosophy: 'European modern cut. Known for narrower shoulder lines and tapered waists.',
    sizingTendency: 'runs_small',
    sizingNote: 'Tends to fit 1/2 size slimmer in the chest and shoulders compared to American brands.',
    categories: ['tops', 'bottoms', 'outerwear'],
    heroImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    website: 'https://www.zara.com',
    founded: 1975,
  },
  {
    id: 'hm',
    slug: 'hm',
    name: 'H&M',
    country: 'Sweden',
    tagline: 'Accessible Scandinavian essentials with relaxed everyday ease',
    sizingPhilosophy: 'Swedish democratic design. Standard commercial grading with ample ease.',
    sizingTendency: 'true_to_size',
    sizingNote: 'More forgiving torso and waist dimensions. Usually requires true size or 1 size up if desiring oversized.',
    categories: ['tops', 'bottoms', 'outerwear', 'dresses'],
    heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    website: 'https://www2.hm.com',
    founded: 1947,
  },
  {
    id: 'uniqlo',
    slug: 'uniqlo',
    name: 'Uniqlo',
    country: 'Japan',
    tagline: 'LifeWear engineered for pure comfort, longevity, and clean lines',
    sizingPhilosophy: 'Japanese precision metric sizing. Straight drops, boxier silhouettes with precise sleeve lengths.',
    sizingTendency: 'true_to_size',
    sizingNote: 'Known for consistent grading across international LifeWear collections.',
    categories: ['tops', 'bottoms', 'outerwear'],
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    website: 'https://www.uniqlo.com',
    founded: 1984,
  },
  {
    id: 'levis',
    slug: 'levis',
    name: "Levi's",
    country: 'United States',
    tagline: 'The timeless standard in authentic denim and rugged American workwear',
    sizingPhilosophy: 'Heritage waist & inseam numeric measurements. Heavy rigid denim fits tighter initially than stretch.',
    sizingTendency: 'true_to_size',
    sizingNote: 'Numeric sizing based on true waist circumference and actual inseam length.',
    categories: ['bottoms', 'tops', 'outerwear'],
    heroImage: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=1200&q=80',
    website: 'https://www.levi.com',
    founded: 1853,
  },
  {
    id: 'nike',
    slug: 'nike',
    name: 'Nike',
    country: 'United States',
    tagline: 'Performance athletic and streetwear apparel cut for dynamic motion',
    sizingPhilosophy: 'Athletic cut with generous chest and shoulder allowance to facilitate movement.',
    sizingTendency: 'athletic_taper',
    sizingNote: 'Tops feature wider shoulders and roomier chest; bottoms feature tapered athletic calves.',
    categories: ['tops', 'bottoms', 'outerwear'],
    heroImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
    website: 'https://www.nike.com',
    founded: 1964,
  },
  {
    id: 'adidas',
    slug: 'adidas',
    name: 'Adidas',
    country: 'Germany',
    tagline: 'Iconic sportswear engineered at the crossroads of sport and streetwear',
    sizingPhilosophy: 'Bavarian athletic engineering. Slightly relaxed silhouette with generous torso length.',
    sizingTendency: 'true_to_size',
    sizingNote: 'Standard sportswear ease. Classic tracksuits feature roomier hip and thigh grading.',
    categories: ['tops', 'bottoms', 'outerwear'],
    heroImage: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=1200&q=80',
    website: 'https://www.adidas.com',
    founded: 1949,
  },
  {
    id: 'mango',
    slug: 'mango',
    name: 'Mango',
    country: 'Spain',
    tagline: 'Mediterranean high-fashion elegance and smart contemporary cuts',
    sizingPhilosophy: 'Refined Mediterranean tailoring with focused waist definition and sleek contours.',
    sizingTendency: 'runs_small',
    sizingNote: 'Slightly narrower through chest and ribcage. Sizing is comparable to Zara, favoring a tailored fit.',
    categories: ['tops', 'bottoms', 'outerwear', 'dresses'],
    heroImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    website: 'https://shop.mango.com',
    founded: 1984,
  },
  {
    id: 'asos',
    slug: 'asos',
    name: 'ASOS Design',
    country: 'United Kingdom',
    tagline: 'London-born trendsetting fashion curated for diverse style profiles',
    sizingPhilosophy: 'British high-street proportions with directional cuts ranging from skinny to extreme oversized.',
    sizingTendency: 'runs_large',
    sizingNote: 'ASOS Design pieces often incorporate deliberate fashion ease and longer body lengths.',
    categories: ['tops', 'bottoms', 'outerwear', 'dresses'],
    heroImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    website: 'https://www.asos.com',
    founded: 2000,
  },
];

export const PRODUCTS: Product[] = [
  // Zara
  {
    id: 'zara-slim-shirt',
    brandId: 'zara',
    slug: 'tailored-poplin-shirt',
    name: 'Tailored Poplin Slim Shirt',
    category: 'tops',
    gender: 'menswear',
    fitCut: 'slim',
    fabric: '100% Mercerized Cotton',
    description: 'Crisp European cut dress shirt with slim waist darts and narrow armhole construction.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    price: '$59.90',
    hasProductSpecificChart: true,
  },
  {
    id: 'zara-relaxed-tee',
    brandId: 'zara',
    slug: 'heavyweight-relaxed-tee',
    name: 'Heavyweight Relaxed Boxy T-Shirt',
    category: 'tops',
    gender: 'menswear',
    fitCut: 'relaxed',
    fabric: '280 GSM Compact Organic Cotton',
    description: 'Drop-shoulder relaxed silhouette with a boxy torso and structured collar.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    price: '$35.90',
    hasProductSpecificChart: true,
  },
  {
    id: 'zara-tailored-trousers',
    brandId: 'zara',
    slug: 'cropped-pleated-trousers',
    name: 'Cropped Pleated Trousers',
    category: 'bottoms',
    gender: 'menswear',
    fitCut: 'regular',
    fabric: 'Viscose & Wool Blend',
    description: 'Single pleat front with slight taper towards the ankle cuff.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    price: '$69.90',
    hasProductSpecificChart: false,
  },

  // Uniqlo
  {
    id: 'uniqlo-airism-tee',
    brandId: 'uniqlo',
    slug: 'airism-cotton-oversized-crew-neck',
    name: 'AIRism Cotton Oversized Crew Neck T-Shirt',
    category: 'tops',
    gender: 'menswear',
    fitCut: 'oversized',
    fabric: '53% Cotton, 47% Polyester (AIRism tech)',
    description: 'Contemporary drop-shoulder half-sleeve tee with silk-like interior feel and structured exterior.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    price: '$24.90',
    hasProductSpecificChart: true,
  },
  {
    id: 'uniqlo-oxford-shirt',
    brandId: 'uniqlo',
    slug: 'oxford-regular-fit-shirt',
    name: 'Oxford Regular Fit Long Sleeve Shirt',
    category: 'tops',
    gender: 'menswear',
    fitCut: 'regular',
    fabric: '100% Traditional Oxford Cotton',
    description: 'Timeless button-down collar shirt with clean classic ease and room through the chest.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    price: '$39.90',
    hasProductSpecificChart: false,
  },

  // Levi's
  {
    id: 'levis-511-slim',
    brandId: 'levis',
    slug: '511-slim-fit-jeans',
    name: "511™ Slim Fit Flex Jeans",
    category: 'bottoms',
    gender: 'menswear',
    fitCut: 'slim',
    fabric: '99% Cotton, 1% Elastane',
    description: 'Modern slim fit with room to move. Sits below the waist with a slim leg from hip to ankle.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    price: '$89.50',
    hasProductSpecificChart: true,
  },
  {
    id: 'levis-501-original',
    brandId: 'levis',
    slug: '501-original-fit-jeans',
    name: "501® Original Fit Jeans",
    category: 'bottoms',
    gender: 'menswear',
    fitCut: 'regular',
    fabric: '100% Rigid Non-Stretch Denim',
    description: 'The blue jean archetype. Classic straight leg with signature button fly and true mid rise.',
    image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80',
    price: '$98.00',
    hasProductSpecificChart: true,
  },
  {
    id: 'levis-trucker-jacket',
    brandId: 'levis',
    slug: 'original-trucker-jacket',
    name: 'Original Denim Trucker Jacket',
    category: 'outerwear',
    gender: 'menswear',
    fitCut: 'regular',
    fabric: '100% Heavy Cotton Denim',
    description: 'Hits at the hip with button-flap chest pockets and side hem adjusters.',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    price: '$108.00',
    hasProductSpecificChart: false,
  },

  // H&M
  {
    id: 'hm-linen-shirt',
    brandId: 'hm',
    slug: 'regular-fit-linen-shirt',
    name: 'Regular Fit Linen Shirt',
    category: 'tops',
    gender: 'menswear',
    fitCut: 'regular',
    fabric: '100% Premium Washed Linen',
    description: 'Airy woven linen with a soft garment wash, classic turn-down collar and curved hem.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    price: '$34.99',
    hasProductSpecificChart: false,
  },
  {
    id: 'hm-wool-coat',
    brandId: 'hm',
    slug: 'tailored-wool-blend-coat',
    name: 'Tailored Wool-Blend Overcoat',
    category: 'outerwear',
    gender: 'menswear',
    fitCut: 'regular',
    fabric: '60% Recycled Wool, 40% Polyester',
    description: 'Knee-length single-breasted coat with notched lapels and tailored interior lining.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    price: '$149.00',
    hasProductSpecificChart: false,
  },

  // Nike
  {
    id: 'nike-club-hoodie',
    brandId: 'nike',
    slug: 'sportswear-club-fleece-hoodie',
    name: 'Sportswear Club Fleece Pullover Hoodie',
    category: 'tops',
    gender: 'menswear',
    fitCut: 'regular',
    fabric: '80% Cotton, 20% Polyester Brushed Fleece',
    description: 'Soft brushed fleece warmth with athletic shoulder mobility and ribbed hem.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    price: '$65.00',
    hasProductSpecificChart: true,
  },

  // Mango
  {
    id: 'mango-structured-blazer',
    brandId: 'mango',
    slug: 'slim-fit-structured-blazer',
    name: 'Slim Fit Structured Suit Blazer',
    category: 'outerwear',
    gender: 'menswear',
    fitCut: 'slim',
    fabric: 'Super 110s Wool Blend',
    description: 'Impeccable Mediterranean silhouette featuring high armscye and sharp chest contouring.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    price: '$169.99',
    hasProductSpecificChart: false,
  },

  // ASOS
  {
    id: 'asos-extreme-oversized-tee',
    brandId: 'asos',
    slug: 'extreme-oversized-cotton-t-shirt',
    name: 'Extreme Oversized Washed T-Shirt',
    category: 'tops',
    gender: 'menswear',
    fitCut: 'oversized',
    fabric: '100% Heavy Gauge Washed Cotton',
    description: 'Exaggerated streetwear fit with dramatic drop shoulders and extended hem.',
    image: 'https://images.unsplash.com/photo-1503342452485-86b7f54527ef?auto=format&fit=crop&w=800&q=80',
    price: '$28.00',
    hasProductSpecificChart: true,
  },
];


const LEVIS_MENS_LENGTHS = [
  { label: '30', inseam: 76 },
  { label: '32', inseam: 81 },
  { label: '34', inseam: 86 },
  { label: '36', inseam: 91 },
];

const LEVIS_WOMENS_LENGTHS = [
  { label: '28', inseam: 71 },
  { label: '30', inseam: 76 },
  { label: '32', inseam: 81 },
];

const CORE_CHARTS: SizeChart[] = [
  // ZARA MENSWEAR TOPS (General Brand Standard Chart)
  {
    id: 'sc-zara-tops-menswear',
    brandId: 'zara',
    category: 'tops',
    gender: 'menswear',
    isProductSpecific: false,
    isVerified: true,
    sourceNote: 'Verified Zara Official European Metric Specifications',
    entries: [
      { size: 'S', chestMin: 90, chestMax: 94, shoulderMin: 42, shoulderMax: 43.5, waistMin: 76, waistMax: 80, heightMin: 165, heightMax: 175 },
      { size: 'M', chestMin: 95, chestMax: 99, shoulderMin: 44, shoulderMax: 45.5, waistMin: 81, waistMax: 85, heightMin: 170, heightMax: 180 },
      { size: 'L', chestMin: 100, chestMax: 105, shoulderMin: 46, shoulderMax: 47.5, waistMin: 86, waistMax: 91, heightMin: 175, heightMax: 185 },
      { size: 'XL', chestMin: 106, chestMax: 112, shoulderMin: 48, shoulderMax: 49.5, waistMin: 92, waistMax: 98, heightMin: 178, heightMax: 190 },
      { size: 'XXL', chestMin: 113, chestMax: 120, shoulderMin: 50, shoulderMax: 52, waistMin: 99, waistMax: 106, heightMin: 180, heightMax: 195 },
    ],
  },

  // ZARA PRODUCT SPECIFIC: Poplin Slim Shirt (Higher priority, product-specific garment ease)
  {
    id: 'sc-zara-slim-shirt',
    brandId: 'zara',
    category: 'tops',
    gender: 'menswear',
    productId: 'zara-slim-shirt',
    isProductSpecific: true,
    isVerified: true,
    sourceNote: 'Product-Specific Garment Measurements (Zara Tailored Poplin)',
    entries: [
      { size: 'S', chestMin: 88, chestMax: 92, shoulderMin: 42, shoulderMax: 43, waistMin: 74, waistMax: 78, garmentChest: 98, garmentWaist: 86 },
      { size: 'M', chestMin: 93, chestMax: 97, shoulderMin: 43.5, shoulderMax: 44.5, waistMin: 79, waistMax: 83, garmentChest: 104, garmentWaist: 92 },
      { size: 'L', chestMin: 98, chestMax: 103, shoulderMin: 45, shoulderMax: 46.5, waistMin: 84, waistMax: 89, garmentChest: 110, garmentWaist: 98 },
      { size: 'XL', chestMin: 104, chestMax: 110, shoulderMin: 47, shoulderMax: 48.5, waistMin: 90, waistMax: 96, garmentChest: 118, garmentWaist: 106 },
    ],
  },

  // ZARA PRODUCT SPECIFIC: Heavyweight Relaxed Tee
  {
    id: 'sc-zara-relaxed-tee',
    brandId: 'zara',
    category: 'tops',
    gender: 'menswear',
    productId: 'zara-relaxed-tee',
    isProductSpecific: true,
    isVerified: true,
    sourceNote: 'Product-Specific Boxy Cut Ease (Zara Heavyweight)',
    entries: [
      { size: 'S', chestMin: 88, chestMax: 95, shoulderMin: 46, shoulderMax: 49, waistMin: 76, waistMax: 84, garmentChest: 112 },
      { size: 'M', chestMin: 94, chestMax: 102, shoulderMin: 49, shoulderMax: 52, waistMin: 82, waistMax: 90, garmentChest: 118 },
      { size: 'L', chestMin: 100, chestMax: 108, shoulderMin: 52, shoulderMax: 55, waistMin: 88, waistMax: 98, garmentChest: 124 },
      { size: 'XL', chestMin: 107, chestMax: 116, shoulderMin: 55, shoulderMax: 58, waistMin: 96, waistMax: 106, garmentChest: 132 },
    ],
  },

  // H&M MENSWEAR TOPS (General Brand Standard Chart)
  // Notice: H&M grading is slightly more generous: 96-104 is an L in some cuts, or M is 92-100.
  // When a user has 96 cm chest, in Zara M (95-99) fits snug/tailored, but in H&M relaxed grading, L (100-108) is recommended if they want comfort or M (92-99) is fitted.
  {
    id: 'sc-hm-tops-menswear',
    brandId: 'hm',
    category: 'tops',
    gender: 'menswear',
    isProductSpecific: false,
    isVerified: true,
    sourceNote: 'Verified H&M International Standards',
    entries: [
      { size: 'XS', chestMin: 84, chestMax: 89, shoulderMin: 41, shoulderMax: 42.5, waistMin: 72, waistMax: 76 },
      { size: 'S', chestMin: 90, chestMax: 95, shoulderMin: 43, shoulderMax: 44.5, waistMin: 77, waistMax: 82 },
      { size: 'M', chestMin: 96, chestMax: 101, shoulderMin: 45, shoulderMax: 46.5, waistMin: 83, waistMax: 88 },
      { size: 'L', chestMin: 102, chestMax: 109, shoulderMin: 47, shoulderMax: 48.5, waistMin: 89, waistMax: 96 },
      { size: 'XL', chestMin: 110, chestMax: 117, shoulderMin: 49, shoulderMax: 51, waistMin: 97, waistMax: 104 },
    ],
  },

  // UNIQLO MENSWEAR TOPS (General Brand Standard Chart)
  {
    id: 'sc-uniqlo-tops-menswear',
    brandId: 'uniqlo',
    category: 'tops',
    gender: 'menswear',
    isProductSpecific: false,
    isVerified: true,
    sourceNote: 'Verified Uniqlo Global LifeWear Master Size Chart',
    entries: [
      { size: 'XS', chestMin: 82, chestMax: 88, shoulderMin: 41, shoulderMax: 42.5, waistMin: 68, waistMax: 74, heightMin: 160, heightMax: 170 },
      { size: 'S', chestMin: 88, chestMax: 94, shoulderMin: 43, shoulderMax: 44, waistMin: 74, waistMax: 80, heightMin: 165, heightMax: 175 },
      { size: 'M', chestMin: 94, chestMax: 100, shoulderMin: 44.5, shoulderMax: 46, waistMin: 80, waistMax: 86, heightMin: 170, heightMax: 180 },
      { size: 'L', chestMin: 100, chestMax: 106, shoulderMin: 46.5, shoulderMax: 48, waistMin: 86, waistMax: 92, heightMin: 175, heightMax: 185 },
      { size: 'XL', chestMin: 106, chestMax: 114, shoulderMin: 48.5, shoulderMax: 50.5, waistMin: 92, waistMax: 100, heightMin: 178, heightMax: 190 },
    ],
  },

  // UNIQLO PRODUCT SPECIFIC: AIRism Oversized Tee
  {
    id: 'sc-uniqlo-airism-tee',
    brandId: 'uniqlo',
    category: 'tops',
    gender: 'menswear',
    productId: 'uniqlo-airism-tee',
    isProductSpecific: true,
    isVerified: true,
    sourceNote: 'Verified Uniqlo Product Specs: AIRism Cotton Oversized Tee',
    entries: [
      { size: 'S', chestMin: 86, chestMax: 93, shoulderMin: 50, shoulderMax: 53, garmentChest: 110, garmentLength: 70 },
      { size: 'M', chestMin: 93, chestMax: 99, shoulderMin: 53, shoulderMax: 56, garmentChest: 116, garmentLength: 72 },
      { size: 'L', chestMin: 99, chestMax: 106, shoulderMin: 56, shoulderMax: 59, garmentChest: 122, garmentLength: 75 },
      { size: 'XL', chestMin: 106, chestMax: 114, shoulderMin: 59, shoulderMax: 62, garmentChest: 130, garmentLength: 78 },
    ],
  },

  // LEVI'S BOTTOMS (Numeric Waist & Inseam Standard)
  {
    id: 'sc-levis-bottoms-menswear',
    brandId: 'levis',
    category: 'bottoms',
    gender: 'menswear',
    isProductSpecific: false,
    isVerified: true,
    sourceNote: "Verified Levi's Official Denim Waist & Hip Measurement Standard",
    entries: [
      { size: '29', waistMin: 72, waistMax: 74, hipMin: 88, hipMax: 91 },
      { size: '30', waistMin: 75, waistMax: 77, hipMin: 91, hipMax: 94 },
      { size: '31', waistMin: 78, waistMax: 80, hipMin: 94, hipMax: 97 },
      { size: '32', waistMin: 81, waistMax: 84, hipMin: 97, hipMax: 100 },
      { size: '33', waistMin: 84, waistMax: 86, hipMin: 100, hipMax: 103 },
      { size: '34', waistMin: 87, waistMax: 90, hipMin: 103, hipMax: 106 },
      { size: '36', waistMin: 92, waistMax: 96, hipMin: 108, hipMax: 112 },
    ],
    lengthOptions: LEVIS_MENS_LENGTHS,
  },

  // LEVI'S PRODUCT SPECIFIC: 511 Slim Fit Jeans
  {
    id: 'sc-levis-511-slim',
    brandId: 'levis',
    category: 'bottoms',
    gender: 'menswear',
    productId: 'levis-511-slim',
    isProductSpecific: true,
    isVerified: true,
    sourceNote: "Product-Specific Fit Specs: Levi's 511 Slim Jeans (Low-Rise)",
    entries: [
      { size: '30', waistMin: 76, waistMax: 78, hipMin: 90, hipMax: 93, garmentWaist: 79 },
      { size: '31', waistMin: 79, waistMax: 81, hipMin: 93, hipMax: 96, garmentWaist: 81.5 },
      { size: '32', waistMin: 82, waistMax: 84, hipMin: 96, hipMax: 99, garmentWaist: 84 },
      { size: '33', waistMin: 85, waistMax: 87, hipMin: 99, hipMax: 102, garmentWaist: 86.5 },
      { size: '34', waistMin: 88, waistMax: 91, hipMin: 102, hipMax: 105, garmentWaist: 89 },
    ],
    lengthOptions: LEVIS_MENS_LENGTHS,
  },

  // NIKE MENSWEAR TOPS (Athletic Standard)
  {
    id: 'sc-nike-tops-menswear',
    brandId: 'nike',
    category: 'tops',
    gender: 'menswear',
    isProductSpecific: false,
    isVerified: true,
    sourceNote: 'Verified Nike Athletic Sizing Framework',
    entries: [
      { size: 'S', chestMin: 88, chestMax: 95, waistMin: 74, waistMax: 81, hipMin: 88, hipMax: 95 },
      { size: 'M', chestMin: 96, chestMax: 103, waistMin: 82, waistMax: 89, hipMin: 96, hipMax: 103 },
      { size: 'L', chestMin: 104, chestMax: 111, waistMin: 90, waistMax: 97, hipMin: 104, hipMax: 111 },
      { size: 'XL', chestMin: 112, chestMax: 122, waistMin: 98, waistMax: 108, hipMin: 112, hipMax: 120 },
      { size: 'XXL', chestMin: 123, chestMax: 134, waistMin: 109, waistMax: 120, hipMin: 121, hipMax: 130 },
    ],
  },

  // ADIDAS MENSWEAR TOPS (European Sportswear Standard)
  {
    id: 'sc-adidas-tops-menswear',
    brandId: 'adidas',
    category: 'tops',
    gender: 'menswear',
    isProductSpecific: false,
    isVerified: true,
    sourceNote: 'Verified Adidas Global Apparel Sizing Table',
    entries: [
      { size: 'S', chestMin: 87, chestMax: 94, waistMin: 75, waistMax: 82, hipMin: 86, hipMax: 93 },
      { size: 'M', chestMin: 95, chestMax: 102, waistMin: 83, waistMax: 90, hipMin: 94, hipMax: 101 },
      { size: 'L', chestMin: 103, chestMax: 110, waistMin: 91, waistMax: 98, hipMin: 102, hipMax: 109 },
      { size: 'XL', chestMin: 111, chestMax: 120, waistMin: 99, waistMax: 108, hipMin: 110, hipMax: 118 },
    ],
  },

  // MANGO MENSWEAR TOPS (Mediterranean Tailored Standard)
  {
    id: 'sc-mango-tops-menswear',
    brandId: 'mango',
    category: 'tops',
    gender: 'menswear',
    isProductSpecific: false,
    isVerified: true,
    sourceNote: 'Verified Mango Tailored Sizing Guidelines',
    entries: [
      { size: 'S', chestMin: 90, chestMax: 94, shoulderMin: 42, shoulderMax: 43.5, waistMin: 76, waistMax: 80 },
      { size: 'M', chestMin: 95, chestMax: 99, shoulderMin: 44, shoulderMax: 45.5, waistMin: 81, waistMax: 85 },
      { size: 'L', chestMin: 100, chestMax: 104, shoulderMin: 46, shoulderMax: 47.5, waistMin: 86, waistMax: 90 },
      { size: 'XL', chestMin: 105, chestMax: 110, shoulderMin: 48, shoulderMax: 49.5, waistMin: 91, waistMax: 96 },
    ],
  },

  // ASOS MENSWEAR TOPS (High Street Fashion Standard)
  {
    id: 'sc-asos-tops-menswear',
    brandId: 'asos',
    category: 'tops',
    gender: 'menswear',
    isProductSpecific: false,
    isVerified: true,
    sourceNote: 'Verified ASOS Design UK Standard Charts',
    entries: [
      { size: 'XS', chestMin: 86, chestMax: 91, waistMin: 71, waistMax: 76 },
      { size: 'S', chestMin: 91, chestMax: 96, waistMin: 76, waistMax: 81 },
      { size: 'M', chestMin: 96, chestMax: 101, waistMin: 81, waistMax: 86 },
      { size: 'L', chestMin: 101, chestMax: 106, waistMin: 86, waistMax: 91 },
      { size: 'XL', chestMin: 106, chestMax: 111, waistMin: 91, waistMax: 96 },
    ],
  },
];


// ---------------------------------------------------------------------------
// Extended coverage: every brand now has its own menswear + womenswear charts for
// the categories it sells, so the engine never has to borrow another brand's chart.
// Values are body measurements in cm, approximated from each brand's public size
// guide, and flagged isVerified: false so the UI can label them honestly.
// Outerwear reuses a brand's tops chart (brands grade jackets on the same chest
// measurements); see resolveChart in the sizing engine.
// ---------------------------------------------------------------------------

type Range = [number, number];

function row(
  size: string,
  dims: { chest?: Range; waist?: Range; hip?: Range; shoulder?: Range }
): SizeChartEntry {
  const e: SizeChartEntry = { size };
  if (dims.chest) [e.chestMin, e.chestMax] = dims.chest;
  if (dims.waist) [e.waistMin, e.waistMax] = dims.waist;
  if (dims.hip) [e.hipMin, e.hipMax] = dims.hip;
  if (dims.shoulder) [e.shoulderMin, e.shoulderMax] = dims.shoulder;
  return e;
}

function brandChart(
  brandId: string,
  category: ClothingCategory,
  gender: GenderCategory,
  sourceNote: string,
  entries: SizeChartEntry[],
  extra: Partial<SizeChart> = {}
): SizeChart {
  return {
    id: `sc-${brandId}-${category}-${gender}`,
    brandId,
    category,
    gender,
    isProductSpecific: false,
    isVerified: false,
    sourceNote,
    entries,
    ...extra,
  };
}

const EXTENDED_CHARTS: SizeChart[] = [
  // ----- MENSWEAR TOPS (missing brands) -----
  brandChart('levis', 'tops', 'menswear', "Levi's men's tops & jackets guide (approximated)", [
    row('S', { chest: [88, 95], waist: [74, 81] }),
    row('M', { chest: [96, 103], waist: [82, 89] }),
    row('L', { chest: [104, 112], waist: [90, 97] }),
    row('XL', { chest: [113, 121], waist: [98, 106] }),
    row('XXL', { chest: [122, 130], waist: [107, 116] }),
  ]),

  // ----- MENSWEAR BOTTOMS -----
  brandChart('zara', 'bottoms', 'menswear', "Zara men's trousers, EU sizing (approximated)", [
    row('38', { waist: [75, 78], hip: [91, 94] }),
    row('40', { waist: [79, 82], hip: [95, 98] }),
    row('42', { waist: [83, 86], hip: [99, 102] }),
    row('44', { waist: [87, 90], hip: [103, 106] }),
    row('46', { waist: [91, 95], hip: [107, 111] }),
    row('48', { waist: [96, 100], hip: [112, 116] }),
  ]),
  brandChart('hm', 'bottoms', 'menswear', "H&M men's trousers guide (approximated)", [
    row('XS', { waist: [72, 76], hip: [88, 92] }),
    row('S', { waist: [77, 82], hip: [93, 97] }),
    row('M', { waist: [83, 88], hip: [98, 102] }),
    row('L', { waist: [89, 96], hip: [103, 108] }),
    row('XL', { waist: [97, 104], hip: [109, 114] }),
  ]),
  brandChart('uniqlo', 'bottoms', 'menswear', "Uniqlo men's bottoms guide (approximated)", [
    row('XS', { waist: [68, 73], hip: [84, 89] }),
    row('S', { waist: [74, 79], hip: [90, 95] }),
    row('M', { waist: [80, 85], hip: [96, 100] }),
    row('L', { waist: [86, 91], hip: [101, 105] }),
    row('XL', { waist: [92, 100], hip: [106, 112] }),
  ]),
  brandChart('nike', 'bottoms', 'menswear', "Nike men's bottoms guide (approximated)", [
    row('S', { waist: [74, 81], hip: [88, 95] }),
    row('M', { waist: [82, 89], hip: [96, 103] }),
    row('L', { waist: [90, 97], hip: [104, 111] }),
    row('XL', { waist: [98, 108], hip: [112, 120] }),
    row('XXL', { waist: [109, 120], hip: [121, 130] }),
  ]),
  brandChart('adidas', 'bottoms', 'menswear', "Adidas men's bottoms guide (approximated)", [
    row('S', { waist: [75, 82], hip: [88, 95] }),
    row('M', { waist: [83, 90], hip: [96, 103] }),
    row('L', { waist: [91, 98], hip: [104, 111] }),
    row('XL', { waist: [99, 108], hip: [112, 120] }),
  ]),
  brandChart('mango', 'bottoms', 'menswear', "Mango men's trousers, EU sizing (approximated)", [
    row('38', { waist: [74, 77], hip: [90, 93] }),
    row('40', { waist: [78, 81], hip: [94, 97] }),
    row('42', { waist: [82, 85], hip: [98, 101] }),
    row('44', { waist: [86, 89], hip: [102, 105] }),
    row('46', { waist: [90, 94], hip: [106, 110] }),
  ]),
  brandChart('asos', 'bottoms', 'menswear', "ASOS Design men's trousers, waist sizing (approximated)", [
    row('W28', { waist: [69, 73], hip: [84, 88] }),
    row('W30', { waist: [74, 78], hip: [89, 93] }),
    row('W32', { waist: [79, 83], hip: [94, 98] }),
    row('W34', { waist: [84, 88], hip: [99, 103] }),
    row('W36', { waist: [89, 93], hip: [104, 108] }),
    row('W38', { waist: [94, 99], hip: [109, 114] }),
  ]),

  // ----- WOMENSWEAR TOPS -----
  brandChart('zara', 'tops', 'womenswear', "Zara women's tops guide (approximated)", [
    row('XS', { chest: [80, 83], waist: [61, 64] }),
    row('S', { chest: [84, 87], waist: [65, 68] }),
    row('M', { chest: [88, 92], waist: [69, 73] }),
    row('L', { chest: [93, 98], waist: [74, 79] }),
    row('XL', { chest: [99, 104], waist: [80, 85] }),
  ]),
  brandChart('hm', 'tops', 'womenswear', "H&M women's tops guide (approximated)", [
    row('XS', { chest: [80, 84], waist: [63, 67] }),
    row('S', { chest: [85, 89], waist: [68, 72] }),
    row('M', { chest: [90, 95], waist: [73, 78] }),
    row('L', { chest: [96, 101], waist: [79, 84] }),
    row('XL', { chest: [102, 108], waist: [85, 91] }),
  ]),
  brandChart('uniqlo', 'tops', 'womenswear', "Uniqlo women's tops guide (approximated)", [
    row('XS', { chest: [76, 80], waist: [58, 62] }),
    row('S', { chest: [81, 84], waist: [63, 66] }),
    row('M', { chest: [85, 88], waist: [67, 70] }),
    row('L', { chest: [89, 94], waist: [71, 76] }),
    row('XL', { chest: [95, 100], waist: [77, 82] }),
  ]),
  brandChart('levis', 'tops', 'womenswear', "Levi's women's tops guide (approximated)", [
    row('XS', { chest: [80, 84], waist: [62, 66] }),
    row('S', { chest: [85, 89], waist: [67, 71] }),
    row('M', { chest: [90, 95], waist: [72, 77] }),
    row('L', { chest: [96, 102], waist: [78, 84] }),
    row('XL', { chest: [103, 110], waist: [85, 92] }),
  ]),
  brandChart('nike', 'tops', 'womenswear', "Nike women's tops guide (approximated)", [
    row('XS', { chest: [76, 83], waist: [60, 67] }),
    row('S', { chest: [84, 90], waist: [68, 74] }),
    row('M', { chest: [91, 97], waist: [75, 81] }),
    row('L', { chest: [98, 104], waist: [82, 88] }),
    row('XL', { chest: [105, 114], waist: [89, 98] }),
  ]),
  brandChart('adidas', 'tops', 'womenswear', "Adidas women's tops guide (approximated)", [
    row('XS', { chest: [78, 82], waist: [63, 66] }),
    row('S', { chest: [83, 87], waist: [67, 71] }),
    row('M', { chest: [88, 93], waist: [72, 77] }),
    row('L', { chest: [94, 100], waist: [78, 84] }),
    row('XL', { chest: [101, 107], waist: [85, 92] }),
  ]),
  brandChart('mango', 'tops', 'womenswear', "Mango women's tops guide (approximated)", [
    row('XS', { chest: [80, 83], waist: [61, 64] }),
    row('S', { chest: [84, 87], waist: [65, 68] }),
    row('M', { chest: [88, 92], waist: [69, 73] }),
    row('L', { chest: [93, 97], waist: [74, 78] }),
    row('XL', { chest: [98, 103], waist: [79, 84] }),
  ]),
  brandChart('asos', 'tops', 'womenswear', "ASOS Design women's UK sizing (approximated)", [
    row('UK 6', { chest: [76, 79], waist: [58, 61] }),
    row('UK 8', { chest: [80, 83], waist: [62, 65] }),
    row('UK 10', { chest: [84, 88], waist: [66, 70] }),
    row('UK 12', { chest: [89, 93], waist: [71, 75] }),
    row('UK 14', { chest: [94, 98], waist: [76, 80] }),
    row('UK 16', { chest: [99, 104], waist: [81, 86] }),
    row('UK 18', { chest: [105, 111], waist: [87, 93] }),
  ]),

  // ----- WOMENSWEAR BOTTOMS -----
  brandChart('zara', 'bottoms', 'womenswear', "Zara women's trousers guide (approximated)", [
    row('XS', { waist: [61, 64], hip: [88, 91] }),
    row('S', { waist: [65, 68], hip: [92, 95] }),
    row('M', { waist: [69, 73], hip: [96, 99] }),
    row('L', { waist: [74, 79], hip: [100, 105] }),
    row('XL', { waist: [80, 85], hip: [106, 111] }),
  ]),
  brandChart('hm', 'bottoms', 'womenswear', "H&M women's trousers guide (approximated)", [
    row('XS', { waist: [63, 67], hip: [88, 92] }),
    row('S', { waist: [68, 72], hip: [93, 97] }),
    row('M', { waist: [73, 78], hip: [98, 103] }),
    row('L', { waist: [79, 84], hip: [104, 109] }),
    row('XL', { waist: [85, 91], hip: [110, 116] }),
  ]),
  brandChart('uniqlo', 'bottoms', 'womenswear', "Uniqlo women's bottoms guide (approximated)", [
    row('XS', { waist: [58, 62], hip: [84, 88] }),
    row('S', { waist: [63, 66], hip: [89, 91] }),
    row('M', { waist: [67, 70], hip: [92, 94] }),
    row('L', { waist: [71, 76], hip: [95, 99] }),
    row('XL', { waist: [77, 82], hip: [100, 104] }),
  ]),
  brandChart(
    'levis',
    'bottoms',
    'womenswear',
    "Levi's women's denim waist sizing (approximated)",
    [
      row('24', { waist: [61, 63], hip: [86, 88] }),
      row('25', { waist: [63.5, 66], hip: [88.5, 91] }),
      row('26', { waist: [66.5, 68.5], hip: [91.5, 93.5] }),
      row('27', { waist: [69, 71], hip: [94, 96] }),
      row('28', { waist: [71.5, 73.5], hip: [96.5, 98.5] }),
      row('29', { waist: [74, 76], hip: [99, 101] }),
      row('30', { waist: [76.5, 78.5], hip: [101.5, 103.5] }),
      row('31', { waist: [79, 81], hip: [104, 106] }),
      row('32', { waist: [81.5, 84], hip: [106.5, 109] }),
    ],
    { lengthOptions: LEVIS_WOMENS_LENGTHS }
  ),
  brandChart('nike', 'bottoms', 'womenswear', "Nike women's bottoms guide (approximated)", [
    row('XS', { waist: [60, 67], hip: [84, 91] }),
    row('S', { waist: [68, 74], hip: [92, 98] }),
    row('M', { waist: [75, 81], hip: [99, 105] }),
    row('L', { waist: [82, 88], hip: [106, 112] }),
    row('XL', { waist: [89, 98], hip: [113, 120] }),
  ]),
  brandChart('adidas', 'bottoms', 'womenswear', "Adidas women's bottoms guide (approximated)", [
    row('XS', { waist: [63, 66], hip: [88, 91] }),
    row('S', { waist: [67, 71], hip: [92, 96] }),
    row('M', { waist: [72, 77], hip: [97, 102] }),
    row('L', { waist: [78, 84], hip: [103, 108] }),
    row('XL', { waist: [85, 92], hip: [109, 115] }),
  ]),
  brandChart('mango', 'bottoms', 'womenswear', "Mango women's trousers guide (approximated)", [
    row('XS', { waist: [61, 64], hip: [87, 90] }),
    row('S', { waist: [65, 68], hip: [91, 94] }),
    row('M', { waist: [69, 73], hip: [95, 98] }),
    row('L', { waist: [74, 78], hip: [99, 103] }),
    row('XL', { waist: [79, 84], hip: [104, 108] }),
  ]),
  brandChart('asos', 'bottoms', 'womenswear', "ASOS Design women's UK sizing (approximated)", [
    row('UK 6', { waist: [58, 61], hip: [84, 87] }),
    row('UK 8', { waist: [62, 65], hip: [88, 91] }),
    row('UK 10', { waist: [66, 70], hip: [92, 96] }),
    row('UK 12', { waist: [71, 75], hip: [97, 101] }),
    row('UK 14', { waist: [76, 80], hip: [102, 106] }),
    row('UK 16', { waist: [81, 86], hip: [107, 112] }),
    row('UK 18', { waist: [87, 93], hip: [113, 119] }),
  ]),
];

export const SIZE_CHARTS: SizeChart[] = [...CORE_CHARTS, ...EXTENDED_CHARTS];
