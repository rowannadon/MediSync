import { create } from 'zustand';
import { Procedure, procedures, Stage, stages } from './TempData';

export interface LocalDataStore {
  selectedStage: Stage | null;
  setSelectedStage: (stage: Stage) => void;
  clearSelectedStage: () => void;

  selectedPathway: Procedure | null;
  setSelectedPathway: (pathway: Procedure) => void;
  clearSelectedPathway: () => void;
}

export const useLocalDataStore = create<LocalDataStore>((set) => ({
  selectedStage: stages[0],
  setSelectedStage: (stage: Stage) => set(() => ({ selectedStage: stage })),
  clearSelectedStage: () => set(() => ({ selectedStage: null })),

  selectedPathway: procedures[0],
  setSelectedPathway: (pathway: Procedure) =>
    set(() => ({ selectedPathway: pathway })),
  clearSelectedPathway: () => set(() => ({ selectedPathway: null })),
}));
