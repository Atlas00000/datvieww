import { create } from 'zustand';
import { generateMockUsers } from '@/data/mockData';

type User = ReturnType<typeof generateMockUsers>[number];

type VisualizationState = {
  rawData: User[];
  displayData: User[];
  setDisplayData: (next: User[] | ((prev: User[]) => User[])) => void;
  reset: () => void;
};

export const useVisualizationStore = create<VisualizationState>((set, get) => ({
  rawData: generateMockUsers(800),
  displayData: [],
  setDisplayData: (next) =>
    set((state) => ({ displayData: typeof next === 'function' ? (next as any)(state.displayData) : next })),
  reset: () => set({ displayData: get().rawData }),
}));

// Initialize displayData on first import
// This ensures charts have data without an explicit effect on every page
const init = useVisualizationStore.getState();
if (init.displayData.length === 0) {
  useVisualizationStore.setState({ displayData: init.rawData });
}


