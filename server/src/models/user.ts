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
    monday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    tuesday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    wednesday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    thursday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    friday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    saturday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    sunday: { start: { type: String, default: 'Off' }, end: { type: String, default: 'Off' } },
    
  },
});

export const User = mongoose.model('User', userSchema);
