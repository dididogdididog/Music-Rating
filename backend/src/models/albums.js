import mongoose from "mongoose";

const Schema = mongoose.Schema;
const AlbumsSchema = new Schema({
  id: String,
  albumName: String,
  singerName: String,
  singerId: String,
  albumType: String,
  img: String,
  publishDate: Date,
  publishCompany: String,
  scores: [Number],
  totalScore: Number,
  users: [{ name: String, comment: String, score: Number, date: Date }],
  usersNumber: Number,
  isHotNewAlbum: Boolean,
  isHotAlbumOfTheYear: Boolean
});

const AlbumsModel = mongoose.model("Albums", AlbumsSchema);

export default AlbumsModel;