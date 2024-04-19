import { Connection, MongooseError } from 'mongoose';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { UserModel } from './models/User';
import PathwayTemplate from './models/pathwayTemplate';
import RunningPathway from './models/runningPathway';
import StageTemplate from './models/stageTemplate';
import { loadDb } from './loadDb';
import { Request, Response, NextFunction } from 'express';

require('dotenv').config({ path: __dirname + '/../../.env' });

const jwt = require('jsonwebtoken');
const httpPort = 3001;
const socketIOPort = 3002;

const bcrypt = require('bcrypt');

export const io = new Server(socketIOPort);
export const app = express();
app.use(express.json());

// console.log(process.argv);
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
      UserModel.findOne({ id: 9999 }).then((existingUser) => {
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
    })
    .catch((err: MongooseError) => {
      console.log(err);
    });
} catch (err) {
  console.log(err);
}

mongoose.connection.once('open', function callback() {
  console.log('Connected successfully.');
  loadDb(mongoose.connection);
});

io.on('connection', async (socket: any) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });

  socket.on('getPathwayTemplates', async () => {
    console.log('sending pathway templates');
    socket.emit('pathwayTemplates', await PathwayTemplate.find());
  });

  console.log('sending all data');
  socket.emit('pathwayTemplates', await PathwayTemplate.find());
  socket.emit('people', await Person.find());
  socket.emit('rooms', await HospitalRoom.find());
  socket.emit('stageTemplates', await StageTemplate.find());
  socket.emit('runningPathways', await RunningPathway.find());
});

interface RequestWithUser extends Request {
  user?: any;
};

// add pathway template
app.post('/pathwayTemplates', async (req: any, res: any) => {
  console.log('adding pathway template', req.body);
  const pathwayTemplate = new PathwayTemplate({
    ...req.body,
    id: uuid(),
  });
  await pathwayTemplate.save();
  return res.json(pathwayTemplate);
});

// delete pathway template
app.delete('/pathwayTemplates/:id', async (req: any, res: any) => {
  const id = req.params.id;
  await PathwayTemplate.deleteOne({
    id,
  });
  return res.json(id);
});

// update pathway template
app.put('/pathwayTemplates/:id', async (req: any, res: any) => {
  const id = req.params.id;
  console.log(`updating pathway template with id: ${id}`);
  await PathwayTemplate.updateOne(
    {
      id,
    },
    req.body,
  );
  return res.json(id);
});

// add stage template
app.post('/stageTemplates', async (req: any, res: any) => {
  const stageTemplate = new StageTemplate(req.body);
  await stageTemplate.save();
  return res.json(stageTemplate);
});

// delete stage template
app.delete('/stageTemplates/:id', async (req: any, res: any) => {
  const id = req.params.id;
  await StageTemplate.deleteOne({
    id,
  });
  return res.json(id);
});

// update stage template
app.put('/stageTemplates/:id', async (req: any, res: any) => {
  const id = req.params.id;
  await StageTemplate.updateOne(
    {
      id,
    },
    req.body,
  );
  return res.json(id);
});

// // add stage to pathway
// app.post('/pathwayTemplates/:id/stage', async (req: any, res: any) => {
//   const pathwayId = req.params.id;
//   const pathway = await PathwayTemplate.findOne({ id: pathwayId });
//   if (!pathway) {
//     return res.status(404).json('Pathway not found');
//   }
//   const stage = new StageTemplate(req.body);
//   pathway.stages.push(stage);
//   await pathway.save();
//   return res.json(stage);
// });

// // remove stage from pathway
// app.delete('/pathwayTemplates/:pid/stage/:sid',
//   async (req: any, res: any) => {
//     const pathwayId = req.params.pid;
//     const stageId = req.params.sid;
//     const pathway = await PathwayTemplate.findOne({ id: pathwayId });
//     if (!pathway) {
//       return res.status(404).json('Pathway not found');
//     }
//     const stage = pathway.stages.id(stageId);
//     if (stage) {
//       stage.remove();
//       await pathway.save();
//       return res.json(stageId);
//     } else {
//       return res.status(404).json('Stage not found');
//     }
//   },
// );

app.get('/test', async (req: any, res: any) => {
  return res.json({ status: 'healthy' });
});

app.get('/health', (req: any, res: any) => {
  return res.json({ status: 'healthy' });
});

const server = app.listen(httpPort, () => {
  console.log(`Server listening on ${httpPort}`);
});

// to login and assign jwt token to user
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = { username: username, password: password };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  console.log(`access token secret: ${process.env.ACCESS_TOKEN_SECRET}`);
  res.json({ accessToken: accessToken });
});


app.get('/posts', authenticateToken, (req: RequestWithUser, res: Response) => {
  res.json(req.user);
});

function authenticateToken(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token==null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: Error, user: any) => {
    if(err) return res.sendStatus(403);
    req.user = user;
    next();
  });
  
};

// to add a new user with a hashed password
app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new UserModel({
      name: req.body.name,
      role: req.body.role,
      department: req.body.department,
      phone: req.body.phone,
      email: req.body.email,
      admin: req.body.admin,
      location: req.body.location, 
      username: req.body.username,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.json(savedUser);


  } catch {
    res.status(500).send();
  }
});

// clean up on exit
process.on('exit', () => {
  cleanup();
});

export const cleanup = () => {
  io.close();
  server.close();
  console.log('Cleaning up...');
};
