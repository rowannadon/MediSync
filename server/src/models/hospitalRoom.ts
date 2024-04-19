import mongoose from 'mongoose';
import equipmentSchema from './equipment';
import occupancySchema from './occupancy';

const hospitalRoomSchema = new mongoose.Schema({
  room_number: Number,
  type: String,
  equipment: [{type: mongoose.Schema.Types.ObjectId, ref: 'Equipment'}],
  occupancy: {type: mongoose.Schema.Types.ObjectId, ref: 'Occupancy'},
});

const HospitalRoom = mongoose.model('HospitalRoom', hospitalRoomSchema);

export default HospitalRoom;