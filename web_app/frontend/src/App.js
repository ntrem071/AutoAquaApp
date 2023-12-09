//import logo from './logo.svg';
import './App.css';
import React from 'react';
//import Button from '@material-ui/core/Button';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
//import WebAppRoutes from './WebAppRoutes';
import Create from './components/Create';
import Login from './components/Login';
import Homepage from './components/Homepage';
import UserInfo from './components/UserInfo';
import Fish from './components/Fish';
import Information from './components/Information';
import Settings from './components/Settings';
//import './components/Settings.css';

import userIcon from './pictures/user.png';
import generalUserIconImage from './pictures/userImageFishUwU.png';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/Login');
  }

  const navigatetoCreateAccount = () => {
    navigate('/CreateAccount');
  }

  const [navDrop, setNavDrop] = useState(false);
  const [btnPopup, setBtnPopup] = useState(false);

  function displayNavSmall(){

    if(navDrop){
        document.getElementsByClassName('nav-dropdwn')[0].style.display = 'none';
    }else{
        document.getElementsByClassName('nav-dropdwn')[0].style.display = 'block';
    }
    setNavDrop(!navDrop);
  }

  function profileAppear(){
    setBtnPopup(!btnPopup);
  }

  // function currentPageHome(){
  //   // document.getElementById('navhome').style.backgroundColor = '#08398d';
  //   // document.getElementById('navfish').style.backgroundColor = '#0844ac';
  //   // document.getElementById('navinfo').style.backgroundColor = '#0844ac';
  //   // document.getElementById('navsettings').style.backgroundColor = '#0844ac';
  // }
  // function currentPageFish(){
  //   // document.getElementById('navhome').style.backgroundColor = '#0844ac';
  //   // document.getElementById('navfish').style.backgroundColor = '#08398d';
  //   // document.getElementById('navinfo').style.backgroundColor = '#0844ac';
  //   // document.getElementById('navsettings').style.backgroundColor = '#0844ac';
  // }
  // function currentPageInfo(){
  //   document.getElementById('navhome').style.backgroundColor = '#0844ac';
  //   document.getElementById('navfish').style.backgroundColor = '#0844ac';
  //   document.getElementById('navinfo').style.backgroundColor = '#08398d';
  //   document.getElementById('navsettings').style.backgroundColor = '#0844ac';
  // }
  // function currentPageSettings(){
  //   document.getElementById('navhome').style.backgroundColor = '#0844ac';
  //   document.getElementById('navfish').style.backgroundColor = '#0844ac';
  //   document.getElementById('navinfo').style.backgroundColor = '#0844ac';
  //   document.getElementById('navsettings').style.backgroundColor = '#08398d';
  // }

  return (
    <div className='App'>
      <div id='login'>
        <div className="navbar">
            <span style={{fontFamily:'Courier', color: 'white'}}>Hello Mr. Bubbles! </span>
            <img id='userIcon' src={generalUserIconImage} onClick={profileAppear}></img>
            <button id='nav-button' onClick={displayNavSmall}></button>
            <div className="nav-dropdwn">
                <button id='navhome' variant='contained' title='Home' onClick={() => {navigate('/Home'); displayNavSmall(); /*currentPageHome()*/}}>
                    <h1 id='nav-text'>Home</h1>
                    &nbsp;
                </button>
                <button id='navfish' variant='contained' title='Fish Health' onClick={() => {navigate('/Fish'); displayNavSmall(); /*currentPageFish()*/}}>
                    <h1 id='nav-text'>Fish Analyctics</h1>
                    &nbsp;
                </button>
                <button id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => {navigate('/Information'); displayNavSmall(); /*currentPageInfo()*/}}>
                    <h1 id='nav-text'>Information</h1>
                    &nbsp;
                </button>  
                <button id='navsettings' variant='contained' title='Settings' onClick={() => {navigate('/Settings'); displayNavSmall(); /*currentPageSettings()*/}}>
                    <h1 id='nav-text'>Settings</h1>
                    &nbsp;
                </button>
            </div> 
            <UserInfo trigger={btnPopup}></UserInfo>
        </div>
        <Routes>
          <Route path='/' element={ <Login/> }/>
          <Route path='/CreateAccount' element={ <Create/> }/>
          <Route path='/Home' element={ <Homepage/> }/>
          <Route path='/Fish' element={ <Fish/> }/>
          <Route path='/Information' element={ <Information/> }/>
          <Route path='/Settings' element={ <Settings/> }/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
