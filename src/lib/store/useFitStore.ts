'use client';

import { useSyncExternalStore } from 'react';
import {
  BodyMeasurements,
  FitPreference,
  GenderCategory,
  MeasurementUnit,
  SavedRecommendation,
} from '../types';
import { isSupabaseConfigured, supabase } from '../supabase/client';

export const SAMPLE_PROFILES: { label: string; description: string; measurements: BodyMeasurements }[] = [
  {
    label: 'Standard Editorial (Prompt Archetype)',
    description: 'Height 175cm, Chest 96cm, Waist 82cm, Shoulder 44cm, Hip 98cm (Zara M / H&M L / Uniqlo M / Levi’s 32)',
    measurements: {
      height: 175,
      weight: 72,
      chest: 96,
      waist: 82,
      shoulder: 44,
      hip: 98,
      inseam: 80,
      gender: 'menswear',
      fitPreference: 'regular',
      unit: 'cm',
    },
  },
  {
    label: 'Athletic Tapered',
    description: 'Broader chest & shoulders (104cm chest, 48cm shoulder, 84cm waist, Slim fit preference)',
    measurements: {
      height: 183,
      weight: 81,
      chest: 104,
      waist: 84,
      shoulder: 48,
      hip: 101,
      inseam: 84,
      gender: 'menswear',
      fitPreference: 'slim',
      unit: 'cm',
    },
  },
  {
    label: 'Relaxed Streetwear Minimalist',
    description: 'Boxy preferences (100cm chest, 86cm waist, Relaxed / Oversized fit preference)',
    measurements: {
      height: 178,
      weight: 76,
      chest: 100,
      waist: 86,
      shoulder: 46,
      hip: 100,
      inseam: 82,
      gender: 'menswear',
      fitPreference: 'relaxed',
      unit: 'cm',
    },
  },
  {
    label: 'Womenswear Tailored',
    description: 'Bust 86cm, Waist 68cm, Hip 92cm (European contemporary sizing)',
    measurements: {
      height: 168,
      weight: 58,
      chest: 86,
      waist: 68,
      shoulder: 39,
      hip: 92,
      inseam: 76,
      gender: 'womenswear',
      fitPreference: 'regular',
      unit: 'cm',
    },
  },
];

export const DEFAULT_MEASUREMENTS: BodyMeasurements = SAMPLE_PROFILES[0].measurements;

const STORAGE_KEYS = {
  MEASUREMENTS: 'fitsync_measurements_v1',
  SAVED_BRANDS: 'fitsync_saved_brands_v1',
  RECENT_BRANDS: 'fitsync_recent_brands_v1',
  HISTORY: 'fitsync_history_v1',
};

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

// Demo history shown until the user saves their first recommendation.
const sampleHistory = (): SavedRecommendation[] => [
  {
    id: 'rec-1',
    brandId: 'zara',
    brandName: 'Zara',
    category: 'tops',
    recommendedSize: 'M',
    confidenceLevel: 'High',
    confidenceScore: 96,
    createdAt: hoursAgo(2),
  },
  {
    id: 'rec-2',
    brandId: 'hm',
    brandName: 'H&M',
    category: 'tops',
    recommendedSize: 'L',
    confidenceLevel: 'High',
    confidenceScore: 92,
    createdAt: hoursAgo(6),
  },
  {
    id: 'rec-3',
    brandId: 'uniqlo',
    brandName: 'Uniqlo',
    category: 'tops',
    recommendedSize: 'M',
    confidenceLevel: 'High',
    confidenceScore: 95,
    createdAt: hoursAgo(24),
  },
  {
    id: 'rec-4',
    brandId: 'levis',
    brandName: "Levi's",
    category: 'bottoms',
    recommendedSize: '32',
    confidenceLevel: 'High',
    confidenceScore: 98,
    createdAt: hoursAgo(48),
  },
];

interface FitState {
  measurements: BodyMeasurements | null;
  isDemoProfile: boolean;
  savedBrands: string[];
  recentBrands: string[];
  history: SavedRecommendation[];
  isLoaded: boolean;
}

// Snapshot used on the server and during hydration. Kept as a single constant so
// useSyncExternalStore always receives the same reference.
const SERVER_STATE: FitState = {
  measurements: null,
  isDemoProfile: true,
  savedBrands: ['zara', 'uniqlo', 'levis'],
  recentBrands: ['zara', 'hm', 'nike'],
  history: [],
  isLoaded: false,
};

const GENDERS: GenderCategory[] = ['menswear', 'womenswear', 'unisex'];
const FITS: FitPreference[] = ['slim', 'regular', 'relaxed', 'oversized'];
const UNITS: MeasurementUnit[] = ['cm', 'inch'];

const isPositive = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0;

/**
 * Repairs a stored profile. Older builds could persist 0 (an emptied number field)
 * or NaN; those values would silently skew every recommendation, so they fall back
 * to the reference profile instead.
 */
function sanitizeMeasurements(raw: unknown): BodyMeasurements | null {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Partial<BodyMeasurements>;
  const d = DEFAULT_MEASUREMENTS;
  return {
    height: isPositive(m.height) ? m.height : d.height,
    weight: isPositive(m.weight) ? m.weight : undefined,
    chest: isPositive(m.chest) ? m.chest : d.chest,
    waist: isPositive(m.waist) ? m.waist : d.waist,
    shoulder: isPositive(m.shoulder) ? m.shoulder : d.shoulder,
    hip: isPositive(m.hip) ? m.hip : d.hip,
    inseam: isPositive(m.inseam) ? m.inseam : d.inseam,
    gender: m.gender && GENDERS.includes(m.gender) ? m.gender : d.gender,
    fitPreference: m.fitPreference && FITS.includes(m.fitPreference) ? m.fitPreference : d.fitPreference,
    unit: m.unit && UNITS.includes(m.unit) ? m.unit : d.unit,
    lastUpdated: typeof m.lastUpdated === 'string' ? m.lastUpdated : undefined,
  };
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed:', e);
  }
}

function loadFromStorage(): FitState {
  const savedBrands = readJSON<string[]>(STORAGE_KEYS.SAVED_BRANDS);
  const recentBrands = readJSON<string[]>(STORAGE_KEYS.RECENT_BRANDS);
  const history = readJSON<SavedRecommendation[]>(STORAGE_KEYS.HISTORY);
  const storedMeasurements = sanitizeMeasurements(readJSON(STORAGE_KEYS.MEASUREMENTS));

  return {
    // First-time visitors get the reference profile so every screen has something to show,
    // flagged as a demo profile until they save their own measurements.
    measurements: storedMeasurements ?? DEFAULT_MEASUREMENTS,
    isDemoProfile: storedMeasurements === null,
    savedBrands: Array.isArray(savedBrands) ? savedBrands : SERVER_STATE.savedBrands,
    recentBrands: Array.isArray(recentBrands) ? recentBrands : SERVER_STATE.recentBrands,
    history: Array.isArray(history) ? history : sampleHistory(),
    isLoaded: true,
  };
}

// ---------------------------------------------------------------------------
// Module-level store: every component reads the same state, so saving a brand
// on one card or editing the profile updates the navbar, dashboard, etc. at once.
// ---------------------------------------------------------------------------
let state: FitState = SERVER_STATE;
let initialized = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function ensureInitialized() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  state = loadFromStorage();
  // Keep multiple open tabs in sync.
  window.addEventListener('storage', (e) => {
    if (e.key && (Object.values(STORAGE_KEYS) as string[]).includes(e.key)) {
      state = loadFromStorage();
      emit();
    }
  });
}

function subscribe(listener: () => void) {
  ensureInitialized();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  ensureInitialized();
  return state;
}

function getServerSnapshot() {
  return SERVER_STATE;
}

function setState(patch: Partial<FitState>) {
  state = { ...state, ...patch };
  emit();
}

async function saveMeasurements(newMeasurements: BodyMeasurements) {
  const updated: BodyMeasurements = {
    ...newMeasurements,
    lastUpdated: new Date().toISOString(),
  };
  setState({ measurements: updated, isDemoProfile: false });
  writeJSON(STORAGE_KEYS.MEASUREMENTS, updated);

  // If Supabase is connected and user is logged in
  if (isSupabaseConfigured && supabase) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase.from('body_measurements').upsert(
          {
            user_id: session.user.id,
            height: updated.height,
            weight: updated.weight,
            chest: updated.chest,
            waist: updated.waist,
            shoulder: updated.shoulder,
            hip: updated.hip,
            inseam: updated.inseam,
            gender: updated.gender,
            fit_preference: updated.fitPreference,
            unit: updated.unit,
          },
          // body_measurements has a unique(user_id) constraint; without this the
          // upsert tries to insert a second row and fails.
          { onConflict: 'user_id' }
        );
        if (error) console.warn('Supabase sync error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase sync error:', e);
    }
  }
}

function toggleSaveBrand(brandId: string) {
  const prev = state.savedBrands;
  const next = prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId];
  setState({ savedBrands: next });
  writeJSON(STORAGE_KEYS.SAVED_BRANDS, next);
}

function recordBrandVisit(brandId: string) {
  const next = [brandId, ...state.recentBrands.filter((id) => id !== brandId)].slice(0, 6);
  setState({ recentBrands: next });
  writeJSON(STORAGE_KEYS.RECENT_BRANDS, next);
}

function addRecommendationHistory(rec: Omit<SavedRecommendation, 'id' | 'createdAt'>) {
  const item: SavedRecommendation = {
    ...rec,
    id: 'rec-' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  const next = [
    item,
    ...state.history.filter(
      (p) => !(p.brandId === item.brandId && p.category === item.category && p.productId === item.productId)
    ),
  ].slice(0, 15);
  setState({ history: next });
  writeJSON(STORAGE_KEYS.HISTORY, next);
}

export function useFitSync() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    measurements: s.measurements,
    isDemoProfile: s.isDemoProfile,
    isLoaded: s.isLoaded,
    hasMeasurements: Boolean(s.measurements && s.measurements.chest && s.measurements.waist),
    saveMeasurements,
    savedBrands: s.savedBrands,
    toggleSaveBrand,
    recentBrands: s.recentBrands,
    recordBrandVisit,
    history: s.history,
    addRecommendationHistory,
  };
}
