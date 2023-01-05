
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import MainPage from "./containers/mainPage.js";
import Album from "./containers/album.js";
import HotNewAlbums from "./containers/hotNewAlbums.js";
import AllAlbumsOfTheYear from "./containers/allAlbumsOfTheYear.js";
import Singer from "./containers/singer.js";
import { useLayoutEffect } from 'react'
import Header from "./containers/header.js";

const Wrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children
}

function App() {
  return (

    <BrowserRouter>
      <Header></Header>
      <Wrapper>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/allAlbumsOfTheYear' element={<AllAlbumsOfTheYear />} />
          <Route path='/albums/:albumId' element={<Album />} />
          <Route path='/singers/:singerId' element={<Singer />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  )
}

export default App;
