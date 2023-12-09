import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';
import userIcon from '../pictures/user.png';
import generalUserIconImage from '../pictures/userImageFishUwU.png';

function UserInfo() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [error, setError] = useState('');

    var navDrop = false;

    useEffect(() => {
        setValues(); 
    }, []);

    function setValues(){
        var url = 'http://localhost:8000/users/'+sessionId;
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
            if((!(data.name==null))){setName(data.name);}
            if((!(data.email==null))){setEmail(data.email);}
            
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }

    function logout(){

        var url = 'http://localhost:8000/users/'+sessionId+'/logout';
        var header = {         
            'Accept': 'application/json',
            'Content-Type': 'application/json'   
        };
        const id = fetch(url, {
            method: 'POST',
            headers: header
        })
        .then((response) => {
            if(response.error) {
                setError(response.error);
                console.log('Error: ', response.error)
            }
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });

        navigate('/');
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
        <div id='user-info'>
                <div className="navbar">
                    <span style={{fontFamily:'Courier', color: 'white'}}>Hello Mr. Bubbles! </span>
                    <img id='userIcon' src={generalUserIconImage}></img>
                    <button id='nav-button' onClick={displayNavSmall}></button>
                    <div className="nav-dropdwn">
                        <button id='navhome' variant='contained' title='Home' onClick={() => navigate('/Home')}>
                            <h1 id='nav-text'>Home</h1>
                            &nbsp;
                        </button>  
                        <button id='navuser' style={{backgroundColor: "#08398d"}} variant='contained' title='User Info' onClick={() => navigate('/User-Info')}>
                            <h1 id='nav-text'>Account</h1>
                            &nbsp;
                        </button> 
                        <button id='navfish' variant='contained' title='Fish Health' onClick={() => navigate('/Fish')}>
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
                <h1>User Info</h1>
                <h3>
                    <div className='nav'>
                        <button id='navhome' variant='contained' onClick={() => navigate('/Home')}>&nbsp;</button>
                        <button id='navuser' style={{backgroundColor: "#08398d"}} variant='contained' onClick={() => navigate('/User-Info')}>&nbsp;</button>
                        <button id='navfish' variant='contained' onClick={() => navigate('/Fish')}>&nbsp;</button>
                        <button id='navinfo' variant='contained' onClick={() => navigate('/Information')}>&nbsp;</button>
                        <button id='navsettings' variant='contained' onClick={() => navigate('/Settings')}>&nbsp;</button>
                    </div>
                    <div className='user-details'>
                        <p id='ntitle'>Name: {name}</p>
                        <p id='etitle'>Email: {email}</p>
                        <button type='button' id='use-logout' onClick={logout}>Logout</button>
                    </div>
                </h3>
        </div>                       

    );
}

export default UserInfo;