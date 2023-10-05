import React from 'react';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    return(
        <body>
            <h1>Login</h1>
            <h3>
                <form>
                    <input type="text" id="email" placeholder="email"/><br/>
                    <input type="text" id="password" placeholder="password"/><br/>
                    <button variant='contained' onClick={() => navigate('home')}>Login</button>
                    <br/>
                    <button variant='contained' onClick={() => navigate('CreateAccount')}>Don't have an account?</button>
                </form>
            </h3>

        </body>
    );
}

export default Login;