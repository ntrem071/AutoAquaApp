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
        var url = 'http://localhost:8000/users/'+sessionId+'/user';
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

        var url = 'http://localhost:8000/users/'+sessionId+'/logout/app';
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
    function exit(){
        document.querySelector('.user-details').setAttribute('close',"");
        document.querySelector('.user-details').addEventListener('animationend',()=>{
            document.querySelector('.user-details').removeAttribute('closing');
            props.setTrigger(false); 
        });        
    }
    
    useEffect(() => {
        document.onclick = function(div){
        if(((document.getElementById('user-details')!==null) && div.target.id !== 'user-details' && div.target.id !== 'userIcon')){
            exit();
        }
        }
      }, []);

    return(props.trigger) ? (
            <div className='user-details' id='user-details'>
                <h3 id='user-details' style={{textAlign:'center'}}>Profile</h3>
                <span id='user-details' className='ntitle'>Name: </span><span id='user-details'>{name}</span>
                <br></br>
                <br></br>
                <span id='user-details' className='etitle'>Email: </span><span id='user-details'>{email}</span>
                <br></br>
                <br></br>
                <div id='user-details' className='wrap-logout'>
                    <button id='user-details' type='Sbutton' className='use-logout' onClick={logout}>Logout</button>
                </div>
            </div>                    
    ) : "";
}

export default UserInfo;