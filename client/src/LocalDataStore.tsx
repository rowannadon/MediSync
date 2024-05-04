import { create } from 'zustand';
import { PathwayTemplate, StageTemplate } from './DataTypes';

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
  stagePageFocused: boolean;
  setStagePageFocused: (focused: boolean) => void;

  pathwayPageFocused: boolean;
  setPathwayPageFocused: (focused: boolean) => void;
}

export const useLocalDataStore = create<LocalDataStore>((set, get) => ({
  selectedStage: null,
  setSelectedStage: (stage: StageTemplate | null) => {
    // console.log(stage);
    set(() => ({ selectedStage: stage }));
  },
  clearSelectedStage: () => {
    // console.log('clearing selected stage');
    set(() => ({ selectedStage: null }));
  },
  hasStageChanges: false,
  setHasStageChanges: (hasStageChanges: boolean) =>
    set(() => ({ hasStageChanges })),
  hasPathwayChanges: false,
  setHasPathwayChanges: (hasStageChanges: boolean) =>
    set(() => ({ hasStageChanges })),

  selectedPathway: null,
  setSelectedPathway: (pathway: PathwayTemplate) => {
    // console.log(pathway);
    set(() => ({ selectedPathway: pathway }));
  },
  clearSelectedPathway: () => {
    // console.log('clearing selected pathway');
    set(() => ({ selectedPathway: null }));
  },
  stagePageFocused: false,
  setStagePageFocused: (focused: boolean) => {
    // console.log('setting stage page focused', focused);
    set(() => ({ stagePageFocused: focused }));
  },
  pathwayPageFocused: false,
  setPathwayPageFocused: (focused: boolean) => {
    // console.log('setting pathway page focused', focused);
    set(() => ({ pathwayPageFocused: focused }));
  },
}));
