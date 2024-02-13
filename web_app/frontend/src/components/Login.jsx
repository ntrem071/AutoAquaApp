import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import Popup from 'react-popup';
import { Buffer } from 'buffer';
import Cookies from 'js-cookie';
import './Login.css'
import backgroundimg from '../pictures/fishlogin.jpg'

function Login() {
    const navigate = useNavigate();

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const[message, setMessage] = useState('');
    const[passwordVisible, setPasswordVisible] = useState(false);

    const [name, setName] = useState('');
    const [cpassword, setCPassword] = useState('');

    const [overlayTitle, setOverlayTitle] = useState(false);
    const [isRight, setIsRight] = useState(true);
    const [createVisible, setCreateVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(true);
    const [leftB8utton, setLeftButton] = useState(false);
    const [rightButton, setRightButton] = useState(true);
    const [slideLeft, setSlideLeft] = useState('false');
    const [responseMessage, setResponseMessage] = useState(false);
    const [white, setWhite] = useState(false);
    // const [isMiddle, setIsMiddle] = useState(false);

    useEffect(() => {
        setTimeout(function(){
            setMessage('');
        }, 2000);
    }, [message]);

    const handleButtonClick = () => {
        // setLeftButton(!(leftB8utton));
        // setRightButton(!(rightButton));
        // console.log('isMiddle first: ', isMiddle)
        if(FormValidation()){
            setSlideLeft(!(slideLeft));
            console.log('FormValidation: ', FormValidation());
            console.log('goes into if');
            
        } else if (slideLeft) {
            setSlideLeft(!(slideLeft));
            console.log('it reaches into else if')
        } else {
            console.log('it reaches here');
            setSlideLeft((slideLeft));
        }
        // setIsMiddle((prevState) => !prevState)

        // setTimeout(() => {
        //     setIsMiddle(false);
        //     // console.log('isMiddle next: ', isMiddle)
        // }, 700);
    }

    const oHandleButtonClick = () => {
        setSlideLeft(!(slideLeft))
    }

    // (\(O.O)/)
    // const white = () => {
        
    // }

    const showResponseMessage = () => {
        // setResponseMessage(!responseMessage);
        setResponseMessage('Account created successful!');
    }

    const handleLeftButton = () => {
        setLeftButton(true);
        setRightButton(false);
    }

    const handleRightButton = () => {
        setLeftButton(false);
        setRightButton(true);
    }

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
                alert('Please enter valid email.');
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
            n.style.borderColor = 'rgb(118, 118, 118)';
            e.style.borderColor = 'rgb(118, 118, 118)';
            p.style.borderColor = 'rgb(118, 118, 118)';
            cp.style.borderColor = 'rgb(118, 118, 118)';
            return true;
        }
    }

    function status(response) {
        if(response.ok) {
            return response.json();
        }else if (response.status === 404) {
            return [];
        } else {
            throw new Error(response.statusText)
        }
    }

// connects frontend to backend
    function createSubmit(){
        //const validate = FormValidation();
        if((name !== '') && (email !== '') && (password !== '') && (password === cpassword)){
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
            .then(status)
            .then((result) => {
                showResponseMessage();
            })
            .then(alert('Account created successfully!'))
            .catch((err) => {
                setError(err.message);
                console.log('Fetch error: ', err);
            });
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
            var url = 'http://localhost:8000/users/na/login/app';
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

    return(
            // <div className='row'>
            //     <div className='column' id='column'>
            //         <h1 id='lh1'>Automated Aquaponics</h1>
            //         <h2 id='lh2'>Login</h2>
            //         <div className='Login'>
            //             <form id='login'>
            //                 <label id='ll1' for='inputBox'>Email: </label><br></br>
            //                 <input
            //                     type='text'
            //                     id='lt1'
            //                     placeholder='Email'
            //                     value={email.toString()}
            //                     onChange={(e) => valuesIn(e, 'email')}
            //                 /><br/>
            //                 <label id='ll1' for='inputBox'>Password: </label><br></br>
            //                 <input
            //                     type='text'
            //                     id='lt1'
            //                     placeholder='Password'
            //                     value={password.toString()}
            //                     onChange={(e) => valuesIn(e, 'password')}
            //                 /><br/>
            //             </form>
            //         </div>
            //         <button
            //             type='button'
            //             id = 'lb1'
            //             className='button'
            //             onClick={loginSubmit}
            //         >Login
            //         </button>
            //         <br/>
            //         <p id ='lp1'>
            //             Don't have an account?&nbsp;&nbsp;
            //             <a id = 'la1' href='/CreateAccount'>Create</a>
            //         </p>
            //     </div>
            //     <div className='column' id='image'>
            //         <img src={backgroundimg} className='login-img'></img>
            //     </div>
            // </div>

        <div id='container'>
            <div id='row'>
                <div id='login-column' className='form-container sign-in-container'>
                    <h1 id='lh1' className={slideLeft ? 'title-right' : 'title-left'}>AUTOMATED AQUAPONICS</h1>
                    {/* <h2 id='lh2'>Login</h2> */}
                    <div id='Login' className='Login'>
                        <form className='log-in'id='login' action='#'>
                            <h2 id='lh2' className='form-title'>Login</h2>
                            <div id='em'>
                                <input
                                    type='text'
                                    id='lt1'
                                    className='email'
                                    placeholder='Email'
                                    value={email.toString()}
                                    onChange={(e) => valuesIn(e, 'email')}
                                />
                                <div id='l-email-icon'>
                                    <MailOutlined/>
                                </div>
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
                            <button
                                type='button'
                                id='lb1'
                                className='button-login'
                                onClick={loginSubmit}
                            >
                            Login
                            </button>
                        </form>
                    </div>
                </div>
                <div id='create-column' className='form-container sign-up-container'>
                    <div className='Create'>
                        <form className='side-by-side row' id='create'action='#'>
                            <h2 id='ch1' className='form-title col'>Create account</h2>
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
                            <button
                                type='button'
                                id='button-create'
                                className='button'
                                // onClick={createSubmit}
                                onClick = {() => {
                                    createSubmit();
                                    handleButtonClick();
                                }}
                                >
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
                <div className={`o-panel o-content ${slideLeft ? 'slide-right' : 'slide-left'}`}>
                    <h1 className='title-overlay'>{slideLeft ? '' : 'AUTOMATED AQUAPONICS'}</h1>
                    <h2 id='overlay-left-title'>{slideLeft ? 'Hello Friend!' : 'Welcome Back!'}</h2>
                    <p id='overlay-left-p'>{slideLeft ? 'Enter your personal details and start a journey with us!' : 'Please login to get started!'}</p>
                    <button className='ghost' id='signIn' onClick={oHandleButtonClick}>{slideLeft ? 'SIGN UP' : 'SIGN IN'}</button>
                </div>
            </div>
        </div>
        )
}

export default Login;