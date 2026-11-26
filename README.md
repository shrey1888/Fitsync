# FITSYNC — Universal Fashion-Tech Sizing Engine

> **“Measure once. Find your size everywhere.”**

FITSYNC is a modern fashion-tech platform built to eliminate vanity sizing discrepancies and online clothing returns. By calibrating a customer's physical body measurements once, FITSYNC accurately cross-references them against verified brand grading charts and product-specific pattern ease curves.

---

## The Sizing Problem & Engineering Solution

- **The Problem:** A customer wears a **Medium** in Zara, needs a **Large** in H&M, an **M** in Uniqlo, and a numeric **32** in Levi's. Fast-fashion brands use disparate anatomical grading blocks and vanity allowances.
- **The Solution:** A transparent sizing engine that differentiates raw skin-to-tape dimensions from finished garment measurements, factoring in garment ease, silhouette preferences (slim, regular, relaxed, oversized), and brand grading tendencies.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS with custom editorial serif & Swiss sans typography
- **Motion & Interactions:** Framer Motion & Canvas Confetti
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) + LocalStorage offline-first fallback
- **Icons:** Lucide React

---

## Key Features & Architecture

### 1. Landing Page (`/`)
- Minimalist black & white editorial layout inspired by Zara, Apple, and Aesop.
- **Live Interactive Hero Demo:** Live sliders allowing visitors to tweak chest & waist dimensions in real-time to watch their size dynamically update across Zara, H&M, Uniqlo, and Levi's.
- **How It Works:** 3-step visual narrative breaking down skin measurements vs garment ease.
- **Brand Compatibility Grid:** Directory of top fashion houses.
- **Why FITSYNC:** Insights on the fast-fashion return crisis and vanity sizing.
- **Demo Testimonials & Accordion FAQ.**

### 2. Measurement Onboarding (`/onboarding`)
- **Step 1: Anatomical Foundation** (Height, Weight optional, Sizing department: Menswear / Womenswear / Unisex).
- **Step 2: Precision Body Calibration** (Chest, Waist, Shoulder width, Hip, Inseam) with Metric/Imperial toggle (cm/in, kg/lbs).
- **Interactive Anatomical Tape Guide:** SVG silhouette that visually illustrates exactly where and how to place the tape measure for each dimension with tailoring tips.
- **Step 3: Garment Ease & Silhouette Selection** (Slim Fit, Regular Fit, Relaxed Fit, Oversized Fit).
- **Quick Test Archetypes:** 1-click presets to immediately test the platform (including the user prompt's reference archetype).

### 3. Brand Explorer (`/brands`)
- Searchable, filterable brand directory covering:
  - **Zara** (Spain — European slim taper)
  - **H&M** (Sweden — Scandinavian relaxed commercial standard)
  - **Uniqlo** (Japan — LifeWear precision metric grading)
  - **Levi’s** (USA — Heritage waist & inseam numeric denim)
  - **Nike** (USA — Athletic motion cut)
  - **Adidas** (Germany — Sportswear grading)
  - **Mango** (Spain — Mediterranean tailored silhouette)
  - **ASOS Design** (UK — High street directional ease)
- Interactive **Size Chart Modal Inspector** showing verified production specifications.

### 4. Size Finder (`/finder`)
- 3-step selector: Brand → Category → Product Model (general brand chart vs. product-specific pattern).
- Displays:
  - Recommended Size with Fit Confidence (High / Moderate / Low)
  - Fit Character (e.g. Natural Regular, Fitted / Snug, Relaxed Drape)
  - Alternative Size recommendations with transparent directional guidance
  - Dimensional Variance Breakdown table comparing user tape vs. brand pattern bounds
  - Garment Ease breakdown
  - One-click "Save This Sizing" and "Copy Result"

### 5. User Dashboard (`/dashboard`)
- **Universal Size Matrix:** Instant cross-brand matrix showing user's size across all 8 brands for Tops, Bottoms, and Outerwear.
- **Private Measurement Vault:** Complete review and instant editing of stored metrics.
- **Saved Brands & Recommendation History.**
- **Supabase Cloud Sync Inspector:** Copyable SQL schema and configuration instructions.

### 6. Size Translator (`/translate`)
- For shoppers without a tape measure: "H&M S fits me, what do I wear elsewhere?"
- Pick department, category (tops / bottoms), a reference brand, the size that fits, and whether it feels tight, right or loose.
- [`src/lib/sizing/translator.ts`](src/lib/sizing/translator.ts) reads that size's ranges off the reference brand's chart to estimate the body, then runs the normal sizing engine against every other brand, flagging "between sizes" cases.

---

## Sizing Recommendation Algorithm

Located in [`src/lib/sizing/engine.ts`](src/lib/sizing/engine.ts):
1. **Garment Ease Modeling:**
   - Slim Fit: +2cm to +4cm ease
   - Regular Fit: +6cm to +10cm ease
   - Relaxed Fit: +12cm to +16cm ease
   - Oversized Fit: +18cm+ ease
2. **Category Weighting:**
   - Tops: Chest (45%), Shoulder (30%), Waist (15%), Height (10%)
   - Bottoms: Waist (50%), Hip (35%), Inseam (15%)
3. **Product-Specific Priority:** Garment-specific charts take precedence over general brand standards.
4. **Missing Measurements Penalty:** Gracefully estimates missing inputs while adjusting confidence score and surfacing transparent notices.

---

## Supabase Database Setup

1. Copy the SQL schema from [`src/lib/supabase/schema.sql`](src/lib/supabase/schema.sql) into your Supabase SQL Editor.
2. In your `.env.local` file, add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. When running locally without environment keys, FITSYNC automatically operates in client-first LocalStorage mode so that all interactions, calculations, and saves work out-of-the-box.

---

## Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
