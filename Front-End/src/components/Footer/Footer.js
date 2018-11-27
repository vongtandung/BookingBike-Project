import React, { Component } from "react";
import "./Footer.css";
import logo from '../../assets/images/logo-ilovexeom.png'

class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-sm-6 col-xs-12">
              <span className="logo-footer"><img src={logo} alt="" width={250}/></span>
            </div>
            <div className="col-md-8 col-sm-6 col-xs-12">
              <ul className="address">
                <span>Contact</span>
                <li>
                  <i className="fa fa-phone" aria-hidden="true" />
                  <a href="#">Phone</a>
                </li>
                <li>
                  <i className="fa fa-map-marker" aria-hidden="true" />
                  <a href="#">Adress</a>
                </li>
                <li>
                  <i className="fa fa-envelope" aria-hidden="true" />
                  <a href="#">Email</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
