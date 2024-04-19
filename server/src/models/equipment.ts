import mongoose from 'mongoose';

export const equipmentSchema = new mongoose.Schema({
  type: String,
  count: Number,
  desc: String,
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;
