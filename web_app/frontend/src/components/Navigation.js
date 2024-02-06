import React, { useEffect } from 'react';
import UserInfo from './UserInfo';
import Cookies from 'js-cookie';
import generalUserIconImage from '../pictures/userImageFishUwU.png';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';
import Session from './Session';

function Navigation() {

  const navigate = useNavigate();
  const [navDrop, setNavDrop] = useState(false);
  const [btnPopup, setBtnPopup] = useState(false);
  const [expireSesh, setExpireSesh] = useState(false);
  const [error, setError] = useState('');
  const sessionId= Cookies.get('sessionId');

  const [timer, setTimer] = useState(null);


  useEffect(() => {
    checkExpiry();
  }, []);

  function displayNavSmall(session){
    if(!session){
        if(navDrop){
          document.getElementsByClassName('nav-dropdwn')[0].style.display = 'none';  
        }else{
          document.getElementsByClassName('nav-dropdwn')[0].style.display = 'block';
        }
        setNavDrop(!navDrop);
    }else{
      document.getElementsByClassName('nav-dropdwn')[0].style.display = 'none';
      setNavDrop(false);
    }
  }

  function profileAppear(){
    if(!btnPopup && !expireSesh){
      setBtnPopup(true);
    }
  }
  function checkExpiry(){
    var url = 'http://localhost:8000/users/'+sessionId+'/session';
    var header = {         
        'Accept': 'application/json',
        'Content-Type': 'application/json'   
    };
    const id = fetch(url, {
        method: 'GET',
        headers: header
    })
    .then((response) => {
        if(response.error) {
            setError(response.error);
            console.log('Error: ', response.error)
        } else {
            return response.json()
        }
    })
    .then(data => {
        clearTimeout(timer);
        console.log(data.expiry);
        if(data.expiry <= 0){
            setExpireSesh(true);
        }else{
            setTimer(setTimeout(checkExpiry, data.expiry)); // new expiry check
        }
    })
    .catch((err) => {
        setError(err);
        console.log(err);
    });
}


  return (
    <div className="navbar">
        <img className='part-of-nav' id='userIcon' src={generalUserIconImage} onClick={profileAppear}></img>
        <button id='nav-button' onClick={() =>{displayNavSmall(false)}}></button>
        <div className="nav-dropdwn">
            <button className='part-of-nav' id='navhome' variant='contained' title='Home' onClick={() => {clearTimeout(timer);navigate('/Home'); displayNavSmall(false); /*currentPageHome()*/}}>
                  <h1 className='part-of-nav' id='nav-text'>Home</h1>
                  &nbsp;
            </button>
            <button className='part-of-nav' id='navfish' variant='contained' title='Fish Health' onClick={() => {clearTimeout(timer);navigate('/Fish'); displayNavSmall(false); /*currentPageFish()*/}}>
                  <h1 id='nav-text'>Fish Analytics</h1>
                  &nbsp;
            </button>
            <button className='part-of-nav' id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => {clearTimeout(timer);navigate('/Information'); displayNavSmall(false); /*currentPageInfo()*/}}>
                  <h1 className='part-of-nav' id='nav-text'>Information</h1>
                  &nbsp;
            </button>  
            <button className='part-of-nav' id='navsettings' variant='contained' title='Settings' onClick={() => {clearTimeout(timer);navigate('/Settings'); displayNavSmall(false); /*currentPageSettings()*/}}>
                  <h1 className='part-of-nav' id='nav-text'>Settings</h1>
                  &nbsp;
            </button>
        </div> 
        <UserInfo trigger={btnPopup} setTrigger={setBtnPopup}></UserInfo>
        <Session trigger={expireSesh} setTrigger={setExpireSesh} closeNav={displayNavSmall}></Session>
    </div>
    
  );
}

export default Navigation;