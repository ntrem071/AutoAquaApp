import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import { DatapH } from "../utils/DatapH";
import { DataWaterLevel } from "../utils/DataWaterLevel";
import { DataEC } from "../utils/DataEC";
import { DataTemp } from "../utils/DataTemp";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import './Homepage.css';

function Homepage() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    const [error, setError] = useState('');
    
    const optionspH = {
        plugins: {
            legend: {
                display: false
            },
            responsive: false
        },
        // responsive: false,
        scales: {
            x:{
                ticks: {
                    color: ['black', 'rgb(105,105,105)']
                },
                title: {
                    display: true,
                    text: 'Time from last hour in minutes',
                    color: 'black'
                }
            },
            y:
            {
                ticks: {
                    color: 'black'
                },
                afterDataLimits: (scale) => {
                    scale.max = 8;
                    scale.min = 6;},
            }
        },
    };

    const optionsWaterLevel = {
        plugins: {
            legend: {
                display: false
            },
        },
        scales: {
            x:{
                ticks: {
                    color: ['black', 'rgb(105,105,105)']
                },
                title: {
                    display: true,
                    text: 'Time from last hour in minutes',
                    color: 'black'
                }
            },
            y:
            {
                ticks: {
                    color: 'black'
                },
                afterDataLimits: (scale) => {
                    scale.max = 300;
                    scale.min = 150;},
            }
        },
    };

    const optionsEC = {
        plugins: {
            legend: {
                display: false
            },
        },
        scales: {
            x:{
                ticks: {
                    color: ['black', 'rgb(105,105,105)']
                },
                title: {
                    display: true,
                    text: 'Time from last hour in minutes',
                    color: 'black'
                }
            },
            y:{
                ticks: {
                    color: 'black'
                },
                afterDataLimits: (scale) => {
                    scale.max = 5.0;
                    scale.min = 2.0;},
            }
        },
    };

    const optionsTemp = {
        plugins: {
            legend: {
                display: false
            },
        },
        scales: {
            x:{
                ticks: {
                    color: ['black', 'rgb(105,105,105)']
                },
                title: {
                    display: true,
                    text: 'Time from last hour in minutes',
                    color: 'black'
                }
            },
            y:
            {
                ticks: {
                    color: 'black'
                },
                afterDataLimits: (scale) => {
                    scale.max = 35.0;
                    scale.min = 15.0;},
            }
        },
    };

    const [pHData, setpHData] = useState({
        labels: DatapH.map((data) => data.time),
        datasets: [
          {
            label: "pH",
            data: DatapH.map((data) => data.values),
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
          }
        ]
    });

    const [waterLevlData, setwaterLevlData] = useState({
        labels: DataWaterLevel.map((data) => data.time),
        datasets: [
          {
            label: "water level",
            data: DataWaterLevel.map((data) => data.values),
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
          }
        ]
    });

    const [ecData, setecData] = useState({
        labels: DataEC.map((data) => data.time),
        datasets: [
          {
            label: "water level",
            data: DataEC.map((data) => data.values),
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
          }
        ]
    });

    const [tempData, settempData] = useState({
        labels: DataTemp.map((data) => data.time),
        datasets: [
          {
            label: "water level",
            data: DataTemp.map((data) => data.values),
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
          }
        ]
    });

    function nav(str){
        document.cookie = `sessionId=${sessionId}`
        navigate(str)
    }

    function displayNavSmall(){

        document.getElementsByClassName("nav")[0].style.display = 'flex';
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
            if((!(data.phGraph[0]==null))){setpHData(data.phGraph);}
            if((!(data.ecGraph[0]==null))){setecData(data.ecGraph);}
            if((!(data.tempGraph[0]==null))){settempData(data.tempGraph);}
            if((!(data.waterGraph[0]==null))){setwaterLevlData(data.waterGraph);}
            
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }
    
    return(

        <body>
            <div id="nav-small-bar">
            </div>
            <div className='nav'>
                <button id='navhome' style={{backgroundColor: "#08398d"}} variant='contained' onClick={() => nav('/Home')}>&nbsp;</button>
                <button id='navuser' variant='contained' onClick={() => nav('/User-Info')}>&nbsp;</button>
                <button id='navfish' variant='contained' onClick={() => nav('/Fish')}>&nbsp;</button>
                <button id='navinfo' variant='contained' onClick={() => nav('/Information')}>&nbsp;</button>
                <button id='navsettings' variant='contained' onClick={() => nav('/Settings')}>&nbsp;</button>
            </div>
            <div className='Homepage'>
                <div className='outerbox-hp'>
                    <div className='wrap-graphs'>
                        <h3 id='wltitle'>Water Level</h3>
                        <Line data={waterLevlData} options={optionsWaterLevel}/>
                    </div>
                    <div className='wrap-graphs'>
                        <h3 id='phtitle'>pH Level</h3>
                        <Line data={pHData} options={optionspH}/>                        
                    </div>
                    <div className='wrap-graphs'>
                        <h3 id='ectitle'>Electrical Condutivity</h3>
                        <Line data={ecData} options={optionsEC}/>                        
                    </div>
                    <div className='wrap-graphs'>
                        <h3 id='ttitle'>Temperature</h3>
                        <Line data={tempData} options={optionsTemp}/>                        
                    </div>
                </div>    
            </div>
        </body> 
    );
}

export default Homepage;