import React from 'react';
import { useNavigate } from 'react-router-dom';

function Fish() {
    const navigate = useNavigate();
    return(
        <body>
            <h1>Fish</h1>
            <h3>
                <button variant='contained' onClick={() => navigate('/Home')}>Home</button>
                <button variant='contained' onClick={() => navigate('/User-Info')}>User Info</button>
                <button variant='contained' onClick={() => navigate('/Fish')}>Fish</button>
                <button variant='contained' onClick={() => navigate('/Information')}>Information</button>
                <button variant='contained' onClick={() => navigate('/Settings')}>Settings</button>
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