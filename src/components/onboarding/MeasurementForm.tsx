'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFitSync, SAMPLE_PROFILES } from '@/lib/store/useFitStore';
import { BodyMeasurements, FitPreference, GenderCategory, MeasurementUnit } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info,
  Ruler,
  HelpCircle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FormProps {
  onSavedRedirect?: string;
}

export default function MeasurementForm({ onSavedRedirect = '/finder' }: FormProps) {
  const router = useRouter();
  const { measurements, saveMeasurements } = useFitSync();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [unit, setUnit] = useState<MeasurementUnit>(measurements?.unit || 'cm');
  const [activeGuide, setActiveGuide] = useState<string>('chest');

  // Form states (internal storage in metric cm/kg)
  const [gender, setGender] = useState<GenderCategory>(measurements?.gender || 'menswear');
  const [height, setHeight] = useState<number>(measurements?.height || 175);
  const [weight, setWeight] = useState<number | undefined>(measurements?.weight || 72);
  const [chest, setChest] = useState<number>(measurements?.chest || 96);
  const [waist, setWaist] = useState<number>(measurements?.waist || 82);
  const [shoulder, setShoulder] = useState<number>(measurements?.shoulder || 44);
  const [hip, setHip] = useState<number>(measurements?.hip || 98);
  const [inseam, setInseam] = useState<number>(measurements?.inseam || 80);
  const [fitPreference, setFitPreference] = useState<FitPreference>(
    measurements?.fitPreference || 'regular'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper conversions
  const cmToInch = (val: number) => Math.round((val / 2.54) * 10) / 10;
  const inchToCm = (val: number) => Math.round(val * 2.54 * 10) / 10;
  const kgToLbs = (val?: number) => (val ? Math.round(val * 2.20462) : '');
  const lbsToKg = (val?: number) => (val ? Math.round(val / 2.20462) : undefined);

  const handleUnitToggle = (newUnit: MeasurementUnit) => {
    setUnit(newUnit);
  };

  const handleLoadSample = (profile: typeof SAMPLE_PROFILES[0]) => {
    setGender(profile.measurements.gender);
    setHeight(profile.measurements.height);
    setWeight(profile.measurements.weight);
    setChest(profile.measurements.chest);
    setWaist(profile.measurements.waist);
    setShoulder(profile.measurements.shoulder);
    setHip(profile.measurements.hip);
    setInseam(profile.measurements.inseam);
    setFitPreference(profile.measurements.fitPreference);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const newProfile: BodyMeasurements = {
      gender,
      height,
      weight,
      chest,
      waist,
      shoulder,
      hip,
      inseam,
      fitPreference,
      unit,
    };

    await saveMeasurements(newProfile);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#121212', '#9F8253', '#8A8A8A', '#D4AF37'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(onSavedRedirect);
    }, 600);
  };

  const guides: Record<
    string,
    { title: string; instruction: string; tip: string; svgCoord: string }
  > = {
    height: {
      title: 'Total Body Stature',
      instruction: 'Stand barefoot with heels flat against a wall. Measure vertically to the crown of your head.',
      tip: 'Do not measure with thick shoes or hair accessories.',
      svgCoord: 'Y-axis full vertical crown-to-ground',
    },
    chest: {
      title: 'Chest / Bust Circumference',
      instruction:
        'Wrap the tape measure around the fullest part of your chest, keeping it level under your armpits and across your shoulder blades.',
      tip: 'Breathe out naturally. Do not expand or puff out your chest.',
      svgCoord: 'Axillary level horizontal tape line',
    },
    waist: {
      title: 'Natural Waistline',
      instruction:
        'Measure around your natural waistline, typically located midway between your lowest rib and the top of your hip bone (near the navel).',
      tip: 'Keep the tape snug but comfortable — one finger should comfortably slip behind the tape.',
      svgCoord: 'Mid-torso iliac contour line',
    },
    shoulder: {
      title: 'Shoulder Biacromial Width',
      instruction:
        'Measure horizontally across the back from the prominent bony tip of one shoulder (acromion) to the other.',
      tip: 'Keep arms relaxed at your sides. Having a partner assist yields highest accuracy.',
      svgCoord: 'Transverse posterior shoulder seam',
    },
    hip: {
      title: 'Seat & Hip Maximum Circumference',
      instruction:
        'Stand with feet together and measure around the fullest, widest point of your hips and buttocks.',
      tip: 'Ensure the tape remains parallel to the floor all the way around.',
      svgCoord: 'Trochanteric horizontal contour',
    },
    inseam: {
      title: 'Inner Leg Inseam',
      instruction:
        'Measure from the lowest point of your groin / inner crotch seam straight down the inside of your leg to your ankle bone.',
      tip: 'Alternatively, measure a pair of well-fitting pants laid flat along the inside leg seam.',
      svgCoord: 'Medial femoral crotch-to-hem seam',
    },
  };

  return (
    <div className="bg-[#FAF9F6] border border-[#E8E6DF] shadow-sm max-w-4xl mx-auto overflow-hidden">
      {/* Header bar */}
      <div className="border-b border-[#E8E6DF] p-6 sm:p-8 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9F8253] font-semibold">
            Universal Profile Setup
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-[#121212] mt-1">
            {step === 1 && 'Step 1: Anatomical Foundation'}
            {step === 2 && 'Step 2: Precision Body Calibration'}
            {step === 3 && 'Step 3: Garment Ease & Silhouette'}
          </h2>
          <p className="text-xs text-[#6E6D68] mt-1">
            Measure once. Your profile will be cross-referenced with all verified fashion charts.
          </p>
        </div>

        {/* Unit toggle & Archetype loader */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <div className="inline-flex border border-[#E8E6DF] p-0.5 bg-[#FAF9F6]">
            <button
              type="button"
              onClick={() => handleUnitToggle('cm')}
              className={`px-3 py-1 text-xs uppercase tracking-wider font-mono transition-all ${
                unit === 'cm' ? 'bg-[#121212] text-white shadow-xs' : 'text-[#6E6D68] hover:text-[#121212]'
              }`}
            >
              Metric (CM)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('inch')}
              className={`px-3 py-1 text-xs uppercase tracking-wider font-mono transition-all ${
                unit === 'inch' ? 'bg-[#121212] text-white shadow-xs' : 'text-[#6E6D68] hover:text-[#121212]'
              }`}
            >
              Imperial (IN)
            </button>
          </div>
        </div>
      </div>

      {/* Quick sample archetypes banner */}
      <div className="bg-[#F3F1EC] px-6 py-3 border-b border-[#E8E6DF] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-[#6E6D68]">
          <Sparkles className="w-3.5 h-3.5 text-[#9F8253]" />
          <span className="font-medium text-[#121212]">Quick Test Archetypes:</span>
          <span className="hidden md:inline text-[#6E6D68]">
            Instant load verified test measurements
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {SAMPLE_PROFILES.map((prof, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(prof)}
              title={prof.description}
              className="text-[11px] px-2.5 py-1 bg-white border border-[#D8D6CF] hover:border-[#121212] hover:bg-[#121212] hover:text-white transition-all text-[#121212]"
            >
              {prof.label.split(' ')[0]} {prof.label.split(' ')[1] || ''}
            </button>
          ))}
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-3 border-b border-[#E8E6DF] bg-white text-center text-xs">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`py-3.5 border-b-2 transition-all flex items-center justify-center space-x-2 ${
            step === 1 ? 'border-[#121212] text-[#121212] font-semibold' : 'border-transparent text-[#6E6D68]'
          }`}
        >
          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono">
            1
          </span>
          <span className="hidden sm:inline uppercase tracking-[0.14em]">Basic Info</span>
        </button>

        <button
          type="button"
          onClick={() => setStep(2)}
          className={`py-3.5 border-b-2 transition-all flex items-center justify-center space-x-2 ${
            step === 2 ? 'border-[#121212] text-[#121212] font-semibold' : 'border-transparent text-[#6E6D68]'
          }`}
        >
          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono">
            2
          </span>
          <span className="hidden sm:inline uppercase tracking-[0.14em]">Measurements</span>
        </button>

        <button
          type="button"
          onClick={() => setStep(3)}
          className={`py-3.5 border-b-2 transition-all flex items-center justify-center space-x-2 ${
            step === 3 ? 'border-[#121212] text-[#121212] font-semibold' : 'border-transparent text-[#6E6D68]'
          }`}
        >
          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono">
            3
          </span>
          <span className="hidden sm:inline uppercase tracking-[0.14em]">Fit Preference</span>
        </button>
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-10">
        {/* STEP 1: BASIC INFORMATION */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            {/* Gender / Sizing category */}
            <div>
              <label className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-medium mb-3">
                Sizing Department
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    { id: 'menswear', label: 'Menswear Standard', note: 'Graded on chest & shoulder drop' },
                    { id: 'womenswear', label: 'Womenswear Standard', note: 'Graded on bust, waist, & hip curve' },
                    { id: 'unisex', label: 'Gender-Free / Unisex', note: 'Universal straight-line grading' },
                  ] as const
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGender(g.id)}
                    className={`p-4 text-left border transition-all ${
                      gender === g.id
                        ? 'border-[#121212] bg-[#121212] text-[#FAF9F6]'
                        : 'border-[#E8E6DF] bg-white text-[#121212] hover:border-[#121212]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{g.label}</span>
                      {gender === g.id && <Check className="w-4 h-4 text-[#FAF9F6]" />}
                    </div>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        gender === g.id ? 'text-[#FAF9F6]/70' : 'text-[#6E6D68]'
                      }`}
                    >
                      {g.note}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Height & Weight Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Height */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-[#121212] font-medium flex items-center gap-1.5">
                    Height
                    <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#6E6D68]">
                    {unit === 'cm' ? `${height} cm` : `${cmToInch(height)} in`}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={unit === 'cm' ? height : cmToInch(height)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setHeight(unit === 'cm' ? val : inchToCm(val));
                    }}
                    onFocus={() => setActiveGuide('height')}
                    min={unit === 'cm' ? 120 : 48}
                    max={unit === 'cm' ? 230 : 90}
                    className="w-full bg-white border border-[#D8D6CF] focus:border-[#121212] px-4 py-3 text-sm font-mono outline-hidden transition-colors"
                  />
                  <span className="absolute right-3 top-3 text-xs uppercase text-[#6E6D68] font-mono pointer-events-none">
                    {unit}
                  </span>
                </div>
                <p className="text-[11px] text-[#6E6D68] mt-1.5">
                  Essential for sleeve length, jacket drop, and vertical grading.
                </p>
              </div>

              {/* Weight (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-[#121212] font-medium flex items-center gap-1.5">
                    Weight
                    <span className="text-[10px] text-[#9B9A93] lowercase tracking-normal">(optional)</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#6E6D68]">
                    {unit === 'cm' ? `${weight || '-'} kg` : `${kgToLbs(weight) || '-'} lbs`}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={unit === 'cm' ? weight || '' : kgToLbs(weight)}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined;
                      setWeight(unit === 'cm' ? val : lbsToKg(val));
                    }}
                    placeholder={unit === 'cm' ? 'e.g. 72' : 'e.g. 160'}
                    className="w-full bg-white border border-[#D8D6CF] focus:border-[#121212] px-4 py-3 text-sm font-mono outline-hidden transition-colors"
                  />
                  <span className="absolute right-3 top-3 text-xs uppercase text-[#6E6D68] font-mono pointer-events-none">
                    {unit === 'cm' ? 'kg' : 'lbs'}
                  </span>
                </div>
                <p className="text-[11px] text-[#6E6D68] mt-1.5">
                  Helps fine-tune body mass distribution calculations.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: BODY MEASUREMENTS */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Input fields column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Chest */}
              <div
                className={`p-3.5 border transition-all ${
                  activeGuide === 'chest' ? 'border-[#121212] bg-[#FAF9F6]' : 'border-[#E8E6DF] bg-white'
                }`}
                onClick={() => setActiveGuide('chest')}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-[0.18em] font-medium text-[#121212]">
                    Chest / Bust Circumference <span className="text-rose-600">*</span>
                  </label>
                  <span className="font-mono text-xs text-[#121212] font-semibold">
                    {unit === 'cm' ? `${chest} cm` : `${cmToInch(chest)} in`}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={unit === 'cm' ? chest : cmToInch(chest)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setChest(unit === 'cm' ? val : inchToCm(val));
                    }}
                    onFocus={() => setActiveGuide('chest')}
                    min={60}
                    max={160}
                    step={0.5}
                    className="w-full bg-white border border-[#D8D6CF] focus:border-[#121212] px-3.5 py-2.5 text-sm font-mono outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#6E6D68]">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Waist */}
              <div
                className={`p-3.5 border transition-all ${
                  activeGuide === 'waist' ? 'border-[#121212] bg-[#FAF9F6]' : 'border-[#E8E6DF] bg-white'
                }`}
                onClick={() => setActiveGuide('waist')}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-[0.18em] font-medium text-[#121212]">
                    Waist Circumference <span className="text-rose-600">*</span>
                  </label>
                  <span className="font-mono text-xs text-[#121212] font-semibold">
                    {unit === 'cm' ? `${waist} cm` : `${cmToInch(waist)} in`}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={unit === 'cm' ? waist : cmToInch(waist)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setWaist(unit === 'cm' ? val : inchToCm(val));
                    }}
                    onFocus={() => setActiveGuide('waist')}
                    min={50}
                    max={150}
                    step={0.5}
                    className="w-full bg-white border border-[#D8D6CF] focus:border-[#121212] px-3.5 py-2.5 text-sm font-mono outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#6E6D68]">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Shoulder Width */}
              <div
                className={`p-3.5 border transition-all ${
                  activeGuide === 'shoulder' ? 'border-[#121212] bg-[#FAF9F6]' : 'border-[#E8E6DF] bg-white'
                }`}
                onClick={() => setActiveGuide('shoulder')}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-[0.18em] font-medium text-[#121212]">
                    Shoulder Width (Biacromial)
                  </label>
                  <span className="font-mono text-xs text-[#121212] font-semibold">
                    {unit === 'cm' ? `${shoulder} cm` : `${cmToInch(shoulder)} in`}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={unit === 'cm' ? shoulder : cmToInch(shoulder)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setShoulder(unit === 'cm' ? val : inchToCm(val));
                    }}
                    onFocus={() => setActiveGuide('shoulder')}
                    min={30}
                    max={65}
                    step={0.5}
                    className="w-full bg-white border border-[#D8D6CF] focus:border-[#121212] px-3.5 py-2.5 text-sm font-mono outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#6E6D68]">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Hip */}
              <div
                className={`p-3.5 border transition-all ${
                  activeGuide === 'hip' ? 'border-[#121212] bg-[#FAF9F6]' : 'border-[#E8E6DF] bg-white'
                }`}
                onClick={() => setActiveGuide('hip')}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-[0.18em] font-medium text-[#121212]">
                    Hip & Seat Circumference
                  </label>
                  <span className="font-mono text-xs text-[#121212] font-semibold">
                    {unit === 'cm' ? `${hip} cm` : `${cmToInch(hip)} in`}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={unit === 'cm' ? hip : cmToInch(hip)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setHip(unit === 'cm' ? val : inchToCm(val));
                    }}
                    onFocus={() => setActiveGuide('hip')}
                    min={60}
                    max={160}
                    step={0.5}
                    className="w-full bg-white border border-[#D8D6CF] focus:border-[#121212] px-3.5 py-2.5 text-sm font-mono outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#6E6D68]">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Inseam */}
              <div
                className={`p-3.5 border transition-all ${
                  activeGuide === 'inseam' ? 'border-[#121212] bg-[#FAF9F6]' : 'border-[#E8E6DF] bg-white'
                }`}
                onClick={() => setActiveGuide('inseam')}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-[0.18em] font-medium text-[#121212]">
                    Inner Leg Inseam
                  </label>
                  <span className="font-mono text-xs text-[#121212] font-semibold">
                    {unit === 'cm' ? `${inseam} cm` : `${cmToInch(inseam)} in`}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={unit === 'cm' ? inseam : cmToInch(inseam)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setInseam(unit === 'cm' ? val : inchToCm(val));
                    }}
                    onFocus={() => setActiveGuide('inseam')}
                    min={60}
                    max={100}
                    step={0.5}
                    className="w-full bg-white border border-[#D8D6CF] focus:border-[#121212] px-3.5 py-2.5 text-sm font-mono outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#6E6D68]">
                    {unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Visual Illustration / Instructions Column */}
            <div className="lg:col-span-5 border border-[#E8E6DF] bg-white p-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#9F8253]">
                  Interactive Tape Guide
                </span>
                <Ruler className="w-4 h-4 text-[#121212]" />
              </div>

              {/* Body anatomical silhouette illustration SVG */}
              <div className="w-full bg-[#FAF9F6] border border-[#E8E6DF] py-6 flex items-center justify-center relative overflow-hidden">
                <svg
                  viewBox="0 0 200 360"
                  className="w-48 h-64 text-[#121212] stroke-current fill-none stroke-[1.2]"
                >
                  {/* Head */}
                  <circle cx="100" cy="35" r="18" className="stroke-[#9B9A93]" />
                  {/* Neck */}
                  <path d="M93 53 L93 64 M107 53 L107 64" className="stroke-[#9B9A93]" />
                  {/* Shoulders */}
                  <path
                    d="M93 64 L50 82 L42 165 M107 64 L150 82 L158 165"
                    className="stroke-[#9B9A93]"
                  />
                  {/* Torso */}
                  <path
                    d="M62 85 C64 125 72 155 70 180 L76 182 L76 330 M138 85 C136 125 128 155 130 180 L124 182 L124 330"
                    className="stroke-[#9B9A93]"
                  />
                  {/* Crotch & Inseam inner leg */}
                  <path d="M100 195 L95 330 M100 195 L105 330" className="stroke-[#9B9A93]" />

                  {/* Highlight indicators depending on activeGuide */}
                  {activeGuide === 'chest' && (
                    <g>
                      <line
                        x1="45"
                        y1="110"
                        x2="155"
                        y2="110"
                        stroke="#9F8253"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <circle cx="100" cy="110" r="4" fill="#9F8253" />
                      <text x="100" y="102" fontSize="9" textAnchor="middle" fill="#121212" fontWeight="bold">
                        Chest Tape Line
                      </text>
                    </g>
                  )}

                  {activeGuide === 'waist' && (
                    <g>
                      <line
                        x1="55"
                        y1="150"
                        x2="145"
                        y2="150"
                        stroke="#9F8253"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <circle cx="100" cy="150" r="4" fill="#9F8253" />
                      <text x="100" y="142" fontSize="9" textAnchor="middle" fill="#121212" fontWeight="bold">
                        Waist Navel Line
                      </text>
                    </g>
                  )}

                  {activeGuide === 'shoulder' && (
                    <g>
                      <line
                        x1="50"
                        y1="82"
                        x2="150"
                        y2="82"
                        stroke="#9F8253"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <circle cx="50" cy="82" r="3" fill="#9F8253" />
                      <circle cx="150" cy="82" r="3" fill="#9F8253" />
                      <text x="100" y="76" fontSize="9" textAnchor="middle" fill="#121212" fontWeight="bold">
                        Shoulder Tip to Tip
                      </text>
                    </g>
                  )}

                  {activeGuide === 'hip' && (
                    <g>
                      <line
                        x1="60"
                        y1="182"
                        x2="140"
                        y2="182"
                        stroke="#9F8253"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <circle cx="100" cy="182" r="4" fill="#9F8253" />
                      <text x="100" y="174" fontSize="9" textAnchor="middle" fill="#121212" fontWeight="bold">
                        Widest Hip / Seat
                      </text>
                    </g>
                  )}

                  {activeGuide === 'inseam' && (
                    <g>
                      <line
                        x1="98"
                        y1="195"
                        x2="94"
                        y2="330"
                        stroke="#9F8253"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <circle cx="98" cy="195" r="3" fill="#9F8253" />
                      <circle cx="94" cy="330" r="3" fill="#9F8253" />
                      <text x="70" y="260" fontSize="9" textAnchor="middle" fill="#121212" fontWeight="bold">
                        Inner Inseam
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Dynamic instruction text */}
              <div className="mt-4 space-y-2">
                <h4 className="font-serif text-base font-semibold text-[#121212]">
                  {guides[activeGuide]?.title || 'Measurement Protocol'}
                </h4>
                <p className="text-xs text-[#6E6D68] leading-relaxed">
                  {guides[activeGuide]?.instruction}
                </p>
                <div className="bg-[#FAF9F6] border-l-2 border-[#9F8253] p-2.5 mt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#121212] block">
                    Tailor Tip
                  </span>
                  <p className="text-[11px] text-[#6E6D68] mt-0.5">{guides[activeGuide]?.tip}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: FIT PREFERENCE */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs uppercase tracking-[0.18em] text-[#121212] font-medium mb-1">
                Preferred Garment Silhouette
              </label>
              <p className="text-xs text-[#6E6D68] mb-6">
                Garment ease varies drastically by aesthetic. How do you want your clothes to drape?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                [
                  {
                    id: 'slim',
                    name: 'Slim Fit',
                    ease: '+2cm to +4cm ease',
                    desc: 'Sharp, tailored silhouette. Follows the natural lines of your body with minimal fabric slack.',
                    badge: 'Continental Tailored',
                  },
                  {
                    id: 'regular',
                    name: 'Regular Fit',
                    ease: '+6cm to +10cm ease',
                    desc: 'Timeless comfort and effortless movement. Clean chest and waist lines without clinging.',
                    badge: 'Classic Archetype',
                  },
                  {
                    id: 'relaxed',
                    name: 'Relaxed Fit',
                    ease: '+12cm to +16cm ease',
                    desc: 'Slightly dropped shoulders and generous torso room. Modern minimalist and casual drape.',
                    badge: 'Contemporary Ease',
                  },
                  {
                    id: 'oversized',
                    name: 'Oversized Fit',
                    ease: '+18cm+ ease',
                    desc: 'Directional streetwear silhouette with exaggerated shoulders, extended length, and boxy volume.',
                    badge: 'Editorial Fashion',
                  },
                ] as const
              ).map((fit) => (
                <button
                  key={fit.id}
                  type="button"
                  onClick={() => setFitPreference(fit.id)}
                  className={`p-5 text-left border transition-all relative ${
                    fitPreference === fit.id
                      ? 'border-[#121212] bg-white ring-1 ring-[#121212] shadow-sm'
                      : 'border-[#E8E6DF] bg-white hover:border-[#121212]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#9F8253]">
                        {fit.badge}
                      </span>
                      <h4 className="font-serif text-lg font-semibold text-[#121212] mt-0.5">
                        {fit.name}
                      </h4>
                    </div>
                    {fitPreference === fit.id ? (
                      <div className="w-5 h-5 rounded-full bg-[#121212] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-[#9B9A93]">{fit.ease}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#6E6D68] mt-2 leading-relaxed">{fit.desc}</p>
                </button>
              ))}
            </div>

            {/* Profile summary card */}
            <div className="bg-[#F3F1EC] p-5 border border-[#E8E6DF] mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#6E6D68]">
                  Calibrated Measurement Summary
                </span>
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-[#121212] font-medium mt-1">
                  <span>Height: {height}cm</span>
                  <span>Chest: {chest}cm</span>
                  <span>Waist: {waist}cm</span>
                  <span>Shoulder: {shoulder}cm</span>
                  <span>Hip: {hip}cm</span>
                  <span>Fit: {fitPreference.toUpperCase()}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs uppercase tracking-wider text-[#121212] underline hover:text-[#9F8253] transition-colors self-start sm:self-center"
              >
                Modify Numbers
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer controls */}
      <div className="border-t border-[#E8E6DF] bg-white p-6 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
            className="inline-flex items-center text-xs uppercase tracking-[0.16em] text-[#6E6D68] hover:text-[#121212] px-4 py-2 border border-[#E8E6DF] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleLoadSample(SAMPLE_PROFILES[0])}
            className="inline-flex items-center text-xs text-[#6E6D68] hover:text-[#121212] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset to Default
          </button>
        )}

        <div className="flex items-center space-x-3">
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              className="inline-flex items-center px-6 py-2.5 text-xs uppercase tracking-[0.16em] bg-[#121212] text-white hover:bg-[#2B2B2B] transition-all group"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="inline-flex items-center px-8 py-3 text-xs uppercase tracking-[0.18em] bg-[#121212] text-white hover:bg-[#2B2B2B] transition-all group shadow-md disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Calibrating...' : 'Save & Calculate Sizes'}</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
