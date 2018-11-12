import React, { Component } from 'react';
import './UserReq.css'
import UserBox from '../UserBox';


class UserReq extends Component {
  constructor() {
    super();
    this.onUserSel = this.onUserSel.bind(this);
    this.state = {
      userList: [],
      userSelect: ''
    }
  }
  componentWillMount() {
    for (let i = 0; i < 4; i++) {
      this.state.userList.push(<UserBox/>)
    }
  }
  onUserSel(index) {
    this.setState({ userSelect: index })
  }
  render() {
    return (
      <div>
        <ul className="sidebar navbar-nav">
          <div className="scroll-box">
            <div className="scroll-box-content">
              {
                this.state.userList.map((userList, index) => {
                  return (
                    <div className={this.state.userSelect === index ? "list-user" : null} key={index} onClick={() => this.onUserSel(index)}>
                      {userList}
                    </div>
                  )
                })
              }
            </div>
          </div>
        </ul>
      </div>
    )
  }
}

export default UserReq;
