import mongoose from 'mongoose';
import { pathwayTemplateSchema } from './pathwayTemplate';
import { runningStageSchema } from './runningStage';

const runningPathwaySchema = new mongoose.Schema({
  ...pathwayTemplateSchema.obj,
  patient: String,
  startDate: Date,
  notes: String,
  stages: [{ type: runningStageSchema.obj }],
});

const RunningPathway = mongoose.model('RunningPathway', runningPathwaySchema);

export default RunningPathway;
