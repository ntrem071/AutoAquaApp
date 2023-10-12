import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
//import axios from 'axios';

function Create() {
//    const navigate = useNavigate();  

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
                    setError('Name has been left blank')
                }
                break;
            case 'email':
                setError('');
                setEmail(e.target.value);
                if (e.target.value === '') {
                    setError('Email has been left blank')
                }
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

// connects frontend to backend
    function createSubmit(){
        if((name !== '') && (email !== '') && (password !== '') && (password === cpassword)){
            var url = 'http://localhost:8000/users';
            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            };
            var data = {
                name: name,
                email: email,
                password: password
            };
            fetch(url, {
                mode: 'no-cors',
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((response) => {
                setMessage(response[0].result);
            })
            .catch((err) => {
                setError(err);
                console.log('it is getting caught');
            });
        } else {
            setError('All fields must be filled')
        }
    }
    return(
        <div className='CreateForm'>
            <p>
                {
                    error !== '' ? (
                    <span className='error'>{error.toString()}</span>
                     ) : (
                    <span className='success'>{message.toString()}</span>
                )}
            </p>
            <h1>Create your account!</h1>
            <h3>
                <form id='create'>
                    <input
                        type="text" 
                        id="name" 
                        placeholder="name" 
                        value={name.toString()}
                        onChange={(e) => handleInputChange(e, 'name')}
                    /><br/>
                    <input
                        type="text" 
                        id="email" 
                        placeholder="email" 
                        value={email.toString()}
                        onChange={(e) => handleInputChange(e, 'email')}
                    /><br/>
                    <input
                        type="password" 
                        id="password" 
                        placeholder="password" 
                        value={password.toString()}
                        onChange={(e) => handleInputChange(e, 'password')}
                    /><br/>
                    <input
                        type="password" 
                        id="confirm_password" 
                        placeholder="confirm password" 
                        value={cpassword.toString()}
                        onChange={(e) => handleInputChange(e, 'cpassword')}
                    /><br/>
                </form>
                <button
                    type='button'
                    className='button' 
                    onClick={createSubmit}>
                        Create Account
                </button>
            </h3>
        </div>
    );
}

export default Create;

