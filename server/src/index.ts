// server/src/index.js

import { MongooseError } from 'mongoose';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { databaseTest } from './models/databaseTest';
import { v4 as uuid } from 'uuid';


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
  socket.on('testSocketIo', (msg: any) => {
    console.log(msg);
    io.emit('test', 'This is a response from the server!');
  });
});

// check if a guess is valid
app.get('/test', (req: any, res: any) => {
  console.log('test');
  return res.json({ test: 'This is a response from the server!' });
});

app.post('/time', (req: any, res: any) => {
  console.log('saving time', req.body);
  databaseTest.create({ msg: req.body.time, id: uuid() });
  return res.json({ time: req.body.time });
});

app.get('/time', async (req: any, res: any) => {
  const times = await databaseTest.find({});

  console.log(times);
  return res.json({ time: times });
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
