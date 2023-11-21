import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import './Login.css'
import backgroundimg from '../pictures/fishlogin.jpg'

function Login() {
    const navigate = useNavigate();

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const[message, setMessage] = useState('');


    const valuesIn = (e, type) => {
        switch(type){
            case 'email':
                setEmail(e.target.value);
                if (e.target.value == ''){
                    setError('Email needed');
                }
                break;
            case 'password':
                setPassword(e.target.value);
                if (e.target.value == ''){
                    setError('Password needed');
                }
        }
    }

    function loginSubmit(){
        if((password !== '') && (email !== '')){
            var url = 'http://localhost:8000/users/na/login';
            //var buf = Buffer.from(email + ':' + password).toString('base64');
            var header = {         
                //'Authorization':'Basic ' + buf,
                'Accept': 'application/json',
                'Content-Type': 'application/json'   
            };
            var data = {
                email: email,
                password: password
            };
            const id = fetch(url, {
                method: 'POST',
                headers: header,
                body: JSON.stringify(data)
            })
            .then((response) => {
                // return response.json()
                if(response.error) {
                    setError(response.error);
                    console.log('Error: ', response.error)
                } else {
                    return response.json()
                }
            })
            .then(data => {
                const sessionId = data.sessionId
                if(sessionId) {
                    navigate('/Home');
                }
            })
            .catch((err) => {
                setError(err);
                console.log(err);
            });
        } else {
            setError('All fields must be filled');
        }
    }

    return(
            <div className='row'>
                <div className='column'>
                    <h1 id='lh1'>Automated Aquaponics</h1>
                    <h2 id='lh2'>Login</h2>
                    <div className='Login'>
                        <form id='login'>
                            <label id='ll1' for='inputBox'>Email: </label><br></br>
                            <input
                                type='text'
                                id='lt1'
                                placeholder='Email'
                                value={email.toString()}
                                onChange={(e) => valuesIn(e, 'email')}
                            /><br/>
                            <label id='ll1' for='inputBox'>Password: </label><br></br>
                            <input
                                type='text'
                                id='lt1'
                                placeholder='Password'
                                value={password.toString()}
                                onChange={(e) => valuesIn(e, 'password')}
                            /><br/>
                        </form>
                    </div>
                    <button
                        type='button'
                        id = 'lb1'
                        className='button'
                        onClick={loginSubmit}
                    >Login
                    </button>
                    <br/>
                    {/* <button 
                        variant='contained' 
                        onClick={() => navigate('CreateAccount')}
                        >Don't have an account?
                    </button> */}
                    <p id ='lp1'>
                        Don't have an account?&nbsp;&nbsp;
                        <a id = 'la1' href='/CreateAccount'>Create</a>
                    </p>
                </div>
                <div className='column' id='image'>
                    <img src={backgroundimg} className='login-img'></img>
                </div>
            </div>
        )
}

export default Login;