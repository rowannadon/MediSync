import mongoose from 'mongoose';
import { personSchema } from './person';

const userSchema = new mongoose.Schema({
  ...personSchema.obj,
  username: { type: String, required: true },
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] },
});

export const User = mongoose.model('User', userSchema);
