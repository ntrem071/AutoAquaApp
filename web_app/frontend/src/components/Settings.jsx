import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Settings() {
    const navigate = useNavigate();
    

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

    const handleInputChange = (e, type) => {
        setError('');

        switch(type){
            case 'pHMin':
                setpHMin(e.target.value);
                if(e.target.value === '') {
                    setError('Minimum pH is missing');
                } 
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
                settempMin(e.target.value);
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
        var url = 'http://localhost:8000/users/6539eb93a1864e481b0d7f10/ranges';
        var data = {
            phRange: [pHMin, pHMax],
            ecRange: [ecMin, ecMax],
            tempRange: [tempMin, tempMax],
            phEnable: phEn,
            ecEnable: ecEn,
            tempEnable: tempEn                    
        };
        sendRequest(url, data);    
    }

    function updateFeed(){
        var url = 'http://localhost:8000/users/feed';
        var data = {
            feedEnable: feedEn,
            feedTimer: [[firsthour,firstminute],[secondhour,secondminute],[thirdhour,thirdminute]]                      
        };
        sendRequest(url, data);
    }
    function updateLED(){
        var url = 'http://localhost:8000/users/led';
        var data = {
            ledEnable: ledEn,
            ledTimer: [[LEDoffHour,LEDoffMinute],[LEDonHour,LEDonMinute]]                    
        };
        sendRequest(url, data);
    }
    function updateTimezone(){
        var url = 'http://localhost:8000/users/timezone';
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
            //mode: 'no-cors',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((response) => {
            setMessage(response[0].result);
            console.log('it is reaching the final then')
        })
        .catch((err) => {
            setError(err);
            console.log('it is getting caught');
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
                    <h2 id='rangeTitle'>Ranges:</h2><br></br>
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
                        <input type='checkbox' value={phEn} onChange={(e)=>handleInputChange(e,"phEn")}></input>
                        <span class='slider round'></span>
                    </label>
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
                        <input type='checkbox' value={ecEn} onChange={(e)=>handleInputChange(e,"ecEn")}></input>
                        <span class='slider round'></span>
                    </label>
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
                        <input type='checkbox' value={tempEn} onChange={(e)=>handleInputChange(e,"tempEn")}></input>
                        <span class='slider round'></span>
                    </label>
                    </p><br></br>
                    <button type='button' id='Save' onClick={updateRanges}>Save Changes</button>

                    <h2>Feed:</h2>
                    <label class='switch' id='Feedswitch'>
                        <input type='checkbox' value={feedEn} onChange={(e)=>handleInputChange(e,"feedEn")}></input>
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
                        <input type='checkbox' value={ledEn} onChange={(e)=>handleInputChange(e,"ledEn")}></input>
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
    );
}

export default Settings;