import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Information.css';
import InfoPopup from './InfoPopup';
import userIcon from '../pictures/user.png';
import generalUserIconImage from '../pictures/userImageFishUwU.png';

function Fish() {
    const navigate = useNavigate();
    const sessionId= Cookies.get('sessionId');

    const [plants, setPlants] = useState('not selected');
    const [plantsArr, setPlantsArr] = useState([]);
    const [fish, setFish] = useState('not selected');
    const [list, setList]= useState([]);

    const[phCheck, setPhCheck] = useState(true);
    const[ecCheck, setEcCheck] = useState(true);
    const[hoursCheck, setHoursCheck] = useState(true);

    const[btnPopup, setbtnPopup] = useState(false);
    const[typePF, setTypePF] = useState('');
    const[namePF, setNamePF] = useState('');

    const[togglePF, setTogglePF] = useState('plant');

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

    function nav(str){
        document.cookie = `sessionId=${sessionId}`
        navigate(str)
    }

    function hideCheckbox(){document.getElementById('wrap-list-customize').style.display='none';}
    function showCheckbox(){document.getElementById('wrap-list-customize').style.display='block';}

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
            if((!(data.fish==null))){
                setFish(data.fish.fish);
            };
            
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
            var name= data[i].replace(/ /g,"_");
            if(type=='fish'){elBtn.addEventListener("click", (e)=>handleButtonClick(e,'fish'));}
            else if(type=='plant'){elBtn.addEventListener("click", (e)=>handleButtonClick(e, 'plant'));}
            elBtn.appendChild(document.createTextNode(data[i]));
            select.appendChild(elBtn);
        }
    }
    
    function getPlantList(){
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
            displayButtons(data,'fish');    
            setList(data);
        })
        .catch((err) => {
            setError(err);
            console.log(err);
        });
    }
    
    function getModifiedList(ph, ec, hours){
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

    function displayNavSmall(){

        if(navDrop){
            document.getElementsByClassName('nav-dropdwn')[0].style.display = 'none';
        }else{
            document.getElementsByClassName('nav-dropdwn')[0].style.display = 'block';
        }

        navDrop = !navDrop;
    }

    const modifySelectPF=(type, elem)=>{

        console.log(elem);
        console.log(type);

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
        
    }

    return(
     
            <div className='info-fish-plant'>
            <div className="navbar">
                <span style={{fontFamily:'Courier', color: 'white'}}>Hello Mr. Bubbles! </span>
                <img id='userIcon' src={generalUserIconImage}></img>
                <button id='nav-button' onClick={displayNavSmall}></button>
                <div className="nav-dropdwn">
                    <button id='navhome' variant='contained' title='Home' onClick={() => navigate('/Home')}>
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
                    <button id='navinfo' style={{backgroundColor: "#08398d"}} variant='contained' title='Fish and Plant Search' onClick={() => navigate('/Information')}>
                        <h1 id='nav-text'>Information</h1>
                        &nbsp;
                    </button>  
                    <button id='navsettings' variant='contained' title='Settings' onClick={() => navigate('/Settings')}>
                        <h1 id='nav-text'>Settings</h1>
                        &nbsp;
                    </button>
                </div> 
            </div>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"/>
            <h1>Compatibility Search</h1>
            <h3>
                <div className='outerbox-p'>

                    <div className='nav'>
                        <button id='navhome' variant='contained' title='Home' onClick={() => nav('/Home')}>&nbsp;</button>
                        <button id='navuser' variant='contained' title='User Info' onClick={() => nav('/User-Info')}>&nbsp;</button>
                        <button id='navfish' variant='contained' title='Fish Health' onClick={() => nav('/Fish')}>&nbsp;</button>
                        <button id='navinfo' style={{backgroundColor: "#08398d"}} variant='contained' title='Fish and Plant Search' onClick={() => nav('/Information')}>&nbsp;</button>
                        <button id='navsettings' variant='contained' title='Settings' onClick={() => nav('/Settings')}>&nbsp;</button>
                    </div>
                    <div>

                        <div className='wrap-toggle-pf'>
                            <button type='button' id='plant-toggle' onClick={getPlantList}>Plants </button>
                            <button type='button' id='fish-toggle' onClick={getFishList}>Fish</button>
                        </div>
                        <div className='wrap-selection-pf'>
                            <p>User Saved Selection:</p>
                            <p>Plants: {plants}</p>
                            <p>Fish: {fish}</p>
                        </div>
                        <div className='wrap-search-pf'>
                            <form>
                                <i className="fas fa-search"></i>
                                <input type='text' id='search-pf' placeholder='Search...' onChange={()=>search()}></input>
                            </form>
                            <div className='wrap-list-customize' id='wrap-list-customize'>
                                <p></p><label>Compatible with current:</label>
                                <input type='checkbox' id='ph-checkbox' value={phCheck} onChange={()=>handleCheckChange('ph')}></input>PH
                                <input type='checkbox' id='ec-checkbox' value={ecCheck} onChange={()=>handleCheckChange('ec')}></input>EC
                                <input type='checkbox' id='hours-checkbox' value={hoursCheck} onChange={()=>handleCheckChange('hours')}></input>Lighting Requirements
                            </div>
                        </div>
                        <div className='wrap-display-pf' id='wrap-display-pf'></div>
                    </div>
                    <InfoPopup trigger={btnPopup} type={typePF} name={namePF} setTrigger={setbtnPopup} modifySelect={modifySelectPF}></InfoPopup>
                </div>
            </h3>
        </div>
    );
}

export default Fish;