import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import userIcon from '../pictures/user.png';
import generalUserIconImage from '../pictures/userImageFishUwU.png';
import './Fish.css';


function Fish() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    var navDrop = false;

    function nav(str){
        document.cookie = `sessionId=${sessionId}`
        navigate(str)
    }

    function displayNavSmall(){

        if(navDrop){
            document.getElementsByClassName('nav-dropdwn')[0].style.display = 'none';
        }else{
            document.getElementsByClassName('nav-dropdwn')[0].style.display = 'block';
        }
        
        navDrop = !navDrop;
    }

    return(
        <div id='fish-analyctics'>
            <div className="navbar">
                <span style={{fontFamily:'Courier', color: 'white'}}>Hello Mr. Bubbles! </span>
                <img id='userIcon' src={generalUserIconImage}></img>
                <button id='nav-button' onClick={displayNavSmall}></button>
                <div className="nav-dropdwn">
                    <button id='navhome' variant='contained' title='Home' onClick={() => navigate('/Home')}>
                        <h1 id='nav-text'>Home</h1>
                        &nbsp;
                    </button>  
                    <button id='navuser' variant='contained' title='User Info' onClick={() => navigate('/User-Info')}>
                        <h1 id='nav-text'>Account</h1>
                        &nbsp;
                    </button> 
                    <button id='navfish' style={{backgroundColor: "#08398d"}} variant='contained' title='Fish Health' onClick={() => navigate('/Fish')}>
                        <h1 id='nav-text'>Fish Analyctics</h1>
                        &nbsp;
                    </button>
                    <button id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => navigate('/Information')}>
                        <h1 id='nav-text'>Information</h1>
                        &nbsp;
                    </button>  
                    <button id='navsettings' variant='contained' title='Settings' onClick={() => navigate('/Settings')}>
                        <h1 id='nav-text'>Settings</h1>
                        &nbsp;
                    </button>
                </div> 
            </div>
            <h1>Fish Behavior</h1>
            <h3>
                <div className='nav'>
                    <button id='navhome' variant='contained' title='Home' onClick={() => nav('/Home')}>&nbsp;</button>
                    <button id='navuser' variant='contained' title='User Info' onClick={() => nav('/User-Info')}>&nbsp;</button>
                    <button id='navfish' style={{backgroundColor: "#08398d"}} variant='contained' title='Fish Health' onClick={() => nav('/Fish')}>&nbsp;</button>
                    <button id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => nav('/Information')}>&nbsp;</button>
                    <button id='navsettings' variant='contained' title='Settings' onClick={() => nav('/Settings')}>&nbsp;</button>
                </div>
                <div id='m'>
                    <p id='model'>ML Model Undergoing Developement...</p>
                </div>
            </h3>
        </div>
    );
}

export default Fish;