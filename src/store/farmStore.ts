// src/store/farmStore.ts

import { create } from 'zustand';
import {
  FarmResponse,
  GreenhouseDto,
  FieldBlockDto,
} from '../types/api.types';
import { farmService } from '../services/farm.service';

interface FarmState {
  farms: FarmResponse[];
  currentFarm: FarmResponse | null;
  greenhouses: GreenhouseDto[];
  fieldBlocks: FieldBlockDto[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFarms: () => Promise<void>;
  setCurrentFarm: (farm: FarmResponse | null) => void;
  fetchFarmDetails: (farmId: string) => Promise<void>;
  fetchGreenhouses: (farmId: string) => Promise<void>;
  fetchFieldBlocks: (farmId: string) => Promise<void>;
  clearError: () => void;
}

export const useFarmStore = create<FarmState>((set, get) => ({
  farms: [],
  currentFarm: null,
  greenhouses: [],
  fieldBlocks: [],
  isLoading: false,
  error: null,

  fetchFarms: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const farms = await farmService.getFarms();
      set({ farms, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch farms',
        isLoading: false,
      });
    }
  },

  setCurrentFarm: (farm) => {
    set({ currentFarm: farm });
  },

  fetchFarmDetails: async (farmId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const farm = await farmService.getFarm(farmId);
      set({ currentFarm: farm, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch farm details',
        isLoading: false,
      });
    }
  },

  fetchGreenhouses: async (farmId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const greenhouses = await farmService.getGreenhouses(farmId);
      set({ greenhouses, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch greenhouses',
        isLoading: false,
      });
    }
  },

  fetchFieldBlocks: async (farmId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const fieldBlocks = await farmService.getFieldBlocks(farmId);
      set({ fieldBlocks, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch field blocks',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));