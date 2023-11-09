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
            var url = 'http://localhost:8000/users/login';
            //var buf = Buffer.from(email + ':' + password).toString('base64');
            var header = {         
                //'Authorization':'Basic ' + buf,
                'Accept': 'application/json',
                'Content-type': 'application/json'   
            };
            var data = {
                email: email,
                password: password
            };
            fetch(url, {
                mode: 'cors',
                method: 'POST',
                headers: header,
                body: JSON.stringify(data)
            })
            .then((response) => {
                console.log(response)
                return response.json()
            })
            .then((response) => {
                setMessage(response[0].result);
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
            <div className='CreateForm'>
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