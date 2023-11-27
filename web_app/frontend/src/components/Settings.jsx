import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Settings() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    const ranges = {
        pHRangeMin : 6.7,
        pHRangeMax : 8.3,
        ecRangeMin : 2,
        ecRangeMax : 4,
        tempRangeMin : 16.7,
        tempRangeMax : 20.0
    }

    const [pHMin, setpHMin] = useState('');
    const [pHMax, setpHMax] = useState('');
    const [ecMin, setecMin] = useState('');
    const [ecMax, setecMax] = useState('');
    const [tempMin, settempMin] = useState('');
    const [tempMax, settempMax] = useState('');
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
    const [phEn, setPHEnable] = useState(false);
    const [ecEn, setECEnable] = useState(false);
    const [tempEn, setTempEnable] = useState(false);
    const [feedEn, setFeedEnable] = useState(false);
    const [ledEn, setLEDEnable] = useState(false);

    const [error, setError] = useState('');


    useEffect(() => {
        console.log("Component has mounted");
        setValues();
        
    }, []);

    const handleInputChange = (e, type) => {
        setError('');

        console.log(e);
        switch(type){
            case 'pHMin':
                setpHMin(e.target.value);
                if(e.target.value === '')
                    setError('Minimum pH is missing');
                if(!document.getElementById('pHErrorValue').hidden)
                    document.getElementById('pHErrorValue').hidden = true;
                break;
            case 'pHMax':
                setpHMax(e.target.value);
                if(e.target.value === '') {
                    setError('Maximum pH is missing');
                } 
                break;
            case 'ecMin':
                setecMin(e.target.value);
                if(e.target.value === '') {
                    setError('Minimum electrical conductivity is missing');
                } 
                break;
                
            case 'ecMax':
                setecMax(e.target.value);
                if(e.target.value === '') {
                    setError('Maximum electrical conductivity is missing');
                } 
                break; 
            case 'tempMin':
                settempMin(e.target.value,true);
                if(e.target.value === '') {
                    setError('Minimum temperature is missing');
                }
                break;

            case 'tempMax':
                settempMax(e.target.value);
                if(e.target.value === '') {
                    setError('Maximum temperature is missing');
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
                

            case 'phEn':
                setPHEnable(!phEn); //console.log("ph: ",phEn);
                toggleRangeDisable(phEn, 'pHMin', 'pHMax')
                break;
            case 'ecEn':
                setECEnable(!ecEn); //console.log("ec: ",ecEn); 
                toggleRangeDisable(ecEn, 'ecMin', 'ecMax')
                break;
            case 'tempEn':
                setTempEnable(!tempEn);//console.log("temp: ",tempEn);
                toggleRangeDisable(tempEn, 'tempMin', 'tempMax')
                break;
            case 'feedEn':
                setFeedEnable(!feedEn); //console.log("feed: ",feedEn);
                break;
            case 'ledEn':
                setLEDEnable(!ledEn); //console.log("led: ",ledEn); 
                toggleLEDDisable();
                break;

            default:
        }
    }
    function toggleRangeDisable(va, str1, str2){
        if(va){
            document.getElementById(str1).disabled= true;
            document.getElementById(str2).disabled= true;
        }else{
            document.getElementById(str1).disabled= false;
            document.getElementById(str2).disabled= false;
        }
    }
    function toggleLEDDisable(){
        if(ledEn){
            document.getElementById('LEDonHour').disabled=true;
            document.getElementById('LEDonMinute').disabled=true;
            document.getElementById('LEDoffHour').disabled=true;
            document.getElementById('LEDoffMinute').disabled=true;
            document.getElementById('LEDswitch').disabled=true;

            document.getElementById('ledHoursON').disabled=true;
            document.getElementById('ledMinutesON').disabled=true;
            document.getElementById('ledHoursOFF').disabled=true;
            document.getElementById('ledMinutesOFF').disabled=true;

        }else{
            document.getElementById('LEDonHour').disabled=false;
            document.getElementById('LEDonMinute').disabled=false;
            document.getElementById('LEDoffHour').disabled=false;
            document.getElementById('LEDoffMinute').disabled=false;
            document.getElementById('LEDswitch').disabled=false;

            document.getElementById('ledHoursON').disabled=false;
            document.getElementById('ledMinutesON').disabled=false;
            document.getElementById('ledHoursOFF').disabled=false;
            document.getElementById('ledMinutesOFF').disabled=false;
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

    function rangeValueError(m = " "){
        this.message = m;

    }

    rangeValueError.prototype = new Error();

    function pHVerification(v, minT){ //minT = true if it's the minimum range value
        
        var pH = parseFloat(v);
        if(ranges.pHRangeMin > pH || pH > ranges.pHRangeMax){
            var e = new rangeValueError("invalid pH value");
            e.pHErr = true;
            throw e; 
        }
        if(minT){
            if(pH > pHMax){
                var e = new rangeValueError("invalid minimun pH range value");
                e.pHErr = true;
                throw e; 
            }
        }else{
            if(pH < pHMin){
                var e = new rangeValueError("invalid maximum pH range value");
                e.pHErr = true;
                throw e; 
            }
        }
    }
    function ecVerification(v,minT){
        
        var ec = parseFloat(v);
        if(ranges.ecRangeMin > ec || ec > ranges.ecRangeMax){
            var e = new rangeValueError("invalid electrical conductivity value");
            e.ecErr = true;
            throw e; 
        }
        if(minT){
            if(ec > ecMax){
                var e = new rangeValueError("invalid minimun electrical conductivity range value");
                e.ecErr = true;
                throw e; 
            }
        }else{
            if(ec < ecMin){
                var e = new rangeValueError("invalid maximum electrical conductivity range value");
                e.ecErr = true;
                throw e; 
            }
        }
    }

    function tempVerification(v,minT){
        
        var temp = parseFloat(v);
        if(ranges.tempRangeMin > temp || temp > ranges.tempRangeMax){
            var e = new rangeValueError("invalid temperature value");
            e.tempErr = true;
            throw e; 
        }
        if(minT){
            if(temp > tempMax){
                var e = new rangeValueError("invalid minimun temperature range value");
                e.tempErr = true;
                throw e; 
            }
        }else{
            if(temp < tempMin){
                var e = new rangeValueError("invalid maximum temperature range value");
                e.tempErr = true;
                throw e; 
            }
        }

    }

    function updateRanges(){

        try{
            pHVerification(pHMin,true);
            pHVerification(pHMax,false);
            if(!document.getElementById('pHErrorValue').hidden)
                document.getElementById('pHErrorValue').hidden = true;
            ecVerification(ecMin,true);
            ecVerification(ecMax,false);
            if(!document.getElementById('ecErrorValue').hidden)
                document.getElementById('ecErrorValue').hidden = true;
            tempVerification(tempMin,true);
            tempVerification(tempMax,false);
            if(!document.getElementById('tempErrorValue').hidden)
                document.getElementById('tempErrorValue').hidden = true;

            var url = 'http://localhost:8000/users/'+sessionId+'/ranges';
            var data = {
            phRange: [pHMin, pHMax],
            ecRange: [ecMin, ecMax],
            tempRange: [tempMin, tempMax],
            phEnable: phEn,
            ecEnable: ecEn,
            tempEnable: tempEn                    
            };
            sendRequest(url, data);  
            return;

        }catch(err){
            console.log(err);
            if(err.pHErr)
                document.getElementById('pHErrorValue').hidden = false;
            if(err.ecErr)
                document.getElementById('ecErrorValue').hidden = false;
            if(err.tempErr)
                document.getElementById('tempErrorValue').hidden = false;
            return; 
        }
    }

    function updateFeed(){
        var url = 'http://localhost:8000/users/'+sessionId+'/feed';
        var data = {
            feedEnable: feedEn,
            feedTimer: [[firsthour,firstminute],[secondhour,secondminute],[thirdhour,thirdminute]]                      
        };
        sendRequest(url, data);
    }
    function updateLED(){
        var url = 'http://localhost:8000/users/'+sessionId+'/led';
        var data = {
            ledEnable: ledEn,
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
        console.log('it reaches here');
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

                if((!(data.phRange[0]==null))){setpHMin(data.phRange[0]);}
                if((!(data.phRange[1]==null))){setpHMax(data.phRange[1]);}
                if((!(data.ecRange[0]==null))){setecMin(data.ecRange[0]);}
                if((!(data.ecRange[1]==null))){setecMax(data.ecRange[1]);}
                if((!(data.tempRange[0]==null))){settempMin(data.tempRange[0])}
                if((!(data.tempRange[1]==null))){settempMax(data.tempRange[1]);}

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

                if(data.phEnable==true){
                    document.getElementById('cs1').click();
                    console.log(phEn);
                }
                //toggle booleans --> issues getting toggle to reflect user boolean values
                /*
                
                if(data.ecEnable==true){}
                if(data.tempEnable==true){}
                if(data.feedEnable==true){}
                if(data.ledEnable==true){}
                */
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
                    <button id='navsettings' style={{backgroundColor: "#08398d"}} variant='contained' title='Settings' onClick={() => navigate('/Settings')}>&nbsp;</button>
                    </div>
                <div>
                    <h2 id='rangeTitle'>Ranges:</h2><br></br>
                    <div>
                        pH = {ranges.pHRangeMin} , {ranges.pHRangeMax} 
                    </div>
                    <div>
                    electrical conductivity = {ranges.ecRangeMin} , {ranges.ecRangeMax} 
                    </div>
                    <div>
                    temperature = {ranges.tempRangeMin} , {ranges.tempRangeMax}
                    </div>
                    <p id='phTitle'>pH 
                    <input
                        type='text'
                        id='pHMin'
                        placeholder='min'
                        value={pHMin.toString()}
                        onChange={(e) => handleInputChange(e, 'pHMin')}
                        disabled
                    ></input> : 
                    <input
                        type='text'
                        id='pHMax'
                        placeholder='max'
                        value={pHMax.toString()}
                        onChange={(e) => handleInputChange(e, 'pHMax')}
                        disabled
                    ></input>
                    <label class='switch' id='pHswitch'>
                        <input type='checkbox' id='cs1' value={phEn} onChange={(e)=>handleInputChange(e,"phEn")}></input>
                        <span class='slider round' id='phSlider'></span>
                    </label>
                    <p id="pHErrorValue" hidden color='#cc0000'>*Please enter a valid pH value within the appropriate range</p>
                    </p><br></br>
                    <p id='ECTitle'>Electrical Conductivity 
                    <input
                        type='text'
                        id='ecMin'
                        placeholder='min'
                        value={ecMin.toString()}
                        onChange={(e) => handleInputChange(e, 'ecMin')}
                        disabled
                    ></input> :  
                    <input
                        type='text'
                        id='ecMax'
                        placeholder='max'
                        value={ecMax.toString()}
                        onChange={(e) => handleInputChange(e, 'ecMax')}
                        disabled
                    ></input>
                    <label class='switch' id='ecswitch'>
                        <input type='checkbox' id='cs2' value={ecEn} onChange={(e)=>handleInputChange(e,"ecEn")}></input>
                        <span class='slider round'></span>
                    </label>
                    <p id="ecErrorValue" hidden color='#cc000'>*Please enter a valid electrical conductivity value within the appropriate range</p>
                    </p><br></br>
                    <p id='tempTitle'>Temperature 
                    <input
                        type='text'
                        id='tempMin'
                        placeholder='min'
                        value={tempMin.toString()}
                        onChange={(e) => handleInputChange(e, 'tempMin')}
                        disabled
                    ></input> : 
                    <input
                        type='text'
                        id='tempMax'
                        placeholder='max'
                        value={tempMax.toString()}
                        onChange={(e) => handleInputChange(e, 'tempMax')}
                        disabled
                    ></input>
                    <label class='switch' id='tempswitch'>
                        <input type='checkbox' id='cs3' value={tempEn} onChange={(e)=>handleInputChange(e,"tempEn")}></input>
                        <span class='slider round'></span>
                    </label>
                    </p><br></br>
                    <p id="tempErrorValue" hidden color='#cc000'>*Please enter a valid temperature value within the appropriate range</p>
                    <button type='button' id='Save' onClick={updateRanges}>Save Changes</button>

                    <h2>Feed:</h2>
                    <label class='switch' id='Feedswitch'>
                        <input type='checkbox' id='cs4' value={feedEn} onChange={(e)=>handleInputChange(e,"feedEn")}></input>
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
                    <h2>LED:</h2>
                    <label class='switch' id='LEDswitch'>
                        <input type='checkbox' id='cs5' value={ledEn} onChange={(e)=>handleInputChange(e,"ledEn")}></input>
                        <span class='slider round'></span>
                    </label><br></br>
                    <p id='LEDOn'>ON : 
                        <select id="ledHoursON" disabled>
                            <option>00</option>
                            <option>01</option>
                            <option>02</option>
                            <option>03</option>
                            <option>04</option>
                            <option>05</option>
                            <option>06</option>
                            <option>07</option>
                            <option>08</option>
                            <option>09</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                            <option>13</option>
                            <option>14</option>
                            <option>15</option>
                            <option>16</option>
                            <option>17</option>
                            <option>18</option>
                            <option>19</option>
                            <option>20</option>
                            <option>21</option>
                            <option>22</option>
                            <option>23</option>
                        </select> :
                        <select id="ledMinutesON" disabled>
                                <option>00</option>
                                <option>05</option>
                                <option>10</option>
                                <option>15</option>
                                <option>20</option>
                                <option>25</option>
                                <option>30</option>
                                <option>35</option>
                                <option>40</option>
                                <option>45</option>
                                <option>50</option>
                                <option>55</option>
                        </select>
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
                    <p id='LEDOff'>OFF :
                    <select id="ledHoursOFF" disabled>
                            <option>00</option>
                            <option>01</option>
                            <option>02</option>
                            <option>03</option>
                            <option>04</option>
                            <option>05</option>
                            <option>06</option>
                            <option>07</option>
                            <option>08</option>
                            <option>09</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                            <option>13</option>
                            <option>14</option>
                            <option>15</option>
                            <option>16</option>
                            <option>17</option>
                            <option>18</option>
                            <option>19</option>
                            <option>20</option>
                            <option>21</option>
                            <option>22</option>
                            <option>23</option>
                        </select> :
                        <select id="ledMinutesOFF" disabled>
                                <option>00</option>
                                <option>05</option>
                                <option>10</option>
                                <option>15</option>
                                <option>20</option>
                                <option>25</option>
                                <option>30</option>
                                <option>35</option>
                                <option>40</option>
                                <option>45</option>
                                <option>50</option>
                                <option>55</option>
                        </select>
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
    );
}

export default Settings;