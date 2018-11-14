import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import User from './components/User';
import Driver from './components/Driver';
import LocateIdentify from './components/LocateIdentify';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.hideLayout = this.hideLayout.bind(this);
    this.state = {
      isLogged: false
    }
  }
  hideLayout(value) {
    this.setState({ isLogged: value });
  }
  render() {
    return (
      <Router>
        <div className="App">
          {this.state.isLogged ? null : <Header />}
          <Switch>
            <Route path="/user" component={User} />
            <Route path="/driver" component={Driver} />
            <Route path="/locate"
              render={(props) => <LocateIdentify {...props} popup={this.showPopup}
                isLogged={this.hideLayout} />}
            />    
            <Route path="/login"
              render={(props) => <Login {...props} popup={this.showPopup}
                isLogged={this.hideLayout} />}
            />            
            <Route exact component={User} />
          </Switch>
          {this.state.isLogged ? null : <Footer />}
        </div>
      </Router>
    );
  }
}

export default App;
