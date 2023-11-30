import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Fish() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    function nav(str){
        document.cookie = `sessionId=${sessionId}`
        navigate(str)
    }
    return(
        <body>
            <h1>Fish Behavior</h1>
            <h3>
                <div className='nav'>
                    <button id='navhome' variant='contained' title='Home' onClick={() => nav('/Home')}>&nbsp;</button>
                    <button id='navuser' variant='contained' title='User Info' onClick={() => nav('/User-Info')}>&nbsp;</button>
                    <button id='navfish' style={{backgroundColor: "#08398d"}} variant='contained' title='Fish Health' onClick={() => nav('/Fish')}>&nbsp;</button>
                    <button id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => nav('/Information')}>&nbsp;</button>
                    <button id='navsettings' variant='contained' title='Settings' onClick={() => nav('/Settings')}>&nbsp;</button>
                </div>
                <div id='m'>
                    <p id='model'>ML Model Undergoing Developement...</p>
                </div>
            </h3>
        </body>
    );
}

export default Fish;