import React from 'react';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const navigate = useNavigate();
    return(
        <body>
            <h1>WARNING</h1>
            <h3>
                <button variant='contained' onClick={() => navigate('/Home')}>Home</button>
                <button variant='contained' onClick={() => navigate('/User-Info')}>User Info</button>
                <button variant='contained' onClick={() => navigate('/Fish')}>Fish</button>
                <button variant='contained' onClick={() => navigate('/Information')}>Information</button>
                <button variant='contained' onClick={() => navigate('/Settings')}>Settings</button>
                <div>
                    <p id='phtitle'>pH: </p><p id='pH_level'>7</p>
                    <br></br>
                    <p id='ectitle'>EC: </p><p id='electric_conduct'>100</p>
                    <br></br>
                    <p id='ttitle'>Temperature: </p><p id='temperature'>20</p>
                    <br></br>
                    <p id='ftitle'>Feed: </p><p id='feeding'>1 time(s) a day</p>
                    
                </div>
            </h3>
            

        </body>
    );
}

export default Settings;