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
            <h1>Fish</h1>
            <h3>
                <div class='nav'>
                    <button id='navhome' variant='contained' title='Home' onClick={() => nav('/Home')}>&nbsp;</button>
                    <button id='navuser' variant='contained' title='User Info' onClick={() => nav('/User-Info')}>&nbsp;</button>
                    <button id='navfish' variant='contained' title='Fish Health' onClick={() => nav('/Fish')}>&nbsp;</button>
                    <button id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => nav('/Information')}>&nbsp;</button>
                    <button id='navsettings' variant='contained' title='Settings' onClick={() => nav('/Settings')}>&nbsp;</button>
                </div>
                <div>
                    <h4>Fish: </h4><p>Goldfish</p><h4>Plant: </h4><p>Hoya</p>
                    <br></br><br></br>
                    <h5>Other fish:
                        <br></br>
                        Other plants: 
                    </h5>
                </div>
            </h3>
        </body>
    );
}

export default Fish;