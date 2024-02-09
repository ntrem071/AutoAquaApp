import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Session.css';

function Session(props) {
    const navigate = useNavigate();

    useEffect(() => {
        props.closeNav(true);
    }, []);

    function redirect(){
        navigate('/');
        props.setTrigger(false);
    }

    return(props.trigger) ? (
        <div className='wrap-session-expired'>
            <div className='wrap-sessionbox'>
                <h3>Your session has expired. Back to login?</h3>
                <button className='expired-ok' onClick={redirect}>OK</button>
            </div> 
        </div>
                   
    ) : "";
}
 
export default Session;