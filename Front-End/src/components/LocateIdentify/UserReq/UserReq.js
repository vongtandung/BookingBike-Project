import React, { Component } from 'react';
import './UserReq.css'
import UserBox from '../UserBox';


class AdNav extends Component {
  render() {
    return (
      <div>
        <ul className="sidebar navbar-nav">
          <div className="scroll-box">
            <div className="scroll-box-content">
              <UserBox />
            </div>
          </div>
        </ul>
      </div>
    )
  }
}

export default AdNav;
