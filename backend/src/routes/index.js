//const wrap = fn => (...args) => fn(...args).catch(args[2])
import albums from '../models/albums';
import singers from '../models/singers';

function main(app) {

  app.get('/api/getMainPage', async (req, res) => {
    try {
      const oneMonthAgo = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 2,
        new Date().getDate()
      );
      const newAlbums = await albums.find({ publishDate: { $gte: oneMonthAgo } }).sort({ usersNumber: -1 });
      // newAlbums.sort((a, b) => {
      //   if (a.usersNumber > b.usersNumber) return -1;
      //   if (a.usersNumber < b.usersNumber) return 1;
      //   return 0;
      // });
      const allAlbums = await albums.find({ $or: [{ publishDate: { $gte: new Date(2022, 0, 1) } }, { publishDate: { $lte: new Date(2022, 11, 31) } }] }).sort({ usersNumber: -1 });
      // allAlbums.sort((a, b) => {
      //   if (a.usersNumber > b.usersNumber) return -1;
      //   if (a.usersNumber < b.usersNumber) return 1;
      //   return 0;
      // });
      res.json({ message: 'success', hotNewAlbums: newAlbums.slice(0, 6), hotAlbumsOfTheYear: allAlbums.slice(0, 12) });
    } catch (e) {
      res.json({ message: 'getMainPage error' });
    }
  })
  app.get('/api/getAllAlbums', async (req, res) => {
    let allAlbums;
    if (req.query.item === '熱門') {
      allAlbums = await albums.find({ $or: [{ publishDate: { $gte: new Date(2022, 0, 1) } }, { publishDate: { $lte: new Date(2022, 11, 31) } }] }).sort({ usersNumber: -1 });
    } else if (req.query.item === '最佳') {
      allAlbums = await albums.find({ $or: [{ publishDate: { $gte: new Date(2022, 0, 1) } }, { publishDate: { $lte: new Date(2022, 11, 31) } }] }).sort({ totalScore: -1 });
    } else if (req.query.item === '最新') {
      allAlbums = await albums.find({ $or: [{ publishDate: { $gte: new Date(2022, 0, 1) } }, { publishDate: { $lte: new Date(2022, 11, 31) } }] }).sort({ publishDate: -1 });
    }
    res.json({ message: 'success', allAlbums: allAlbums });
  })
  app.get('/api/getAlbumData', async (req, res) => {
    try {
      const album = await albums.findOne({ id: req.query.albumId });
      res.json({ message: 'success', album: album });
    } catch (e) {
      res.json({ mesage: 'getAlbumData error' })
    }
  })
  app.get('/api/getSingerData', async (req, res) => {
    const singer = await singers.findOne({ id: req.query.singerId });
    //console.log(singer);
    res.json({ message: "success", singer: singer });
  })
  app.post('/api/postComment', async (req, res) => {
    const id = req.body.albumId;
    const userName = req.body.userName;
    const userComment = req.body.comment;
    const userScore = req.body.score;
    const userDate = req.body.date;
    const albumData = await albums.findOne({ id: id });
    if (albumData.users.find(e => e.name === userName)) {
      console.log("already exist");
      res.json({ message: "already exist" });
    }
    else {
      await albums.updateOne({ id: id }, {
        $push: { users: { name: userName, comment: userComment, score: userScore, date: userDate } },
        $inc: { usersNumber: 1, totalScore: userScore, ["scores." + (userScore - 1).toString()]: 1 },
      });
      res.json({ message: "sucess" });
    }
    //const updateRes = await albums.updateOne({ _id: id }, { $push: { users: { name, comment, score, date } } });
  })
  app.post('/api/deleteComment', async (req, res) => {
    try {
      const id = req.body.albumId;
      const userName = req.body.userName;
      const album = await albums.findOne({ id: id });
      const userData = album.users.find(user => user.name === userName);
      //console.log(album.users.find(user => user.name === userName));

      const response = await albums.updateOne({ id: id }, {
        $pull: { users: { name: userName } },
        $inc: { usersNumber: -1, totalScore: -userData.score, ["scores." + (userData.score - 1).toString()]: -1 },
      })
      res.json({ message: "success" });
    } catch (e) {
      res.json({ message: "deleteComment error" });
    }
  })


}

export default main