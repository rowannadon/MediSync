import { MongooseError } from 'mongoose';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import PathwayTemplate from './models/pathwayTemplate';
import RunningPathway from './models/runningPathway';
import StageTemplate from './models/stageTemplate';
import { loadDb } from './loadDb';
import { Request, Response, NextFunction } from 'express';
import Person from './models/person';
import HospitalRoom from './models/hospitalRoom';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './models/user';

dotenv.config({ path: __dirname + '/../../.env' });

const httpPort = 3001;
const socketIOPort = 3002;

export const io = new Server(socketIOPort);
export const app = express();
app.use(express.json());

const stage = process.env.STAGE;

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

try {
  mongoose
    .connect(mongoDomain, {
      ssl: stage === 'prod' ? true : false,
      retryWrites: false,
    })
    .catch((err: MongooseError) => {
      console.log(err);
    });
} catch (err) {
  console.log(err);
}

let server: any;
mongoose.connection.once('open', async () => {
  console.log('Connected successfully.');
  await loadDb(mongoose.connection);

  server = app.listen(httpPort, () => {
    console.log(`Server listening on ${httpPort}`);
  });

  //clean up on exit
  process.on('exit', () => {
    cleanup();
  });
});

export const cleanup = async () => {
  console.log('Cleaning up');
  await new Promise((resolve, reject) => {
    io.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve('closed io server');
      }
    });
  });
  await new Promise((resolve, reject) => {
    (server as Server).close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve('closed http server');
      }
    });
  });
  await mongoose.connection.close();
};

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
}

// get all pathway templates
app.get('/pathwayTemplates', async (req: any, res: any) => {
  const pathwayTemplates = await PathwayTemplate.find();
  return res.json(pathwayTemplates);
});

// get pathway template by id
app.get('/pathwayTemplates/:id', async (req: any, res: any) => {
  const id = req.params.id;
  const pathwayTemplate = await PathwayTemplate.findOne({ id });
  return res.json(pathwayTemplate);
});

// add pathway template
app.post('/pathwayTemplates', async (req: any, res: any) => {
  console.log('adding pathway template', req.body);
  const pathwayTemplate = new PathwayTemplate(req.body);
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
  console.log(`updating pathway template with id: ${id} to`, req.body);
  await PathwayTemplate.updateOne(
    {
      id,
    },
    req.body,
  );
  return res.json(id);
});

// get all stage templates
app.get('/stageTemplates', async (req: any, res: any) => {
  const stageTemplates = await StageTemplate.find();
  return res.json(stageTemplates);
});

// get stage template by id
app.get('/stageTemplates/:id', async (req: any, res: any) => {
  const id = req.params.id;
  const stageTemplate = await StageTemplate.findOne({ id });
  return res.json(stageTemplate);
});

// add stage template
app.post('/stageTemplates', async (req: any, res: any) => {
  console.log('adding stage template', req.body);
  const stageTemplate = new StageTemplate(req.body);
  await stageTemplate.save();
  return res.json(stageTemplate);
});

// delete stage template
app.delete('/stageTemplates/:id', async (req: any, res: any) => {
  const id = req.params.id;
  console.log(`deleting stage template with id: ${id}`);
  await StageTemplate.deleteOne({
    id,
  });
  return res.json(id);
});

// update stage template
app.put('/stageTemplates/:id', async (req: any, res: any) => {
  const id = req.params.id;
  console.log(`updating stage template with id: ${id} to`, req.body);
  await StageTemplate.updateOne(
    {
      id,
    },
    req.body,
  );
  return res.json(id);
});

app.get('/health', (req: any, res: any) => {
  return res.json({ status: 'healthy' });
});

// to login and assign jwt token to user
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = { username: username, password: password };
  const accessToken = jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET || 'secret',
  );
  console.log(`access token secret: ${process.env.ACCESS_TOKEN_SECRET}`);
  res.json({ accessToken: accessToken });
});

app.get('/posts', authenticateToken, (req: RequestWithUser, res: Response) => {
  res.json(req.user);
});

function authenticateToken(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || 'secret',
    { complete: true },
    (err: VerifyErrors | null, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    },
  );
}

// to add a new user with a hashed password
app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
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
