import React, { Component } from 'react';
import WebService from '../../../utilities/WebServices';
import "./UserBox.scss";

class UserBox extends Component {
  constructor(props) {
    super(props);
    this.handleDriverTripInf = this.handleDriverTripInf.bind(this);
    this.showTripInf = this.showTripInf.bind(this);
    this.webService = new WebService();
    this.state = {
      show: false,
      driverInf: {
        name: '',
        phone: ''
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.userIdSelClick !== this.props.reqId) {
      this.setState({ show: false })
    }
  }
  handleDriverTripInf(driverid) {
    const self = this
    self.webService.getDriverInfoAdmin(driverid)
      .then(res => {
        const data = {
          driverid: self.props.driverId,
          reqId: self.props.reqId,
          driverLat: res[0].DriverLat,
          driverLng: res[0].DriverLng
        }
        self.setState({
          driverInf: {
            ...self.state.driverInf,
            name: res[0].DriverName,
            phone: res[0].DriverPhone
          }
        }, () => {
          self.props.userIdSel(data)
        })
      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken()
            .then(res => {
              self.webService.updateToken(res.access_token)
              self.getDriverInfoAdmin(driverid)
            }).catch((error) => {
              self.webService.logout();
              self.props.history.push('/login')
            })
        } else if (error === 403) {
          self.webService.logout()
          self.props.push('/login')
          return
        }
      })
  }
  showTripInf() {
    if (this.state.show === true) {
      this.setState({ show: !this.state.show })
      this.props.userIdSel(null)
    } else {
      this.setState({ show: !this.state.show }, () => {
        this.handleDriverTripInf(this.props.driverId)
      })
    }
  }
  render() {
    return (
      <div className="user-box-admin" >
        <div className="container-fluid">
          <div className="buttons box">
            <div className="btn green" href="">
              <div className="user-req">
                <div className="user-req-inf">
                  <div className="user-req-inf-name">
                    <i className="fas fa-user user-ico fa-2x"></i>
                    <span className="user-name">User: {this.props.name}</span>
                  </div>
                  <div className="user-req-inf-phone">
                    <i className="fas fa-phone user-ico fa-2x"></i>
                    <span className="user-phone">{this.props.userPhone}</span>
                  </div>
                </div>
                <p className="addr"><u>Địa chỉ:</u> {this.props.address}</p>
                <p className="state"><u>Trạng thái:</u> {this.props.state}</p>
                {
                  this.state.show === true && this.props.reqId === this.props.userIdSelClick ?
                    <div>
                      <p className="driver-name"><u>Tên tài xế:</u> {this.state.driverInf.name}</p>
                      <p className="driver-phone"><u>SDT tài xế:</u> {this.state.driverInf.phone}</p>
                    </div>
                    : null
                }
              </div>
              <button disabled={this.props.state === 'Moving' || this.props.state === 'Accepted' ? false : true} className="btn btn-danger" onClick={this.showTripInf}>Xem thông tin chuyến đi</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserBox;
