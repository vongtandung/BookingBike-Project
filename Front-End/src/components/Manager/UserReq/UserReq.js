import React, { Component } from 'react';
import './UserReq.css'
import UserBox from '../UserBox';


class UserReq extends Component {
  constructor(props) {
    super(props)
    this.onUserIdSel = this.onUserIdSel.bind(this);
    this.state = {
      userList: [],
      userSelect: '',
      userNum: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userList && nextProps.userList !== this.props.userList) {
      const newUserList = nextProps.userList;
      this.setState({ userList: newUserList })
    }
  }
  onUserIdSel(data) {
    let dataSend ={
      driverid: null,
      reqId: null,
      driverLat: null,
      driverLng: null
    }
    if (data !== null){
      dataSend.driverid = data.driverid
      dataSend.reqId = data.reqId
      dataSend.driverLat = data.driverLat
      dataSend.driverLng = data.driverLng
    }
    this.setState({
      userSelect: dataSend.reqId
    }, () => {
      this.props.userSelect(dataSend)
    })
  }
  render() {
    const userList = this.state.userList ? this.state.userList : []
    return (
      <div className="admin-user-req">
        <ul className="sidebar navbar-nav">
          <div className="scroll-box">
            <div className="scroll-box-content">
              {
                userList.map((data, index) => {
                  return (
                    <div key={index}>
                      <UserBox reqId={data.id} address={data.BeginPlace} name={data.UserName} userPhone={data.UserPhone} state={data.State}
                        driverId={data.idDriver} userIdSel={this.onUserIdSel} userIdSelClick={this.state.userSelect} />
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
