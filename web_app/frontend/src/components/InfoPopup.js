import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './InfoPopup.css';
import imgP from '../pictures/pichpich.jpg';

function InfoPopup(props) {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId'); 
    const [error, setError] = useState('');

    useEffect(() => {
        if (props.trigger) {
          setValues();
        }
      }, [props.trigger, props.name, props.type]);

    const handleButtonClick=(e)=>{
        props.modifySelect(e.target.id, props.name);
        props.setTrigger(false)
    }
    
    function displayPlantInfoBox(name){

        var url = 'http://localhost:8000/plants/na/'+name;
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

            var tb = document.getElementById("popup-topbar");
            var s0 = document.getElementById("popup-section0");
            var s1 = document.getElementById("popup-section1");
            var s3 = document.getElementById("popup-section3");

            var d1 = document.createElement("label");
            d1.innerHTML = data.plant;
            tb.appendChild(d1);

           var p1 = document.createElement("p");
           var l1= document.createElement("label"); l1.className = 'element-label';   
           var l2 = document.createElement("label"); l2.className = 'info-label';
           l1.innerHTML = "Daily Light: ";
           l2.innerHTML = "  "+data.daily_light_requirement[0]+"-"+data.daily_light_requirement[1]+" hours\n";
           p1.appendChild(l1);p1.appendChild(l2);s1.appendChild(p1);

           var p2 = document.createElement("p");
           var l3= document.createElement("label");l3.className = 'element-label';
           var l4 = document.createElement("label"); l4.className = 'info-label';
           l3.innerHTML = "Ideal PH Range: ";
           l4.innerHTML = "  "+ data.ph_range[0]+"-"+data.ph_range[1];
           p2.appendChild(l3);p2.appendChild(l4);s1.appendChild(p2);

           var p3 = document.createElement("p");
           var l5= document.createElement("label"); l5.className = 'element-label';
           var l6 = document.createElement("label");l6.className = 'info-label';
           l5.innerHTML = "Ideal EC Range: ";
           l6.innerHTML = "  "+ data.ec_range[0]+"-"+data.ec_range[1];
           p3.appendChild(l5);p3.appendChild(l6);s1.appendChild(p3);

           var b1 = document.createElement("button");
           b1.id='add-plant'; b1.addEventListener("click", (e)=>handleButtonClick(e)); b1.innerHTML = "Add";
           
           var b2 = document.createElement("button");
           b2.id='remove-plant'; b2.addEventListener("click", (e)=>handleButtonClick(e)); b2.innerHTML = "Remove";
           s0.appendChild(b1);
           s0.appendChild(b2);

           var p3 = document.createElement("p"); p3.className='popup-info';
           p3.innerHTML = data.info;
           s3.appendChild(p3);
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }
    function displayFishInfoBox(name){
        var url = 'http://localhost:8000/fish/na/'+name;
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

            var tb = document.getElementById("popup-topbar");
            var s0 = document.getElementById("popup-section0");
            var s1 = document.getElementById("popup-section1");
            var s3 = document.getElementById("popup-section3");

            var d1 = document.createElement("label");
            d1.innerHTML = data.fish;
            tb.appendChild(d1);


           var p2 = document.createElement("p");
           var l3= document.createElement("label");l3.className = 'element-label';
           var l4 = document.createElement("label"); l4.className = 'info-label';
           l3.innerHTML = "Ideal PH Range: ";
           l4.innerHTML = "  "+ data.ph_range[0]+"-"+data.ph_range[1];
           p2.appendChild(l3);p2.appendChild(l4);s1.appendChild(p2);

           var p3 = document.createElement("p");
           var l5= document.createElement("label"); l5.className = 'element-label';
           var l6 = document.createElement("label");l6.className = 'info-label';
           l5.innerHTML = "Ideal Temp Range: ";
           l6.innerHTML = "  "+ data.temp_range[0]+"-"+data.temp_range[1];
           p3.appendChild(l5);p3.appendChild(l6);s1.appendChild(p3);
           
           var p1 = document.createElement("p");
           var l1= document.createElement("label"); l1.className = 'element-label';   
           var l2 = document.createElement("label"); l2.className = 'info-label';
           l1.innerHTML = "Tank Size: ";
           l2.innerHTML = "  "+data.tank_size;
           p1.appendChild(l1);p1.appendChild(l2);s1.appendChild(p1);

           var b1 = document.createElement("button");
           b1.id='replace-fish'; b1.addEventListener("click", (e)=>handleButtonClick(e)); b1.innerHTML = "Replace";
           var b2 = document.createElement("button");
           b2.id='remove-fish'; b2.addEventListener("click", (e)=>handleButtonClick(e)); b2.innerHTML = "Remove";
           s0.appendChild(b1);
           s0.appendChild(b2);

           var p3 = document.createElement("p"); p3.className='popup-info';
           p3.innerHTML = data.info;
           s3.appendChild(p3);
            
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }

    function displayFishInfoBox(name){
        var url = 'http://localhost:8000/fish/na/'+name;
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
            
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }

    function setValues(){
        if(props.type=="fish"){displayFishInfoBox(props.name);}
        else if(props.type == 'plant'){displayPlantInfoBox(props.name);}
    }

    return(props.trigger) ? (
        <body>
            <div className='popup-box'>
                <div className='popup-inner'>
                    <div className='popup-topbar' id='popup-topbar'>
                        <button className='close-popup' onClick={()=>props.setTrigger(false)}>x</button>
                        {props.children}
                    </div>
                    <div className='popup-info-display'>
                        
                        <div className='popup-section1' id='popup-section1'></div>
                        <div className='popup-section0' id='popup-section0'></div>
                        <div className='popup-section2' id='popup-section2'>
                            <img src={imgP} alt="pichpich" width="280" height="280"></img>
                        </div>
                        <div className='popup-section3' id='popup-section3'></div>
                    </div>
                </div>
            </div>
        </body>
    ) : "";
}

export default InfoPopup;