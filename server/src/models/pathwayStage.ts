import mongoose from 'mongoose';
import { nextSchema } from './next';

export const pathwayStageSchema = new mongoose.Schema({
  id: String,
  template: String,
  next: { type: [nextSchema.obj] },
});

const PathwayStage = mongoose.model('PathwayStage', pathwayStageSchema);

export default PathwayStage;
