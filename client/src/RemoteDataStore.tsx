import { create } from 'zustand';
import {
  displayedPeople,
  displayedRooms,
  HospitalRoom,
  Person,
  PathwayTemplate,
  procedures,
  StageTemplate,
  stageTemplates,
  runningPathways,
  RunningPathway,
} from './TempData';

export interface RemoteDataStore {
  pathways: PathwayTemplate[];
  people: Person[];
  stages: StageTemplate[];
  rooms: HospitalRoom[];
  runningPathways: RunningPathway[];
  getStageTemplate: (id: string) => StageTemplate | undefined;
}

export const useRemoteDataStore = create<RemoteDataStore>((_) => ({
  pathways: procedures,
  people: displayedPeople,
  stages: stageTemplates,
  rooms: displayedRooms,
  runningPathways: runningPathways,
  getStageTemplate: (id: string) => {
    return stageTemplates.find((template) => template.id === id);
  },
}));
