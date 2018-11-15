import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SweetAlert from 'sweetalert2-react';

import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import User from './components/User';
import Driver from './components/Driver';
import LocateIdentify from './components/LocateIdentify';
import Manager from './components/Manager';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.hideLayout = this.hideLayout.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.state = {
      isLogged: false,
      popupInfo: {
        title: '',
        show: false,
        mess: ''
      }
    }
  }
  hideLayout(value) {
    this.setState({ isLogged: value });
  }
  showPopup(info) {
    this.setState({
      popupInfo: {
        ...this.state.popupInfo,
        title: info.title,
        show: true,
        mess: info.mess
      }
    })
  }
  closePopup() {
    this.setState({
      popupInfo: {
        ...this.state.popupInfo,
        title: '',
        show: false,
        mess: ''
      }
    })
  }
  render() {
    return (
      <Router>
        <div className="App">
          {this.state.isLogged ? null : <Header />}
          <Switch>
            <Route path="/user"
              render={(props) => <User {...props} popup={this.showPopup}
                isLogged={this.hideLayout} />}
            />
            <Route path="/driver"
              render={(props) => <Driver {...props} popup={this.showPopup}
                isLogged={this.hideLayout} />}
            />
            <Route path="/locate"
              render={(props) => <LocateIdentify {...props} popup={this.showPopup}
                isLogged={this.hideLayout} />}
            />
            <Route path="/admin"
              render={(props) => <Manager {...props} popup={this.showPopup}
                isLogged={this.hideLayout} />}
            />
            <Route path="/login"
              render={(props) => <Login {...props} popup={this.showPopup}
                isLogged={this.hideLayout} />}
            />
            <Route exact component={User} />
          </Switch>
          {this.state.isLogged ? null : <Footer />}
          <SweetAlert
            show={this.state.popupInfo.show}
            title={this.state.popupInfo.title}
            text={this.state.popupInfo.mess}
            onConfirm={this.closePopup}
          />
        </div>
      </Router>
    );
  }
}

export default App;
