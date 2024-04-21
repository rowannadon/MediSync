import mongoose from 'mongoose';
import { equipmentSchema } from './equipment';
import { occupancySchema } from './occupancy';

const hospitalRoomSchema = new mongoose.Schema({
  room_number: Number,
  type: String,
  equipment: { type: [equipmentSchema.obj] },
  occupancy: { type: occupancySchema.obj },
});

const HospitalRoom = mongoose.model('HospitalRoom', hospitalRoomSchema);

export default HospitalRoom;
