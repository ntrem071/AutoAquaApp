import React, { useEffect } from 'react';
import UserInfo from './UserInfo';
import Cookies from 'js-cookie';
import generalUserIconImage from '../pictures/userImageFishUwU.png';
import { useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  useEffect(() => {
    checkExpiry();
    if(location.pathname=="/Home"){
      document.getElementById('nav-title').innerHTML="AUTO AQUA | Home"
    }else if(location.pathname=="/Fish"){
      document.getElementById('nav-title').innerHTML="AUTO AQUA | Analytics"
    }else if(location.pathname=="/Information"){
      document.getElementById('nav-title').innerHTML="AUTO AQUA | Information"
    }else if(location.pathname=="/Settings"){
      document.getElementById('nav-title').innerHTML="AUTO AQUA | Settings"
    }
  }, []);

  function displayNavSmall(session) {
    const wrapper =document.querySelector('.wrap-nav-dropdown');
    const navDropdown = document.querySelector('.nav-dropdwn');
    if (!expireSesh && !session) {
        setNavDrop(!navDrop);
        if (!navDrop) {
            wrapper.style.display = 'block';
            setTimeout(() => navDropdown.classList.add('active'), 0);
        } else {
            navDropdown.classList.remove('active');
            setTimeout(() => {
                wrapper.style.display = 'none'; 
            }, 300); 
        }
    } else if(expireSesh || session) {
        navDropdown.classList.remove('active');
        setTimeout(() => {
            wrapper.style.display = 'none'; 
        }, 300); 
        setNavDrop(false);
    }
}

  function profileAppear(){
    if(!btnPopup && !expireSesh){
      setBtnPopup(true);
    }else if(btnPopup && !expireSesh){
      document.querySelector('.user-details').setAttribute('close',"");
      document.querySelector('.user-details').addEventListener('animationend',()=>{
          document.querySelector('.user-details').removeAttribute('closing');
          setBtnPopup(false);
      });        
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
function logout(){
  clearTimeout(timer);
  navigate('/');
}
  
  return (
    <div className="navbar">
        <span className='part-of-nav' id='userIcon' title='User Profile' /*src={generalUserIconImage}*/ onClick={profileAppear}>
              <i className='material-icons' id='userIconImage'>
                    person
              </i>
        </span>
        <button id='nav-button' onClick={() =>{displayNavSmall(false)}}></button>
        <div id='nav-title'>AUTO AQUA</div>
        <div classList='part-of-nav' className='wrap-nav-dropdown' id='wrap-nav-dropdown'>
          <div classList='part-of-nav' className="nav-dropdwn">
              <button classList='part-of-nav' id='navhome' variant='contained' title='Home' onClick={() => {clearTimeout(timer);navigate('/Home'); displayNavSmall(false); }}>
                    <h1 classList='part-of-nav' id='nav-text'>Home</h1>
                    &nbsp;
              </button>
              <button classList='part-of-nav' id='navfish' variant='contained' title='Fish Health' onClick={() => {clearTimeout(timer);navigate('/Fish'); displayNavSmall(false); }}>
                    <h1 classList='part-of-nav' id='nav-text'>Fish Analytics</h1>
                    &nbsp;
              </button>
              <button classList='part-of-nav' id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => {clearTimeout(timer);navigate('/Information'); displayNavSmall(false);}}>
                    <h1 classList='part-of-nav' id='nav-text'>Information</h1>
                    &nbsp;
              </button>  
              <button classList='part-of-nav' id='navsettings' variant='contained' title='Settings' onClick={() => {clearTimeout(timer);navigate('/Settings'); displayNavSmall(false); }}>
                    <h1 classList='part-of-nav' id='nav-text'>Settings</h1>
                    &nbsp;
              </button>
          </div> 
        </div>
        <UserInfo trigger={btnPopup} setTrigger={setBtnPopup} displayNavSmall={displayNavSmall} logout={logout}></UserInfo>
        <Session trigger={expireSesh} setTrigger={setExpireSesh} closeNav={displayNavSmall} logout={logout}></Session>
    </div>
    
  );
}

export default Navigation;