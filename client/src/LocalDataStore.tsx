import { create } from 'zustand';
import {
  PathwayTemplate,
  procedures,
  StageTemplate,
  stageTemplates,
} from './TempData';

export interface LocalDataStore {
  selectedStage: StageTemplate | null;
  setSelectedStage: (stage: StageTemplate) => void;
  clearSelectedStage: () => void;
  hasChanges: boolean;
  setHasChanges: (hasChanges: boolean) => void;

  selectedPathway: PathwayTemplate | null;
  setSelectedPathway: (pathway: PathwayTemplate) => void;
  clearSelectedPathway: () => void;
}

export const useLocalDataStore = create<LocalDataStore>((set) => ({
  selectedStage: stageTemplates[0],
  setSelectedStage: (stage: StageTemplate) =>
    set(() => ({ selectedStage: stage })),
  clearSelectedStage: () => set(() => ({ selectedStage: null })),
  hasChanges: false,
  setHasChanges: (hasChanges: boolean) => set(() => ({ hasChanges })),

  selectedPathway: procedures[0],
  setSelectedPathway: (pathway: PathwayTemplate) =>
    set(() => ({ selectedPathway: pathway })),
  clearSelectedPathway: () => set(() => ({ selectedPathway: null })),
}));
