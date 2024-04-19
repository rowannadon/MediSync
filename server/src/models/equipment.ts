import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  type: String,
  count: Number,
  desc: String,
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;
