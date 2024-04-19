import mongoose from 'mongoose';

export const nextSchema = new mongoose.Schema({
  Scheduled: { type: String },
  'Next Available': { type: String },
  Delay: { type: String },
});

const Next = mongoose.model('Next', nextSchema);

export default Next;
