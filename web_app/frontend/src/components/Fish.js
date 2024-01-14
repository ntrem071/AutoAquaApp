import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Fish.css';


function Fish() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');


    function nav(str){
        document.cookie = `sessionId=${sessionId}`
        navigate(str)
    }


    return(
        <div id='fish-analyctics'>
            <h1>Fish Behavior</h1>
            <h3>
                <div id='m'>
                    <p id='model'>ML Model Undergoing Developement...</p>
                </div>
            </h3>
        </div>
    );
}

export default Fish;