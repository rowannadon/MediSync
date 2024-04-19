import mongoose from 'mongoose';

const occupancySchema = new mongoose.Schema({
  current: Number,
  total: Number,
});

const Occupancy = mongoose.model('Occupancy', occupancySchema);

export default Occupancy;