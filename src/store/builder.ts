'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  featuresCatalog,
  pagesCatalog,
  stylePresets,
  type FeatureId,
  type FontPairId,
  type PageId,
  type PresetId,
} from '@data/builder';
import type { Extra, PackageId } from '@data/pricing';
import type { Industry } from '@data/projects';
import type { SharedDesign } from '@/lib/share';

export type BuilderStep = 0 | 1 | 2 | 3 | 4 | 5;

export interface BuilderBusiness {
  name: string;
  industry: Industry;
  tagline: string;
  location: string;
}

export interface BuilderStyle {
  presetId: PresetId;
  primary: string;
  accent: string;
  fontPairId: FontPairId;
  logoUrl?: string;
}

export interface BuilderState {
  version: 1;
  step: BuilderStep;
  business: BuilderBusiness;
  style: BuilderStyle;
  pages: PageId[];
  features: FeatureId[];
  extras: Extra['id'][];
  forcedPackage?: PackageId;
  setStep: (s: BuilderStep) => void;
  updateBusiness: (p: Partial<BuilderBusiness>) => void;
  applyPreset: (id: PresetId) => void;
  setColors: (primary: string, accent: string) => void;
  setFontPair: (id: FontPairId) => void;
  setLogoUrl: (url?: string) => void;
  togglePage: (id: PageId) => void;
  toggleFeature: (id: FeatureId) => void;
  toggleExtra: (id: Extra['id']) => void;
  setForcedPackage: (id?: PackageId) => void;
  hydrateFromShare: (s: SharedDesign) => void;
  reset: () => void;
}

const defaultPreset = stylePresets[0]!;

export const defaultBusiness: BuilderBusiness = {
  name: '',
  industry: 'other',
  tagline: '',
  location: 'Cape Town',
};

export const defaultStyle: BuilderStyle = {
  presetId: defaultPreset.id,
  primary: defaultPreset.primary,
  accent: defaultPreset.accent,
  fontPairId: defaultPreset.id,
};

export const defaultPages: PageId[] = ['home', 'services', 'contact'];
export const defaultFeatures: FeatureId[] = ['whatsapp', 'contactForm'];
export const defaultExtras: Extra['id'][] = ['domain', 'hostingBasic'];

const initialState = {
  version: 1 as const,
  step: 0 as BuilderStep,
  business: defaultBusiness,
  style: defaultStyle,
  pages: defaultPages,
  features: defaultFeatures,
  extras: defaultExtras,
  forcedPackage: undefined as PackageId | undefined,
};

function uniquePages(pages: PageId[]): PageId[] {
  const set = new Set(pages);
  set.add('home');
  return pagesCatalog.map((p) => p.id).filter((id) => set.has(id));
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      updateBusiness: (p) => set({ business: { ...get().business, ...p } }),
      applyPreset: (id) => {
        const preset = stylePresets.find((p) => p.id === id) ?? defaultPreset;
        set({
          style: {
            ...get().style,
            presetId: preset.id,
            primary: preset.primary,
            accent: preset.accent,
            fontPairId: preset.id,
          },
        });
      },
      setColors: (primary, accent) =>
        set({ style: { ...get().style, primary, accent } }),
      setFontPair: (fontPairId) => set({ style: { ...get().style, fontPairId } }),
      setLogoUrl: (logoUrl) => set({ style: { ...get().style, logoUrl } }),
      togglePage: (id) => {
        if (id === 'home') return;
        const pages = get().pages;
        const on = pages.includes(id);
        let next = on ? pages.filter((p) => p !== id) : [...pages, id];
        next = uniquePages(next);

        let features = get().features;
        if (id === 'bookings' && !on) {
          if (!features.includes('booking')) features = [...features, 'booking'];
        }
        if (id === 'shop' && !on) {
          if (!features.includes('shop')) features = [...features, 'shop'];
          if (!features.includes('payments')) features = [...features, 'payments'];
        }
        if (id === 'blog' && !on) {
          if (!features.includes('blog')) features = [...features, 'blog'];
        }
        set({ pages: next, features });
      },
      toggleFeature: (id) => {
        const features = get().features;
        const on = features.includes(id);
        let next = on ? features.filter((f) => f !== id) : [...features, id];
        // Keep catalog order
        next = featuresCatalog.map((f) => f.id).filter((fid) => next.includes(fid));
        set({ features: next });
      },
      toggleExtra: (id) => {
        const extras = get().extras;
        const hosting = id === 'hostingBasic' || id === 'hostingBusiness';
        if (extras.includes(id)) {
          set({ extras: extras.filter((e) => e !== id) });
          return;
        }
        let next = [...extras, id];
        if (hosting) {
          next = next.filter((e) => e !== 'hostingBasic' && e !== 'hostingBusiness');
          next.push(id);
        }
        if (id === 'googleStarter') {
          // Bundle replaces separate SEO + GBP once-offs visually but keep flags for quote engine
        }
        set({ extras: next });
      },
      setForcedPackage: (forcedPackage) => set({ forcedPackage }),
      hydrateFromShare: (s) =>
        set({
          business: { ...defaultBusiness, ...s.b },
          style: { ...defaultStyle, ...s.s, logoUrl: undefined },
          pages: uniquePages(s.p.includes('home') ? s.p : ['home', ...s.p]),
          features: s.f,
          extras: s.e.length ? s.e : defaultExtras,
          forcedPackage: s.k,
          step: 5,
        }),
      reset: () =>
        set({
          ...initialState,
          business: { ...defaultBusiness },
          style: { ...defaultStyle },
          pages: [...defaultPages],
          features: [...defaultFeatures],
          extras: [...defaultExtras],
          forcedPackage: undefined,
        }),
    }),
    {
      name: 'brikeweb-builder-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        version: state.version,
        step: state.step,
        business: state.business,
        style: {
          presetId: state.style.presetId,
          primary: state.style.primary,
          accent: state.style.accent,
          fontPairId: state.style.fontPairId,
          // logoUrl intentionally omitted
        },
        pages: state.pages,
        features: state.features,
        extras: state.extras,
        forcedPackage: state.forcedPackage,
      }),
    },
  ),
);
