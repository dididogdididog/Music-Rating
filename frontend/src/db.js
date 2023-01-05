
function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

let albums = [];
for (let i = 1; i <= 100; i++) {
  albums.push(
    {
      name: `專輯${i}`,
      singer: `歌手${i}`,
      publisher: `公司${i}`,
      date: '2022',
      ISRC: `${i}`,
      songs: ['歌1', '歌2', '歌3'],
      language: '華語',
      star: getRandomFloat(0, 5, 1),
      img: `https://source.unsplash.com/random/250x250?sig=${i}`
    }
  );
}
for (let i = 100; i <= 200; i++) {
  albums.push(
    {
      name: `album${i}`,
      singer: `singer${i}`,
      publisher: `company${i}`,
      date: '2022',
      ISRC: `${i}`,
      songs: ['song1', 'song2', 'song3'],
      language: '西洋',
      star: getRandomFloat(0, 5, 1),
      img: `https://source.unsplash.com/random/250x250?sig=${i}`
    }
  );
}

export default albums;
