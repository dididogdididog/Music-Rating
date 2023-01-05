import styled from '@emotion/styled';
import { Box, Link, Paper, Stack, Typography, Rating, Chip, Divider, Avatar, IconButton, TextField, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Container } from '@mui/system';
import { Bard as Bar } from '../components/chartBar.js';

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

import db from '../db.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const VerDivBox = styled(Box)({
  textAlign: 'center',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'start',
  gap: '10px',
  overflowX: 'auto',
});
const StyledPaper = styled(Paper)({
  borderRadius: '10px',
  width: '250px',
  height: '350px',
  margin: '5px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
})

const API_ROOT =
  process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:4000/api";

const instance = axios.create({ baseURL: API_ROOT });

const getScoresBar = (scores) => {
  const scoresRound = scores.map(x => Math.round(x));
  const scoresBar = new Array(10).fill(0);
  for (let i = 0; i < scoresRound.length; i++) {
    scoresBar[scoresRound[i] - 1]++;
  }
  return scoresBar;
}



const Singer = () => {

  const { singerId } = useParams();
  const [singerData, setSingerData] = useState({});
  const [scores, setScores] = useState([]);
  const [scoresBar, setScoresBar] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    getSingerData(singerId);
  }, [])

  const getSingerData = async () => {
    const res = await instance.get('/getSingerData', { params: { singerId } });
    console.log(res.data.singer);
    setSingerData(res.data.singer);
    setScores(res.data.singer.scores);
    setScoresBar(getScoresBar(res.data.singer.scores));
    setAlbums(res.data.singer.albums);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ maxWidth: '1700px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
          <img src="https://source.unsplash.com/random/450x450?sig=1" />
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box sx={{ paddingTop: '30px', paddingLeft: '30px', paddingRight: '30px', paddingBottom: '10px', width: '100%', minWidth: '300px', display: 'flex', flexDirection: 'column', }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h3'>{singerData.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '100px', flexWrap: 'nowrap' }}>
                  <Rating name="read-only" value={4.5} precision={0.5} size='large' readOnly />
                  <Typography variant='h6' sx={{ ml: 2 }}>{Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10}/10.0</Typography>
                  <Typography variant='h7' sx={{ ml: 2 }} color='textSecondary'>(專輯平均評分)</Typography>
                </Box>

              </Box>
              <Divider sx={{ borderBottomWidth: 2 }}></Divider>
              <Box sx={{ marginTop: '20px' }}>
                <Typography variant='h6' color='textSecondary'>簡介: {singerData.intro}</Typography>
              </Box>
            </Box>
            <Divider orientation='vertical' variant='middle' sx={{ borderBottomWidth: 2 }}></Divider>
            <Box sx={{ minWidth: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant='h4' color='textSecondary' paddingLeft='20px'>專輯評分統計</Typography>
              {Bar(scoresBar)}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderBottomWidth: 5 }}></Divider>
        <Box sx={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
          <Typography variant='h4'>歌手其他專輯</Typography>
          <VerDivBox sx={{
            "&::-webkit-scrollbar": {
              height: '10px'
            },
            "&::-webkit-scrollbar-track": {
              //backgroundColor: "orange"
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: ' #ffffff4d',
              borderRadius: '5px'
            }
          }}>
            {albums.map(album => (<StyledPaper>
              <Box component="img" src={album.img} sx={{ width: '250px', height: '250px', borderRadius: "5px", cursor: 'pointer', '&: hover': { opacity: 0.8 } }}></Box>
              <Box sx={{ height: '50px', paddingTop: '10px' }}>
                <Link underline="hover" color="inherit" component={RouterLink} to={`/albums/${album.id}`}>
                  <Typography variant='h5'>
                    {album.name}
                  </Typography>
                </Link>
              </Box>
              <Box sx={{ height: '50px', }}>
                <Typography variant='h6' color='textSecondary'>
                  {singerData.name}
                </Typography>
              </Box>
            </StyledPaper>))}
          </VerDivBox>
        </Box>

      </Container>
    </ThemeProvider >
  )
};
export default Singer;