import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import SweetAlert from 'sweetalert2-react';
import io from 'socket.io-client';
import WebService from '../../utilities/WebServices';
import markerIco from '../../assets/images/marker-ico.png'
import "./Driver.css";
// declare let navigator

class Driver extends Component {
  constructor(props) {
    super(props);
    this.handleCurLocate  = this.handleCurLocate.bind(this);
    this.handleDataSocket = this.handleDataSocket.bind(this);
    this.onTimeOutReq = this.onTimeOutReq.bind(this);
    this.onConfirmPopup = this.onConfirmPopup.bind(this);
    this.onClosePopup = this.onClosePopup.bind(this);
    this.changeSwitch = this.changeSwitch.bind(this);
    this.changeState = this.changeState.bind(this);
    this.webService = new WebService();
    this.state = {
      switchState: "STAND BY",
      btnState: false,
      btnStateTitle: "Bắt đầu",
      curLocate: {
        lat: 0,
        lng: 0
      },
      isProcess: false,
      popupReq: {
        show: false,
        popupType: true,
        title: '',
        mess: ''
      },
      userDet: {
        reqId: '',
        addr: '',
        name: '',
        phone: ''
      }
    }
    this.driverRes = {
      name: this.webService.getUserName(),
      driverphone: this.webService.getPhoneNum(),
      driverid: this.webService.getIdUser(),
      socketid: '',
      requestid: '',
      userphone: '',
      mess: ''
    }
    this.io = null
  }
  componentWillMount() {
    this.initData()
  }
  componentDidMount() {
    if (this.io != null) {
      this.handleDataSocket();
    }
    this.handleCurLocate();
    if (this.state.curLocate.lat === 0 && this.state.curLocate.lng === 0) {
      this.props.popup({ title: 'Bạn vui lòng bật gps để xác định địa điểm', mess: '' })
    }
  }
  componentWillUnmount() {
    if (this.io != null) {
      this.io.close()
    }
  }
  initData() {
    const self = this;
    if (this.webService.isLocate()) {
      this.props.history.push('/locate')
      return;
    } else if (this.webService.isAdmin()) {
      this.props.history.push('/admin')
      return;
    } else if (this.webService.isUser()) {
      this.props.history.push('/user')
      return;
    } else if (this.webService.isDriver()) {
      self.props.isLogged(false)
      self.handleCurLocate()
      self.io = io(this.webService.sokDomain, {
        query: {
          permission: self.webService.getPermission(),
          name: self.webService.getUserName(),
          phone: self.webService.getPhoneNum()
        }
      });
      return;
    } else {
      this.props.history.push('/login')
      return;
    }
  }
  handleCurLocate() {
    const self = this
    window.navigator.geolocation.getCurrentPosition(function (data) {
      clearInterval(self.gpsEnable);
      self.setState({
        curLocate: {
          ...self.state.curLocate,
          lat: data.coords.latitude,
          lng: data.coords.longitude
        }
      })
    }, function () {
      self.props.popup({ title: 'Bạn vui lòng bật gps để xác định địa điểm', mess: '' })
    })
  }
  handleDataSocket() {
    const self = this
    self.io.on('server-send-request-driver', function (data) {
      console.log(data)
      if (data) {
        self.setState({
          popupReq: {
            ...self.state.popupReq,
            show: true,
            title: data.name,
            mess: data.addr + '|' + data.phone
          },
          userDet: {
            ...self.state.userDet,
            reqId: data.requestid,
            addr: data.addr,
            name: data.name,
            phone: data.phone
          }
        }, () => {
          self.onTimeOutReq()
          self.driverRes.socketid = data.socketid
          self.driverRes.userphone = data.phone
          self.driverRes.requestid = data.requestid
        })

      }
    })
  }
  onTimeOutReq() {
    if (this.state.popupReq.show === true) {
      setTimeout(() => {
        this.onClosePopup()
      }, 10000);
    }
  }
  onConfirmPopup(e) {
    const self = this
    this.driverRes.mess = 'accept'
    self.setState({
      popupReq: {
        ...self.state.popupReq,
        show: false,
        title: '',
        mess: ''
      }
    }, () => {
      console.log(self.driverRes)
      self.io.emit('driver-send-response', self.driverRes)
    })
  }
  onClosePopup() {
    console.log('ok')
    this.driverRes.mess = 'reject'
    this.io.emit('driver-send-response', this.driverRes)
  }
  changeSwitch() {
    if (this.refs.switch.checked) {
      this.setState({ switchState: "READY" })
    } else {
      this.setState({ switchState: "STAND BY" })
    }
  }
  changeState(e) {
    e.preventDefault();
    this.webService.driverFinish(this.state.userDet.reqId)
      .then(res => {
        console.log(res + 'finish')
      })
    const state = this.state.btnState;
    this.setState({ btnState: !state }, () => {
      if (this.state.btnState === true) {
        this.setState({ btnStateTitle: "Kết thúc" })
      } else {
        this.setState({ btnStateTitle: "Bắt đầu" })
      }
    })
  }
  render() {
    return (
      <div className="driver">
        <div className="switch-state">
          <label className="switch">
            <input type="checkbox" ref="switch" onClick={this.changeSwitch} />
            <span className="slider round" />
          </label>
          <div>
            <label>{this.state.switchState}</label>
          </div>
        </div>
        <div />
        <div className="btn-state">
          <div className="btn-box">
            <button className="btn btn-danger btn-lg" ref="btn" onClick={this.changeState}>
              {this.state.btnStateTitle}
            </button>
          </div>
        </div>
        <SweetAlert
          show={this.state.popupReq.show}
          title={this.state.popupReq.title}
          text={this.state.popupReq.mess}
          onConfirm={this.onConfirmPopup}
          showCancelButton={true}
        // imageUrl="https://unsplash.it/400/200"
        // imageWidth="400"
        // imageHeight="200"
        />
        <Map />
      </div>
    );
  }
}

class Map extends Component {
  constructor(props) {
    super(props);
    this.getPoint = this.getPoint.bind(this);
    this.state = {
      center: {
        lat: 10.801940,
        lng: 106.738449
      },
      zoom: 16
    }
  }

  getPoint(event) {
    console.log(event)
    this.setState({
      center: {
        ...this.state.center,
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }
    })
  }
  render() {

    return (
      <div className="google-map">
        <GoogleMapExample
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `90vh` }} />}
          mapElement={<div style={{ height: `90%` }} />}
          onMapClick={this.getPoint}
          center={this.state.center}
          zoom={this.state.zoom}
        />
      </div>
    );
  }
};

const GoogleMapExample = withGoogleMap(props => (
  <GoogleMap
    defaultCenter={props.center}
    defaultZoom={props.zoom}
    options={mapOptions}
    onClick={props.onMapClick}
  >
    <Marker position={props.center} icon={markerIco} onClick={props.onMarkerClick} />
  </GoogleMap>
));

const mapOptions = {
  panControl: false,
  mapTypeControl: false,
  styles: [
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        { color: "#ffdfcc" },
        { gamma: 0 },
        { lightness: 1 },
        { visibility: "on" }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#494949" }, { lightness: 30 }, { visibility: "on" }]
    },
    {
      featureType: "road",
      elementType: "labels.text",
      stylers: [{ color: "#00000" }, { lightness: 1 }, { visibility: "on" }]
    }
  ]
};

export default Driver;
