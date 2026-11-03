'use client';

import { useState, useEffect } from 'react';
import { BodyMeasurements, SavedRecommendation } from '../types';
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

const STORAGE_KEYS = {
  MEASUREMENTS: 'fitsync_measurements_v1',
  SAVED_BRANDS: 'fitsync_saved_brands_v1',
  RECENT_BRANDS: 'fitsync_recent_brands_v1',
  HISTORY: 'fitsync_history_v1',
};

export function useFitSync() {
  const [measurements, setMeasurementsState] = useState<BodyMeasurements | null>(null);
  const [savedBrands, setSavedBrandsState] = useState<string[]>(['zara', 'uniqlo', 'levis']);
  const [recentBrands, setRecentBrandsState] = useState<string[]>(['zara', 'hm', 'nike']);
  const [history, setHistoryState] = useState<SavedRecommendation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage and/or Supabase
  useEffect(() => {
    try {
      const storedMeas = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
      if (storedMeas) {
        setMeasurementsState(JSON.parse(storedMeas));
      } else {
        // Pre-populate with the prompt's reference profile so the user gets an instant wow factor!
        const defaultProfile = SAMPLE_PROFILES[0].measurements;
        setMeasurementsState(defaultProfile);
        localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(defaultProfile));
      }

      const storedSaved = localStorage.getItem(STORAGE_KEYS.SAVED_BRANDS);
      if (storedSaved) {
        setSavedBrandsState(JSON.parse(storedSaved));
      }

      const storedRecent = localStorage.getItem(STORAGE_KEYS.RECENT_BRANDS);
      if (storedRecent) {
        setRecentBrandsState(JSON.parse(storedRecent));
      }

      const storedHist = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (storedHist) {
        setHistoryState(JSON.parse(storedHist));
      } else {
        // Initial sample history
        const initialHist: SavedRecommendation[] = [
          {
            id: 'rec-1',
            brandId: 'zara',
            brandName: 'Zara',
            category: 'tops',
            recommendedSize: 'M',
            confidenceLevel: 'High',
            confidenceScore: 96,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 'rec-2',
            brandId: 'hm',
            brandName: 'H&M',
            category: 'tops',
            recommendedSize: 'L',
            confidenceLevel: 'High',
            confidenceScore: 92,
            createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          },
          {
            id: 'rec-3',
            brandId: 'uniqlo',
            brandName: 'Uniqlo',
            category: 'tops',
            recommendedSize: 'M',
            confidenceLevel: 'High',
            confidenceScore: 95,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
          {
            id: 'rec-4',
            brandId: 'levis',
            brandName: "Levi's",
            category: 'bottoms',
            recommendedSize: '32',
            confidenceLevel: 'High',
            confidenceScore: 98,
            createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          },
        ];
        setHistoryState(initialHist);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(initialHist));
      }
    } catch {
      // Fallback
      setMeasurementsState(SAMPLE_PROFILES[0].measurements);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveMeasurements = async (newMeasurements: BodyMeasurements) => {
    const updated = {
      ...newMeasurements,
      lastUpdated: new Date().toISOString(),
    };
    setMeasurementsState(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(updated));

      // If Supabase is connected and user is logged in
      if (isSupabaseConfigured && supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from('body_measurements').upsert({
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
          });
        }
      }
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  };

  const toggleSaveBrand = (brandId: string) => {
    setSavedBrandsState((prev) => {
      const next = prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId];
      try {
        localStorage.setItem(STORAGE_KEYS.SAVED_BRANDS, JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const recordBrandVisit = (brandId: string) => {
    setRecentBrandsState((prev) => {
      const filtered = prev.filter((id) => id !== brandId);
      const next = [brandId, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(STORAGE_KEYS.RECENT_BRANDS, JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const addRecommendationHistory = (rec: Omit<SavedRecommendation, 'id' | 'createdAt'>) => {
    const item: SavedRecommendation = {
      ...rec,
      id: 'rec-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setHistoryState((prev) => {
      const next = [item, ...prev.filter((p) => !(p.brandId === item.brandId && p.category === item.category))].slice(0, 15);
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  return {
    measurements,
    isLoaded,
    hasMeasurements: Boolean(measurements && measurements.chest && measurements.waist),
    saveMeasurements,
    savedBrands,
    toggleSaveBrand,
    recentBrands,
    recordBrandVisit,
    history,
    addRecommendationHistory,
  };
}

