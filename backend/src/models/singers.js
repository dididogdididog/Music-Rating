import mongoose from "mongoose";

const Schema = mongoose.Schema;
const SingersSchema = new Schema({
  name: String,
  id: String,
  albums: [{ name: String, id: String, img: String, totalScore: Number, usersNumber: Number }],
  intro: String,
  img: String,
  scores: [Number],
});

const SingersModel = mongoose.model("Singers", SingersSchema);

export default SingersModel;