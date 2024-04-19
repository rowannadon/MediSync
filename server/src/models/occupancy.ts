import mongoose from 'mongoose';

export const occupancySchema = new mongoose.Schema({
  current: Number,
  total: Number,
});

const Occupancy = mongoose.model('Occupancy', occupancySchema);

export default Occupancy;
