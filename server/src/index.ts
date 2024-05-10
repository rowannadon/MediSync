import { MongooseError } from 'mongoose';
import express from 'express';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import PathwayTemplate from './models/pathwayTemplate';
import StageTemplate from './models/stageTemplate';
import { loadDb } from './loadDb';
import Person from './models/person';
import HospitalRoom from './models/hospitalRoom';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './models/user';
import axios from 'axios';
import {
  Assignments,
  NextType,
  PathwayStage,
  RunningPathway,
  RunningStage,
} from './DataTypes';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import DatabaseTest from './models/databaseTest';

const httpPort = 3001;
const socketIOPort = 3002;

export const io = new Server(socketIOPort);
export const app = express();
app.use(express.json());

const stage = process.env.STAGE;
const refreshTokenSecret =
  '4b72570e57bb34840214b7ae80834e656e57a6b548f1744ee56cd2774d7836f3af41666e88ad3ef1e60bfa42bcf9613c00b4e7ab8a51e67f1f772c2df020276c';
const accessTokenSecret =
  '03eafd45afce7087a8f49620c0655fea0103bd9df6bf7b1829bb42a72b7501153ee4cf70648c1b2aceefa36d5bc57028f2859e3dc25aca1379c1dbb83df26ff3';

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

axios
  .get(solverDomain + '/health')
  .then((res) => {
    console.log('Solver health check:', res.data);
  })
  .catch((err) => {
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

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log('socket token:', token);
  if (!token) {
    return;
  } // No token provided

  jwt.verify(token, accessTokenSecret, (err: any, data: any) => {
    if (err) {
      console.log('socket unauthorized');
      next(new Error('Invalid token'));
      return;
    } // Invalid token
    console.log('socket authenticated for', data);
    socket.handshake.auth.username = data.username;
    next();
  });
});

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  // allow login and token requests without token
  if (req.path === '/login' || req.path === '/token') return next();

  console.log('path:', req.path);
  console.log('token:', token);

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, accessTokenSecret, (err: any, data: any) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.username = data.username;
    next();
  });
};

app.use(authenticateToken);

function getMostRecentMonday() {
  const today = new Date();
  today.setSeconds(0, 0);
  const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
  const distanceFromMonday = (dayOfWeek + 6) % 7; // Calculate how many days ago was the last Monday
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - distanceFromMonday);
  return lastMonday;
}

const runningPathways: RunningPathway[] = [];
let lockedPathways: { user: string; pathway: string }[] = [];
let lockedStages: { user: string; stage: string }[] = [];
//const sockets: Socket[] = [];

const serverStartDate = getMostRecentMonday();

let fastForwardTime = new Date();
let fastForwardTimeEnabled = false;
let fastForwardTimePaused = false; 

io.on('connection', async (socket: any) => {
  console.log('a new user connected:', socket.handshake.auth.username);
  //sockets.push(socket);
  socket.on('disconnect', () => {
    lockedPathways = lockedPathways.filter(
      (p) => p.user !== socket.handshake.auth.username,
    );
    //sockets.splice(sockets.indexOf(socket), 1);
    console.log('a user disconnected:', socket.handshake.auth.username);
  });

  let ffInterval: NodeJS.Timeout;

  socket.on('enableFastForward', () => {
    fastForwardTimeEnabled = true;
    ffInterval = setInterval(() => {
      if (fastForwardTimeEnabled && !fastForwardTimePaused) {
        fastForwardTime.setMinutes(fastForwardTime.getMinutes() + 1);
        socket.emit('timeUpdate', fastForwardTime);
      }
    }, 100);
  });

  socket.on('disableFastForward', () => {
    fastForwardTimeEnabled = false;
    fastForwardTime = new Date();
    if (ffInterval)
      clearInterval(ffInterval);
  });

  socket.on('pauseFastForward', () => {
    fastForwardTimePaused = true;
  });

  socket.on('resumeFastForward', () => {
    fastForwardTimePaused = false;
  });

  socket.on('getPathwayTemplates', async () => {
    console.log('sending pathway templates');
    socket.emit('pathwayTemplates', await PathwayTemplate.find());
  });

  socket.on('getPeople', async () => {
    console.log('sending people');
    socket.emit('people', await Person.find());
  });

  socket.on('getRooms', async () => {
    console.log('sending rooms');
    socket.emit('rooms', await HospitalRoom.find());
  });

  socket.on('getStageTemplates', async () => {
    console.log('sending stage templates');
    socket.emit('stageTemplates', await StageTemplate.find());
  });

  socket.on('getRunningPathways', async () => {
    console.log('sending running pathways');
    socket.emit('runningPathways', runningPathways);
  });

  socket.on('lockPathway', (id: string) => {
    console.log('locking pathway', id);
    lockedPathways = lockedPathways.filter(
      (p) => p.user !== socket.handshake.auth.username,
    );
    lockedPathways.push({ user: socket.handshake.auth.username, pathway: id });
    io.emit(
      'lockedPathways',
      lockedPathways.map((s) => s.pathway),
    );
  });

  socket.on('unlockPathway', () => {
    console.log('unlocking pathway');
    lockedPathways = lockedPathways.filter(
      (p) => p.user !== socket.handshake.auth.username,
    );
    io.emit(
      'lockedPathways',
      lockedPathways.map((s) => s.pathway),
    );
  });

  socket.on('lockStage', (id: string) => {
    console.log('locking stage', id);
    lockedStages = lockedStages.filter(
      (p) => p.user !== socket.handshake.auth.username,
    );
    lockedStages.push({ user: socket.handshake.auth.username, stage: id });
    io.emit(
      'lockedStages',
      lockedStages.map((s) => s.stage),
    );
  });

  socket.on('unlockStage', () => {
    console.log('unlocking stage');
    lockedStages = lockedStages.filter(
      (s) => s.user !== socket.handshake.auth.username,
    );
    io.emit(
      'lockedStages',
      lockedStages.map((s) => s.stage),
    );
  });

  console.log('sending all data');
  socket.emit('pathwayTemplates', await PathwayTemplate.find());
  socket.emit('people', await Person.find());
  socket.emit('rooms', await HospitalRoom.find());
  socket.emit('stageTemplates', await StageTemplate.find());
  socket.emit('runningPathways', runningPathways);
});

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

app.post('/time', async (req: any, res: any) => {
  const time = req.body.time;
  console.log('setting time to', time);
  const dbTest = new DatabaseTest({
    msg: time,
    id: uuid(),
  });
  await dbTest.save();
  res.json(dbTest);
});

app.get('/time', async (req: any, res: any) => {
  const dbTest = await DatabaseTest.find();
  res.json(dbTest);
});

const findRunnableStages = (stages: PathwayStage[]): string[] => {
  const allIds = stages.map((s) => s.id);
  const nextIds = stages.map((s) => s.next.map((n) => n.next)).flat();
  const root = _.difference(allIds, nextIds)[0];
  const runnableStages: string[] = [];

  // traverse from root until a stage with more than one next is found
  const findNext = (id: string) => {
    const stage = stages.find((s) => s.id === id);
    if (!stage) {
      return;
    }
    runnableStages.push(stage.id);
    const next = stage.next;
    // return if there are multiple next stages or no next stages
    if (next.length > 1 || next.length === 0) {
      return;
    }
    findNext(next[0].next);
  };

  findNext(root);
  console.log('runnable stages', runnableStages);
  return runnableStages;
};

app.post('/runningPathways', async (req: any, res: any) => {
  console.log('creating new running pathway from: ', req.body);
  const newId = uuid();

  const pathwayStartDate = new Date(req.body.form.startDate);
  const dateOffsetMinutes =
    Math.abs(pathwayStartDate.valueOf() - serverStartDate.valueOf()) / 60000;

  const runnableStageIds = findRunnableStages(req.body.stages);
  const runnableStages = req.body.stages.filter((s: PathwayStage) =>
    runnableStageIds.includes(s.id),
  );

  const staff = req.body.form.staff;
  const tasks = [];
  for (const stage of runnableStages) {
    const stageStaff = staff
      .filter((s: any) => s.stageId === stage.template.id)
      .map((s: any) => ({ type: s.staff, count: 1 }));

    const output = req.body.form.outputs.find(
      (o: any) => o.stageId === stage.template.id,
    );
    console.log(stage)

    let delay = 0;
    if (output && output.type === 'Delay') {
      delay = Number.parseInt(output.value);
      console.log('delay', delay);
    }

    let timeOffset = 0;
    if (output && output.type === 'Scheduled') {
      timeOffset =
        (new Date(output.value).valueOf() - serverStartDate.valueOf()) / 60000;
      console.log('delay', delay);
    }

    const offset = timeOffset > 0 ? timeOffset : dateOffsetMinutes;

    const next = stage.next.length > 1 ? [] : stage.next.map((n: any) => n.next + '-' + req.body.form.patient);

    const task = {
      name: stage.template.name,
      id: stage.id + '-' + req.body.form.patient,
      patient: req.body.form.patient,
      duration: stage.template.durationEstimate,
      offset: offset,
      delay: delay,
      required_people: stageStaff,
      next: next,
    };
    tasks.push(task);
  }

  for (const pathway of runningPathways) {
    for (const stage of pathway.stages.filter(
      (s) => !s.completed && s.runnable,
    )) {
      const stageStaff = stage.assigned_staff.map((s: any) => ({
        id: Number.parseInt(s),
      }));

      const offset =
        stage.scheduleOffset > 0 ? stage.scheduleOffset : stage.timeOffset;

      const task = {
        name: stage.template.name,
        id: stage.id,
        patient: pathway.patient,
        duration: stage.template.durationEstimate,
        offset: offset,
        delay: stage.delay,
        required_people: stageStaff,
        next: stage.next.length > 1 ? [] : stage.next.map((n: any) => n.next + '-' + pathway.patient),
      };

      tasks.push(task);
    }
  }

  const people = await Person.find();
  const p = people.map((person: any, index: number) => ({
    id: index + 1,
    type: person.role,
    name: person.name,
    available_hours: [8 * 60, 16 * 60],
  }));

  console.log('tasks', tasks);

  let result;
  try {
    result = await axios.post(solverDomain + '/schedule', {
      tasks: tasks,
      people: p,
    });
  } catch (e) {
    //console.log(e);
    return res.status(500).json({ error: 'Error scheduling pathway' });
  }
  //console.log(result.data);

  const tasksData = result.data.tasks;
  const assignmentData: Assignments = result.data.assignments;

  const assignments = new Map<string, string[]>();

  // Iterate over each user and their tasks
  for (const [tasks, peopleIds] of Object.entries(assignmentData)) {
    for (const personId of Object.keys(peopleIds)) {
      console.log('personId', personId)
      console.log('person', people[Number.parseInt(personId) + 1]);
      const name = people[Number.parseInt(personId) + 1].name;

      const n = name ? name : 'Unknown';
      
      if (!assignments.has(n)) {
        assignments.set(n, []);
      }
      assignments.get(n)?.push(tasks);
    }
  }

  console.log(assignments);

  const newRunningPathway: RunningPathway = {
    id: newId,
    patient: req.body.form.patient,
    startDate: pathwayStartDate,
    notes: req.body.form.notes,
    title: req.body.pathway.title,
    desc: req.body.pathway.desc,
    stages: runnableStages.map((stage: RunningStage) => {
      const output = req.body.form.outputs.find(
        (o: any) => o.stageId === stage.template.id,
      );
      const assigned = result.data.assignments[stage.id + '-' + req.body.form.patient];
      const ms_offset = tasksData[stage.id + '-' + req.body.form.patient]['start'] * 60000;
      return {
        ...stage,
        template: stage.template,
        id: stage.id + '-' + req.body.form.patient,
        timeOffset: dateOffsetMinutes,
        assigned_staff: assigned ? Object.keys(assigned) : [],
        assigned_room: '',
        date: new Date(
          serverStartDate.valueOf() +
            ms_offset,
        ),
        completed: false,
        runnable: runnableStageIds.includes(stage.id),
        delay:
          output && output.type === 'Delay' ? Number.parseInt(output.value) : 0,
        scheduleOffset:
          output && output.type === 'Scheduled'
            ? (new Date(output.value).valueOf() - serverStartDate.valueOf()) /
              60000
            : 0,
      };
    }),
  };

  for (const pathway of runningPathways) {
    for (const stage of pathway.stages) {
      if (stage.completed) {
        continue;
      }
      if (tasksData[stage.id]['start'])
        stage.date = new Date(
          serverStartDate.valueOf() + tasksData[stage.id]['start'] * 60000,
        );
    }
  }

  //console.log('new running pathway', newRunningPathway);

  if (!runningPathways.some((p) => p.patient === req.body.form.patient)) {
    runningPathways.push(newRunningPathway);
    io.emit('runningPathways', runningPathways);
  }
});

const completedStages: RunningStage[] = []
const currentStages: RunningStage[] = []

const mainInterval = setInterval(() => {
  const time = fastForwardTimeEnabled ? fastForwardTime : new Date();
  // find stages that are currently running
  for (const pathway of runningPathways) {
    for (const stage of pathway.stages) {
      if (stage.completed) {
        continue;
      }
      if (stage.date <= time && stage.date) {
        if (!currentStages.includes(stage)) {
          currentStages.push(stage);
          console.log('current stage', stage)
        }
      }
    }
  }
}, 500);

// ------------------------------------------------- User account routes ------------------------------------------------- //

// authenticate and assign access token to user
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

  const user = {
    _id: dbUser._id,
    username: username,
  };
  // const refreshTokenSecret = refreshTokenS;
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, refreshTokenSecret);

  // add refresh token to db
  dbUser.refreshTokens.push(refreshToken);
  await dbUser.save();

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

// delete refresh token
app.delete('/logout', async (req: any, res: any) => {
  const refreshToken = req.body.token;
  const username = req.username;

  console.log('logging out', username);

  const dbUser = await User.findOne({ username: username });
  if (!dbUser) {
    return res.status(400).json({ error: 'User not found' });
  }

  dbUser.refreshTokens = dbUser.refreshTokens.filter(
    (token: string) => token !== refreshToken,
  );
  await dbUser.save();

  res.sendStatus(204);
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

  // refresh token exists, create new access token
  jwt.verify(refreshToken, refreshTokenSecret, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      username: user.username,
      _id: dbUser._id,
    });
    res.json({ accessToken: accessToken });
  });
});

// generate a new access token
function generateAccessToken(user: any) {
  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }
  console.log('user id: ', user._id);
  console.log('user: ', user);
  return jwt.sign(
    { _id: user._id, username: user.username },
    accessTokenSecret,
    { expiresIn: '1h' },
  );
}

// add a new user and store password hash
app.post('/newUser', async (req, res) => {
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

// get user data for currently logged in user
app.get('/user', async (req: any, res) => {
  console.log('Received request for user data for', req.username);
  const user = await User.find({ username: req.username });
  if (!user[0]) {
    return res.status(404).json({ error: 'User not found' });
  }
  console.log('User data:', user[0]);
  res.json(user[0]);
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
