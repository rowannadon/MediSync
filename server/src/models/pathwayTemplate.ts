import mongoose from 'mongoose';

export const pathwayTemplateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  desc: String,
  stages: [{type: mongoose.Schema.Types.ObjectId, ref: 'PathwayStage'}],
});

const PathwayTemplate = mongoose.model('PathwayTemplate', pathwayTemplateSchema);

export default PathwayTemplate;