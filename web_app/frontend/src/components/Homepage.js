import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import { DatapH } from "../utils/DatapH";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import './Homepage.css';

function Homepage() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');
    
    const options = {
        plugins: {
            legend: {
                display: false
            },
        },
        scales: {
          y:
            {
              afterDataLimits: (scale) => {
                    scale.max = 8;
                    scale.min = 6;},
              stepSize: 1,
            }
        },
    };

    const [pHData, setChartData] = useState({
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

    function nav(str){
        document.cookie = `sessionId=${sessionId}`
        navigate(str)
    }
    //6 to 8

    
    return(

        <div className='Homepage'>
            <body>
                <div className='nav'>
                    <button id='navhome' variant='contained' onClick={() => nav('/Home')}>&nbsp;</button>
                    <button id='navuser' variant='contained' onClick={() => nav('/User-Info')}>&nbsp;</button>
                    <button id='navfish' variant='contained' onClick={() => nav('/Fish')}>&nbsp;</button>
                    <button id='navinfo' variant='contained' onClick={() => nav('/Information')}>&nbsp;</button>
                    <button id='navsettings' variant='contained' onClick={() => nav('/Settings')}>&nbsp;</button>
                </div>
                <div className='outerbox'>
                    <h1>WARNING</h1>
                    <div>
                        <h3 id='wltitle'>Water Level</h3>
                        <br></br>
                        <div>
                            <h3 id='phtitle'>pH Level</h3>
                            <div>
                                <Line data={pHData} options={options}/>
                            </div>
                        </div>
                        <br></br>
                        <h3 id='ectitle'>Electrical Condutivity</h3>
                        <br></br>
                        <h3 id='ttitle'>Temperature</h3>
                    </div>
                </div>
            </body>            
        </div>

    );
}

export default Homepage;