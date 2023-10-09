import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Create() {
    const navigate = useNavigate();

    const form = document.getElementById('create');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        axios.post('/api/createUser', formData)
            .then(response => {
                const data = response.data;

                if (data.success) {
                    const success = document.getElementById('success-message');
                    success.textContent = 'User created! Now go log in!';
                } else {
                    console.error('Failure in creating user', data.error);
                }
            })
            .catch(error => {
                console.error('Creation request failed', error)
            })

    });

    return(
        <body>
            <h1>Create your account!</h1>
            <h3>
                <form id='create'>
                    <input type="text" id="name" placeholder="name"/><br/>
                    <input type="text" id="email" placeholder="email"/><br/>
                    <input type="text" id="password" placeholder="password"/><br/>
                    <input type="text" id="confirm_password" placeholder="confirm password"/><br/>
                </form>
                <button variant='contained' id='submit' onClick={() => navigate('/')}>Create</button>
            </h3>
        </body>
    );
}

export default Create;