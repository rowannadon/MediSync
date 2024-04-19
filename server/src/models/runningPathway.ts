import mongoose from 'mongoose';
import { pathwayTemplateSchema } from './pathwayTemplate';

const runningPathwaySchema = new mongoose.Schema({
  ...pathwayTemplateSchema.obj,
  patient: String,
  startDate: Date,
  notes: String,
  stages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RunningStage' }],
});

const RunningPathway = mongoose.model('RunningPathway', runningPathwaySchema);

export default RunningPathway;
