import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Information.css';
import InfoPopup from './InfoPopup';
import Navigation from './Navigation';

function Fish() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');
    
    const [plants, setPlants] = useState('not selected');
    const [plantsArr, setPlantsArr] = useState([]);
    const [fish, setFish] = useState('not selected');
    const [list, setList]= useState([]);

    const [PH, setPH]= useState([]);
    const [EC, setEC]= useState([]);
    const [Hours, setHours]= useState([]);

    const[phCheck, setPhCheck] = useState(true);
    const[ecCheck, setEcCheck] = useState(true);
    const[hoursCheck, setHoursCheck] = useState(true);

    const[btnPopup, setbtnPopup] = useState(false);
    const[typePF, setTypePF] = useState('');
    const[namePF, setNamePF] = useState('');

    const[togglePF, setTogglePF] = useState('plant');
    const[blue, setBlue] = useState('true');
    const[green, setGreen] = useState('false');

    const [error, setError] = useState('');

    var navDrop = false;

    useEffect(() => {
        setValues(); 
        getPlantList();
    }, []);

    const handleCheckChange=(type)=>{
        setError('');

        switch(type){
            case 'ph':
                setPhCheck(!phCheck);
                getModifiedList(phCheck, !ecCheck, !hoursCheck);
                break;
            case 'ec':
                setEcCheck(!ecCheck);
                getModifiedList(!phCheck, ecCheck, !hoursCheck);
                break;
            case 'hours':
                setHoursCheck(!hoursCheck);
                getModifiedList(!phCheck, !ecCheck, hoursCheck);
                break;
            default:
        }
        
    }
    const handleButtonClick=(e, type)=>{
        setTypePF(type);
        setNamePF(e.target.id.replace(' ','_'));
        setbtnPopup(true);
    }

    const search = () =>{
        const searchValue = document.getElementById("search-pf").value.toLowerCase();
        const result = list.filter((item)=> item.toLowerCase().includes(searchValue));
        displayButtons(result, togglePF);
    }

    function refresh(){
        var url = 'http://localhost:8000/users/'+sessionId+'/navigate';
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetch(url, {
            method: 'PUT',
            headers: headers,
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
    
    function hideCheckbox(){document.getElementById('wrap-list-customize').style.display='none';}
    function showCheckbox(){document.getElementById('wrap-list-customize').style.display='block';}

    function setValues(){
        var url = 'http://localhost:8000/users/'+sessionId+'/search';
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
            if((!(data.plants[0]==null))){
                
                var str=''; var arr=[];

                for(let i =0; i<data.plants.length; i++){
                    str+=data.plants[i].plant+" ";
                    arr.push(data.plants[i].plant);
                }
                arr= arr.sort();
                setPlantsArr(arr);
                setPlants(arr.join(', '));
            }
            if((!(data.fish==null))){setFish(data.fish.fish);};
            if((!(data.recomPH==null))){setPH(data.recomPH.join('-'));}else{setPH('none')}
            if((!(data.recomEC==null))){setEC(data.recomEC.join('-')+" Sm/cm");}else{setEC('none')}
            if((!(data.recomHours==null))){setHours(data.recomHours.join('-')+" hours");}else{setHours('none')}
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }

    function displayButtons(data, type){
        var select = document.getElementById("wrap-display-pf");
        select.replaceChildren();

        for(var i = 0; i < data.length; i++) {
            var elBtn = document.createElement("button");
            elBtn.className = 'btnItem';
            elBtn.id = data[i];
            
            // document.getElementById('data[i]').style.borderColor = 

            // elBtn.style.borderColor = buttonColour;
            // elBtn.style.backgroundColor = bgColor;
            
            var name= data[i].replace(/ /g,"_");
            if(type=='fish'){
                elBtn.addEventListener("click", (e)=>handleButtonClick(e,'fish'));
            }else if(type=='plant'){
                elBtn.addEventListener("click", (e)=>handleButtonClick(e, 'plant'));
            }
            elBtn.appendChild(document.createTextNode(data[i]));
            select.appendChild(elBtn);
        }
    }
    
    function getPlantList(data){
        document.getElementById('plant-toggle').style.background= '#9db8cc';
        document.getElementById('fish-toggle').style.background= '#bdd0df';
        // document.getElementById('searchbox-p').style.backgroundColor = '#a7becf';

        refresh();
        showCheckbox();
        setTogglePF('plant');
        var url = 'http://localhost:8000/plants';
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
            displayButtons(data, 'plant');
            setList(data);
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }
    function getFishList(){
        document.getElementById('plant-toggle').style.background= '#bdd0df';
        document.getElementById('fish-toggle').style.background= '#9db8cc';
        // document.getElementById('searchbox-p').style.backgroundColor= '#abc0ad';

        // displayButtons(data, 'fish', '')

        refresh();
        hideCheckbox();
        setTogglePF('fish');
        var url = 'http://localhost:8000/fish';
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
            console.log('it reaches here');
            displayButtons(data,'fish');    
            setList(data);
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }
    
    function getModifiedList(ph, ec, hours){
        refresh();
        var str='';
        if(ph==true){str+='_ph'}
        if(ec==true){str+='_ec'}
        if(hours==true){str+='_hour'}

       var url = 'http://localhost:8000/plants/'+sessionId+'/'+str;
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
            displayButtons(data, 'plant');
            setList(data);     
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });

    }
    function updateUserSelect(arr, str){
       var url = 'http://localhost:8000/users/'+sessionId+'/species';
        var header = {         
            'Accept': 'application/json',
            'Content-Type': 'application/json'   
        };
        var data = {
            plants: arr,
            fish: str                   
        };
        const id = fetch(url, {
            method: 'PUT',
            headers: header,
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

    const modifySelectPF=(type, elem)=>{
        console.log(!phCheck+" "+!ecCheck+" "+!hoursCheck);
        switch(type){
            case 'add-plant':
                if(plantsArr.includes(elem)){
                    setError("Plant already included in user selection")
                }else{
                    var arr = plantsArr.concat([elem]).sort();
                    setPlantsArr(arr);
                    setPlants(arr.join(', '));
                    updateUserSelect(arr, fish);
                }
                getModifiedList(!phCheck, !ecCheck, !hoursCheck);
                break;
            case 'remove-plant':
                if(plantsArr.includes(elem)){
                    var arr = plantsArr.filter(item => item !== elem);
                    setPlantsArr(arr);
                    if(arr[0]!=null){setPlants(arr.join(', '));}
                    else{setPlants('not selected')}
                    updateUserSelect(arr, fish);
                }else{
                    setError("Plant not in current user selection")
                }
                getModifiedList(!phCheck, !ecCheck, !hoursCheck);
                break;
            case 'replace-fish':
                if(elem!=fish){         
                    setFish(elem);
                    updateUserSelect(plantsArr, elem);
                }else{setError("Fish already added")}
                break;
            case 'remove-fish':
                if(elem==fish){
                    setFish('not selected');
                    updateUserSelect(plantsArr, '');
                }else{setError("Fish not added")}
                break;
            default:
        }
        setValues();

    }

    return(
     
        //     <div className='info-fish-plant'>
        //     <Navigation/>
        //     <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"/>
        //     <h1>Compatibility Search</h1>
        //     <h3>
        //         <div className='outerbox-p'>
        //             <div className='searchbox-pf'>
        //                 <div>
        //                     <div className='wrap-toggle-pf'>
        //                         <button type='button' id='plant-toggle' onClick={getPlantList}>Plants </button>
        //                         <button type='button' id='fish-toggle' onClick={getFishList}>Fish</button>
        //                     </div>
        //                     <div className='wrap-search-pf'>
        //                         <form>
        //                             <i className="fas fa-search"></i>
        //                             <input type='text' id='search-pf' placeholder='Search...' onChange={()=>search()}></input>
        //                         </form>
        //                         <div className='wrap-list-customize' id='wrap-list-customize'>
        //                             <p></p><label>Compatible with current:</label>
        //                             <input type='checkbox' id='ph-checkbox' value={phCheck} onChange={()=>handleCheckChange('ph')}></input>PH
        //                             <input type='checkbox' id='ec-checkbox' value={ecCheck} onChange={()=>handleCheckChange('ec')}></input>EC
        //                             <input type='checkbox' id='hours-checkbox' value={hoursCheck} onChange={()=>handleCheckChange('hours')}></input>Lighting Requirements
        //                         </div>
        //                     </div>
        //                     <div className='wrap-display-pf' id='wrap-display-pf'></div>
        //                 </div>
        //             </div>
        //             <div  className='wrap-stats-pf'>
        //                 <p className='pf-p1'>Based on your current saved selection,</p>
        //                 <div className='wrap-s2-pf'>     
        //                     <p className='pf-p2'>Plants: <p className='pf-p3'>{plants}</p></p>
        //                     <p className='pf-p2'>Fish: <p className='pf-p3'>{fish}</p></p>
        //                 </div>
        //                 <p className='pf-p1'>these are your recommended system ranges!</p>
        //                 <div className='wrap-s3-pf'>
        //                     <p className='pf-p2'>Daily Plant Light: <p className='pf-p3'>{Hours} </p></p>
        //                     <p className='pf-p2'>Ideal EC:  <p className='pf-p3'>{EC} </p></p>
        //                     <p className='pf-p2'>Ideal PH: <p className='pf-p3'>{PH} </p></p>
        //                 </div>
        //             </div> 
        //             <InfoPopup trigger={btnPopup} type={typePF} name={namePF} setTrigger={setbtnPopup} modifySelect={modifySelectPF}></InfoPopup>
        //         </div>
        //     </h3>
        // </div>
        <div className='info-fish-plant'>
            <Navigation/>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"/>
            <h3>
                <div className='outerbox-p'>
                    <div className='outerbox'>
                        <div className='wrap-toggle-pf'>
                            <button type='button' id='plant-toggle' onClick={getPlantList}>Plants </button>
                            <button type='button' id='fish-toggle' onClick={getFishList}>Fish</button>
                        </div>
                        <div className='searchbox-pf' id='searchbox-p'>
                            <div className='not-btn'>
                                <div className='wrap-search-pf'>
                                    <form>
                                        <i className="fas fa-search"></i>
                                        <input type='text' id='search-pf' placeholder='Search...' onChange={()=>search()}></input>
                                    </form>
                                </div>
                                <div className='wrap-list-customize' id='wrap-list-customize'>
                                        <h2 className='compatible'>Compatible with current:</h2>
                                        <label className='pH'>pH
                                            <input className='check' type='checkbox' id='ph-checkbox' value={phCheck} onChange={()=>handleCheckChange('ph')}></input>
                                            <span className='cm1'></span>
                                        </label>
                                        <label className='EC'>EC
                                            <input className='check' type='checkbox' id='ec-checkbox' value={ecCheck} onChange={()=>handleCheckChange('ec')}></input>
                                            <span className='cm2'></span>
                                        </label>
                                        <label className='hours'>Lighting Requirements
                                            <input className='check' type='checkbox' id='hours-checkbox' value={hoursCheck} onChange={()=>handleCheckChange('hours')}></input>
                                            <span className='cm3'></span>
                                        </label>
                                </div>
                                <div className='wrap-display-pf' id='wrap-display-pf'></div>
                            </div>
                        </div>
                    </div>
                    <div  className='wrap-stats-pf'>
                        <p className='pf-p1'>Based on your current saved selection,</p>
                        <div className='wrap-s2-pf'>     
                            <p className='pf-p2'>Plants: <p className='pf-p3'>{plants}</p></p>
                            <p className='pf-p2'>Fish: <p className='pf-p3'>{fish}</p></p>
                        </div>
                        <p className='pf-p1'>these are your recommended system ranges!</p>
                        <div className='wrap-s3-pf'>
                            <p className='pf-p2'>Daily Plant Light: <p className='pf-p3'>{Hours} </p></p>
                            <p className='pf-p2'>Ideal EC:  <p className='pf-p3'>{EC} </p></p>
                            <p className='pf-p2'>Ideal PH: <p className='pf-p3'>{PH} </p></p>
                        </div>
                    </div> 
                    <InfoPopup trigger={btnPopup} type={typePF} name={namePF} setTrigger={setbtnPopup} modifySelect={modifySelectPF}></InfoPopup>
                </div>
            </h3>
        </div>
    );
}

export default Fish;