import mongoose from 'mongoose';
// import { personSchema } from './person';

const userSchema = new mongoose.Schema({
  name: String,
  role: String,
  department: String,
  phone: String,
  email: String,
  admin: Boolean,
  location: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] },
});

export const User = mongoose.model('User', userSchema);
