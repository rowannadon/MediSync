import mongoose from 'mongoose';
import equipmentSchema from './equipment';
import { outputTypes } from '../../../client/src/DataTypes';

const stageTemplateSchema = new mongoose.Schema({
  id: String,
  name: String,
  desc: String,
  type: String,
  required_staff: [String],
  required_room: String,
  required_equipment: [{type: mongoose.Schema.Types.ObjectId, ref: 'Equipment'}],
  outputs: { type: String, enum: outputTypes },
  durationEstimate: Number,
});

const StageTemplate = mongoose.model('StageTemplate', stageTemplateSchema);

export default StageTemplate;