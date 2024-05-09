import { Connection } from 'mongoose';
import { procedures } from './initialData';
import { stageTemplates } from './initialData';
import { displayedPeople } from './initialData';
import { displayedRooms } from './initialData';
import PathwayTemplate from './models/pathwayTemplate';
import StageTemplate from './models/stageTemplate';
import HospitalRoom from './models/hospitalRoom';
import Person from './models/person';
import { User } from './models/user';
import bcrypt from 'bcrypt';

export const loadDb = async (connection: Connection) => {
  console.log('Clearing database...');
  await connection.db.dropDatabase().then(() => {
    console.log('Database cleared');
  });

  // creates a test user if it doesn't yet exist
  // username/password: test/test
  User.findOne({ id: 2222 }).then(async (existingUser) => {
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('test4', 10);
      const user = new User({
        id: 2222,
        name: 'Test User 4',
        role: 'Physician',
        department: 'Cardiology',
        phone: '1234567890',
        email: 'testExample4@gmail.com',
        admin: false,
        location: 'Room 1',
        username: 'test4',
        password: hashedPassword,
      });

      user
        .save()
        .then(() => {
          console.log('Test user 4 created');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('Test user 4 already exists');
    }
  });

  User.findOne({ id: 8888 }).then(async (existingUser) => {
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('test3', 10);
      const user = new User({
        id: 8888,
        name: 'Test User 3',
        role: 'Admin',
        department: 'Administrator',
        phone: '1234567890',
        email: 'admin3@example.com',
        admin: true,
        location: 'Room 9999',
        username: 'test3',
        password: hashedPassword,
      });

      user
        .save()
        .then(() => {
          console.log('Test user 3 created');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('Test user 3 already exists');
    }
  });

  if (
    (await PathwayTemplate.find()).length > 0 ||
    (await StageTemplate.find()).length > 0 ||
    (await HospitalRoom.find()).length > 0 ||
    (await Person.find()).length > 0
  ) {
    console.log('Database not cleared');
    return;
  }
  await PathwayTemplate.insertMany(procedures);
  await StageTemplate.insertMany(stageTemplates);
  await HospitalRoom.insertMany(displayedRooms);
  await Person.insertMany(displayedPeople);

  console.log('Database loaded');
};
