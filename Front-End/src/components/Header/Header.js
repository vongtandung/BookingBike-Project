import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import WebService from '../../utilities/WebServices';
import "./Header.css";
import logo from '../../assets/images/logo-ilovexeom.png'
class Header extends Component {
  constructor(props){
    super();
    this.logOut = this.logOut.bind(this);
    this.webService = new WebService();
  }
  logOut(){
    this.webService.logout();
    this.props.history.push('/login')
  }
  render() {
    return (
      <header>
        <div className="header">
          <div className="sides">
            <a href="#" className="logo">
              <img src={logo} alt='' width={150 + 'rem'}></img>
            </a>
          </div>
          <div className="sides">
            <div className="menu">
              <div>
                <button className="btn btn-danger dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="far fa-user"></i> {this.webService.getUserName()}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a className="dropdown-item" href="#" onClick={this.logOut}>Đăng xuất</a>
                </div>
              </div>
            </div>
          </div>
          <div className="info">
            <h1>EASY TO TAKE - EASY TO GO</h1>
            <div className="meta">
              <button className="btn btn-success btn-header">Get start</button>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default withRouter(Header);
