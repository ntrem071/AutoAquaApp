import React, {useEffect} from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
    const navigate = useNavigate();

    useEffect(() => {
        const sessionId = Cookies.get('sessionId');

        if(!sessionId) {
            navigate('/');
        }

        console.log('SessionId: ', sessionId);
    }, [navigate]);

    return(
        <body>
            <h1>WARNING</h1>
            <h3>
                <div className='nav'>
                    <button id='navhome' variant='contained' onClick={() => navigate('/Home')}>&nbsp;</button>
                    <button id='navuser' variant='contained' onClick={() => navigate('/User-Info')}>&nbsp;</button>
                    <button id='navfish' variant='contained' onClick={() => navigate('/Fish')}>&nbsp;</button>
                    <button id='navinfo' variant='contained' onClick={() => navigate('/Information')}>&nbsp;</button>
                    <button id='navsettings' variant='contained' onClick={() => navigate('/Settings')}>&nbsp;</button>
                </div>
                <div>
                    <p id='wltitle'>Water Level</p><p id='water_level'>25</p>
                    <br></br>
                    <p id='phtitle'>pH Level</p><p id='pH_level'>7</p>
                    <br></br>
                    <p id='ectitle'>Electrical Condutivity</p><p id='electric_conduct'>100</p>
                    <br></br>
                    <p id='ttitle'>Temperature</p><p id='temperature'>20</p>
                </div>
            </h3>
            

        </body>
    );
}

export default Homepage;