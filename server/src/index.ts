import { MongooseError } from 'mongoose';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import PathwayTemplate from './models/pathwayTemplate';
import StageTemplate from './models/stageTemplate';
import { loadDb } from './loadDb';
import { Request } from 'express';
import Person from './models/person';
import HospitalRoom from './models/hospitalRoom';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './models/user';
import axios from 'axios';
import { RunningPathway } from './DataTypes';
import { v4 as uuid } from 'uuid';

dotenv.config({ path: __dirname + '/../../.env' });

const httpPort = 3001;
const socketIOPort = 3002;

export const io = new Server(socketIOPort);
export const app = express();
app.use(express.json());

const stage = process.env.STAGE;

let mongoDomain = '';
let solverDomain = '';
switch (stage) {
  case 'local':
    mongoDomain = 'mongodb://mongodb:27017/medisync';
    solverDomain = 'http://solver:5000';
    break;
  case 'prod':
    mongoDomain = `mongodb://${process.env.MONGO_URI}:27017/medisync`;
    solverDomain = 'http://127.0.0.1:5000';
    break;
  case 'test':
    mongoDomain = process.env.MONGO_URI
      ? process.env.MONGO_URI
      : 'mongodb://127.0.0.1:27017/medisync';
    solverDomain = 'http://127.0.0.1:5000';
    break;
  default:
    mongoDomain = 'mongodb://127.0.0.1:27017/medisync';
    solverDomain = 'http://127.0.0.1:5000';
    break;
}

console.log(mongoDomain);
console.log(solverDomain);

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

axios.get(solverDomain + '/health').then((res) => {
  console.log('Solver health check:', res.data);
}).catch((err) => { 
  console.log('Solver health check failed:', err);
});

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

const runningPathways: RunningPathway[] = [];

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
  socket.emit('runningPathways', runningPathways);
});

interface RequestWithUser extends Request {
  user?: any;
}

app.get('/test', async (req: any, res: any) => {
  return res.send('API response: This is a response from the server!');
});

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

app.post('/runningPathways', async (req: any, res: any) => {
  console.log('creating new running pathway from: ', req.body);
  const timePadding = 5;

  const staff = req.body.form.staff;
  const stages = req.body.stages;
  const tasks = []
  for (let stage of stages) {
    const stageStaff = staff.filter((s: any) => s.stageId === stage.template.id);
    const s = stageStaff.map((s: any) => ({'type': s.staff, 'count': 1}));
    const next = stage.next.filter((n: any) => n['Next Available']).map((n: any) => n['Next Available']);
    const task = {
      'name': stage.id,
      'duration': stage.template.durationEstimate + timePadding,
      'required_people': s,
      'next': next
    }
    console.log(task);
    tasks.push(task);
  }

  const unavailable_periods: any = [
  ]

  const people = await Person.find();
  const p = people.map((person: any, index: number) => ({'id': index+1, 'type': person.role, 'available_hours': [8*60, 16*60]}));
  
  console.log('tasks', tasks);

  let result;
  try {
    result = await axios.post(solverDomain + '/schedule', {tasks: tasks, people: p, unavailable_periods: unavailable_periods})
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Error scheduling pathway' });
  }
  console.log(result.data);

  const startDate = new Date();

  const newId = uuid();

  const newRunningPathway: RunningPathway = {
    id: newId,
    patient: req.body.form.patient,
    startDate: startDate,
    notes: req.body.form.notes,
    title: req.body.pathway.title,
    desc: req.body.pathway.desc,
    stages: req.body.stages.map((stage: any) => {
      return {
        ...stage,
        id: stage.id + '-' + newId,
        template: stage.template.id,
        assigned_staff: [],
        assigned_room: '',
        date: new Date(startDate.valueOf() + result.data[stage.id]['start']*60000),
        completed: false,
        progress: 0,
      }
    }),
  }

  console.log('new running pathway', newRunningPathway)

  runningPathways.push(newRunningPathway);
  io.emit('runningPathways', runningPathways);
  
});


// login and assign access token to user
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // find user in db
  const dbUser = await User.findOne({ username: username });
  if (!dbUser) {
    return res.status(400).json({ error: 'User not found' });
  }

  // compare passwords
  const match = await bcrypt.compare(password, dbUser.password);
  if (!match) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  const user = { username: username };
  const refreshTokenSecret = checkRefreshTokenSecret();
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, refreshTokenSecret);

  // add refresh token to db
  dbUser.refreshTokens.push(refreshToken);
  await dbUser.save();

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

// generate new access token using refresh token
app.post('/token', async (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  const username = req.body.username;

  // check if refresh token exists in db for the user
  const dbUser = await User.findOne({ username: username });
  if (!dbUser) {
    return res.status(400).json({ error: 'User not found' });
  }

  if (!dbUser.refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: 'Refresh token not found' });
  }

  const refreshTokenSecret = checkRefreshTokenSecret();

  // refresh token exists, create new access token
  jwt.verify(refreshToken, refreshTokenSecret, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken: accessToken });
  })
});

// delete refresh token
app.delete('/logout', async (req: any, res: any) => {
  const refreshToken = req.body.token;
  const username = req.body.username;

  const dbUser = await User.findOne({ username: username });
  if (!dbUser) {
    return res.status(400).json({ error: 'User not found' });
  }

  dbUser.refreshTokens = dbUser.refreshTokens.filter((token: string) => token !== refreshToken);
  await dbUser.save();

  res.sendStatus(204);
});


// generate a new access token
function generateAccessToken(user: any) {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }

  return jwt.sign(user, accessTokenSecret, { expiresIn: '10m' });
};

function checkRefreshTokenSecret() {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  } else {
    return process.env.REFRESH_TOKEN_SECRET;
  }

}

// add a new user and store password hash
app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashedPassword);
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
