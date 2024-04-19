import mongoose from 'mongoose';
import { Person } from '../../../client/src/TempData';

export interface User extends Person {
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema<User>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  admin: { type: Boolean, required: true },
  location: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<User>('User', userSchema);
