// server/src/index.js

import { MongooseError } from 'mongoose';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

const httpPort = 3001;

const socketIOPort = 3002;

const io = new Server(socketIOPort);
const app = express();

const mongoDomain = process.env.STAGE === 'prod' ? 'mongodb' : '127.0.0.1';

mongoose
  .connect(`mongodb://${mongoDomain}:27017/medisync`)
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch((err: MongooseError) => {
    console.log(err);
  });

io.on('connection', (_) => {});

// check if a guess is valid
app.get('/test', (req: any, res: any) => {
  return res.json({ test: 'This is a response from the server!' });
});

app.listen(httpPort, () => {
  console.log(`Server listening on ${httpPort}`);
});
