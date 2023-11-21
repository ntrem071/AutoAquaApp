import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';

function UserInfo() {
    const navigate = useNavigate();
    return(
        <body>
            <h1>User Info</h1>
            <h3>
                <div className='nav'>
                    <button id='navhome' variant='contained' onClick={() => navigate('/Home')}>&nbsp;</button>
                    <button id='navuser' variant='contained' onClick={() => navigate('/User-Info')}>&nbsp;</button>
                    <button id='navfish' variant='contained' onClick={() => navigate('/Fish')}>&nbsp;</button>
                    <button id='navinfo' variant='contained' onClick={() => navigate('/Information')}>&nbsp;</button>
                    <button id='navsettings' variant='contained' onClick={() => navigate('/Settings')}>&nbsp;</button>
                </div>
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