import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  role: String,
  department: String,
  phone: String,
  email: String,
  admin: Boolean,
  location: String,
});

const Person = mongoose.model('Person', personSchema);

export default Person;