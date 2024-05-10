import mongoose from 'mongoose';

export const nextSchema = new mongoose.Schema({
  next: { type: String },
  type: { type: String },
  value: { type: String, required: false },
});

const Next = mongoose.model('Next', nextSchema);

export default Next;
