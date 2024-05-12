import mongoose from 'mongoose';

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
  schedule: {
    Monday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    Tuesday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    Wednesday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    Thursday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    Friday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    Saturday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    Sunday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    
  },
});

export const User = mongoose.model('User', userSchema);
