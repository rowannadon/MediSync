import mongoose from 'mongoose';

export const personSchema = new mongoose.Schema({
  name: String,
  role: String,
  department: String,
  phone: String,
  email: String,
  admin: Boolean,
  location: String,
  username: String,
  password: { type: String, required: false },
});

const Person = mongoose.model('Person', personSchema);

export default Person;
