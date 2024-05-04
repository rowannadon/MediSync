import mongoose from 'mongoose';

const databaseTestSchema = new mongoose.Schema({
  //primary key
  id: { type: String, required: true, unique: true },
  msg: { type: String, required: true },
});

const DatabaseTest = mongoose.model('databaseTest', databaseTestSchema);

export default DatabaseTest;
