import express from 'express';
import cors from 'cors';
import mongodb from './src/mongodb';
import routes from './src/routes';

import db from './db'

mongodb.connect();

const app = express();
const port = process.env.PORT || 4000;
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}
app.use(express.json());

routes(app)

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
