import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import { DatapH } from "../utils/DatapH";
import { DataWaterLevel } from "../utils/DataWaterLevel";
import { DataEC } from "../utils/DataEC";
import { DataTemp } from "../utils/DataTemp";
import { CategoryScale, plugins } from "chart.js";
import Chart from "chart.js/auto";
import './Homepage.css';
import Navigation from './Navigation';
import 'chartjs-adapter-date-fns';

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
    const [percent, setPercent] = useState(30);

    const zoom_in = document.getElementById('zoom_in');
    const zoom_out = document.getElementById('zoom_out');
    const zoom_text = document.getElementById('zoom-percent');

    const downDWater=100, downCWater=150; 
    const upDPH=9, upCPH=8.5, downCPH=6.5, downDPH=6.0; 
    const upDEC=2.2, upCEC=2.0, downCEC=0.2, downDEC=0; 
    const upDTemp=30, upCTemp=22, downCTemp=18, downDTemp=10;
    
    const warningColor='#ff9966'; const dangerColor = '#cc3300';

    var sectionIndex = 0;
    
    // carousel slider and graph zoom effects
    useEffect(() => {
        const slider = document.querySelector('.slider-h');
        const leftArrow = document.querySelector('.left');
        const rightArrow = document.querySelector('.right');
        const controlsIndicators = document.querySelectorAll('.controls-h li');
        const indicatorParents = document.querySelector('.controls-h ul');
    
        const handleRightArrowClick = () => {
            sectionIndex = (sectionIndex < 3) ? sectionIndex + 1 : 0;
            document.querySelector('.controls-h .selected').classList.remove('selected');
            indicatorParents.children[sectionIndex].classList.add('selected');
            updateTitle(sectionIndex);
            slider.style.transform = 'translate(' + (sectionIndex) * (-25) + '%)';
        };
        const handleLeftArrowClick = () => {
            sectionIndex = (sectionIndex > 0) ? sectionIndex - 1 : 3;
            document.querySelector('.controls-h .selected').classList.remove('selected');
            indicatorParents.children[sectionIndex].classList.add('selected');
            updateTitle(sectionIndex);
            slider.style.transform = 'translate(' + (sectionIndex) * (-25) + '%)';
        };
        const handleScrollCircle = (indicator, ind) => {
            sectionIndex = ind;
            document.querySelector('.controls-h .selected').classList.remove('selected');
            indicator.classList.add('selected');
            updateTitle(sectionIndex);
            slider.style.transform = 'translate(' + (sectionIndex) * (-25) + '%)';
        }

        // Event listeners for arrows
        if (rightArrow) {rightArrow.addEventListener('click', handleRightArrowClick);}
        if (leftArrow) {leftArrow.addEventListener('click', handleLeftArrowClick);}
        controlsIndicators.forEach((indicator, ind) => {
            indicator.addEventListener('click', () => handleScrollCircle(indicator, ind));
        });
        // Clean up the event listeners when the component is unmounted
        return () => {
            if (rightArrow) {rightArrow.removeEventListener('click', handleRightArrowClick);}
            if (leftArrow) {leftArrow.removeEventListener('click', handleLeftArrowClick);}
            controlsIndicators.forEach((indicator, ind) => {
                indicator.removeEventListener('click', () => handleScrollCircle(ind));
            });
        };
    }, []);

    //zoom on graphs
    const handleZoomOut = () => {
        var p = (percent < 100) ? percent + 10 : 100;//increment by 10%
        setPercent(p);
        adjustGraph(p);
        zoom_text.innerHTML=p+'%';
    };
    const handleZoomIn = () => {
        var p = (percent > 10) ? percent - 10 : 10;
        setPercent(p);
        adjustGraph(p);
        zoom_text.innerHTML=p+'%';
    };
    function adjustGraph(p){
        var n = 76;
        n= parseInt((p/100) * inWaterLevel.length);
        setwaterLevlData(graphData(inWaterLevel.slice(-n)));
        
        n= parseInt((p/100) * inPH.length);
        setpHData(graphData(inPH.slice(-n)));

        n= parseInt((p/100) * inEC.length);
        setecData(graphData(inEC.slice(-n)));

        n= parseInt((p/100) * inTemp.length);
        settempData(graphData(inTemp.slice(-n)));
    }

    function updateTitle(sectionIndex){
        console.log('here'+ sectionIndex);
        if(sectionIndex==0){
            document.getElementById('graph-title').innerText="Water Level";
        }else if(sectionIndex==1){
            document.getElementById('graph-title').innerText="PH";
        }else if(sectionIndex==2){
            document.getElementById('graph-title').innerText="Electrical Conductivity";
        }else if(sectionIndex==3){
            document.getElementById('graph-title').innerText="Temperature";
        }        
    }

    function graphDangerLine(num, color){
        const horizonLine ={
            id: 'horizonLine',
            afterDatasetsDraw(chart, args, options){
                const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
                const yValue = y.getPixelForValue(num);
                const yPosition = Math.max(top, Math.min(bottom, yValue));
                ctx.save();
                ctx.strokeStyle = color;
                ctx.setLineDash([20, 5]);
                ctx.beginPath();
                ctx.moveTo(left, yPosition);
                ctx.lineTo(right, yPosition);
                ctx.stroke();
                ctx.restore();
            }
        }
        return horizonLine;
    }
    function graphData(points){
        var d = {
            labels: points.map((data) => data[0]),
            datasets: [
              {
                label: "pH",
                data: points.map((data) => data[1]),
                backgroundColor: "rgba(80, 148, 204, 0.6)",
                borderColor: "rgba(80, 148, 204, 0.6)",
                pointRadius: 1,
                pointHoverRadius: 3,
                borderWidth: 1,
                spanGaps: true,
                fill: {
                    target: 'origin',
                    above: 'rgb(80, 148, 204, 0.2)',   
                  },
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
                    type:'time',
                    time:{
                         unit: 'second',
                         parser: 'dd/MM/yyyy HH:mm:ss'
                     },
                    ticks: {
                        color: ['#000', '#939393']
                    },
                    title: {
                        display: true,
                        text: 'Timestamp',
                        color: '#000'
                    },
                    grid: {
                        color: '#f0f0f0'
                    },
                    border: {
                        color: '#323232', 
                    },
                },
                y:{
                    ticks: {
                        color: '#000'
                    },
                    title: {
                        display: true,
                        text: labelY,
                        color: '#000',
                    },
                    grid: {
                        color: '#f0f0f0'
                    },
                    border: {
                        color: '#323232', 
                    },
                }
            },
            animation: false
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
            var c = false;
            var d = false;

            if((!(data.phGraph[0]==null))){
                var curr=data.phGraph.slice(-1)[0];

                setInPH(data.phGraph);
                setpHData(graphData(data.phGraph.slice(-parseInt((percent/100)*data.phGraph.length))));
                document.getElementById('cur-ph-p2').innerText = 'timestamp: '+curr[0];
                document.getElementById('cur-ph-p3').innerText = curr[1];

                if((curr[1]<=downDPH) || (curr[1]>=upDPH)){
                    document.getElementById('cur-ph').style.border='2.5px solid '+dangerColor;
                    d=true; 
                }else if((curr[1]<=downCPH) || (curr[1]>=upCPH)){
                    document.getElementById('cur-ph').style.border='2.5px solid '+warningColor;
                    c=true;
                }
            }
            if((!(data.ecGraph[0]==null))){
                var curr=data.ecGraph.slice(-1)[0];

                setInEC(data.ecGraph);
                setecData(graphData(data.ecGraph.slice(-parseInt((percent/100)*data.ecGraph.length))));
                document.getElementById('cur-ec-p2').innerText = 'timestamp: '+curr[0];
                document.getElementById('cur-ec-p3').innerText = curr[1]+'mS/cm';
            
                if((curr[1]<=downDEC) || (curr[1]>=upDEC)){
                    document.getElementById('cur-ec').style.border='2.5px solid '+dangerColor;
                    d=true; 
                }else if((curr[1]<=downCEC) || (curr[1]>=upCEC)){
                    document.getElementById('cur-ec').style.border='2.5px solid '+warningColor;
                    c=true;
                }
            }
            if((!(data.tempGraph[0]==null))){
                var curr=data.tempGraph.slice(-1)[0];

                setInTemp(data.tempGraph);
                settempData(graphData(data.tempGraph.slice(-parseInt((percent/100)*data.tempGraph.length))));
                document.getElementById('cur-temp-p2').innerText = 'timestamp: '+curr[0];
                document.getElementById('cur-temp-p3').innerText = curr[1]+'°C';
                
                if((curr[1]<=downDTemp) || (curr[1]>=upDTemp)){
                    document.getElementById('cur-temp').style.border='2.5px solid '+dangerColor;
                    d=true; 
                }else if((curr[1]<=downCTemp) || (curr[1]>=upCTemp)){
                    document.getElementById('cur-temp').style.border='2.5px solid '+warningColor;
                    c=true;
                }
            }
            if((!(data.waterGraph[0]==null))){
                var curr=data.waterGraph.slice(-1)[0];

                setInWaterLevel(data.waterGraph);
                setwaterLevlData(graphData(data.waterGraph.slice(-parseInt((percent/100)*data.waterGraph.length))));
                document.getElementById('cur-water-p2').innerText = 'timestamp: '+curr[0];
                document.getElementById('cur-water-p3').innerText = curr[1]+'mm';
                
                if(curr[1]<=downDWater){
                    document.getElementById('cur-water').style.border='2.5px solid '+dangerColor;
                    d=true; 
                }else if(curr[1]<=downCWater){
                    document.getElementById('cur-water').style.border='2.5px solid '+warningColor;
                    c=true;
                }
            }
            if(d){
                document.querySelector('.warning-state-h').style.borderColor=dangerColor;
                document.querySelector('.warning-state-h').style.backgroundColor='#fcd4d2';
                document.getElementById('h0-h').innerText='DANGER: Your system has reached unsafe levels!';
            }else if(c){
                document.querySelector('.warning-state-h').style.borderColor=warningColor;
                document.querySelector('.warning-state-h').style.backgroundColor='#f7e0b5';
                document.getElementById('h0-h').innerText='CAUTION: Hey! Keep an eye on your system buddy >:(';
            }
            
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }
    
    return(

        <div className='Homepage'>
            <Navigation/> 
            <div className='outerbox-h'> 
                <div className="containor-h">
                    <div className= 'warning-state-h'>
                        <span  className="info-warning">
                            <i className='material-icons'>
                                info
                            </i>
                        </span>
                        <h1 id="h0-h">The ecosystem is doing <i>swimmingly</i> well~</h1>
                    </div>
                    <div className="carousel-h">
                        <div className="slider-h">
                        <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js"></script>
                            <section>
                                <div className='wrap-graphs'>
                                    <Line data={waterLevlData} options={graphOptions('Water Level (mm)')} plugins={[graphDangerLine(downDWater, dangerColor), graphDangerLine(downCWater, warningColor  )]}/>
                                </div>
                            </section>
                            <section>
                                <div className='wrap-graphs'>
                                    <Line data={pHData} options={graphOptions('pH')} plugins={[graphDangerLine(downDPH, dangerColor), graphDangerLine(upDPH, dangerColor), graphDangerLine(downCPH, warningColor  ), graphDangerLine(upCPH, warningColor  )]}/>                    
                                </div>
                            </section>
                            <section>
                                <div className='wrap-graphs'>
                                    <Line data={ecData} options={graphOptions('Conductivity (mS/cm)')} plugins={[graphDangerLine(downDEC, dangerColor), graphDangerLine(upDEC, dangerColor), graphDangerLine(downCEC, warningColor  ), graphDangerLine(upCEC, warningColor  )]}/>                   
                                </div>
                            </section>
                            <section>
                                <div className='wrap-graphs'>
                                    <Line data={tempData} options={graphOptions('Temperature (°C)')} plugins={[graphDangerLine(downDTemp, dangerColor), graphDangerLine(upDTemp, dangerColor), graphDangerLine(downCTemp, warningColor  ), graphDangerLine(upCTemp, warningColor  )]}/>
                                </div>
                            </section>
                        </div>
                        <div  className="graph-zoom">
                                <p className='h3-h' id='graph-title'>Water Level</p>
                                <div className='inner-zoom'>
                                    <i className='material-icons' id='zoom_out' onClick={handleZoomOut}>
                                        zoom_out
                                    </i>
                                    <p id='zoom-percent'>{percent}%</p>
                                     <i className='material-icons' id='zoom_in' onClick={handleZoomIn}>
                                        zoom_in
                                    </i>
                                </div>
                            </div>
                        <div className="controls-h">
                            <span className="arrow left">
                                <i className='material-icons'>
                                    keyboard_arrow_left
                                </i>
                            </span>
                            <span className="arrow right">
                                <i className='material-icons'>
                                    keyboard_arrow_right
                                </i>
                            </span>
                            <ul>
                                <li className='selected'></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                    </div>
                </div> 
                <div className='current-stats-h'>
                    <div className='cur-h' id='cur-water'>
                        <p className='p1-h'>Current Water Level</p>
                        <p className='p2-h' id='cur-water-p2'>timestamp</p>
                        <p className='p3-h' id='cur-water-p3'>Value</p>
                    </div>
                    <div className='cur-h' id='cur-ph'>
                        <p className='p1-h'>Current PH Value</p>
                        <p className='p2-h' id='cur-ph-p2'>timestamp</p>
                        <p className='p3-h' id='cur-ph-p3'>Value</p>
                    </div>
                    <div className='cur-h' id='cur-ec'>
                        <p className='p1-h'>Current EC Value</p>
                        <p className='p2-h' id='cur-ec-p2'>timestamp</p>
                        <p className='p3-h' id='cur-ec-p3'>Value</p>
                    </div>
                    <div className='cur-h' id='cur-temp'>
                        <p className='p1-h'>Current Temperature</p>
                        <p className='p2-h' id='cur-temp-p2'>timestamp</p>
                        <p className='p3-h' id='cur-temp-p3'>Value</p>
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default Homepage;