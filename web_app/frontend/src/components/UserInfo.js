import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserInfo() {
    const navigate = useNavigate();
    return(
        <body>
            <h1>User Info</h1>
            <h3>
                <button variant='contained' onClick={() => navigate('/Home')}>Home</button>
                <button variant='contained' onClick={() => navigate('/User-Info')}>User Info</button>
                <button variant='contained' onClick={() => navigate('/Fish')}>Fish</button>
                <button variant='contained' onClick={() => navigate('/Information')}>Information</button>
                <button variant='contained' onClick={() => navigate('/Settings')}>Settings</button>
                <div>
                    <p id='ntitle'>Name: </p><p id='name'>John Doe</p><br></br>
                    <p id='etitle'>Email: </p><p id='email'>joe123@test.com</p><br></br>
                    <p id='ptitle'>Plant: </p><p id='plant'>Hoya</p><br></br>
                    <p id='ftitle'>Fish: </p><p id='fish'>Goldfish</p>
                </div>
            </h3>
        </body>
    );
}

export default UserInfo;