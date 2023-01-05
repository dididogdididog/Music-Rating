import random_name from "node-random-name";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const albumsNum = 100;
const singerNum = 10;

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


const albumTypeArray = ['專輯', 'EP'];
const publishCompany = ['華納音樂', '環球音樂', '華納音樂', '愛克貝斯'];
const singersList = [];
for (let i = 1; i <= singerNum; i++) {
  singersList.push({
    name: '歌手' + i.toString(),
    id: uuidv4()
  })
}
const getScores = (scoresArray) => {
  return {
    score1: scoresArray[0],
    score2: scoresArray[1],
    score3: scoresArray[2],
    score4: scoresArray[3],
    score5: scoresArray[4],
    score6: scoresArray[5],
    score7: scoresArray[6],
    score8: scoresArray[7],
    score9: scoresArray[8],
    score10: scoresArray[9],
  }
}

const getUsers = (scoresArraySum) => {
  const users = []
  for (let i = 1; i <= scoresArraySum; i++) {
    users.push(
      {
        name: `user ${getRandomInt(1, 1000)}`,
        comment: "Nice album",
        score: getRandomInt(1, 10),
        date: randomDate(new Date(2021, 0, 1), new Date())
      }
    )
  }
  return users;
}
let singers = []
const getRandomSinger = (i, albumId, totalScore, userLength, albumImg) => {
  const singer = singersList[Math.floor(Math.random() * singersList.length)]
  const singersIndex = singers.findIndex(x => x.id === singer.id);
  //console.log(singersIndex);
  if (singers[singersIndex]) {
    singers[singersIndex].albums.push({ name: `專輯${i}`, id: albumId, img: albumImg, totalScore, usersNumber: userLength });
    singers[singersIndex].scores.push(totalScore / userLength);
  } else {
    singers.push({
      name: singer.name,
      id: singer.id,
      albums: [{
        name: `專輯${i}`, id: albumId, img: albumImg, totalScore: totalScore, usersNumber: userLength,
      }],
      intro: "周杰倫，臺灣華語流行音樂男歌手、音樂家、編曲家、唱片製片人、魔術師。 在2000年，周杰倫發行了他的首張專輯《Jay》，從屬於唱片公司阿爾發音樂，從此以後，他的音樂遍及亞洲。",
      img: `https://source.unsplash.com/random/450x450?sig=${i}`,
      scores: [totalScore / userLength],
    })
  }
  return { name: singer.name, id: singer.id }
}
// const getFixedURL = async (i) => {
//   let randomURL = `https://source.unsplash.com/random/450x450/?sig=${getRandomInt(1, 10000)}`;
//   await axios.get(randomURL).then(data => {
//     // the url of the random img
//     console.log(data.request.res.responseUrl);
//     console.log(i);
//     return data.request.res.responseUrl;
//   });
// }

let albums = [];

for (let i = 1; i <= albumsNum; i++) {
  const scores = [];
  for (let j = 1; j <= 10; j++) {
    scores.push(getRandomInt(1, 10));
  }
  const scoresArraySum = scores.reduce((a, b) => a + b);
  const users = getUsers(scoresArraySum);
  let totalScore = 0
  for (let j = 0; j < 10; j++) {
    totalScore = totalScore + (j + 1) * scores[j]
  }
  const albumImg = `https://source.unsplash.com/random/450x450?sig=${i}`;
  const albumId = uuidv4();
  const singer = getRandomSinger(i, albumId, totalScore, users.length, albumImg);
  const singerName = singer.name;
  const singerId = singer.id;
  //const fixedURL = await getFixedURL(i);
  //const score = (1 * scores.score1 + 2 * scores.score2 + 3 * scores.score3 + 4 * scores.score4 + 5 * scores.score5 + 6 * scores.score6 + 7 * scores.score7 + 8 * scores.score8 + 9 * scores.score9 + 10 * scores.score10) / users.length;
  albums.push(
    {
      id: albumId,
      albumName: `專輯${i}`,
      singerName: singerName,
      singerId: singerId,
      //singerName: `歌手${i}`,
      albumType: albumTypeArray[Math.floor(Math.random() * albumTypeArray.length)],
      img: albumImg,
      publishDate: randomDate(new Date(2021, 0, 1), new Date()),
      publishCompany: publishCompany[Math.floor(Math.random() * publishCompany.length)],
      scores: scores,
      totalScore: totalScore,
      users: users,
      usersNumber: users.length,
      isHotNewAlbum: false,
      isHotAlbumOfTheYear: false,
    }
  );

}
export { albums, singers };