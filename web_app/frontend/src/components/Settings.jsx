import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settingscss.css';

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

    const [error, setError] = useState('');

    const handleInputChange = (e, type) => {
        switch(type){
            case 'pHMin':
                setError('');
                setpHMin(e.target.value);
                console.log(e.target.value);
                break;
            case 'pHMax':
                setError('');
                setpHMax(e.target.value);
                break;
            case 'ecMin':
                setError('');
                setecMin(e.target.value);
                break;
            case 'ecMax':
                setError('');
                setecMax(e.target.value);
                break;
            case 'tempMin':
                setError('');
                settempMin(e.target.value);
                break;
            case 'tempMax':
                setError('');
                settempMax(e.target.value);
                break;

            case 'LEDonHour':
                setError('');
                setLEDonHour(e.target.value);
                break;
            case 'LEDonMinute':
                setError('');
                setLEDonMinute(e.target.value);
                break;
            case 'LEDoffHour':
                setError('');
                setLEDoffHour(e.target.value);
                break;
            case 'LEDoffMinute':
                setError('');
                setLEDoffMinute(e.target.value);
                break;

            case 'firstHour':
                setError('');
                setfirstHour(e.target.value);
                break;
            case 'firstMinute':
                setError('');
                setfirstMinute(e.target.value);
                break;
            case 'secondHour':
                setError('');
                setsecondHour(e.target.value);
                break;
            case 'secondMinute':
                setError('');
                setsecondMinute(e.target.value);
                break;
            case 'thirdHour':
                setError('');
                setthirdHour(e.target.value);
                break;
            case 'thirdMinute':
                setError('');
                setthirdMinute(e.target.value);
                break;
                
            default:
        }
    }

    function ToggleTextAddTime(){
        var feedtime = document.getElementById(time);
        if(time === 'first'){
            setTime('second');
            feedtime.style.display = 'inline';
        }else if(time === 'second'){
            setTime('third');
            feedtime.style.display = 'inline';
        }else if(time === 'third'){
            setMessage('Cannot add more feed times')
        }else{
            time = 'first';
            feedtime.style.display = 'inline';
        }
    }

    function updateRanges(){
        var url = 'http://localhost:8000/users/ranges';
        var data = {
            phRange: {pHMin, pHMax},
            ecRange: {ecMin, ecMax},
            tempRange: {tempMin, tempMax},
            phEnable: 1,
            ecEnable: 1,
            tempEnable: 1                    
        };
        sendRequest(url, data);    
    }
    function updateFeed(){
        var url = 'http://localhost:8000/users/feed';
        var data = {
            ledEnable: 1,
            ledTimer: [[LEDoffHour,LEDoffMinute],[LEDonHour,LEDonMinute]]                    
        };
        sendRequest(url, data);
    }
    function updateLED(){
        var url = 'http://localhost:8000/users/led';
        var data = {
            feedEnable: 1,
            feedTimer: [[firsthour,firstminute],[secondhour,secondminute],[thirdhour,thirdminute]]                      
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
        var headers = {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        };
        console.log(JSON.stringify(data));
        fetch(url, {
            mode: 'no-cors',
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
        // this used to be in the div below style={styles.settingscss}
        <div class='Settings'>
            <h1>WARNING</h1>
            <h3>
                <button variant='contained' onClick={() => navigate('/Home')}>Home</button>
                <button variant='contained' onClick={() => navigate('/User-Info')}>User Info</button>
                <button variant='contained' onClick={() => navigate('/Fish')}>Fish</button>
                <button variant='contained' onClick={() => navigate('/Information')}>Information</button>
                <button variant='contained' onClick={() => navigate('/Settings')}>Settings</button>
                <div>
                    <h2 id='rangeTitle'>Ranges:</h2><br></br>
                    <p id='phTitle'>pH 
                    <input
                        type='text'
                        id='pHMin'
                        placeholder='min'
                        value={pHMin.toString()}
                        onChange={(e) => handleInputChange(e, 'pHMin')}
                    ></input> : 
                    <input
                        type='text'
                        id='pHMax'
                        placeholder='max'
                        value={pHMax.toString()}
                        onChange={(e) => handleInputChange(e, 'pHMax')}
                    ></input>
                    <label class='switch' id='pHswitch'>
                        <input type='checkbox'></input>
                        <span class='slider'></span>
                    </label>
                    </p><br></br>
                    <p id='ECTitle'>Conductivity 
                    <input
                        type='text'
                        id='ecMin'
                        placeholder='min'
                        value={ecMin.toString()}
                        onChange={(e) => handleInputChange(e, 'ecMin')}
                    ></input> : 
                    <input
                        type='text'
                        id='ecMax'
                        placeholder='max'
                        value={ecMax.toString()}
                        onChange={(e) => handleInputChange(e, 'ecMax')}
                    ></input>
                    <label class='switch'>
                        <input type='checkbox' id='ecswitch'></input>
                        <span class='slider'></span>
                    </label>
                    </p><br></br>
                    <p id='tempTitle'>Temperature 
                    <input
                        type='text'
                        id='tempMin'
                        placeholder='min'
                        value={tempMin.toString()}
                        onChange={(e) => handleInputChange(e, 'tempMin')}
                    ></input> : 
                    <input
                        type='text'
                        id='tempMax'
                        placeholder='max'
                        value={tempMax.toString()}
                        onChange={(e) => handleInputChange(e, 'tempMax')}
                    ></input>
                    <label class='switch' id='tempswitch'>
                        <input type='checkbox'></input>
                        <span class='slider'></span>
                    </label>
                    </p><br></br>
                    <button type='button' id='Save' onClick={updateRanges}>Save Changes</button>

                    <h2>Feed:</h2><br></br>
                    <p id='first'>#1 
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
                    <p id='second'>#2 
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
                    <p id='third'>#3  
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
                    id='addtime' onClick={ToggleTextAddTime}>Add Time
                    </button><br></br>
                    <button type='button' id='Save' onClick={updateFeed}>Save Changes</button>
                    <h2>LED:</h2>
                    <label class='switch' id='LEDswitch'>
                        <input type='checkbox'></input>
                        <span class='slider'></span>
                    </label><br></br>
                    <p id='LEDOn'>ON 
                        <input
                            type='text'
                            id='LEDonHour'
                            placeholder='hour'
                            value={LEDonHour.toString()}
                            onChange={(e) => handleInputChange(e, 'LEDonHour')}
                        ></input> : 
                        <input
                            type='text'
                            id='LEDonMinute'
                            placeholder='minute'
                            value={LEDonMinute.toString()}
                            onChange={(e) => handleInputChange(e, 'LEDonMinute')}
                        ></input>
                    </p><br></br>
                    <p id='LEDOff'>OFF 
                        <input
                            type='text'
                            id='LEDoffHour'
                            placeholder='hour'
                            value={LEDoffHour.toString()}
                            onChange={(e) => handleInputChange(e, 'LEDoffHour')}
                        ></input> : 
                        <input
                            type='text'
                            id='LEDoffMinute'
                            placeholder='minute'
                            value={LEDoffMinute.toString()}
                            onChange={(e) => handleInputChange(e, 'LEDoffMinute')}
                        ></input>
                    </p>

                </div>
            </h3>
            <button type='button' id='Save' onClick={updateLED}>Save Changes</button>

        </div>
    );
}

export default Settings;