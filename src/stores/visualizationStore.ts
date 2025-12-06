'use client';

import { create } from 'zustand';
import { generateMockUsers } from '@/data/mockData';

type User = ReturnType<typeof generateMockUsers>[number];

type VisualizationState = {
  rawData: User[];
  displayData: User[];
  setDisplayData: (next: User[] | ((prev: User[]) => User[])) => void;
  reset: () => void;
};

// Lazy initialization - only generate data when store is first accessed on client
let initialData: User[] | null = null;

const getInitialData = () => {
  if (initialData === null) {
    initialData = generateMockUsers(800);
  }
  return initialData;
};

export const useVisualizationStore = create<VisualizationState>((set, get) => ({
  rawData: getInitialData(),
  displayData: getInitialData(),
  setDisplayData: (next) =>
    set((state) => ({ displayData: typeof next === 'function' ? (next as any)(state.displayData) : next })),
  reset: () => set({ displayData: get().rawData }),
}));


