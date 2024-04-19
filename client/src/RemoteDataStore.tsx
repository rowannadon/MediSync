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
} from './TempData';
import io from 'socket.io-client';

export interface RemoteDataStore {
  pathways: PathwayTemplate[];
  people: Person[];
  stages: StageTemplate[];
  rooms: HospitalRoom[];
  runningPathways: RunningPathway[];
  getStageTemplate: (id: string) => StageTemplate | undefined;
  addPathwayTemplate: (pathway: PathwayTemplate) => void;
  removePathwayTemplate: (pathwayId: string) => void;
  addStageTemplate: (stage: StageTemplate) => void;
  removeStageTemplate: (stageId: string) => void;
  addPerson: (person: Person) => void;
  addRoom: (room: HospitalRoom) => void;
  addRunningPathway: (runningPathway: RunningPathway) => void;
  addStageToPathwayTemplate: (
    pathwayTemplateId: string,
    stage: PathwayStage,
  ) => void;
  removeStageFromPathwayTemplate: (
    pathwayTemplateId: string,
    stageId: string,
  ) => void;
  addNextToPathwayStage: (
    pathwayTemplateId: string,
    stageId: string,
    nextId: string,
    outputType: string,
  ) => void;
  removeNextFromPathwayStage: (
    pathwayTemplateId: string,
    stageId: string,
    nextId: string,
  ) => void;
  updateStageTemplate: (stage: StageTemplate) => void;
  updatePathwayTemplate: (pathway: PathwayTemplate) => void;
  updatePerson: (person: Person) => void;
  updateRoom: (room: HospitalRoom) => void;
}

const websocketURL = `ws://${window.location.hostname}:${window.location.port}`;

const socket = io(websocketURL);

export const useRemoteDataStore = create<RemoteDataStore>((set, get) => ({
  pathways: procedures,
  people: displayedPeople,
  stages: stageTemplates,
  rooms: displayedRooms,
  runningPathways: runningPathways,
  getStageTemplate: (id: string) => {
    return get().stages.find((template) => template.id === id);
  },
  addPathwayTemplate: (pathway: PathwayTemplate) => {
    set((state: RemoteDataStore) => ({
      pathways: [...state.pathways, pathway],
    }));
  },
  removePathwayTemplate: (pathwayId: string) => {
    set((state) => ({
      pathways: state.pathways.filter((template) => template.id !== pathwayId),
    }));
  },
  addStageTemplate: (stage: StageTemplate) => {
    set((state) => ({
      stages: [...state.stages, stage],
    }));
  },
  removeStageTemplate: (stageId: string) => {
    set((state) => ({
      stages: state.stages.filter((template) => template.id !== stageId),
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
  removeStageFromPathwayTemplate: (
    pathwayTemplateId: string,
    stageId: string,
  ) => {
    const pathwayTemplate = get().pathways.find(
      (pathway) => pathway.id === pathwayTemplateId,
    );
    if (pathwayTemplate) {
      pathwayTemplate.stages = pathwayTemplate.stages.filter(
        (stage) => stage.id !== stageId,
      );
      set((state) => ({
        pathways: [...state.pathways],
      }));
    }
  },
  addNextToPathwayStage: (
    pathwayTemplateId: string,
    stageId: string,
    nextId: string,
    outputType: string,
  ) => {
    const pathwayTemplate = get().pathways.find(
      (pathway) => pathway.id === pathwayTemplateId,
    );
    if (pathwayTemplate) {
      const stage: PathwayStage | undefined = pathwayTemplate.stages.find(
        (stage) => stage.id === stageId,
      );
      if (stage) {
        stage.next.push({ [outputType]: nextId });
        set((state) => ({
          pathways: [...state.pathways],
        }));
      }
    }
  },
  removeNextFromPathwayStage: (
    pathwayTemplateId: string,
    stageId: string,
    nextId: string,
  ) => {
    const pathwayTemplate = get().pathways.find(
      (pathway) => pathway.id === pathwayTemplateId,
    );
    if (pathwayTemplate) {
      const stage: PathwayStage | undefined = pathwayTemplate.stages.find(
        (stage) => stage.id === stageId,
      );
      if (stage) {
        stage.next = stage.next.filter(
          (next) => Object.values(next)[0] !== nextId,
        );
        set((state) => ({
          pathways: [...state.pathways],
        }));
      }
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
    const index = get().pathways.findIndex((p) => p.id === pathway.id);
    console.log('updating pathway', pathway, index);
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
}));
