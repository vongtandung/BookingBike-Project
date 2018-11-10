import React, { Component } from "react";
import "./Header.css";
class Header extends Component {
  render() {
    return (
      <header>
        <div className="header">
          <div className="sides">
            <a href="#" className="logo">
              BLOG
            </a>
          </div>
          <div className="sides">
            {" "}
            <a href="#" className="menu">
              -
            </a>
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

export default Header;
