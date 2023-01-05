import styled from '@emotion/styled';
import { Box, Link, Paper, Stack, Typography, Rating, Chip, Divider, Avatar, IconButton, TextField, Button, Tooltip, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Container } from '@mui/system';
import { Bard as Bar } from '../components/chartBar.js';

import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import db from '../db.js';
import { useUser } from './useUser.js';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


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
const getDateSubtract = (commentDate) => {
  const diffSecond = Math.abs((new Date()) - Date.parse(commentDate)) / 1000;
  if (diffSecond < 60) return "剛剛"
  if (diffSecond < 60 * 60) return `${Math.floor(diffSecond / 60)}分鐘前`
  if (diffSecond < 60 * 60 * 24) return `${Math.floor(diffSecond / 60 / 60)}小時前`
  if (diffSecond < 60 * 60 * 24 * 30.437) return `${Math.floor(diffSecond / 60 / 60 / 24)}天前`
  if (diffSecond < 60 * 60 * 24 * 365.25) return `${Math.floor(diffSecond / 60 / 60 / 24 / 30.437)}個月前`
  return `${Math.floor(diffSecond / 60 / 60 / 24 / 365.25)}年前`
}
const addScores = (users, score) => {
  const usersCopy = [...users];
  usersCopy[score - 1] = usersCopy[score - 1] + 1;
  return usersCopy;
}
const deleteScores = (users, score) => {
  const usersCopy = [...users];
  usersCopy[score - 1] = usersCopy[score - 1] - 1;
  return usersCopy;
}

const Album = () => {
  const { albumId } = useParams();
  const [albumData, setAlbumData] = useState({});

  const { userName, islogIn } = useUser()
  const [myComment, setMyComment] = useState({ body: '', date: '', score: 0 });
  const [hasComment, setHasComment] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [stars, setStars] = useState(0);

  const [singerOtherAlbums, setSingerOtherAlbums] = useState([]);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    getAlbumData(albumId);
  }, [albumId]);

  const inputRef = useRef();

  const getAlbumData = async (albumId) => {
    const res = await instance.get('/getAlbumData', { params: { albumId } });
    console.log(res.data.message);
    setAlbumData(res.data.album);
    const myUserFind = res.data.album.users.find(user => user.name === userName)
    if (myUserFind) {
      setHasComment(true);
      setMyComment({ body: myUserFind.comment, date: myUserFind.date, score: myUserFind.score });
    }
    getSingerData(res.data.album.singerId)
  }
  const getSingerData = async (singerId) => {
    const res = await instance.get('/getSingerData', { params: { singerId } });
    setSingerOtherAlbums(res.data.singer.albums);
  }
  const postAlbumData = async (body, date, score) => {
    const res = await instance.post('/postComment', {
      albumId: albumData.id,
      userName: userName,
      comment: body,
      date,
      score,
    });
    return res.data.message;
  };
  const deleteAlbumData = async () => {
    const res = await instance.post('/deleteComment', {
      albumId: albumData.id,
      userName: userName
    });
    console.log(res.data.message);
  }

  const handleCommentSubmit = async (e) => {

    const body = inputRef.current.value;
    const date = Date();
    const userScore = stars * 2;
    const totalScore = albumData.totalScore + stars * 2;
    const scores = addScores(albumData.scores, stars * 2);
    const usersNumber = albumData.usersNumber + 1;
    if (userScore === 0) {
      setSnackMessage("星數須大於零")
      setSnackOpen(true);
      return
    }
    const message = await postAlbumData(body, date, userScore);
    console.log(message);
    if (message === "already exist") {
      setSnackMessage("你已評價過這張專輯")
      setSnackOpen(true);
    } else {
      setHasComment(true);
      setMyComment({ body, date, score: userScore })
      setAlbumData({ ...albumData, totalScore, scores, usersNumber })
      inputRef.current.value = '';
    }


  }
  const handleCommentCancel = (e) => {
    inputRef.current.value = '';
  }

  const handleDeleteButton = (e) => {
    setOpenDialog(true);
  }
  const handleDialogYes = (e) => {
    setOpenDialog(false);
    setHasComment(false);
    setMyComment({ body: '', date: '', score: 0 })
    setAlbumData({
      ...albumData,
      totalScore: (albumData.totalScore - stars * 2),
      scores: deleteScores(albumData.scores, stars * 2),
      usersNumber: albumData.usersNumber - 1
    })
    deleteAlbumData();
  }
  const handleDialogNo = (e) => {
    setOpenDialog(false);
  }
  const handleStars = (e) => {
    setStars(e.target.value);
  }
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ maxWidth: '1700px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
          <img src={albumData.img} alt="圖片" />
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box sx={{ paddingTop: '30px', paddingLeft: '30px', paddingRight: '30px', paddingBottom: '10px', width: '100%', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h3'>{albumData.albumName}</Typography>
                  <Box sx={{ paddingLeft: 2 }}><Chip label={albumData.albumType} sx={{ borderRadius: '5px' }}></Chip></Box>
                </Box>
                <Typography variant='h5' color='textSecondary'>{albumData.singerName}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '100px', flexWrap: 'nowrap' }}>
                  <Rating name="read-only" value={getStar(Math.round(albumData.totalScore / albumData.usersNumber * 10) / 10)} precision={0.5} size='large' readOnly />
                  <Typography variant='h6' sx={{ ml: 2 }}>{Math.round(albumData.totalScore / albumData.usersNumber * 10) / 10}/10.0</Typography>
                  <Typography variant='h7' sx={{ ml: 2 }} color='textSecondary'>({albumData.usersNumber}個評價)</Typography>
                </Box>

              </Box>
              <Box  >
                <Typography variant='h6' color='textSecondary'>專輯名稱: {albumData.albumName}</Typography>
                <Typography variant='h6' color='textSecondary'>歌手: {albumData.singerName}</Typography>
                <Typography variant='h6' color='textSecondary'>類型: {albumData.albumType}</Typography>
                <Typography variant='h6' color='textSecondary'>發行日期: {new Date(albumData.publishDate).getFullYear()}/{new Date(albumData.publishDate).getMonth() + 1}/{new Date(albumData.publishDate).getDate()}</Typography>
                <Typography variant='h6' color='textSecondary'>發行公司: {albumData.publishCompany}</Typography>
              </Box>
            </Box>
            <Divider orientation='vertical' variant='middle' sx={{ borderBottomWidth: 2 }}></Divider>
            <Box sx={{ minWidth: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant='h4' color='textSecondary' paddingLeft='20px'>統計</Typography>
              {Bar(albumData.scores)}
            </Box>
          </Box>
        </Box>
        <Divider sx={{ borderBottomWidth: 5 }}></Divider>
        <Box sx={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'Center' }}>
            <Typography variant='h4'>評論</Typography>
            <Typography variant='h5' color='textSecondary'>({albumData.usersNumber}則)</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{
              width: '100%', minWidth: '500px', maxHeight: '1000px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1, "&::-webkit-scrollbar": {
                width: '10px'
              },
              "&::-webkit-scrollbar-track": {
                //backgroundColor: "orange"
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: ' #ffffff4d',
                borderRadius: '5px'
              }
            }}>
              {islogIn ?
                hasComment ?
                  <>
                    <Paper sx={{ padding: '20px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                        <Avatar sx={{ width: '50px', height: '50px' }}><Typography variant='h6'>S</Typography></Avatar>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                            <Box>
                              <Typography variant='h6' fontWeight='bold'>{userName}</Typography>
                              <Typography variant='body2' color='textSecondary'>{getDateSubtract(myComment.date)}</Typography>
                            </Box>
                            <Rating name="read-only" value={getStar(myComment.score)} precision={0.5} readOnly />
                            <Box>
                              <Typography variant='h6'>{myComment.score}/10</Typography>
                            </Box>
                          </Box>
                          <Typography variant='subtitle1'>{myComment.body}</Typography>
                          <IconButton><ThumbUpOffAltIcon /></IconButton>
                          <IconButton><ThumbDownOffAltIcon /></IconButton>
                        </Box>
                        <Box>
                          <Tooltip title="Delete" placement='top'><IconButton onClick={handleDeleteButton} sx={{ color: "text.secondary" }}><DeleteIcon></DeleteIcon></IconButton></Tooltip>
                          <Dialog open={openDialog} onClose={() => { }} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">刪除留言?</DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">是否要刪除留言?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleDialogNo}>否</Button>
                              <Button onClick={handleDialogYes} autoFocus>是</Button>
                            </DialogActions>
                          </Dialog>
                        </Box>
                      </Box>
                    </Paper>
                  </> :
                  <>
                    <Paper sx={{ padding: '20px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                        <Avatar sx={{ width: '50px', height: '50px' }}><Typography variant='h6'>S</Typography></Avatar>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                            <Box>
                              <Typography variant='h6' fontWeight='bold'>{userName}</Typography>
                            </Box>
                            <Rating name="half-rating" value={stars} onChange={handleStars} precision={0.5} size='large' />
                            <Box>
                              <Typography variant='h6'>{stars * 2}/10</Typography>
                            </Box>
                          </Box>
                          <TextField inputRef={inputRef} multiline variant='standard' placeholder='輸入評論...' margin='dense' fullWidth />
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={handleCommentSubmit} variant="contained" sx={{ borderRadius: '20px' }}>發送</Button>
                            <Button onClick={handleCommentCancel} variant="outlined" sx={{ borderRadius: '20px' }}>取消</Button>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </>
                : <></>
              }
              <Box sx={{ padding: '20px' }}><Divider><Typography variant='subtitle1' color='textSecondary'>其他評論</Typography></Divider></Box>

              {albumData.users !== undefined ? (albumData.users.map((user) => (
                <Paper sx={{ padding: '20px' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Avatar sx={{ width: '50px', height: '50px' }}><Typography variant='h6'>S</Typography></Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                        <Box>
                          <Typography variant='h6' fontWeight='bold'>{user.name}</Typography>
                          <Typography variant='body2' color='textSecondary'>{getDateSubtract(user.date)}</Typography>
                        </Box>
                        <Rating name="read-only" value={getStar(user.score)} precision={0.5} readOnly />
                      </Box>
                      <Typography variant='subtitle1'>{user.comment}</Typography>
                      <IconButton><ThumbUpOffAltIcon /></IconButton>
                      <IconButton><ThumbDownOffAltIcon /></IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))) : <></>}

            </Box>
            <Box sx={{ backgroundColor: 'black', width: '500px', minWidth: '500px', height: '300px' }}></Box>
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
            {singerOtherAlbums.map(album => (<StyledPaper>
              <Box component="img" src={album.img} sx={{ width: '250px', height: '250px', borderRadius: "5px", cursor: 'pointer', '&: hover': { opacity: 0.8 } }}></Box>
              <Box sx={{ paddingTop: '10px', paddingLeft: '5px', paddingRight: '5px', display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                <Box>
                  <Link underline="hover" color="inherit" component={RouterLink} to={`/albums/${album.id}`}>
                    <Typography variant='h5'>
                      {album.name}
                    </Typography>
                  </Link>
                </Box>
                <Box>
                  <Rating name="read-only" value={getStar(album.totalScore / album.usersNumber)} precision={0.5} size='small' readOnly />
                  <Typography variant='body2' color='textSecondary'>{`(${album.usersNumber}人評價)`}</Typography>
                </Box>
              </Box>

              <Box sx={{ height: '50px', }}>
                <Link underline="hover" color="inherit" component={RouterLink} to={`/singers/${albumData.singerId}`}>
                  <Typography variant='h6' color='textSecondary'>
                    {albumData.singerName}
                  </Typography>
                </Link>
              </Box>
            </StyledPaper>))}
          </VerDivBox>
        </Box>

      </Container>
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider >
  )
};
export default Album;