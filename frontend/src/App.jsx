import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUP from './components/SignUp'
import Playlist from './components/Playlist'
import Artist from './components/Artist'
import Profile from './components/Profile'
import PrivateSong from './components/Private'
import Party from './components/Party'
function App() {
  
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/home' element={<Home></Home>}></Route>
      <Route path='/' element={<SignIn></SignIn>}></Route>
      <Route path='/signup' element={<SignUP></SignUP>}></Route>
      <Route path='/playlist' element={<Playlist></Playlist>}></Route>
      <Route path='/artist' element={<Artist></Artist>}></Route>
      <Route path='/profile' element={<Profile></Profile>}></Route>
      <Route path='/private' element={<PrivateSong></PrivateSong>}></Route>
      <Route path='/party' element={<Party></Party>}></Route>

     </Routes>
     
     </BrowserRouter>
      
    </>
  )
  

}

export default App
