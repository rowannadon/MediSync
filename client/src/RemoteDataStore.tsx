import { create } from 'zustand';
import {
  displayedPeople,
  displayedRooms,
  HospitalRoom,
  Person,
  Procedure,
  procedures,
  Stage,
  stages,
} from './TempData';

export interface RemoteDataStore {
  pathways: Procedure[];
  people: Person[];
  stages: Stage[];
  rooms: HospitalRoom[];
}

export const useRemoteDataStore = create<RemoteDataStore>((_) => ({
  pathways: procedures,
  people: displayedPeople,
  stages: stages,
  rooms: displayedRooms,
}));
