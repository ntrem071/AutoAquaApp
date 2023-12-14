import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { Buffer } from 'buffer';
import Cookies from 'js-cookie';
import './Login.css'
import backgroundimg from '../pictures/wbackground.png'

function Login() {
    const navigate = useNavigate();

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const[message, setMessage] = useState('');
    const[passwordVisible, setPasswordVisible] = useState(false);

    const [name, setName] = useState('');
    const [cpassword, setCPassword] = useState('');

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [isRight, setIsRight] = useState(true);
    const [createVisible, setCreateVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(true);

    useEffect(() => {
        setTimeout(function(){
            setMessage('');
        }, 2000);
    }, [message]);

    const RightorLeft = () => {
        console.log('it reaches here!');
        setIsRight((prevIsRight) => !prevIsRight);
        console.log('isRight: ', isRight);
    }

    const position = RightorLeft ? 'show-right' : 'show-left'

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
                .then
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

    const togglePasswordVisibility = () => {
        setPasswordVisible = ((prevVisible) => !prevVisible);
    }

    function loginSubmit(){
        const e = document.getElementById('lt1');
        const p = document.getElementById('lt2');
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
                    console.log('It reaches here')
                    e.style.borderColor = 'red';
                    p.style.borderColor = 'red';
                    setTimeout(() => {
                        alert('Email or password is incorrect');
                    }, 500);
                } else {
                    return response.json()
                }
            })
            .then(data => {
                const sessionID = data.sessionId;
                if(sessionID) {
                    document.cookie = `sessionId=${sessionID}`
                    navigate('/Home');
                }
                
            })
            .catch((err) => {
                setError('Email or password is incorrect');
                e.style.borderColor = 'red';
                p.style.borderColor = 'red';
                // alert('Email or password is incorrect.');
                setTimeout(() => {
                    alert('Email or password is incorrect');
                }, 500);
            });
        } else if ((email === '') || (password === '')){
            setError('All fields must be filled');
            e.style.borderColor = 'red';
            p.style.borderColor = 'red';
            // alert('All fields must be filled.');
            setTimeout(() => {
                alert('Email and/or password must be filled');
            }, 500);
        }
    }

    const showOverlay = () => {
        setOverlayVisible(true);
    }

    const hideOverlay = () => {
        setOverlayVisible(false);
    }

    return(
        <div id='container'>
            <div id='rectangle'>
                <div id='title'>
                    <h1 id='lh1'>Automated Aquaponics</h1>
                </div>
                <div id='row'>
                    {/* <div id='o-img' className={`animated-div ${isRight ? 'right' : 'left'}`}>
                        <img
                            src={backgroundimg}
                            id='overlay-img'
                        />
                    </div> */}
                    <div id='login-column'>
                        <h2 id='lh2'>Login</h2>
                        <div id='Login'>
                        <form id='login'>
                            <div id='em'>
                                <input
                                    type='text'
                                    id='lt1'
                                    className='email'
                                    placeholder='Email'
                                    value={email.toString()}
                                    onChange={(e) => valuesIn(e, 'email')}
                                />
                            </div>
                            <div id='l-email-icon'>
                                <MailOutlined/>
                            </div>
                            <br />
                            <div id='pw' className='flex'>
                                <input
                                    type= {passwordVisible ? 'text' : 'password'}
                                    id='lt2'
                                    className='password'
                                    placeholder='Password'
                                    value={password.toString()}
                                    onChange={(e) => valuesIn(e, 'password')}
                                />
                                <div id='l-password-icon'>
                                    <LockOutlined/>
                                </div>
                                <div className='eye-icon' id='eye-icon' onClick={() => setPasswordVisible(!passwordVisible)}>
                                    {passwordVisible ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                                </div>
                                <br />
                            </div>
                        </form>
                        </div>
                        <button
                            type='button'
                            id='lb1'
                            className='button'
                            onClick={loginSubmit}
                        >
                        Login
                        </button>
                        <br />
                        <p id='lp1'>
                            Don't have an account?&nbsp;&nbsp;
                        <a 
                            id='la1' 
                            href='/CreateAccount'
                        >
                            Create
                        </a>
                        </p>
                    </div>
                    <div id='create-column'>
                    <h1 id='ch1'>Create account</h1>
                    <div id='Create'>
                        <form id='create'>
                            <div id='name'>
                                <input
                                    type="text" 
                                    id="cf1" 
                                    placeholder="Name" 
                                    value={name.toString()}
                                    onChange={(e) => handleInputChange(e, 'name')}
                                />
                                <div id='name-icon'>
                                    <UserOutlined/>
                                </div>
                            </div><br/>
                            <div id='email'>
                                <input
                                    type="email" 
                                    id="cf2" 
                                    placeholder="Email" 
                                    value={email.toString()}
                                    onChange={(e) => handleInputChange(e, 'email')}
                                    pattern='.+@example\.com'
                                    required
                                />
                                <div id='email-icon'>
                                    <MailOutlined/>
                                </div>
                            </div><br/>
                            <div id='password'>
                                <br/>
                                <input
                                    type="password" 
                                    id="cf3" 
                                    placeholder="Password" 
                                    value={password.toString()}
                                    onChange={(e) => handleInputChange(e, 'password')}
                                />
                                <div id='password-icon'>
                                    <LockOutlined/>
                                </div>
                            </div><br/>
                            <div id='confirm-password'>
                                <input
                                    type="password" 
                                    id="cf4" 
                                    placeholder="Confirm Password" 
                                    value={cpassword.toString()}
                                    onChange={(e) => handleInputChange(e, 'cpassword')}
                                />
                                <div id='cpassword-icon'>
                                    <LockOutlined/>
                                </div>
                            </div><br/>
                        </form>
                        <button
                            type='button'
                            id='button-create' 
                            onClick={createSubmit}>
                                Create Account
                        </button>
                        {/* <br/>
                        <button
                            type='button'
                            id='button-login' 
                            onClick={goback}>
                                Back to Login
                        </button> */}
                    </div>
                </div>
                </div>
                {/* <div className='overlay-container'>
                    <div className='overlay'>
                        <div className='overlay-left'>
                            <h2 id='overlay-left-title'>Welcome Back!</h2>
                            <p id='overlay-left-p'>Please login to get started!</p>
                            <button className='ghost' id='signIn'>Sign In</button>
                        </div>
                        <div className='overlay-right'>
                            <h2 id='overlay-right-title'>Hello, friend!</h2>
                            <p id='overlay-right-p'>To get started, please input your personal information</p>
                            <button className='ghost' id='signUp'>Sign Up</button>
                        </div>
                    </div>
                </div> */}
            </div>
            <div id='overlay'>
                <div className='o-content-left'>
                    <h2 id='overlay-left-title'>Welcome Back!</h2>
                    <p id='overlay-left-p'>Please login to get started!</p>
                    <button className='ghost' id='signIn'>Sign In</button>
                </div>
                <div id='o-content-right'>
                    <h1 id='sign-in-h1'>Hello Friend!</h1>
                    <p id='sign-in-p'>Enter your personal details and start a journey with us!</p>
                    <button id='sign-in-t-sign-up' onClick={RightorLeft}>Sign Up</button>
                </div>
                <div id='o-img' className={isRight ? 'show-right' : 'show-left'}>
                    <img
                        src={backgroundimg}
                        id='overlay-img'
                    />
                </div>
            </div>
        </div>
        )
}

export default Login;