import React, { Component } from 'react';
import "./UserBox.scss";

class UserBox extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="user-box" >
        <div className="container-fluid">
          <div className="buttons box">
            <div className="btn green" href="">
              <div className="user-req-inf">
                <i className="fas fa-user user-ico fa-2x"></i>
                <span>User1</span>
                <span>49 xa lo ha noi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserBox;