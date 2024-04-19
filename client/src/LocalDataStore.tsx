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
  hasStageChanges: boolean;
  setHasStageChanges: (hasChanges: boolean) => void;
  hasPathwayChanges: boolean;
  setHasPathwayChanges: (hasChanges: boolean) => void;

  selectedPathway: PathwayTemplate | null;
  setSelectedPathway: (pathway: PathwayTemplate) => void;
  clearSelectedPathway: () => void;
}

export const useLocalDataStore = create<LocalDataStore>((set) => ({
  selectedStage: stageTemplates[0],
  setSelectedStage: (stage: StageTemplate | null) =>
    set(() => ({ selectedStage: stage })),
  clearSelectedStage: () => set(() => ({ selectedStage: null })),
  hasStageChanges: false,
  setHasStageChanges: (hasStageChanges: boolean) =>
    set(() => ({ hasStageChanges })),
  hasPathwayChanges: false,
  setHasPathwayChanges: (hasStageChanges: boolean) =>
    set(() => ({ hasStageChanges })),

  selectedPathway: procedures[0],
  setSelectedPathway: (pathway: PathwayTemplate) =>
    set(() => ({ selectedPathway: pathway })),
  clearSelectedPathway: () => set(() => ({ selectedPathway: null })),
}));
