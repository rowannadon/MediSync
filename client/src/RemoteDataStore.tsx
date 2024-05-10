import { create } from 'zustand';
import {
  HospitalRoom,
  Person,
  PathwayTemplate,
  StageTemplate,
  RunningPathway,
  PathwayStage,
  Conflict,
  OutputType,
} from './DataTypes';
import { subscribeWithSelector } from 'zustand/middleware';
import { instance } from './AxiosInstance';

export interface RemoteDataStore {
  pathways: PathwayTemplate[];
  people: Person[];
  stages: StageTemplate[];
  rooms: HospitalRoom[];
  runningPathways: RunningPathway[];
  conflicts: Conflict[];
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
  // updatePerson: (person: Person) => void;
  updateRoom: (room: HospitalRoom) => void;
  setPathwayTemplates: (pathways: PathwayTemplate[]) => void;
  setPeople: (people: Person[]) => void;
  setStageTemplates: (stages: StageTemplate[]) => void;
  setRooms: (rooms: HospitalRoom[]) => void;
  setRunningPathways: (runningPathways: RunningPathway[]) => void;
  addConflict: (conflict: Conflict) => void;
  lockedPathways: string[];
  lockedStages: string[];
  setLockedPathways: (lockedPathways: string[]) => void;
  setLockedStages: (lockedStages: string[]) => void;
}

export const useRemoteDataStore = create(
  subscribeWithSelector<RemoteDataStore>((set, get) => ({
    pathways: [],
    people: [],
    stages: [],
    rooms: [],
    runningPathways: [],
    conflicts: [],
    getStageTemplate: (id: string) => {
      return get().stages.find((template) => template.id === id);
    },
    addPathwayTemplate: async (pathway: PathwayTemplate) => {
      const res = await instance.post('/api/pathwayTemplates', pathway);
      if (res.status !== 200) {
        console.error('Failed to add pathway template');
      } else {
        set((state: RemoteDataStore) => ({
          pathways: [...state.pathways, pathway],
        }));
      }
    },
    removePathwayTemplate: async (pathwayId: string) => {
      const res = await instance.delete('/api/pathwayTemplates/' + pathwayId);
      if (res.status !== 200) {
        console.error('Failed to remove pathway template');
      } else {
        set((state) => ({
          pathways: state.pathways.filter(
            (template) => template.id !== pathwayId,
          ),
        }));
      }
    },
    addStageTemplate: async (stage: StageTemplate) => {
      const res = await instance.post('/api/stageTemplates', stage);
      if (res.status !== 200) {
        console.error('Failed to add stage template');
      } else {
        set((state) => ({
          stages: [...state.stages, stage],
        }));
      }
    },
    removeStageTemplate: async (stageId: string) => {
      const res = await instance.delete('/api/pathwayTemplates/' + stageId);
      if (res.status !== 200) {
        console.error('Failed to remove stage template');
      } else {
        set((state) => ({
          stages: state.stages.filter((template) => template.id !== stageId),
        }));
      }
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
    addStageToPathwayTemplate: async (
      pathwayTemplateId: string,
      stage: PathwayStage,
    ) => {
      const pathwayTemplate = get().pathways.find(
        (pathway) => pathway.id === pathwayTemplateId,
      );
      if (pathwayTemplate) {
        pathwayTemplate.stages.push(stage);
        const res = await instance.put(
          '/api/pathwayTemplates/' + pathwayTemplateId,
          pathwayTemplate,
        );
        if (res.status !== 200) {
          console.error('Failed to add stage to pathway template');
        } else {
          set((state) => ({
            pathways: [...state.pathways],
          }));
        }
      }
    },
    removeStageFromPathwayTemplate: async (
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

        const res = await instance.put(
          '/api/pathwayTemplates/' + pathwayTemplateId,
          pathwayTemplate,
        );
        if (res.status !== 200) {
          console.error('Failed to remove stage template');
        } else {
          set((state) => ({
            pathways: [...state.pathways],
          }));
        }
      }
    },
    addNextToPathwayStage: async (
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
          stage.next.push({
            type: outputType as OutputType,
            next: nextId,
            value: '',
          });

          const res = await instance.put(
            '/api/pathwayTemplates/' + pathwayTemplateId,
            pathwayTemplate,
          );
          if (res.status !== 200) {
            console.error('Failed to remove stage template');
          } else {
            set((state) => ({
              pathways: [...state.pathways],
            }));
          }
        }
      }
    },
    removeNextFromPathwayStage: async (
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
          const res = await instance.put(
            '/api/pathwayTemplates/' + pathwayTemplateId,
            pathwayTemplate,
          );
          if (res.status !== 200) {
            console.error('Failed to remove stage template');
          } else {
            set((state) => ({
              pathways: [...state.pathways],
            }));
          }
        }
      }
    },
    updateStageTemplate: async (stage: StageTemplate) => {
      const index = get().stages.findIndex(
        (template) => template.id === stage.id,
      );
      if (index !== -1) {
        get().stages[index] = stage;
        const res = await instance.put(
          '/api/stageTemplates/' + stage.id,
          stage,
        );
        if (res.status !== 200) {
          console.error('Failed to remove stage template');
        } else {
          set((state) => ({
            stages: [...state.stages],
          }));
        }
      }
    },
    updatePathwayTemplate: (pathway: PathwayTemplate) => {
      const index = get().pathways.findIndex((p) => p.id === pathway.id);
      if (index !== -1) {
        get().pathways[index] = pathway;
        set((state) => ({
          pathways: [...state.pathways],
        }));
      }
    },
    // updatePerson: (person: Person) => {
    //   const index = get().people.findIndex((p) => p.id === person.id);
    //   if (index !== -1) {
    //     get().people[index] = person;
    //     set((state) => ({
    //       people: [...state.people],
    //     }));
    //   }
    // },
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
    setPathwayTemplates: (pathways: PathwayTemplate[]) => {
      set(() => ({
        pathways,
      }));
    },
    setPeople: (people: Person[]) => {
      set(() => ({
        people,
      }));
    },
    setStageTemplates: (stages: StageTemplate[]) => {
      set(() => ({
        stages,
      }));
    },
    setRooms: (rooms: HospitalRoom[]) => {
      set(() => ({
        rooms,
      }));
    },
    setRunningPathways: (runningPathways: RunningPathway[]) => {
      set(() => ({
        runningPathways,
      }));
    },
    addConflict: (conflict: Conflict) => {
      set((state) => ({
        conflicts: [...state.conflicts, conflict],
      }));
    },
    lockedPathways: [],
    lockedStages: [],
    setLockedPathways: (lockedPathways: string[]) => {
      set(() => ({
        lockedPathways,
      }));
    },
    setLockedStages: (lockedStages: string[]) => {
      set(() => ({
        lockedStages,
      }));
    },
  })),
);
