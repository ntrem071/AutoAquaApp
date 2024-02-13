import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import './UserInfo.css';
import './Navigation.css';
import userIcon from '../pictures/user.png';
import generalUserIconImage from '../pictures/userImageFishUwU.png';

function UserInfo(props) {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [error, setError] = useState('');
    const location=useLocation();
    
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
        props.logout();
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
                if(((document.getElementById('user-details')!==null) && div.target.id !== 'user-details' && div.target.id !== 'userIcon' && div.target.id != 'userIconImage')){
                    exit();
                }if(((document.getElementById('wrap-nav-dropdown').style.display=='block') && div.target.classList !== 'part-of-nav' && div.target.id != 'nav-button')){     
                    props.displayNavSmall(true);
                }
        }
        return () => {
            document.onclick = null;
        };
      }, []);

    return(props.trigger) ? (
            <div className='user-details' id='user-details'>
                <h3 id='user-details' style={{textAlign:'center'}}>User Profile</h3>
                <div className="wrap-ne" id="user-details">
                    <div id='wrap-line-ui'><span id='user-details' className='ntitle'>Name: </span><span id='user-details'>{name}</span></div>
                    <div id='wrap-line-ui'><span id='user-details' className='etitle'>Email: </span><span id='user-details'>{email}</span></div>
                    <div id='user-details' className='wrap-logout'>
                        <button id='user-details' type='Sbutton' className='use-logout' onClick={logout}>Logout</button>
                    </div>
                </div>     
            </div>                    
    ) : "";
}

export default UserInfo;