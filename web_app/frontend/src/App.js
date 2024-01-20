//import logo from './logo.svg';
import './App.css';
import React from 'react';
//import Button from '@material-ui/core/Button';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
//import WebAppRoutes from './WebAppRoutes';
// import Create from './components/Create';
import Login from './components/Login';
import Homepage from './components/Homepage';
import UserInfo from './components/UserInfo';
import Fish from './components/Fish';
import Information from './components/Information';
import Settings from './components/Settings';
//import './components/Settings.css';
import userIcon from './pictures/user.png';
import generalUserIconImage from './pictures/userImageFishUwU.png';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/Login');
  }

  const navigatetoCreateAccount = () => {
    navigate('/CreateAccount');
  }

  return (
    <div className='App'>
      <div id='login'>
        <Routes>
          <Route path='/' element={ <Login/> }/>
          {/* <Route path='/CreateAccount' element={ <Create/> }/> */}
          <Route path='/Home' element={ <Homepage/> }/>
          <Route path='/Fish' element={ <Fish/> }/>
          <Route path='/Information' element={ <Information/> }/>
          <Route path='/Settings' element={ <Settings/> }/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
