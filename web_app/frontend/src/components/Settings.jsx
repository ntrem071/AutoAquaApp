import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import userIcon from '../pictures/user.png';
import generalUserIconImage from '../pictures/userImageFishUwU.png';

function Settings() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    var navDrop = false;

    const [pHMin, setpHMin] = useState('6.5');
    const [pHMax, setpHMax] = useState('7.5');
    const [ecMin, setecMin] = useState('2.0');
    const [ecMax, setecMax] = useState('3.0');
    const [tempMin, settempMin] = useState('22');
    const [tempMax, settempMax] = useState('28');
    const [firsthour, setfirstHour] = useState('00');
    const [secondhour, setsecondHour] = useState('00');
    const [thirdhour, setthirdHour] = useState('00');
    const [firstminute, setfirstMinute] = useState('00');
    const [secondminute, setsecondMinute] = useState('00');
    const [thirdminute, setthirdMinute] = useState('00');
    const [LEDonHour, setLEDonHour] = useState('00');
    const [LEDoffHour, setLEDoffHour] = useState('00');
    const [LEDonMinute, setLEDonMinute] = useState('00');
    const [LEDoffMinute, setLEDoffMinute] = useState('00');
    const [phEn, setPHEnable] = useState(true);
    const [ecEn, setECEnable] = useState(true);
    const [tempEn, setTempEnable] = useState(true);
    const [feedEn, setFeedEnable] = useState(true);
    const [ledEn, setLEDEnable] = useState(true);
    const [timezone, setTimezone] = useState('UTC');
    const [visibleWraps, setVisibleWraps] = useState([false, false, false]);

    const [error, setError] = useState('');

    const progress1 = document.querySelector(".range-slider .progress-ph"), 
            progress2 = document.querySelector(".range-slider .progress-ec"),
                progress3 = document.querySelector(".range-slider .progress-temp");
    let phGap= 0.4, ecGap=0.4, tempGap=3;
    
    useEffect(() => {
        getTimezoneList();
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

            case 'timezone':
                setTimezone(e.target.value);
                break;

            default:
        }
        if(error!=''){
            console.log(error);
        }
    }
    const handleCheckChange = (type) => {
        setError('');
        switch(type){
            case 'phEn':
                setPHEnable(!phEn); 
                toggleRangeDisable(phEn, 'ph')
                break;
            case 'ecEn':
                setECEnable(!ecEn);  
                toggleRangeDisable(ecEn, 'ec')
                break;
            case 'tempEn':
                setTempEnable(!tempEn);
                toggleRangeDisable(tempEn, 'temp')
                break;
            case 'feedEn':
                setFeedEnable(!feedEn); 
                toggleFEEDDisable()
                break;
            case 'ledEn':
                setLEDEnable(!ledEn); 
                toggleLEDDisable();
                break;

            default:
        }
    }
    function toggleRangeDisable(va, str1){
        var thumbs=document.querySelectorAll( 'input[type="range"]' );
        var min, max; 
        if(str1=="ph"){min=thumbs[0];max=thumbs[1];}
        else if(str1=="ec"){min=thumbs[2];max=thumbs[3];}
        else if(str1=="temp"){min=thumbs[4];max=thumbs[5];}

        if(!va){
            document.querySelector(".range-slider .progress-"+str1).style.background = '#969493'; 
            min.style.setProperty( '--color', '#969493');
            max.style.setProperty( '--color', '#969493');
 
        }else{
            document.querySelector(".range-slider .progress-"+str1).style.background = '#2196F3';
            min.style.setProperty( '--color', '#2196F3');
            max.style.setProperty( '--color', '#2196F3');
        }
    }

    function toggleFEEDDisable(){
        console.log('-t-',feedEn);
        console.log('-t-',visibleWraps);
            document.getElementById('addtime').disabled = !feedEn;
            if(visibleWraps[0]==true){
                document.getElementById('firsthour').disabled=!feedEn;
                document.getElementById('firstminute').disabled=!feedEn;
                if(visibleWraps[1]==false){document.getElementById('delete-t1').disabled = !feedEn;}
            }
            if(visibleWraps[1]==true){
                document.getElementById('secondhour').disabled=!feedEn;
                document.getElementById('secondminute').disabled=!feedEn;
                if(visibleWraps[2]==false){document.getElementById('delete-t2').disabled = !feedEn;}
            }
            if(visibleWraps[2]==true){
                document.getElementById('thirdhour').disabled=!feedEn;
                document.getElementById('thirdminute').disabled=!feedEn;
                document.getElementById('delete-t3').disabled = !feedEn;
                console.log(document.getElementById('addtime').disabled);
                document.getElementById('addtime').disabled = true;
            }
    }


    function addTime(){     
        console.log('-a-',feedEn);
        console.log('-a-',visibleWraps);
            if (visibleWraps[0]==false){
                setVisibleWraps([true, false, false]);
                document.getElementById('wrap1').style.display = 'flex';

            } else if (visibleWraps[1]==false) {
                setVisibleWraps([true, true, false]);
                document.getElementById('wrap2').style.display = 'flex';
                document.getElementById('delete-t1').disabled = true;
                document.getElementById('delete-t2').disabled = false;

            } else if (visibleWraps[2]==false) {
                setVisibleWraps([true, true, true]);
                document.getElementById('wrap3').style.display = 'flex';
                document.getElementById('delete-t2').disabled = true;
                document.getElementById('delete-t3').disabled = false;
                document.getElementById('addtime').disabled = true;
            }    
    }

    function deleteTime() {
            console.log('-d-',feedEn);
            console.log('-d-',visibleWraps);

            if (visibleWraps[2]==true) {
                console.log('here3');
                setVisibleWraps([true, true, false]);
                document.getElementById('delete-t2').disabled = false;
                document.getElementById('wrap3').style.display = 'none';
            } 
            else if (visibleWraps[1]==true) {
                console.log('here2');
                setVisibleWraps([true, false, false]);
                document.getElementById('delete-t1').disabled = false;
                document.getElementById('wrap2').style.display = 'none';
            } 
            else if (visibleWraps[0]==true) {
                console.log('here1');
                setVisibleWraps([false, false, false]);
                document.getElementById('wrap1').style.display = 'none';
            }  

            document.getElementById('addtime').disabled = false;
    }

    function toggleLEDDisable(){
        if(!ledEn){
            document.getElementById('LEDonHour').disabled=true;
            document.getElementById('LEDonMinute').disabled=true;
            document.getElementById('LEDoffHour').disabled=true;
            document.getElementById('LEDoffMinute').disabled=true;
        }else{
            document.getElementById('LEDonHour').disabled=false;
            document.getElementById('LEDonMinute').disabled=false;
            document.getElementById('LEDoffHour').disabled=false;
            document.getElementById('LEDoffMinute').disabled=false;
        }
    }


    
    function getTimezoneList(){
        var url = 'http://localhost:8000/users/'+sessionId+'/timezone-list';
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetch(url, {
            method: 'GET',
            headers: headers,
        })
        .then((response) => {
            if(response.error) {
                setError(response.error);
                console.log('Error: ', response.error)
            } else {
                return response.json()

            }
        }).then(data => {
            var select = document.getElementById("timezone-list");

            for(var i = 0; i < data.length-1; i++) {
                var opt = data[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                select.appendChild(el);
            }

        }).catch((err) => {
            setError(err);
            console.log(err);
        });
    }

    function updateRanges(){
        var url = 'http://localhost:8000/users/'+sessionId+'/ranges';
        var data = {
            phRange: [parseFloat(pHMin), parseFloat(pHMax)],
            ecRange: [parseFloat(ecMin), parseFloat(ecMax)],
            tempRange: [parseFloat(tempMin), parseFloat(tempMax)],
            phEnable: !phEn,
            ecEnable: !ecEn,
            tempEnable: !tempEn                    
        };
        sendRequest(url, data);    
    }

    function updateFeed(){
        var arr=[];
        if(visibleWraps[0]){arr.push([firsthour,firstminute])}
        if(visibleWraps[1]){arr.push([secondhour,secondminute])}
        if(visibleWraps[2]){arr.push([thirdhour,thirdminute])}

        var url = 'http://localhost:8000/users/'+sessionId+'/feed';
        var data = {
            feedEnable: !feedEn,
            feedTimer: arr                     
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
            timezone: timezone           
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
        .then((response) => { 
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
            var url = 'http://localhost:8000/users/'+sessionId+'/settings';
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
                console.log(data);
                //load range sliders
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

                toggleRangeDisable(data.phEn, 'ph');
                toggleRangeDisable(data.ecEn, 'ec');
                toggleRangeDisable(data.tempEnEn, 'temp');
                //load LED times
                if((!(data.ledTimer[0]==null) && !(data.ledTimer[0][0]==null))){setLEDoffHour(data.ledTimer[0][0]);}
                if((!(data.ledTimer[0]==null) && !(data.ledTimer[0][1]==null))){setLEDoffMinute(data.ledTimer[0][1]);}
                if((!(data.ledTimer[1]==null) && !(data.ledTimer[1][0]==null))){setLEDonHour(data.ledTimer[1][0]);}
                if((!(data.ledTimer[1]==null) && !(data.ledTimer[1][1]==null))){setLEDonMinute(data.ledTimer[1][1]);}
                
              
                //load feed times
                if(!(data.feedTimer[0]==null)){
                    if((!(data.feedTimer[0][0]==null))){setfirstHour(data.feedTimer[0][0]);}
                    if((!(data.feedTimer[0][1]==null))){setfirstMinute(data.feedTimer[0][1]);}

                    document.getElementById('wrap1').style.display = 'flex';
                    if(data.feedTimer[1]==null){
                        setVisibleWraps([true, false, false]);
                    }
                    console.log(!data.feedEnable)
                    document.getElementById('firsthour').disabled=!data.feedEnable;
                    document.getElementById('firstminute').disabled=!data.feedEnable;
                    document.getElementById('delete-t1').disabled =!data.feedEnable;
                }
                if(!(data.feedTimer[1]==null)){
                    if((!(data.feedTimer[1][0]==null))){setsecondHour(data.feedTimer[1][0]);}
                    if((!(data.feedTimer[1][1]==null))){setsecondMinute(data.feedTimer[1][1]);}
                    
                    
                    document.getElementById('wrap2').style.display = 'flex';
                    document.getElementById('delete-t1').disabled = true;
                    if(data.feedTimer[2]==null){
                        setVisibleWraps([true, true, false]);
                    }
                    document.getElementById('secondhour').disabled=!data.feedEnable;
                    document.getElementById('secondminute').disabled=!data.feedEnable;
                    document.getElementById('delete-t2').disabled = !data.feedEnable;
                }
                if(!(data.feedTimer[2]==null)){
                    if((!(data.feedTimer[2][0]==null))){setthirdHour(data.feedTimer[2][0]);}
                    if((!(data.feedTimer[2][1]==null))){setthirdMinute(data.feedTimer[2][1]);}
                    
                    document.getElementById('wrap3').style.display = 'flex';
                    document.getElementById('addtime').disabled = true;
                    document.getElementById('delete-t2').disabled = true;
                    setVisibleWraps([true, true, true]);
                    document.getElementById('thirdhour').disabled=!data.feedEnable;
                    document.getElementById('thirdminute').disabled=!data.feedEnable;
                    document.getElementById('delete-t3').disabled = !data.feedEnable;
                }

                if(!data.feedEnable){
                    document.getElementById('addtime').disabled = true;
                }

                if((!(data.timezone==null))){setTimezone(data.timezone);}
                
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

    function displayNavSmall(){

        if(navDrop){
            document.getElementsByClassName('nav-dropdwn')[0].style.display = 'none';
        }else{
            document.getElementsByClassName('nav-dropdwn')[0].style.display = 'block';
        }
        
        navDrop = !navDrop;
    }

    return(     
        
        <div className='settings'>
            <div className="navbar">
                <span style={{fontFamily:'Courier', color: 'white'}}>Hello Mr. Bubbles! </span>
                <img id='userIcon' src={generalUserIconImage}></img>
                <button id='nav-button' onClick={displayNavSmall}></button>
                <div className="nav-dropdwn">
                    <button id='navhome' variant='contained' title='Home' onClick={() => navigate('/Home')}>
                        <h1 id='nav-text'>Home</h1>
                        &nbsp;
                    </button>  
                    <button id='navuser' variant='contained' title='User Info' onClick={() => navigate('/User-Info')}>
                        <h1 id='nav-text'>Account</h1>
                        &nbsp;
                    </button> 
                    <button id='navfish' variant='contained' title='Fish Health' onClick={() => navigate('/Fish')}>
                        <h1 id='nav-text'>Fish Analyctics</h1>
                        &nbsp;
                    </button>
                    <button id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => navigate('/Information')}>
                        <h1 id='nav-text'>Information</h1>
                        &nbsp;
                    </button>  
                    <button id='navsettings' style={{backgroundColor: "#08398d"}} variant='contained' title='Settings' onClick={() => navigate('/Settings')}>
                        <h1 id='nav-text'>Settings</h1>
                        &nbsp;
                    </button>
                </div> 
            </div>
            <div className="settings-title"><h1 id='settings-title'>Settings</h1></div>
            <div className='outerbox-s'>
                <div className='nav'>
                    <button id='navhome' variant='contained' title='Home' onClick={() => navigate('/Home')}>&nbsp;</button>
                    <button id='navuser' variant='contained' title='User Info' onClick={() => navigate('/User-Info')}>&nbsp;</button>
                    <button id='navfish' variant='contained' title='Fish Health' onClick={() => navigate('/Fish')}>&nbsp;</button>
                    <button id='navinfo' variant='contained' title='Fish and Plant Search' onClick={() => navigate('/Information')}>&nbsp;</button>
                    <button id='navsettings' style={{backgroundColor: "#08398d"}} variant='contained' title='Settings' onClick={() => navigate('/Settings')}>&nbsp;</button>
                    </div>
                <div>
                
                <div className='wrap-range'>
                    <h2 id='st1'>RANGES:</h2>
                    <div className="wrap-ph">
                        <p id='pHTitle'>PH Range </p>
                        <div className="range-slider">
                            <div className="progress-ph"></div>
                            <div className="range-input">
                                <div id="tick-marks-ph"><p>6</p><p>7</p><p>8</p></div>
                                <div id="tick-interval1-ph"><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p></div>
                                <div id="tick-interval2-ph"><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p></div>
                                <input type="range" id="pHMin" className="range-min" min="6.0" max="8.0"  value={pHMin} onChange={(e) => handleInputChange(e, 'phRange')} step="0.1"></input>
                                <input type="range" id="PHMax" className="range-max" min="6.0" max="8.0"  value={pHMax} onChange={(e) => handleInputChange(e, 'phRange')} step="0.1"></input>

                            </div>   
                        </div>
                            <label className='switch' id='pHswitch'>
                                <input type='checkbox' id='cs1' defaultValue={phEn} onChange={()=>handleCheckChange("phEn")}></input>
                                <span className='slider round'></span>
                            </label>
                        <br></br>
                    </div>
                    <div className="wrap-ec">
                        <p id='ECTitle'>EC Range </p>
                        <div className="range-slider">
                            <div className="progress-ec"></div>
                            <div className="range-input">
                                <div id="tick-marks-ec"><p>0</p><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p></div>
                                <div id="tick-interval1-ec"><p></p><p></p><p></p><p></p></div>
                                <div id="tick-interval2-ec"><p></p><p></p><p></p><p></p></div>
                                <div id="tick-interval3-ec"><p></p><p></p><p></p><p></p></div>
                                <div id="tick-interval4-ec"><p></p><p></p><p></p><p></p></div>
                                <div id="tick-interval5-ec"><p></p><p></p><p></p><p></p></div>
                                <input type="range" id="ecMin" className="range-min" min="0" max="5"  value={ecMin} onChange={(e) => handleInputChange(e, 'ecRange')} step="0.2"></input>
                                <input type="range" id="ecMax" className="range-max" min="0" max="5"  value={ecMax} onChange={(e) => handleInputChange(e, 'ecRange')} step="0.2"></input>

                            </div>   
                        </div>
                        <label className='switch' id='ecswitch'>
                            <input type='checkbox' id='cs2' value={ecEn} onChange={()=>handleCheckChange("ecEn")}></input>
                            <span className='slider round'></span>
                        </label>
                        <br></br>
                    </div>
                    <div className="wrap-temp">
                    <p id='tempTitle'>Temperature Range (°C) </p>
                        <div className="range-slider">
                                <div className="progress-temp"></div>
                                <div className="range-input">
                                    <div id="tick-marks-temp"><p>20</p><p>21</p><p>22</p><p>23</p><p>24</p><p>25</p><p>26</p><p>27</p><p>28</p><p>29</p><p>30</p></div>
                                    <input type="range" id="tempMin" className="range-min" min="20" max="30"  value={tempMin} onChange={(e) => handleInputChange(e, 'tempRange')} step="1"></input>
                                    <input type="range" id="tempMax" className="range-max" min="20" max="30"  value={tempMax} onChange={(e) => handleInputChange(e, 'tempRange')} step="1"></input>
                                </div>   
                        </div>
                        <label className='switch' id='tempswitch'>
                            <input type='checkbox' id='cs3' value={tempEn} onChange={()=>handleCheckChange("tempEn")}></input>
                            <span className='slider round'></span>
                        </label>
                    </div>
                    <div className="save-range">
                        <button type='button' id='Save' onClick={updateRanges}>Save Changes</button>
                    </div>   
                </div>
                <div className="wrap-timers">
                    <div className="wrap-timezone">
                        <h2 id='st1'>TIMEZONE:</h2>
                        <select id="timezone-list" value={timezone} onChange={(e) => handleInputChange(e, 'timezone')}>
                            <option>UTC</option>
                        </select>
                        <button type='button' id='Save' onClick={updateTimezone}>Save Changes</button>
                    </div>
                    <div className="wrap-timers2">
                        <div className="wrap-feed">
                            <form className='form-horizontal' role='form'>
                                <h2 id='st1'>FEED TIMES:</h2>
                                <label className='switch' id='feedswitch'>
                                    <input type='checkbox' id='cs4' value={feedEn} onChange={()=>handleCheckChange("feedEn")}></input>
                                    <span className='slider round'></span>
                                </label>
                            </form>
                            <div className="wrap-first" id="wrap1">
                                <p id='cs4'>1 : 
                                    <select id="firsthour" value={firsthour} onChange={(e) => handleInputChange(e, 'firstHour') }>
                                        <option>00</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option>
                                        <option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option>
                                        <option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option>
                                        <option>19</option><option>20</option><option>21</option><option>22</option><option>23</option>
                                    </select> :
                                    <select id="firstminute" value={firstminute} onChange={(e) => handleInputChange(e, 'firstMinute')}>
                                            <option>00</option><option>15</option><option>30</option><option>45</option>
                                    </select>  
                                    <button type='button' id='delete-t1' onClick={deleteTime}>x</button>                    
                                </p>
                            </div>
                            <div className="wrap-second" id="wrap2">
                                <p id='cs4'>2 : 
                                    <select id="secondhour" value={secondhour} onChange={(e) => handleInputChange(e, 'secondHour')}>
                                        <option>00</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option>
                                        <option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option>
                                        <option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option>
                                        <option>19</option><option>20</option><option>21</option><option>22</option><option>23</option>
                                    </select> :
                                    <select id="secondminute"  value={secondminute} onChange={(e) => handleInputChange(e, 'secondMinute')}>
                                            <option>00</option><option>15</option><option>30</option><option>45</option>
                                    </select>
                                    <button  type='button' id='delete-t2' onClick={deleteTime}>x</button>      
                                </p>
                            </div>
                            <div className="wrap-third" id="wrap3">
                                <p id='cs4'>3 : 
                                    <select id="thirdhour"  value={thirdhour} onChange={(e) => handleInputChange(e, 'thirdHour')}>
                                        <option>00</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option>
                                        <option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option>
                                        <option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option>
                                        <option>19</option><option>20</option><option>21</option><option>22</option><option>23</option>
                                    </select> :
                                    <select  id="thirdminute"  value={thirdminute} onChange={(e) => handleInputChange(e, 'thirdMinute')}>
                                            <option>00</option><option>15</option><option>30</option><option>45</option>
                                    </select>
                                    <button  type='button' id='delete-t3' onClick={deleteTime}>x</button>      
                                </p>
                            </div>
                            <button id='addtime' onClick={addTime}>Add Time</button>
                            <button type='button' id='Save' onClick={updateFeed}>Save Changes</button>
                        </div>
                        <div className="wrap-led">
                            <h2 id='st1'>LED TIMES:</h2>
                            <label className='switch' id='ledSwitch'>
                                <input type='checkbox' id='cs5' value={ledEn} onChange={()=>handleCheckChange("ledEn")}></input>
                                <span className='slider round'></span>
                            </label>
                            <p id='cs5'>ON : 
                                <select id="LEDonHour" disabled value={LEDonHour} onChange={(e) => handleInputChange(e, 'LEDonHour') }>
                                    <option>00</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option>
                                    <option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option>
                                    <option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option>
                                    <option>19</option><option>20</option><option>21</option><option>22</option><option>23</option>
                                </select> :
                                <select id="LEDonMinute" disabled value={LEDonMinute} onChange={(e) => handleInputChange(e, 'LEDonMinute')}>
                                        <option>00</option><option>15</option><option>30</option><option>45</option>
                                </select>                      
                                </p>
                            <p id='cs5'>OFF : 
                                <select id="LEDoffHour" disabled value={LEDoffHour} onChange={(e) => handleInputChange(e, 'LEDoffHour')}>
                                    <option>00</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option>
                                    <option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option>
                                    <option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option>
                                    <option>19</option><option>20</option><option>21</option><option>22</option><option>23</option>
                                </select> :
                                <select id="LEDoffMinute" disabled value={LEDoffMinute} onChange={(e) => handleInputChange(e, 'LEDoffMinute')}>
                                        <option>00</option><option>15</option><option>30</option><option>45</option>
                                </select>
                            </p>
                            <button type='button' id='Save' onClick={updateLED}>Save Changes</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default Settings;