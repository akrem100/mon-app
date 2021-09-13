import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './component/App';
import reportWebVitals from './reportWebVitals';
import Score from './component/Score';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './nav-bar/Navbar';
ReactDOM.render(
  
  <React.StrictMode >
       <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/Score" component={Score} />
     
        </Switch>
      </Router>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
