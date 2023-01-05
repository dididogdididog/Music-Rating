import express from 'express';
import cors from 'cors';
import mongodb from './mongodb';
import routes from './routes';

import db from '../db'

mongodb.connect();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

routes(app)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
