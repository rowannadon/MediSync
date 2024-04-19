import mongoose from 'mongoose';
import { pathwayStageSchema } from './pathwayStage';

export const pathwayTemplateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  desc: String,
  stages: [pathwayStageSchema.obj],
});

const PathwayTemplate = mongoose.model(
  'PathwayTemplate',
  pathwayTemplateSchema,
);

export default PathwayTemplate;
