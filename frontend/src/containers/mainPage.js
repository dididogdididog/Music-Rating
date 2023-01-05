import styled from '@emotion/styled';
import { Box, Link, Paper, Stack, Typography, Rating } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Link as RouterLink } from 'react-router-dom';

import axios from 'axios';
import React, { useState, useEffect } from 'react';

const instance = axios.create({
  baseURL: 'http://localhost:4000/api'
})

const MainPage = () => {

  const [hotNewAlbums, setHotNewAlbums] = useState([]);
  const [hotAlbumsOfTheYear, sethotAlbumsOfTheYear] = useState([]);
  //const nowDate = new Date();

  const getMainPageData = async () => {
    //console.log('hello');
    const res = await instance.get('/getMainPage');
    console.log(res.data);
    setHotNewAlbums(res.data.hotNewAlbums);
    sethotAlbumsOfTheYear(res.data.hotAlbumsOfTheYear);
  }

  useEffect(() => {
    getMainPageData()
  }, [])
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const getStar = (score) => {
    if (score > 9) return 5;
    if (score > 8) return 4.5;
    if (score > 7) return 4;
    if (score > 6) return 3.5;
    if (score > 5) return 3;
    if (score > 4) return 2.5;
    if (score > 3) return 2;
    if (score > 2) return 1.5;
    if (score > 1) return 1;
    return 0.5;
  }

  const VerDivBox = styled(Box)({
    textAlign: 'center',
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
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
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack display="flex" alignItems="center">
        <VerDivBox>
          <Box width="100%" padding='20px'>
            <Typography variant='h3' fontWeight="bold">熱門新專</Typography>
          </Box>
          {hotNewAlbums.map(x => (<StyledPaper>
            <Box component="img" src={x.img} sx={{ width: '250px', height: '250px', borderRadius: "5px", cursor: 'pointer', '&: hover': { opacity: 0.8 } }}></Box>
            <Box sx={{ paddingTop: '10px', paddingLeft: '5px', paddingRight: '5px', display: 'flex', justifyContent: 'space-between', width: '250px' }}>
              <Box>
                <Link underline="hover" color="inherit" component={RouterLink} to={`/albums/${x.id}`}>
                  <Typography variant='h5'>
                    {x.albumName}
                  </Typography>
                </Link>
              </Box>
              <Box>
                <Rating name="read-only" value={getStar(x.totalScore / x.usersNumber)} precision={0.5} size='small' readOnly />
                <Typography variant='body2' color='textSecondary'>{`(${x.usersNumber}人評價)`}</Typography>
              </Box>
            </Box>
            <Box sx={{ paddingLeft: '5px' }}>
              <Link underline="hover" color="inherit" component={RouterLink} to={`/singers/${x.singerId}`}>
                <Typography variant='h6' color='textSecondary'>
                  {x.singerName}
                </Typography>
              </Link>
            </Box>
          </StyledPaper>))}
        </VerDivBox>
        <VerDivBox>
          <Box width="100%" padding='20px'>
            <Typography variant='h3' fontWeight="bold">年度熱門專輯</Typography>
          </Box>
          {hotAlbumsOfTheYear.map(x => (<StyledPaper>
            <Box component="img" src={x.img} sx={{ width: '250px', height: '250px', borderRadius: "5px", cursor: 'pointer', '&: hover': { opacity: 0.8 } }}></Box>
            <Box sx={{ paddingTop: '10px', paddingLeft: '5px', paddingRight: '5px', display: 'flex', justifyContent: 'space-between', width: '250px' }}>
              <Box>
                <Link underline="hover" color="inherit" component={RouterLink} to={`/albums/${x.id}`}>
                  <Typography variant='h5'>
                    {x.albumName}
                  </Typography>
                </Link>
              </Box>
              <Box>
                <Rating name="read-only" value={getStar(x.totalScore / x.usersNumber)} precision={0.5} size='small' readOnly />
                <Typography variant='body2' color='textSecondary'>{`(${x.usersNumber}人評價)`}</Typography>
              </Box>
            </Box>
            <Box sx={{ paddingLeft: '5px' }}>
              <Link underline="hover" color="inherit" component={RouterLink} to={`/singers/${x.singerId}`}>
                <Typography variant='h6' color='textSecondary'>
                  {x.singerName}
                </Typography>
              </Link>
            </Box>
          </StyledPaper>))}
          <Box width="100%" padding='20px'>
            <Link underline="hover" color="inherit" component={RouterLink} to="/allAlbumsOfTheYear"><Typography variant='h3' fontWeight="bold">年度專輯列表</Typography></Link>
          </Box>
        </VerDivBox>
      </Stack >
    </ThemeProvider>
  );
}

export default MainPage;