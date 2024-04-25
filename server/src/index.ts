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
