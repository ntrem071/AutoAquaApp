import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';

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
            var url = 'http://localhost:8000/users'
            var buf = Buffer.from(email + ':' + password).toString('base64')
            console.log('buffer:', buf)
            var header = {         
                'Content-type': 'application/json',
                'Authorization':'Basic' + buf
            }
            fetch(url, {
                mode: 'no-cors',
                method: 'GET',
                headers: header,
            })
            .then((response => response.json()))
            .then((response) => {
                setMessage(response[0].result);
            })
            .catch(err => {
                setError(err);
                console.log('it is getting caught')
            })
        } else {
            setError('All fields must be filled');
        }
    }
    return(
            <div className='CreateForm'>
                <p>
                    error !== '' ? (
                        <span className='error'>{error.toString()}()</span>
                    ) : (
                        <span className='success'>{message.toString()}</span>
                    )
                </p>
                <h1>Login</h1>
                <h3>
                    <form id='login'>
                        <input
                            type='text'
                            id='email'
                            placeholder='Email'
                            value={email.toString()}
                            onChange={(e) => valuesIn(e, 'email')}
                        /><br/>
                        <input
                            type='password'
                            id='password'
                            placeholder='Password'
                            value={password.toString()}
                            onChange={(e) => valuesIn(e, 'password')}
                        /><br/>
                    </form>
                    <button
                        type='button'
                        className='button'
                        onClick={loginSubmit}
                    >Login
                    </button>
                    <br/>
                    <button 
                        variant='contained' 
                        onClick={() => navigate('CreateAccount')}
                        >Don't have an account?
                    </button>
                </h3>
            </div>
        )
}

export default Login;