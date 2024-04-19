import mongoose from 'mongoose';

const nextTypeSchema = new mongoose.Schema({}, { strict: false });

export const pathwayStageSchema = new mongoose.Schema({
  id: String,
  template: String,
  next: { type: nextTypeSchema },
});

const PathwayStage = mongoose.model('PathwayStage', pathwayStageSchema);

export default PathwayStage;
