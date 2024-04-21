import mongoose from 'mongoose';

export const equipmentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  count: { type: Number, default: 1, required: true},
  desc: { type: String },
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;
