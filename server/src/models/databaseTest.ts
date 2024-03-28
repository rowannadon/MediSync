import mongoose from "mongoose";

const databaseTestSchema = new mongoose.Schema({
  //primary key
  id: { type: String, required: true, unique: true },
  msg: { type: String, required: true },
});

const databaseTest: any = mongoose.model("databaseTest", databaseTestSchema);

export { databaseTest }
