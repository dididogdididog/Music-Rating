import mongoose from 'mongoose';
import dotenv from 'dotenv-defaults';
import albums from './models/albums';
import singers from './models/singers';
import { albums as albumsDb, singers as singersDb } from '../db';

const dataInit = async () => {
  // const checkData = await albums.find();
  // if (checkData.length === 0) {
  //   await albums.deleteMany({});
  //   await albums.insertMany(db);
  // }
  await albums.deleteMany({});
  await albums.insertMany(albumsDb);
  await singers.deleteMany({});
  await singers.insertMany(singersDb);
}

export default {
  connect: () => {
    dotenv.config();
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((res) => {
      console.log("mongo db connection created");
      if (process.env.MODE === 'Reset') {
        console.log('Reset Mode: reset the data');
        dataInit();
      }

    });
  }
}