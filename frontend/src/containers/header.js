import { Button, Box, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState } from 'react';
import { useUser } from './useUser';
import { useNavigate } from 'react-router-dom';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


export default function Header() {
  const { setUserName, setIsLogIn, islogIn, userName } = useUser()
  const [open, setOpen] = useState(false);
  const [textFieldInput, setTextFieldInput] = useState("");
  const navigate = useNavigate();

  const handleLogInButton = () => {
    setOpen(true);
  }
  const handleLogOutButton = () => {
    setIsLogIn(false);
    setUserName("");
  }
  const handleLogInDialogClose = () => {
    setOpen(false);
  }
  const handleLogInDialogInput = () => {
    console.log(textFieldInput);
    setUserName(textFieldInput);
    setIsLogIn(true);
    setOpen(false);
  }
  const goHome = () => {
    navigate("/");
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline></CssBaseline>
      {islogIn ?
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ padding: '10px' }}>
            <Button variant="outlined" onClick={goHome}>
              Home
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountCircleIcon /><Typography variant='h5' paddingLeft="5px" paddingRight="5px">{userName}</Typography>
          </Box>
        </Box>
        :
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ padding: '10px' }}>
            <Button variant="outlined" onClick={goHome}>
              Home
            </Button>
          </Box>
          <Box sx={{ padding: '10px' }}>
            <Button variant="outlined" endIcon={<LoginIcon />} onClick={handleLogInButton}>
              ??????
            </Button>
            <Dialog open={open} onClose={handleLogInDialogClose}>
              <DialogTitle>??????</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  ???????????????????????????????????????
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="???????????????"
                  type="userName"
                  fullWidth
                  variant="standard"
                  value={textFieldInput}
                  onChange={(e) => { setTextFieldInput(e.target.value) }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleLogInDialogClose}>??????</Button>
                <Button onClick={handleLogInDialogInput}>??????</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>}
    </ThemeProvider>
  )
}