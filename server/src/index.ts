import { MongooseError } from 'mongoose';
import express from 'express';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import PathwayTemplate from './models/pathwayTemplate';
import StageTemplate from './models/stageTemplate';
import { loadDb } from './loadDb';
import HospitalRoom from './models/hospitalRoom';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from './models/user';
import axios from 'axios';
import {
  Assignments,
  PathwayStage,
  Person,
  RunningPathway,
  RunningStage,
} from './DataTypes';
import { v4 as uuid } from 'uuid';
import _, { update } from 'lodash';
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
let assignments = new Map<string, string[]>();
let lockedPathways: { user: string; pathway: string }[] = [];
let lockedStages: { user: string; stage: string }[] = [];
const sockets: { socket: Socket; username: string }[] = [];

const serverStartDate = getMostRecentMonday();

let fastForwardTime = new Date();
let fastForwardTimeEnabled = false;
let fastForwardTimePaused = false;

io.on('connection', async (socket: any) => {
  console.log('a new user connected:', socket.handshake.auth.username);
  sockets.push({ socket: socket, username: socket.handshake.auth.username });
  socket.on('disconnect', () => {
    lockedPathways = lockedPathways.filter(
      (p) => p.user !== socket.handshake.auth.username,
    );
    sockets.splice(sockets.indexOf(socket), 1);
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
    if (ffInterval) clearInterval(ffInterval);
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
    socket.emit('people', await User.find());
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

  socket.on(
    'completeStage',
    async ({
      next,
      stage,
      pathway,
      notes,
    }: {
      next: string;
      stage: string;
      pathway: string;
      notes: string;
    }) => {
      console.log('completing stage', stage);
      const pathwayIndex = runningPathways.findIndex((p) => p.id === pathway);
      const pwy = runningPathways[pathwayIndex];

      const stageIndex = pwy.stages.findIndex((s) => s.id === stage);
      const stg = pwy.stages[stageIndex];

      pwy.notes = notes;

      stg.next = stg.next.filter((n) => n.next === next.split('$')[0]);
      console.log('stage', stg);

      if (next) {
        const newRunnableStages = findRunnableStages2(pwy.stages, next);
        console.log('newRunnableStages', newRunnableStages);

        for (const runnableStage of newRunnableStages) {
          const index = pwy.stages.findIndex((s) => s.id === runnableStage);
          pwy.stages[index].runnable = true;
          console.log(pwy.stages[index].required_staff);
          pwy.stages[index].assigned_staff = pwy.stages[index].required_staff;
        }

        const prevTasks = generateSolverTasksFromRunningStages(runningPathways);
        const people = await generatePeople();

        console.log('prevTasks', prevTasks);
        //const completedTaskIndex = prevTasks.findIndex((t) => t.id === stage);
        //prevTasks[completedTaskIndex].next = [next]

        let result: any;
        try {
          result = await computeSchedule(prevTasks, people);
        } catch (err) {
          console.error(err);
        }

        for (const runnableStage of newRunnableStages) {
          const index = pwy.stages.findIndex((s) => s.id === runnableStage);
          pwy.stages[index].assigned_staff = result.data.assignments[
            runnableStage
          ].map((a: string) => ({ id: a }));
        }

        const tasksData = result.data.tasks;
        console.log(tasksData);
        updateRunningPathways(tasksData);
      }
      //stg.completed = true;
      io.emit('runningPathways', runningPathways);
      io.emit('assignments', assignments);
    },
  );

  socket.on('getInitialData', async () => {
    console.log('sending all data');
    socket.emit('pathwayTemplates', await PathwayTemplate.find());
    socket.emit('people', await User.find());
    socket.emit('rooms', await HospitalRoom.find());
    socket.emit('stageTemplates', await StageTemplate.find());
    socket.emit('runningPathways', runningPathways);
    socket.emit('assignments', assignments);
  });
});

const findRunnableStages2 = (
  stages: RunningStage[],
  root: string,
): string[] => {
  const runnableStages: string[] = [];

  // traverse from root until a stage with more than one next is found
  const findNext = (id: string) => {
    const stage = stages.find((s) => s.id.split('$')[0] === id.split('$')[0]);
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
  return runnableStages;
};

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

const findRoot = (stages: PathwayStage[]): string => {
  const allIds = stages.map((s) => s.id);
  const nextIds = stages.map((s) => s.next.map((n) => n.next)).flat();
  return _.difference(allIds, nextIds)[0];
};

const findRunnableStages = (stages: PathwayStage[], root: string): string[] => {
  const runnableStages: string[] = [];

  // traverse from root until a stage with more than one next is found
  const findNext = (id: string) => {
    const stage = stages.find((s) => s.id === id);
    console.log('stage', stage);
    if (!stage) {
      return;
    }
    runnableStages.push(stage.id);
    const next = stage.next;
    console.log('next', next);
    // return if there are multiple next stages or no next stages
    if (next.length > 1 || next.length === 0) {
      return;
    }
    findNext(next[0].next);
  };

  findNext(root);
  return runnableStages;
};

const computeSchedule = async (tasks: any, people: any) => {
  const result = await axios.post(solverDomain + '/schedule', {
    tasks: tasks,
    people: people,
  });

  assignments = result.data.assignments;
  console.log('assignments', assignments);

  return result;
};

const generateSolverTasksFromFormData = (
  form: any,
  stages: RunningStage[],
  dateOffsetMinutes: number,
) => {
  const tasks = [];

  for (const stage of stages) {
    const stageStaff = form.staff
      .filter((s: any) => s.stageId === stage.template.id)
      .map((s: any) =>
        s.value === 'Automatic' ? { type: s.staff } : { id: s.value },
      );

    const output = form.outputs.find(
      (o: any) => o.stageId === stage.template.id,
    );
    console.log(stage);

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

    const next =
      stage.next.length > 1
        ? []
        : stage.next.map((n: any) => n.next + '$' + form.patient);

    const task = {
      name: stage.template.name,
      id: stage.id + '$' + form.patient,
      patient: form.patient,
      duration: stage.template.durationEstimate,
      offset: offset,
      delay: delay,
      required_people: stageStaff,
      next: next,
    };
    tasks.push(task);
    console.log('newtask', task);
  }

  return tasks;
};

const generateSolverTasksFromRunningStages = (
  runningPathways: RunningPathway[],
) => {
  const tasks = [];
  for (const pathway of runningPathways) {
    for (const stage of pathway.stages.filter(
      (s) => !s.completed && s.runnable,
    )) {
      const stageStaff = stage.assigned_staff;

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
        next:
          stage.next.length > 1
            ? []
            : stage.next.map((n: any) => n.next + '$' + pathway.patient),
      };

      tasks.push(task);
      console.log('oldtask', task);
    }
  }
  return tasks;
};

const updateRunningPathways = (tasksData: any) => {
  for (const pathway of runningPathways) {
    for (const stage of pathway.stages) {
      if (stage.completed || !stage.runnable) {
        continue;
      }
      if (tasksData[stage.id]['start'])
        stage.date = new Date(
          serverStartDate.valueOf() + tasksData[stage.id]['start'] * 60000,
        );
    }
  }
};

const generatePeople = async () => {
  const users = await User.find();
  return users.map((person: any) => ({
    id: person.username,
    type: person.role,
    name: person.name,
    available_hours: [8 * 60, 16 * 60],
  }));
};

app.post('/runningPathways', async (req: any, res: any) => {
  console.log('creating new running pathway from: ', req.body);
  const newId = uuid();

  const pathwayStartDate = new Date(req.body.form.startDate);
  const dateOffsetMinutes =
    Math.abs(pathwayStartDate.valueOf() - serverStartDate.valueOf()) / 60000;

  const root = findRoot(req.body.stages);
  const runnableStageIds = findRunnableStages(req.body.stages, root);
  const runnableStages = req.body.stages.filter((s: PathwayStage) =>
    runnableStageIds.includes(s.id),
  );

  const formTasks = generateSolverTasksFromFormData(
    req.body.form,
    runnableStages,
    dateOffsetMinutes,
  );
  const prevTasks = generateSolverTasksFromRunningStages(runningPathways);
  const people = await generatePeople();

  let result: any;
  try {
    result = await computeSchedule([...formTasks, ...prevTasks], people);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to compute schedule' });
  }

  const tasksData = result.data.tasks;

  const newRunningPathway: RunningPathway = {
    id: newId,
    patient: req.body.form.patient,
    startDate: pathwayStartDate,
    notes: req.body.form.notes,
    title: req.body.pathway.title,
    desc: req.body.pathway.desc,
    stages: req.body.stages.map((stage: RunningStage) => {
      const output = req.body.form.outputs.find(
        (o: any) => o.stageId === stage.template.id,
      );
      const assigned =
        result.data.assignments[stage.id + '$' + req.body.form.patient];
      const ms_offset = tasksData[stage.id + '$' + req.body.form.patient]
        ? tasksData[stage.id + '$' + req.body.form.patient]['start'] * 60000
        : 0;

      const staff = req.body.form.staff
        .filter((s: any) => s.stageId === stage.template.id)
        .map((s: any) =>
          s.value === 'Automatic' ? { type: s.staff } : { id: s.value },
        );
      return {
        ...stage,
        template: stage.template,
        id: stage.id + '$' + req.body.form.patient,
        timeOffset: dateOffsetMinutes,
        assigned_staff: assigned
          ? assigned.map((a: string) => ({ id: a }))
          : [],
        required_staff: staff,
        assigned_room: '',
        date: new Date(serverStartDate.valueOf() + ms_offset),
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

  updateRunningPathways(tasksData);

  if (!runningPathways.some((p) => p.patient === req.body.form.patient)) {
    runningPathways.push(newRunningPathway);
    io.emit('runningPathways', runningPathways);
  }

  io.emit('assignments', assignments);

  res.json(newRunningPathway);
});

const completedStages: RunningStage[] = [];
const currentStages: RunningStage[] = [];

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
          console.log('current stage', stage);
        }
      }
    }
  }
}, 500);

app.get('/tasks', async (req: any, res: any) => {
  const username = req.username;
  console.log('getting tasks for', username);
  console.log('assignments', assignments);
  const tasks = assignments.get(username);
  const taskData = [];

  if (!tasks) {
    return;
  }
  for (const task of tasks) {
    const t = runningPathways
      .flatMap((p) => p.stages)
      .find((s) => s.id === task);
    if (t) {
      taskData.push(t);
    }
  }

  return res.json(taskData);
});

// ------------------------------------------------- User account routes ------------------------------------------------- //

// authenticate and assign access token to user
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // find user in db
  const dbUser = await User.findOne({ username: username });
  if (!dbUser) {
    console.log('User not found: searched username:', username);
    return res.status(400).json({ error: 'User not found' });
  }

  // compare passwords
  const match = await bcrypt.compare(password, dbUser?.password);
  if (!match) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  const user = {
    _id: dbUser._id,
    username: username,
  };

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
    // Check if a user with the provided username already exists
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

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

    const savedPerson = await user.save();
    res.json(savedPerson);
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

app.delete('/user/:username', async (req: any, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.deleteOne({ username: req.params.username });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/user/schedule', async (req: any, res: any) => {
  console.log('Received request to update schedule for', req.username);
  const user = await User.findOne({ username: req.username });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.schedule = req.body;
  await user.save();
  res.json(user);
});

app.post('/newRoom', async (req: any, res: any) => {
  try {

    // Check if a room with the same room number already exists
    const existingRoom = await HospitalRoom.findOne({ room_number: req.body.room_number });

    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const room = new HospitalRoom({
      room_number: req.body.room_number,
      type: req.body.type,
      equipment: req.body.equipment,
      occupancy: req.body.occupancy,
    });
    

    const savedRoom = await room.save();
    res.json(savedRoom);
  } catch {
    res.status(500).send();
  }
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
  clearInterval(mainInterval);
};

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
