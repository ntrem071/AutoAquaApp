import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Fish.css';
import Navigation from './Navigation';


function Fish() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');


    function nav(str){
        document.cookie = `sessionId=${sessionId}`
        navigate(str)
    }
    return(
        <div id='fish-analyctics'>
            <Navigation/>
            <div class="outerbox-f">
                <div class="video-container">
                    <video height="300px" weight="">
                        <source src="../videos/fishTestVideo.mp4" type="video/mp4"/>
                    </video>
                </div>
            </div>
        </div>
    );
}

export default Fish;