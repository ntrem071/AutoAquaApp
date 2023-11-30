import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import './Create.css'
import backgroundimg from '../pictures/fishlogin.jpg'

function Create() {
   const navigate = useNavigate();  

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setTimeout(function(){
            setMessage('');
        }, 2000);
    }, [message]);

    useEffect(() => {
        if(error) {
            console.log('Validation failed in useEffect');
        }
    }, [error]);

    const handleInputChange = (e, type) => {
        switch(type){
            case 'name':
                setError('');
                setName(e.target.value);
                if (e.target.value === '') {
                    setError('Name has been left blank')
                }
                break;
            case 'email':
                setError('');
                setEmail(e.target.value);
                if (e.target.value === '') {
                    setError('Email has been left blank')
                } //else {
                //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                //     if (!emailRegex.test(e.target.value)) {
                //         setError('Invalid email format');
                //         console.log('Invalid email format');
                //     } else {
                //         console.log('Email format is valid');
                //     }
                //     console.log('Error: ', error);
                // }
                break;
            case 'password':
                setError('');
                setPassword(e.target.value);
                if (e.target.value === '') {
                    setError('Password has been left blank')
                }
                break;
            case 'cpassword':
                setError('')
                setCPassword(e.target.value);
                if (password !== e.target.value){
                    setError('Passwords do not match')
                } else if (e.target.value === ''){
                    setError('Password has been left blank')
                }
                break;
                default:
        }
    }

    const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      };

// connects frontend to backend
    function createSubmit(){
        const validate = validateEmail(email);
        console.log(name)
        console.log(email)
        console.log(password)
        console.log('Boolean: ', validate && (name !== '') && (email !== '') && (password !== '') && (password === cpassword))
         if(validate && (name !== '') && (email !== '') && (password !== '') && (password === cpassword)){
            console.log('Validate: ',validate[0]);
            if(validate[0]){
                var url = 'http://localhost:8000/users/na/create';
                var headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                };
                var data = {
                    name: name,
                    email: email,
                    password: password
                };
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data)
                })
                .then((response) => {
                    console.log('Server response: ', response)
                    // if(!response.ok) {
                    //     console.log('Response is not okay');
                    // }
                    return response.json();
                })
                .then(navigate('/'))
                .catch((err) => {
                    setError(err.message);
                    console.log('Fetch error: ', err);
                });
            } else {
                setError('Email must be valid');
            }
        } else {
            setError('All fields must be filled')
        }
    }

    function goback() {
        navigate('/')
    }

    return(
        <div id='container'>
            <div id='create-column'>
                <h1 id='ch1'>Create your account!</h1>
                {/* <h2 id='ch2'>Test</h2> */}
                <div id='Create'>
                    <form id='create'>
                        {/* <div id='error-message'>
                            {error && <p id='error'>{error}</p>}
                        </div> */}
                        <div id='name'>
                            <label id='name-title' htmlFor='inputBox'>
                                Name:{' '}
                            </label>
                            <br/>
                            <input
                                type="text" 
                                id="cf" 
                                placeholder="name" 
                                value={name.toString()}
                                onChange={(e) => handleInputChange(e, 'name')}
                            />
                        </div><br/>
                        <div id='email'>
                            <label id='email-title' htmlFor='inputBox'>
                                Email:{' '}
                            </label>
                            <br/>
                            <input
                                type="email" 
                                id="cf" 
                                placeholder="email" 
                                value={email.toString()}
                                onChange={(e) => handleInputChange(e, 'email')}
                                pattern='.+@example\.com'
                                required
                            />
                        </div><br/>
                        <div id='password'>
                            <label id='password-title' htmlFor='inputBox'>
                                Password:{' '}
                            </label>
                            <br/>
                            <input
                                type="password" 
                                id="cf" 
                                placeholder="password" 
                                value={password.toString()}
                                onChange={(e) => handleInputChange(e, 'password')}
                            />
                        </div><br/>
                        <div id='confirm-password'>
                            <label id='confirmpassword-title' htmlFor='inputBox'>
                                Confirm Password:{' '}
                            </label>
                            <br/>
                            <input
                                type="password" 
                                id="cf" 
                                placeholder="confirm password" 
                                value={cpassword.toString()}
                                onChange={(e) => handleInputChange(e, 'cpassword')}
                            />
                        </div><br/>
                    </form>
                    <button
                        type='button'
                        id='button-create' 
                        onClick={createSubmit}>
                            Create Account
                    </button>
                    <br/>
                    <button
                        type='button'
                        id='button-login' 
                        onClick={goback}>
                            Back to Login
                    </button>
                
            </div>
        </div>
            <div id='image-column'>
                <img 
                    src={backgroundimg} 
                    id='create-img' 
                    alt='Background' 
                />
            </div>
        
        </div>
    );
}

export default Create;

