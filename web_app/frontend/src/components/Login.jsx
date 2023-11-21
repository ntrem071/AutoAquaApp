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
            var url = 'http://localhost:8000/users/login';
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
                const userId = data.userId
                console.log(userId)
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
                    <h1>Automated Aquaponics</h1>
                    <h2>Login</h2>
                    <div className='Login'>
                        <form id='login'>
                            <label for='inputBox'>Email: </label><br></br>
                            <input
                                type='text'
                                id='email'
                                placeholder='Email'
                                value={email.toString()}
                                onChange={(e) => valuesIn(e, 'email')}
                            /><br/>
                            <label for='inputBox'>Password: </label><br></br>
                            <input
                                type='text'
                                id='password'
                                placeholder='Password'
                                value={password.toString()}
                                onChange={(e) => valuesIn(e, 'password')}
                            /><br/>
                        </form>
                    </div>
                    <button
                        type='button'
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
                    <p id='create'>
                        Don't have an account?&nbsp;&nbsp;
                        <a href='/CreateAccount'>Create</a>
                    </p>
                </div>
                <div className='column' id='image'>
                    <img src={backgroundimg} className='login-img'></img>
                </div>
            </div>
        )
}

export default Login;