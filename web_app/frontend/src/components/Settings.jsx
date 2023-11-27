import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Settings() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    const [pHMin, setpHMin] = useState('6.5');
    const [pHMax, setpHMax] = useState('7.5');
    const [ecMin, setecMin] = useState('2.0');
    const [ecMax, setecMax] = useState('3.0');
    const [tempMin, settempMin] = useState('22');
    const [tempMax, settempMax] = useState('28');
    const [firsthour, setfirstHour] = useState('');
    const [secondhour, setsecondHour] = useState('');
    const [thirdhour, setthirdHour] = useState('');
    const [firstminute, setfirstMinute] = useState('');
    const [secondminute, setsecondMinute] = useState('');
    const [thirdminute, setthirdMinute] = useState('');
    const [message, setMessage] = useState('');
    const [time, setTime] = useState('');
    const [LEDonHour, setLEDonHour] = useState('');
    const [LEDoffHour, setLEDoffHour] = useState('');
    const [LEDonMinute, setLEDonMinute] = useState('');
    const [LEDoffMinute, setLEDoffMinute] = useState('');
    const [firstVisible, setFirstVisible] = useState(false);
    const [secondVisible, setSecondVisible] = useState(false);
    const [thirdVisible, setthirdVisible] = useState(false);
    const [current, setCurrent] = useState(1);
    const [phEn, setPHEnable] = useState(true);
    const [ecEn, setECEnable] = useState(true);
    const [tempEn, setTempEnable] = useState(true);
    const [feedEn, setFeedEnable] = useState(true);
    const [ledEn, setLEDEnable] = useState(true);

    const [error, setError] = useState('');


    const progress1 = document.querySelector(".range-slider .progress-ph"), 
            progress2 = document.querySelector(".range-slider .progress-ec"),
                progress3 = document.querySelector(".range-slider .progress-temp");
    let phGap= 0.4, ecGap=0.4, tempGap=3;

    useEffect(() => {
        setValues(); //initialize values from user doc on page load
    }, []);

    const handleInputChange = (e, type) => {
        setError('');
        console.log(e.target.className,e.target.value);
        switch(type){
            case 'phRange':
                //setpHMin(e.target.value);
                if(e.target.className==="range-min" && !phEn){
                    if((parseFloat(pHMax)-e.target.value)<phGap){
                        setpHMin((parseFloat(pHMax)-phGap).toFixed(1)+"");
                        progress1.style.left = (((parseFloat(pHMax)-phGap)-6)/2)*100 + '%';
                    }else{
                        setpHMin(e.target.value);
                        progress1.style.left = ((e.target.value-6)/2)*100 + '%';
                    }
                }else if(e.target.className==="range-max"  && !phEn){
                    if((e.target.value-pHMin)<phGap){
                        setpHMax((parseFloat(pHMin)+phGap).toFixed(1)+"");
                        progress1.style.right = (100-((((parseFloat(pHMin)+phGap)-6)/2)*100) )+ '%';
                    }else{
                        setpHMax(e.target.value);
                        progress1.style.right = 100-((e.target.value-6)/2)*100 + '%';
                    }
                }else if(phEn){
                   //console.log('PH Dosing System Disabled!');
                    setError('PH Dosing System Disabled!');
                }   
                break;
                
            case 'ecRange':
                if(e.target.className==="range-min" && !ecEn){
                    if((parseFloat(ecMax)-e.target.value)<ecGap){
                        setecMin((parseFloat(ecMax)-ecGap).toFixed(1)+"");
                        progress2.style.left = (((parseFloat(ecMax)-ecGap))/5)*100 + '%';
                    }else{
                        setecMin(e.target.value);
                        progress2.style.left = ((e.target.value)/5)*100 + '%';
                    }
                }else if(e.target.className==="range-max"  && !ecEn){
                    if((e.target.value-ecMin)<ecGap){
                        setecMax((parseFloat(ecMin)+ecGap).toFixed(1)+"");
                        progress2.style.right = (100-((((parseFloat(ecMin)+ecGap))/5)*100) )+ '%';
                    }else{
                        setecMax(e.target.value);
                        progress2.style.right = 100-((e.target.value)/5)*100 + '%';
                    }
                }else if(ecEn){
                    setError('EC Dosing System Disabled!');
                }
                break;

            case 'tempRange':
                if(e.target.className==="range-min" && !tempEn){
                    if((parseFloat(tempMax)-e.target.value)<tempGap){
                        settempMin((parseFloat(tempMax)-tempGap).toFixed(1)+"");
                        progress3.style.left = (((parseFloat(tempMax)-tempGap)-20)/10)*100 + '%';
                    }else{
                        settempMin(e.target.value);
                        progress3.style.left = ((e.target.value-20)/10)*100 + '%';
                    }
                }else if(e.target.className==="range-max"  && !tempEn){
                    if((e.target.value-tempMin)<tempGap){
                        settempMax((parseFloat(tempMin)+tempGap).toFixed(1)+"");
                        progress3.style.right = (100-((((parseFloat(tempMin)+tempGap)-20)/10)*100) )+ '%';
                    }else{
                        settempMax(e.target.value);
                        progress3.style.right = 100-((e.target.value-20)/10)*100 + '%';
                    }
                }else if(tempEn){
                    setError('Temperature Regulation System Disabled!');
                }  
                break;
           
            case 'LEDonHour':
                setLEDonHour(e.target.value);
                break;
            case 'LEDonMinute':
                setLEDonMinute(e.target.value);
                break;
            case 'LEDoffHour':
                setLEDoffHour(e.target.value);
                break;
            case 'LEDoffMinute':
                setLEDoffMinute(e.target.value);
                break;

            case 'firstHour':
                setfirstHour(e.target.value);
                break;
            case 'firstMinute':
                setfirstMinute(e.target.value);
                break;
            case 'secondHour':
                setsecondHour(e.target.value);
                break;
            case 'secondMinute':
                setsecondMinute(e.target.value);
                break;
            case 'thirdHour':
                setthirdHour(e.target.value);
                break;
            case 'thirdMinute':
                setthirdMinute(e.target.value);
                break;
            default:
        }
        if(error!=''){
            console.log(error);
            //document.querySelector("#warning").style.display;
        }
        

    }
    const handleCheckChange = (type) => {
        setError('');
        switch(type){
            case 'phEn':
                setPHEnable(!phEn); 
                //toggleRangeDisable(phEn, 'ph')
                break;
            case 'ecEn':
                setECEnable(!ecEn);  
                //toggleRangeDisable(ecEn, 'ecMin', 'ecMax')
                break;
            case 'tempEn':
                setTempEnable(!tempEn);
                //toggleRangeDisable(tempEn, 'tempMin', 'tempMax')
                break;
            case 'feedEn':
                setFeedEnable(!feedEn); 
                break;
            case 'ledEn':
                setLEDEnable(!ledEn); 
                toggleLEDDisable();
                break;

            default:
        }
    }
    function toggleRangeDisable(va, str1){
        if(!va){
            document.querySelector(".range-slider .progress-"+str1).style.background = '#5f5f5f'; 
            //document.querySelector('.range-slider').style.setProperty(--SlideColor, '#5f5f5f');  
        }else{
            document.querySelector(".range-slider .progress-"+str1).style.background = '#2196F3';
           // document.querySelector('input[type="range"]::-webkit-slider-thumb').style.background = '#2196F3';  
        }
    }
    function toggleLEDDisable(){
        if(!ledEn){
            document.getElementById('LEDonHour').disabled=true;
            document.getElementById('LEDonMinute').disabled=true;
            document.getElementById('LEDoffHour').disabled=true;
            document.getElementById('LEDoffMinute').disabled=true;
            document.getElementById('LEDswitch').disabled=true;
        }else{
            document.getElementById('LEDonHour').disabled=false;
            document.getElementById('LEDonMinute').disabled=false;
            document.getElementById('LEDoffHour').disabled=false;
            document.getElementById('LEDoffMinute').disabled=false;
            document.getElementById('LEDswitch').disabled=false;
        }
    }
    function toggleTime(){
        var btn = document.getElementById('addtime');
        var toggle = document.getElementById('Feedswitch');

        if (btn && toggle) {
            btn.disabled = toggle.querySelector('input[type=checkbox]:checked')
        }
    }
    
    function ToggleTextAddTime(){
        var first = document.getElementById('first');
        var second = document.getElementById('second');
        var third = document.getElementById('third');

        console.log('First: ', first);
        console.log('Second: ', second);
        console.log('Third: ', third);

        first.classList.add('firsthide');
        second.classList.add('secondhide');
        third.classList.add('thirdhide');

        if (current === 1) {
            first.classList.remove('firsthide');
        } else if (current === 2) {
            second.classList.remove('secondhide');
        } else if (current === 3) {
            third.classList.remove('thirdhide');
        }

        current = (current % 3) + 1
    }

    function updateRanges(){
        var url = 'http://localhost:8000/users/'+sessionId+'/ranges';
        var data = {
            phRange: [pHMin, pHMax],
            ecRange: [ecMin, ecMax],
            tempRange: [tempMin, tempMax],
            phEnable: !phEn,
            ecEnable: !ecEn,
            tempEnable: !tempEn                    
        };
        sendRequest(url, data);    
    }

    function updateFeed(){
        var url = 'http://localhost:8000/users/'+sessionId+'/feed';
        var data = {
            feedEnable: !feedEn,
            feedTimer: [[firsthour,firstminute],[secondhour,secondminute],[thirdhour,thirdminute]]                      
        };
        sendRequest(url, data);
    }
    function updateLED(){
        var url = 'http://localhost:8000/users/'+sessionId+'/led';
        var data = {
            ledEnable: !ledEn,
            ledTimer: [[LEDoffHour,LEDoffMinute],[LEDonHour,LEDonMinute]]                    
        };
        sendRequest(url, data);
    }
    function updateTimezone(){
        var url = 'http://localhost:8000/users/'+sessionId+'/timezone';
        var data = {
            timezone: 'UTC'           
        };
        sendRequest(url, data);
    }

    function sendRequest(url, data){
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        console.log(JSON.stringify(data));
        fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then((response) => { //null data response (set to T/F later)
            if(response.error) {
                setError(response.error);
                console.log('Error: ', response.error)
            }
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }

    function setValues(){
            var url = 'http://localhost:8000/users/'+sessionId;
            var header = {         
                'Accept': 'application/json',
                'Content-Type': 'application/json'   
            };

            const id = fetch(url, {
                method: 'GET',
                headers: header
            })
            .then((response) => {
                if(response.error) {
                    setError(response.error);
                    console.log('Error: ', response.error)
                } else {
                    return response.json()
                }
            })
            .then(data => {
                if((!(data.phRange[0]==null))){
                    setpHMin(data.phRange[0]);
                    document.querySelector(".range-slider .progress-ph").style.left = ((data.phRange[0]-6)/2)*100+'%';         
                }
                if((!(data.phRange[1]==null))){
                    setpHMax(data.phRange[1]);
                    document.querySelector(".range-slider .progress-ph").style.right = 100-((data.phRange[1]-6)/2)*100 + '%';
                }
                if((!(data.ecRange[0]==null))){
                    setecMin(data.ecRange[0]);
                    document.querySelector(".range-slider .progress-ec").style.left = ((data.ecRange[0])/5)*100+'%';
                }
                if((!(data.ecRange[1]==null))){
                    setecMax(data.ecRange[1]);
                    document.querySelector(".range-slider .progress-ec").style.right = 100-((data.ecRange[1])/5)*100 + '%';
                }
                if((!(data.tempRange[0]==null))){
                    settempMin(data.tempRange[0]);
                    document.querySelector(".range-slider .progress-temp").style.left = ((data.tempRange[0]-20)/10)*100+'%';
                }
                if((!(data.tempRange[1]==null))){
                    settempMax(data.tempRange[1]);
                    document.querySelector(".range-slider .progress-temp").style.right = 100-((data.tempRange[1]-20)/10)*100 + '%';
                }

                if((!(data.ledTimer[0]==null) && !(data.ledTimer[0][0]==null))){setLEDoffHour(data.ledTimer[0][0]);}
                if((!(data.ledTimer[0]==null) && !(data.ledTimer[0][1]==null))){setLEDoffMinute(data.ledTimer[0][1]);}
                if((!(data.ledTimer[1]==null) && !(data.ledTimer[1][0]==null))){setLEDonHour(data.ledTimer[1][0]);}
                if((!(data.ledTimer[1]==null) && !(data.ledTimer[1][1]==null))){setLEDonMinute(data.ledTimer[1][1]);}
  
                if((!(data.feedTimer[0]==null) && !(data.feedTimer[0][0]==null))){setfirstHour(data.feedTimer[0][0]);}
                if((!(data.feedTimer[0]==null) && !(data.feedTimer[0][1]==null))){setfirstMinute(data.feedTimer[0][1]);}
                if((!(data.feedTimer[1]==null) && !(data.feedTimer[1][0]==null))){setsecondHour(data.feedTimer[1][0]);}
                if((!(data.feedTimer[1]==null) && !(data.feedTimer[1][1]==null))){setsecondMinute(data.feedTimer[1][1]);}
                if((!(data.feedTimer[2]==null) && !(data.feedTimer[2][0]==null))){setthirdHour(data.feedTimer[2][0]);}
                if((!(data.feedTimer[2]==null) && !(data.feedTimer[2][1]==null))){setthirdMinute(data.feedTimer[2][1]);}

                //toggle booleans --> issues getting toggle to reflect user boolean values
                
                if(data.phEnable===true){document.getElementById('cs1').click();}
                if(data.ecEnable===true){document.getElementById('cs2').click();}
                if(data.tempEnable===true){document.getElementById('cs3').click();}
                if(data.feedEnable===true){document.getElementById('cs4').click();}
                if(data.ledEnable===true){document.getElementById('cs5').click();}
                
            })
            .catch((err) => {
                setError(err);
                console.log(err);
            });
    }
      

    return(     
    
        <div class='Settings'>
            <h1 id='warning'>WARNING</h1>
            <div class='outerbox'>
                <div class='nav'>
                    <button id='navhome' variant='contained' title='Home' onClick={() => navigate('/Home')}>&nbsp;</button>
                    <button id='navuser' variant='contained' title='User Info' onClick={() => navigate('/User-Info')}>&nbsp;</button>
                    <button id='navfish' variant='contained' title='Fish Health' onClick={() => navigate('/Fish')}>&nbsp;</button>
                    <button id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => navigate('/Information')}>&nbsp;</button>
                    <button id='navsettings' variant='contained' title='Settings' onClick={() => navigate('/Settings')}>&nbsp;</button>
                    </div>
                <div>
                <div class='wrap-range'>
                    <h2 id='st1'>RANGES:</h2><br></br>
                    <div className="wrap-ph">
                        <p id='pHTitle'>PH Range </p>
                        <div class="range-slider">
                            <div className="progress-ph"></div>
                            <div class="range-input">
                                <div id="tick-marks-ph"><p>6</p><p>7</p><p>8</p></div>
                                <div id="tick-interval1-ph"><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p></div>
                                <div id="tick-interval2-ph"><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p></div>
                                <input type="range" id="pHMin" class="range-min" min="6.0" max="8.0"  value={pHMin} onChange={(e) => handleInputChange(e, 'phRange')} step="0.1"></input>
                                <input type="range" id="PHMax" class="range-max" min="6.0" max="8.0"  value={pHMax} onChange={(e) => handleInputChange(e, 'phRange')} step="0.1"></input>

                            </div>   
                        </div>
                            <label class='switch' id='pHswitch'>
                                <input type='checkbox' id='cs1' defaultValue={phEn} onChange={()=>handleCheckChange("phEn")}></input>
                                <span class='slider round'></span>
                            </label>
                        <br></br>
                    </div>
                    <div className="wrap-ec">
                        <p id='ECTitle'>EC Range </p>
                        <div class="range-slider">
                            <div className="progress-ec"></div>
                            <div class="range-input">
                                <div id="tick-marks-ec"><p>0</p><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p></div>
                                <div id="tick-interval1-ec"><p></p><p></p><p></p><p></p></div>
                                <div id="tick-interval2-ec"><p></p><p></p><p></p><p></p></div>
                                <div id="tick-interval3-ec"><p></p><p></p><p></p><p></p></div>
                                <div id="tick-interval4-ec"><p></p><p></p><p></p><p></p></div>
                                <div id="tick-interval5-ec"><p></p><p></p><p></p><p></p></div>
                                <input type="range" id="ecMin" class="range-min" min="0" max="5"  value={ecMin} onChange={(e) => handleInputChange(e, 'ecRange')} step="0.2"></input>
                                <input type="range" id="ecMax" class="range-max" min="0" max="5"  value={ecMax} onChange={(e) => handleInputChange(e, 'ecRange')} step="0.2"></input>

                            </div>   
                        </div>
                        <label class='switch' id='ecswitch'>
                            <input type='checkbox' id='cs2' value={ecEn} onChange={()=>handleCheckChange("ecEn")}></input>
                            <span class='slider round'></span>
                        </label>
                        <br></br>
                    </div>
                    <div className="wrap-temp">
                    <p id='tempTitle'>Temperature Range (°C) </p>
                        <div class="range-slider">
                                <div className="progress-temp"></div>
                                <div class="range-input">
                                    <div id="tick-marks-temp"><p>20</p><p>21</p><p>22</p><p>23</p><p>24</p><p>25</p><p>26</p><p>27</p><p>28</p><p>29</p><p>30</p></div>
                                    <input type="range" id="tempMin" class="range-min" min="20" max="30"  value={tempMin} onChange={(e) => handleInputChange(e, 'tempRange')} step="1"></input>
                                    <input type="range" id="tempMax" class="range-max" min="20" max="30"  value={tempMax} onChange={(e) => handleInputChange(e, 'tempRange')} step="1"></input>
                                </div>   
                        </div>
                        <label class='switch' id='tempswitch'>
                            <input type='checkbox' id='cs3' value={tempEn} onChange={()=>handleCheckChange("tempEn")}></input>
                            <span class='slider round'></span>
                        </label>
                        <br></br>
                    </div>
                    <div className="save-range">
                        <button type='button' id='Save' onClick={updateRanges}>Save Changes</button>
                    </div>   
                </div>
                <div className="wrap-timers">
                    <div className="wrap-timezone">
                        <h2 id='st1'>TIMEZONE:</h2>
                    </div>
                    <div className="wrap-feed">
                        <h2 id='st1'>FEED:</h2>
                        <label class='switch' id='Feedswitch'>
                            <input type='checkbox' id='cs4' value={feedEn} onChange={()=>handleCheckChange("feedEn")}></input>
                            <span class='slider round'></span>
                        </label><br></br>
                        <p id='first' class={firstVisible ? 'firstshow' : 'firsthide'}>#1 
                            <input
                                type='text'
                                id='firsthour'
                                placeholder='hour'
                                value={firsthour.toString()}
                                onChange={(e) => handleInputChange(e, 'firsthour')}
                            ></input> : 
                            <input
                                type='text'
                                id='firstminute'
                                placeholder='minute'
                                value={firstminute.toString()}
                                onChange={(e) => handleInputChange(e, 'firstminute')}
                            ></input>
                        </p><br></br>
                        <p id='second' class={secondVisible ? 'secondshow' : 'secondhide'}>#2 
                            <input
                                type='text'
                                id='secondhour'
                                placeholder='hour'
                                value={secondhour.toString()}
                                onChange={(e) => handleInputChange(e, 'secondhour')}
                            ></input> : 
                            <input
                                type='text'
                                id='secondminute'
                                placeholder='minute'
                                value={secondminute.toString()}
                                onChange={(e) => handleInputChange(e, 'secondminute')}
                            ></input>
                        </p><br></br>
                        <p id='third' class={thirdVisible ? 'thirdshow' : 'thirdhide'}>#3  
                            <input
                                type='text'
                                id='thirdhour'
                                placeholder='hour'
                                value={thirdhour.toString()}
                                onChange={(e) => handleInputChange(e, 'thirdhour')}
                            ></input> : 
                            <input
                                type='text'
                                id='thirdminute'
                                placeholder='minute'
                                value={thirdminute.toString()}
                                onChange={(e) => handleInputChange(e, 'thirdminute')}
                            ></input>
                        </p><br></br>
                        <button
                        type='button'
                        id='addtime' 
                        onClick={() => ToggleTextAddTime()}
                        disabled>Add Time
                        </button><br></br>
                        <button type='button' id='Save' onClick={updateFeed}>Save Changes</button>
                    </div>
                    <div className="wrap-led">
                        <h2 id='st1'>LED:</h2>
                        <label class='switch' id='LEDswitch'>
                            <input type='checkbox' id='cs5' value={ledEn} onChange={()=>handleCheckChange("ledEn")}></input>
                            <span class='slider round'></span>
                        </label><br></br>
                        <p id='LEDOn'>ON 
                            <input
                                type='text'
                                id='LEDonHour'
                                placeholder='hour'
                                value={LEDonHour.toString()}
                                onChange={(e) => handleInputChange(e, 'LEDonHour')}
                                disabled
                            ></input> : 
                            <input
                                type='text'
                                id='LEDonMinute'
                                placeholder='minute'
                                value={LEDonMinute.toString()}
                                onChange={(e) => handleInputChange(e, 'LEDonMinute')}
                                disabled
                            ></input>
                        </p><br></br>
                        <p id='LEDOff'>OFF 
                            <input
                                type='text'
                                id='LEDoffHour'
                                placeholder='hour'
                                value={LEDoffHour.toString()}
                                onChange={(e) => handleInputChange(e, 'LEDoffHour')}
                                disabled
                            ></input> : 
                            <input
                                type='text'
                                id='LEDoffMinute'
                                placeholder='minute'
                                value={LEDoffMinute.toString()}
                                onChange={(e) => handleInputChange(e, 'LEDoffMinute')}
                                disabled
                            ></input>
                        </p>
                        <button type='button' id='Save' onClick={updateLED}>Save Changes</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;