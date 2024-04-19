
// server/src/index.js

import { Connection, MongooseError } from 'mongoose';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { databaseTest } from './models/databaseTest';
import { v4 as uuid } from 'uuid';
import { UserModel } from './models/User';
import { procedures, stageTemplates, runningPathways, displayedPeople, displayedRooms} from './initialData'
import PathwayTemplate from './models/pathwayTemplate';
import RunningPathway from './models/runningPathway';
import StageTemplate from './models/stageTemplate';
import {loadDb} from './loadDb';

const httpPort = 3001;

const socketIOPort = 3002;

// const bcrypt = require('bcrypt');

export const io = new Server(socketIOPort);
export const app = express();
app.use(express.json());

console.log(process.argv);
const stage = process.env.STAGE;
console.log(stage);

let mongoDomain = '';
switch (stage) {
  case 'local':
    mongoDomain = 'mongodb://mongodb:27017/medisync';
    break;
  case 'prod':
    mongoDomain = `mongodb://${process.env.MONGO_URI}:27017/medisync`;
    break;
  case 'test':
    mongoDomain = process.env.MONGO_URI
      ? process.env.MONGO_URI
      : 'mongodb://127.0.0.1:27017/medisync';
    break;
  default:
    mongoDomain = 'mongodb://127.0.0.1:27017/medisync';
}

console.log(mongoDomain);

let db: any = null;

try {
  mongoose
    .connect(mongoDomain, {
      ssl: stage === 'prod' ? true : false,
      retryWrites: false,
    })
    .then((connection: any) => {
      db = connection;
      console.log('Connected to mongodb');
      UserModel.findOne({ username: 'test' })
        .then((existingUser) => {
          if (!existingUser) {
            const user = new UserModel({
              id: 9999,
              name: 'Test User',
              role: 'Admin',
              department: 'Administrator',
              phone: '1234567890',
              email: 'admin@example.com',
              admin: true,
              location: 'Room 9999',
              username: 'test',
              password: 'test',
            });

            user.save()
              .then(() => {
                console.log('User created');
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.log('User already exists');
          }
        })

      //loadDb(connection.db);
    })
    .catch((err: MongooseError) => {
      console.log(err);
    });
} catch (err) {
  console.log(err);
}


io.on('connection', (socket: any) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });

  socket.on('addPathwayTemplate', (pathwayTemplate: any) => {
    console.log('adding pathway template', pathwayTemplate);
    io.emit('addPathwayTemplate', pathwayTemplate);
  });

  console.log('sending initial data');
  socket.emit('pathwayTemplates', procedures);
  socket.emit('people', displayedPeople);
  socket.emit('rooms', displayedRooms);
  socket.emit('stageTemplates', stageTemplates);
  socket.emit('runningPathways', runningPathways);
});

// add pathway template
app.post('/pathwayTemplates', async (req: any, res: any) => {
  console.log(req.body);
  const pathwayTemplate = new PathwayTemplate({
    ...req.body,
    id: uuid(),
  });
  await pathwayTemplate.save();
  return res.json();
});

app.delete('/pathwayTemplates/:id', async (req: any, res: any) => {
  const id = req.params.id;
  await PathwayTemplate.deleteOne({
    id,
  });
  return res.json(id);
});

app.get('/test', async (req: any, res: any) => {
  return res.json({ status: 'healthy' });
});

app.get('/health', (req: any, res: any) => {
  return res.json({ status: 'healthy' });
});

const server = app.listen(httpPort, () => {
  console.log(`Server listening on ${httpPort}`);
});

// app.post('/users', async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const user = { name: req.body.name, password: hashedPassword };

//   } catch {
//     res.status(500).send();
//   }
// });

// clean up on exit
process.on('exit', () => {
  cleanup();
});

export const cleanup = () => {
  io.close();
  server.close();
  console.log('Cleaning up...');
};
