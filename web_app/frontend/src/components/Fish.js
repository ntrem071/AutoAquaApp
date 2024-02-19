import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Fish.css';
import Navigation from './Navigation';
import video from '../videos/v1.mp4';

function Fish() {
    const navigate = useNavigate();
    const [behaviourVisible, setBehaviourVisible] = useState(false)
    const sessionId= Cookies.get('sessionId');

    const toggleBehaviour = () => {
        setBehaviourVisible(!behaviourVisible);
        behaviourVisible? 
            document.getElementById('elementsB').style.height = '0px' :
            document.getElementById('elementsB').style.height = 'max-content';
    }

    function nav(str){
        document.cookie = `sessionId=${sessionId}`
        navigate(str)
    }

    return(
        <div id='fish-analyctics'>
            <Navigation/>
            <div className="outerbox-f">
                <div className="video-container">
                    <h1 id='h1-fv'>Last hour...</h1>
                    <video id="videoID" height="300px" controls loop>
                        <source src={video} type="video/mp4"/>
                        Your browser doesn't support HTML5 video tag.
                    </video>
                </div>
                <div className="fishes">
                    <h1 id="h1-fs" color="rgb(77, 77, 77)">My fish</h1>
                    <div className="fish">
                        <h2 id="h2-fn">Mr. Bubbles</h2>
                        <p id="f-text">Mr. Bubbles is healthy!</p>
                        <div id="f-behaviour">
                            <div id="f-bmenu" onClick={toggleBehaviour}>
                                <span id="f-text">Noticed behaviour</span> <span id='ddSign'>{behaviourVisible ? '-' : '+'}</span>
                            </div>  
                            <ul id='elementsB'>
                                <li>
                                    <p>Foraging</p>
                                    <p>
                                        Your fish has been digging through the bottom of the tank! This behaviour is often found in 
                                        goldfish. This might be for your fish to search for food or marking his territory!
                                    </p>
                                </li>
                                <li>
                                    <p>Gasping</p>
                                    <p>
                                        The fish has been gulping at the top of the tank to make up for the lack of oxygen. Verify the
                                        water quality of your system!
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Fish;