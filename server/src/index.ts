// server/src/index.js

import { MongooseError } from 'mongoose';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { databaseTest } from './models/databaseTest';
import { v4 as uuid } from 'uuid';

const httpPort = 3001;

const socketIOPort = 3002;

const io = new Server(socketIOPort);
const app = express();
app.use(express.json());

console.log(process.argv);
const stage = process.env.STAGE;

const mongoDomain =
  stage === 'local'
    ? 'mongodb'
    : stage === 'dev'
      ? '127.0.0.1'
      : process.env.MONGO_URI;

console.log('mongodomain ', mongoDomain);

mongoose
  .connect(`mongodb://${mongoDomain}:27017/medisync`, { ssl: true })
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch((err: MongooseError) => {
    console.log(err);
  });

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

app.listen(httpPort, () => {
  console.log(`Server listening on ${httpPort}`);
});
