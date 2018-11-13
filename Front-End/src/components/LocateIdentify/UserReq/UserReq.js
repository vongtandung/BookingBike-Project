import React, { Component } from 'react';
import './UserReq.css'
import UserBox from '../UserBox';


class UserReq extends Component {
  constructor(props) {
    super(props);
    this.onUserSel = this.onUserSel.bind(this);
    this.state = {
      userList: [],
      userSelect: '',
      userNum: 0
    }
  }
  shouldComponentUpdate() {
    return true
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      userList: [...this.state.userList, nextProps.userList]
    })
  }
  onUserSel(index) {
    this.setState({ userSelect: index }, () => {
      this.props.userSelect(this.state.userSelect);
      console.log(this.state)
    })
  }
  render() {
    const num = 0
    const userList = [this.state.userList[0]]
    console.log(userList);
    return (
      <div>
        <ul className="sidebar navbar-nav">
          <div className="scroll-box">
            <div className="scroll-box-content">
             
            </div>
          </div>
        </ul>
      </div>
    )
  }
}

export default UserReq;
