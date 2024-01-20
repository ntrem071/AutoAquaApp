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
import userIcon from '../pictures/user.png';
import generalUserIconImage from '../pictures/userImageFishUwU.png';


function Homepage() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    const [error, setError] = useState('');

    var navDrop = false;
    
    useEffect(() => {
        setValues(); 
    }, []);

    const [tWater, setTWater] = useState('day');
    const [tEC, setTEC] = useState('day');
    const [tPH, setTPH] = useState('day');
    const [tTemp, setTTemp] = useState('day');

    const [pHData, setpHData] = useState(graphData([0,0]));
    const [waterLevlData, setwaterLevlData] = useState(graphData([0,0]));
    const [ecData, setecData] = useState(graphData([0,0]));
    const [tempData, settempData] = useState(graphData([0,0]));

    const [inPH, setInPH] = useState(graphData([0,0]));
    const [inWaterLevel, setInWaterLevel] = useState(graphData([0,0]));
    const [inEC, setInEC] = useState(graphData([0,0]));
    const [inTemp, setInTemp] = useState(graphData([0,0]));

    const handleInputChange = (e, type) => {
        setError('');
        var n; 
        if(e.target.value=='day'){n=24;}
        else if (e.target.value=='week'){n=168;}
        else if (e.target.value=='month'){n=760;}

        switch(type){
            case 'water':
                setTWater(e.target.value);
                setwaterLevlData(graphData(inWaterLevel.slice(0,n)));
                break;
            case 'ec':
                setTEC(e.target.value);
                setecData(graphData(inEC.slice(0,n)));
                break;
            case 'ph':
                setTPH(e.target.value);
                setpHData(graphData(inPH.slice(0,n)));
                break;
            case 'temp':
                setTTemp(e.target.value);
                settempData(graphData(inTemp.slice(0,n)));
                break;
            default:
        }
        
        if(error!=''){
            console.log(error);
        }
    }


    function graphData(points){
        var d = {
            labels: points.map((data) => data[0]),
            datasets: [
              {
                label: "pH",
                data: points.map((data) => data[1]),
                backgroundColor: "rgba(33,150,243,1.0)",
                borderColor: "rgba(33,150,243,1)",
                pointRadius: 1,
                pointHoverRadius: 3,
                borderWidth: 1,
                spanGaps: true,
                fill: {
                    target: 'origin',
                    above: 'rgb(33,150,243, 0.2)',   
                  }
              }
            ]
        };
        return d;
    }

    function graphOptions(labelY){
        var op = {
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x:{ 
                    ticks: {
                        color: ['black', 'rgb(105,105,105)']
                    },
                    title: {
                        display: true,
                        text: 'Timestamp',
                        color: 'black'
                    }
                },
                y:{
                    ticks: {
                        color: 'black'
                    },
                    title: {
                        display: true,
                        text: labelY,
                        color: 'black'
                    }
                    
                }
            },
        };
        return op;
    }

    function displayNavSmall(){

        document.getElementsByClassName("nav")[0].style.display = 'flex';
    }

    function setValues(){
        var url = 'http://localhost:8000/users/'+sessionId+'/home';
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
            console.log(data)

            if((!(data.phGraph[0]==null))){
                setInPH(data.phGraph);
                setpHData(graphData(data.phGraph.slice(0,24)));
            }
            if((!(data.ecGraph[0]==null))){
                setInEC(data.ecGraph);
                setecData(graphData(data.ecGraph.slice(0,24)));
            }
            if((!(data.tempGraph[0]==null))){
                setInTemp(data.tempGraph);
                settempData(graphData(data.tempGraph.slice(0,24)));
            }
            if((!(data.waterGraph[0]==null))){
                setInWaterLevel(data.waterGraph);
                setwaterLevlData(graphData(data.waterGraph.slice(0,24)));
            }
            
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

        <div className='Homepage'>
            <div className="navbar">
                <span style={{fontFamily:'Courier', color: 'white'}}>Hello Mr. Bubbles! </span>
                <img id='userIcon' src={generalUserIconImage}></img>
                <button id='nav-button' onClick={displayNavSmall}></button>
                <div className="nav-dropdwn">
                    <button id='navhome' style={{backgroundColor: "#08398d"}} variant='contained' title='Home' onClick={() => navigate('/Home')}>
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
                    <button id='navsettings' variant='contained' title='Settings' onClick={() => navigate('/Settings')}>
                        <h1 id='nav-text'>Settings</h1>
                        &nbsp;
                    </button>
                </div> 
            </div>
            <div className='nav'>
                <button id='navhome' style={{backgroundColor: "#08398d"}} variant='contained' onClick={() => navigate('/Home')}>&nbsp;</button>
                <button id='navuser' variant='contained' onClick={() => navigate('/User-Info')}>&nbsp;</button>
                <button id='navfish' variant='contained' onClick={() => navigate('/Fish')}>&nbsp;</button>
                <button id='navinfo' variant='contained' onClick={() => navigate('/Information')}>&nbsp;</button>
                <button id='navsettings' variant='contained' onClick={() => navigate('/Settings')}>&nbsp;</button>
            </div>
            <div className='outerbox-hp'>
                <div className='wrap-graphs'>
                    <h3 id='wltitle'>Water Level</h3>
                    <Line data={waterLevlData} options={graphOptions('Water Level (mm)')}/>
                    <select id="st-water" value={tWater} onChange={(e) => handleInputChange(e, 'water')}>
                        <option>day</option><option>week</option><option>month</option>
                    </select> 
                </div>
                <div className='wrap-graphs'>
                    <h3 id='phtitle'>pH Level</h3>
                    <Line data={pHData} options={graphOptions('pH')}/> 
                    <select id="st-ph" value={tPH} onChange={(e) => handleInputChange(e, 'ph')}>
                    <option>day</option><option>week</option><option>month</option>
                    </select>                        
                </div>
                <div className='wrap-graphs'>
                    <h3 id='ectitle'>Electrical Condutivity</h3>
                    <Line data={ecData} options={graphOptions('Conductivity (mS/cm)')}/>    
                    <select id="st-ec" value={tEC} onChange={(e) => handleInputChange(e, 'ec')}>
                        <option>day</option><option>week</option><option>month</option>
                    </select>                    
                </div>
                <div className='wrap-graphs'>
                    <h3 id='ttitle'>Temperature</h3>
                    <Line data={tempData} options={graphOptions('Temperature (°C)')}/>
                    <select id="st-temp" value={tTemp} onChange={(e) => handleInputChange(e, 'temp')}>
                        <option>day</option><option>week</option><option>month</option>
                    </select>                         
                </div>
            </div>    
        </div>
    );
}

export default Homepage;