import React, { Component } from 'react';
import "./UserBox.scss";

class UserBox extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="user-box" >
        <div className="container-fluid">
          <div className="buttons box">
            <div className="btn green" href="">
              <div className="user-req">
                <div className="user-req-inf">
                  <i className="fas fa-user user-ico fa-2x"></i>
                  <span className="user-name">User {this.props.num}: {this.props.name}</span>
                </div>
                <p className="addr"><u>Địa chỉ:</u> {this.props.address}</p>
                <p className="addr"><u>Ghi chú:</u> {this.props.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserBox;
