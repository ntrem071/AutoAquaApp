import React from 'react';
import UserInfo from './UserInfo';
import generalUserIconImage from '../pictures/userImageFishUwU.png';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation() {

  const navigate = useNavigate();
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

  return (
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
  );
}

export default Navigation;