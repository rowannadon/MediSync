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
  PathwayStage,
  Conflict,
  conflicts,
} from './TempData';

export interface RemoteDataStore {
  pathways: PathwayTemplate[];
  people: Person[];
  stages: StageTemplate[];
  rooms: HospitalRoom[];
  runningPathways: RunningPathway[];
  conflicts: Conflict[];
  getStageTemplate: (id: string) => StageTemplate | undefined;
  addPathwayTemplate: (pathway: PathwayTemplate) => void;
  addStageTemplate: (stage: StageTemplate) => void;
  addPerson: (person: Person) => void;
  addRoom: (room: HospitalRoom) => void;
  addRunningPathway: (runningPathway: RunningPathway) => void;
  addStageToPathwayTemplate: (
    pathwayTemplateId: string,
    stage: PathwayStage,
  ) => void;
  updateStageTemplate: (stage: StageTemplate) => void;
  updatePathwayTemplate: (pathway: PathwayTemplate) => void;
  updatePerson: (person: Person) => void;
  updateRoom: (room: HospitalRoom) => void;
  addConflict: (conflict: Conflict) => void;
}

export const useRemoteDataStore = create<RemoteDataStore>((set, get) => ({
  pathways: procedures,
  people: displayedPeople,
  stages: stageTemplates,
  rooms: displayedRooms,
  runningPathways: runningPathways,
  conflicts: conflicts,
  getStageTemplate: (id: string) => {
    return stageTemplates.find((template) => template.id === id);
  },
  addPathwayTemplate: (pathway: PathwayTemplate) => {
    set((state: RemoteDataStore) => ({
      pathways: [...state.pathways, pathway],
    }));
  },
  addStageTemplate: (stage: StageTemplate) => {
    set((state) => ({
      stages: [...state.stages, stage],
    }));
  },
  addPerson: (person: Person) => {
    set((state) => ({
      people: [...state.people, person],
    }));
  },
  addRoom: (room: HospitalRoom) => {
    set((state) => ({
      rooms: [...state.rooms, room],
    }));
  },
  addRunningPathway: (runningPathway: RunningPathway) => {
    set((state) => ({
      runningPathways: [...state.runningPathways, runningPathway],
    }));
  },
  addStageToPathwayTemplate: (
    pathwayTemplateId: string,
    stage: PathwayStage,
  ) => {
    const pathwayTemplate = get().pathways.find(
      (pathway) => pathway.id === pathwayTemplateId,
    );
    if (pathwayTemplate) {
      pathwayTemplate.stages.push(stage);
      set((state) => ({
        pathways: [...state.pathways],
      }));
    }
  },
  updateStageTemplate: (stage: StageTemplate) => {
    const index = get().stages.findIndex(
      (template) => template.id === stage.id,
    );
    if (index !== -1) {
      get().stages[index] = stage;
      set((state) => ({
        stages: [...state.stages],
      }));
    }
  },
  updatePathwayTemplate: (pathway: PathwayTemplate) => {
    const index = get().pathways.findIndex(
      (template) => template.id === pathway.id,
    );
    if (index !== -1) {
      get().pathways[index] = pathway;
      set((state) => ({
        pathways: [...state.pathways],
      }));
    }
  },
  updatePerson: (person: Person) => {
    const index = get().people.findIndex((p) => p.id === person.id);
    if (index !== -1) {
      get().people[index] = person;
      set((state) => ({
        people: [...state.people],
      }));
    }
  },
  updateRoom: (room: HospitalRoom) => {
    const index = get().rooms.findIndex(
      (r) => r.room_number === room.room_number,
    );
    if (index !== -1) {
      get().rooms[index] = room;
      set((state) => ({
        rooms: [...state.rooms],
      }));
    }
  },
  addConflict: (conflict: Conflict) => {
    set((state) => ({
      conflicts: [...state.conflicts, conflict],
    }));
  },
}));
