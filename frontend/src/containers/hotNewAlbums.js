import styled from '@emotion/styled';
import { Box, Link, Paper, Stack, Typography, Rating } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Link as RouterLink } from 'react-router-dom';
import BasicSelect from '../components/basicSelect.js';

import db from '../db.js';

const HotNewAlbums = () => {
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
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack display="flex" alignItems="center">
        <VerDivBox>
          <Box sx={{ width: "100%", display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
            <Box sx={{ width: '25%' }}></Box>
            <Typography variant='h3' fontWeight="bold">熱門新專</Typography>
            <Box sx={{ width: '25%', display: 'flex', alignItems: 'center' }}>
              <Typography variant='body1' sx={{ paddingRight: '20px' }}> 排序:</Typography>
              <BasicSelect></BasicSelect>
            </Box>
          </Box>
          {db.slice(0, 50).map(x => (<StyledPaper>
            <Box component="img" src={x.img} sx={{ borderRadius: "5px", cursor: 'pointer', '&: hover': { opacity: 0.8 } }}></Box>
            <Box sx={{ paddingTop: '10px', paddingLeft: '5px', paddingRight: '5px', display: 'flex', justifyContent: 'space-between', width: '250px' }}>
              <Box>
                <Link underline="hover" color="inherit" component={RouterLink} to="/albums/5">
                  <Typography variant='h5'>
                    {x.name}
                  </Typography>
                </Link>
              </Box>
              <Box>
                <Rating name="read-only" value={4.5} precision={0.5} size='small' readOnly />
                <Typography variant='body2' color='textSecondary'>(700人評價)</Typography>
              </Box>
            </Box>
            <Box sx={{ paddingLeft: '5px' }}>
              <Link underline="hover" color="inherit" component={RouterLink} to="/singers/5">
                <Typography variant='h6' color='textSecondary'>
                  {x.singer}
                </Typography>
              </Link>
            </Box>
          </StyledPaper>))}
        </VerDivBox>
      </Stack >
    </ThemeProvider >
  );
}

export default HotNewAlbums;