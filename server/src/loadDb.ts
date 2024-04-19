import { Connection } from "mongoose";
import { procedures } from "./initialData";
import { stageTemplates } from "./initialData";
import { runningPathways } from "./initialData";
import { displayedPeople } from "./initialData";
import { displayedRooms } from "./initialData";
import PathwayTemplate from "./models/pathwayTemplate";
import RunningPathway from "./models/runningPathway";
import StageTemplate from "./models/stageTemplate";
import HospitalRoom from "./models/hospitalRoom";
import Person from "./models/person";
import { v4 as uuid } from 'uuid';

export const loadDb = async (db: Connection) => {
    console.log('db', db)
    console.log('Clearing database')
    await db.dropDatabase();
    await PathwayTemplate.insertMany(procedures);
    await StageTemplate.insertMany(stageTemplates);
    await RunningPathway.insertMany(runningPathways);
    await HospitalRoom.insertMany(displayedRooms);
    await Person.insertMany(displayedPeople);
    console.log('Database loaded');
};