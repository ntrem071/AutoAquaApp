import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Create from "./components/Create";
import Login from "./components/Login";
//import history from "history";

export default class WebAppRoutes extends Component {
    render() {
        return (
            <Routes>
                <Route path="/" exact component={<Login/>} />
                <Route path="/CreateAccount" exact component={<Create/>} />
            </Routes>
        )
    }
}