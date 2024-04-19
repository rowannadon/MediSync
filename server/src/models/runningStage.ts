import mongoose from 'mongoose';
import { pathwayStageSchema } from './pathwayStage';

const runningStageSchema = new mongoose.Schema({
  ...pathwayStageSchema.obj,
  assigned_staff: [String],
  assigned_room: String,
  date: Date,
  completed: Boolean,
  progress: Number,
});

const RunningStage = mongoose.model('RunningStage', runningStageSchema);

export default RunningStage;
