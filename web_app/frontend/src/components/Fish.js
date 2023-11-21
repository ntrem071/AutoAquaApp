import React from 'react';
import { useNavigate } from 'react-router-dom';

function Fish() {
    const navigate = useNavigate();
    return(
        <body>
            <h1>Fish</h1>
            <h3>
                <div class='nav'>
                    <button id='navhome' variant='contained' title='Home' onClick={() => navigate('/Home')}>&nbsp;</button>
                    <button id='navuser' variant='contained' title='User Info' onClick={() => navigate('/User-Info')}>&nbsp;</button>
                    <button id='navfish' variant='contained' title='Fish Health' onClick={() => navigate('/Fish')}>&nbsp;</button>
                    <button id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => navigate('/Information')}>&nbsp;</button>
                    <button id='navsettings' variant='contained' title='Settings' onClick={() => navigate('/Settings')}>&nbsp;</button>
                </div>
                <div>
                    "Fish"
                </div>
            </h3>
        </body>
    );
}

export default Fish;