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
  console.log('Clearing database');
  await connection.db.dropDatabase();

  if ((await PathwayTemplate.find()).length) {
    console.log('Database not cleared');
    return;
  }
  await PathwayTemplate.insertMany(procedures);
  await StageTemplate.insertMany(stageTemplates);
  await HospitalRoom.insertMany(displayedRooms);
  await Person.insertMany(displayedPeople);

  // creates a test user if it doesn't yet exist
  // username/password: test/test
  User.findOne({ username: 'test' }).then(async (existingUser) => {
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('test', 10);
      const user = new User({
        id: 9999,
        name: 'Test User',
        role: 'Admin',
        department: 'Administrator',
        phone: '1234567890',
        email: 'admin@example.com',
        admin: true,
        location: 'Room 9999',
        username: 'test',
        password: hashedPassword,
      });

      user
        .save()
        .then(() => {
          console.log('Test user created');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('User already exists');
    }
  });

  User.findOne({ username: 'test2' }).then(async (existingUser) => {
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('test2', 10);
      const user = new User({
        id: 9999,
        name: 'Test User 2',
        role: 'Admin',
        department: 'Administrator',
        phone: '1234567890',
        email: 'admin2@example.com',
        admin: true,
        location: 'Room 9999',
        username: 'test2',
        password: hashedPassword,
      });

      user
        .save()
        .then(() => {
          console.log('Test user 2 created');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('User 2 already exists');
    }
  });

  console.log('Database loaded');
};
