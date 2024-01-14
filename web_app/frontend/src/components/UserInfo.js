import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';
import userIcon from '../pictures/user.png';
import generalUserIconImage from '../pictures/userImageFishUwU.png';

function UserInfo(props) {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [error, setError] = useState('');

    useEffect(() => {
        setValues(); 
    }, []);

    function nav(str){
        document.cookie = `sessionId=${sessionId}`
        navigate(str)
    }

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

        nav('/');
    }

    return(props.trigger) ? (
        <div className='user-details'>
            <div className='infoUser'>
                <h3 style={{textAlign:'center'}}>Profile</h3>
                <span id='ntitle'>Name: </span><span>{name}</span>
                <br></br>
                <br></br>
                <span id='etitle'>Email: </span><span>{email}</span>
                <br></br>
                <br></br>
            </div>
            <button type='Sbutton' id='use-logout' onClick={logout}>Logout</button>
        </div>                      
    ) : "";
}

export default UserInfo;