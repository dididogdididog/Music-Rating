import styled from '@emotion/styled';
import { Box, Link, Paper, Stack, Typography, Rating, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Link as RouterLink } from 'react-router-dom';
//import BasicSelect from '../components/basicSelect.js';
import React, { useState, useEffect } from 'react'
import axios from 'axios';

import db from '../db.js';

const AllAlbumsOfTheYear = () => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const VerDivBox = styled(Box)({
    textAlign: 'center',
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: '29px',
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

  const instance = axios.create({
    baseURL: 'http://localhost:4000/api'
  })

  const [item, setItem] = useState("熱門");
  const [allAlbums, setAllAlbums] = useState([]);
  const handleSelectChange = (e) => {
    console.log('Change');
    setItem(e.target.value);
  }
  const getAllAlbum = async () => {
    const res = await instance.get('/getAllAlbums', { params: { item } });
    console.log(res.data.allAlbums);
    setAllAlbums(res.data.allAlbums);
  }
  useEffect(() => {
    getAllAlbum();
  }, [item])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack display="flex" alignItems="center" paddingTop='20px'>
        <VerDivBox>
          <Box sx={{ width: "100%", display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
            <Box sx={{ width: '25%' }}></Box>
            <Typography variant='h3' fontWeight="bold">年度專輯列表</Typography>
            <Box sx={{ width: '25%', display: 'flex', alignItems: 'center' }}>
              <Typography variant='body1' sx={{ paddingRight: '20px' }}> 排序:</Typography>
              <Box sx={{ minWidth: 120, width: 150 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label"></InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={item}
                    onChange={handleSelectChange}
                    sx={{ borderRadius: '30px' }}
                  >
                    <MenuItem value={"最新"}>最新</MenuItem>
                    <MenuItem value={"最佳"}>最佳</MenuItem>
                    <MenuItem value={"熱門"}>熱門</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
          {allAlbums.map(album => (<StyledPaper>
            <Box component="img" src={album.img} sx={{ width: '250px', height: '250px', borderRadius: "5px", cursor: 'pointer', '&: hover': { opacity: 0.8 } }}></Box>
            <Box sx={{ paddingTop: '10px', paddingLeft: '5px', paddingRight: '5px', display: 'flex', justifyContent: 'space-between', width: '250px' }}>
              <Box>
                <Link underline="hover" color="inherit" component={RouterLink} to={`/albums/${album.id}`}>
                  <Typography variant='h5'>
                    {album.albumName}
                  </Typography>
                </Link>
              </Box>
              <Box>
                <Rating name="read-only" value={getStar(album.totalScore / album.usersNumber)} precision={0.5} size='small' readOnly />
                <Typography variant='body2' color='textSecondary'>({album.usersNumber}人評價)</Typography>
              </Box>
            </Box>
            <Box sx={{ paddingLeft: '5px' }}>
              <Link underline="hover" color="inherit" component={RouterLink} to={`/singers/${album.singerId}`}>
                <Typography variant='h6' color='textSecondary'>
                  {album.singerName}
                </Typography>
              </Link>
            </Box>
          </StyledPaper>))}
        </VerDivBox>
      </Stack >
    </ThemeProvider>
  );
}

export default AllAlbumsOfTheYear;