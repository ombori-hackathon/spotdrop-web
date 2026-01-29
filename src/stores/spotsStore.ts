import { create } from 'zustand';
import { spotsApi } from '../lib/api';
import type { Spot } from '../types';

interface SpotsState {
  spots: Spot[];
  selectedSpot: Spot | null;
  isLoading: boolean;
  filters: {
    category: string | null;
    minRating: number | null;
  };
  fetchSpots: () => Promise<void>;
  selectSpot: (spot: Spot | null) => void;
  setFilters: (filters: Partial<SpotsState['filters']>) => void;
}

export const useSpotsStore = create<SpotsState>((set, get) => ({
  spots: [],
  selectedSpot: null,
  isLoading: false,
  filters: {
    category: null,
    minRating: null,
  },

  fetchSpots: async () => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const response = await spotsApi.list({
        category: filters.category ?? undefined,
        min_rating: filters.minRating ?? undefined,
        size: 100,
      });
      set({ spots: response.items, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch spots:', error);
      set({ isLoading: false });
    }
  },

  selectSpot: (spot) => set({ selectedSpot: spot }),

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchSpots();
  },
}));
