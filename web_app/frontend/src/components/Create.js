import React from 'react';
import { useNavigate } from 'react-router-dom';

function Create() {
    const navigate = useNavigate();
    return(
        <body>
            <h1>Create your account!</h1>
            <h3>
                <form>
                    <input type="text" id="name" placeholder="name"/><br/>
                    <input type="text" id="email" placeholder="email"/><br/>
                    <input type="text" id="password" placeholder="password"/><br/>
                    <input type="text" id="confirm_password" placeholder="confirm password"/><br/>
                </form>
                <button variant='contained' onClick={() => navigate('/')}>Create</button>
            </h3>

        </body>
    );
}

export default Create;