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

    const handleInputChange = (e, type) => {
        switch(type){
            case 'name':
                setError('');
                setName(e.target.value);
                if (e.target.value === '') {
                    setError('Name has been left blank');
                } else {
                    document.getElementById('cf1').style.borderColor = '';
                }
                break;
            case 'email':
                setError('');
                setEmail(e.target.value);
                if (e.target.value === '') {
                    setError('Email has been left blank');
                } else {
                    document.getElementById('cf2').style.borderColor = '';
                }
                break;
            case 'password':
                setError('');
                setPassword(e.target.value);
                if (e.target.value === '') {
                    setError('Password has been left blank');
                }
                break;
            case 'cpassword':
                setError('')
                setCPassword(e.target.value);
                if (password !== e.target.value){
                    setError('Passwords do not match');
                } else if (e.target.value === ''){
                    setError('Password has been left blank');
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

    function FormValidation() {
        var n = document.getElementById('cf1');
        var e = document.getElementById('cf2');
        var p = document.getElementById('cf3');
        var cp = document.getElementById('cf4');

        if(!validateEmail(email)){
            e.style.borderColor = 'red';
            setTimeout(() => {
                alert('Please enter valid email.');;
            }, 500);
            return false;
        } else if (password !== cpassword) {
            
            p.style.borderColor = 'red';
            cp.style.borderColor = 'red';
            setTimeout(() => {
                alert('Passwords do not match.');
            }, 500);
            return false;
        } else if (name === '') {
            
            n.style.borderColor = 'red';
            setTimeout(() => {
                alert('Name is needed.');
            }, 500);
            return false;
        } else if ((password === '') || (cpassword === '')) {
            
            p.style.borderColor = 'red';
            cp.style.borderColor = 'red';
            setTimeout(() => {
                alert('Passwords are needed.');
            }, 500);
            return false;
        } else if (email === '') {
            
            e.style.borderColor = 'red';
            setTimeout(() => {
                alert('Email is needed.');
            }, 500);
            return false;
        } else {
            return true;
        }
    }

// connects frontend to backend
    function createSubmit(){
        const validate = FormValidation();
        if(validate && (name !== '') && (email !== '') && (password !== '') && (password === cpassword)){
            if(validate){
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
                                id="cf1" 
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
                                id="cf2" 
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
                                id="cf3" 
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
                                id="cf4" 
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

