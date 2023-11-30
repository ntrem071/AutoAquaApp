    
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './InfoPopup.css';

function InfoPopup(props) {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId'); 
    const [error, setError] = useState('');

    useEffect(() => {
        if (props.trigger) {
          setValues();
        }
      }, [props.trigger, props.name, props.type]);

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
            console.log(data);

            var tb = document.getElementById("popup-topbar");
            var s1 = document.getElementById("popup-section1");
            var s3 = document.getElementById("popup-section3");

            var d1 = document.createElement("label");
            d1.innerHTML = data.plant;
            tb.appendChild(d1);

           var p1 = document.createElement("p");
           var l1= document.createElement("label");
           var l2 = document.createElement("label")
           l1.className = 'element-label';
           l1.innerHTML = "Daily Light Requirements: ";
           l2.className = 'info-label';
           l2.innerHTML = data.daily_light_requirement[0]+"-"+data.daily_light_requirement[1]+" hours\n";
           p1.appendChild(l1);p1.appendChild(l2);s1.appendChild(p1);
          // var d3 = document.createElement("p");
           //d3.innerHTML = "Ideal PH Range: "+ data.ph_range[0]+"-"+data.ph_range[1];
           //var d4 = document.createElement("p");
           //d4.innerHTML = "Ideal EC Range: "+ data.ec_range[0]+"-"+data.ec_range[1];

            //elBtn.appendChild(document.createTextNode(data[i]));
            

            //s1.appendChild(d2);
            //s1.appendChild(d3);
            //s1.appendChild(d4);

            
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
            console.log(data);
            
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
                        <div className='popup-section2' id='popup-section2'></div>
                        <div className='popup-section3' id='popup-section3'></div>
                    </div>
                </div>
            </div>
        </body>
        

    ) : "";
}

export default InfoPopup;