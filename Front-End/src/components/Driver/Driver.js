import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from 'react-google-maps';
import SweetAlert from 'sweetalert2-react';
import haversine from 'haversine';
import io from 'socket.io-client';
import WebService from '../../utilities/WebServices';
import markerIco from '../../assets/images/marker-ico.png'
import "./Driver.css";
// declare let navigator

class Driver extends Component {
  constructor(props) {
    super(props);
    this.handleCurLocate = this.handleCurLocate.bind(this);
    this.handleDataSocket = this.handleDataSocket.bind(this);
    this.onTimeOutReq = this.onTimeOutReq.bind(this);
    this.onShowPopupWarn = this.onShowPopupWarn.bind(this);
    this.onClosePopupWarn = this.onClosePopupWarn.bind(this);
    this.onConfirmPopup = this.onConfirmPopup.bind(this);
    this.onClosePopupReq = this.onClosePopupReq.bind(this);
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
    window.navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
      if (result.state === 'granted') {
        return
      } else if (result.state === 'prompt' || result.state === 'denied') {
        self.onShowPopupWarn()
      }
    });

    window.navigator.geolocation.getCurrentPosition(function (data) {
      self.setState({
        curLocate: {
          ...self.state.curLocate,
          lat: data.coords.latitude,
          lng: data.coords.longitude
        }
      }, () => {
        self.onClosePopupWarn()
      })
    })
  }
  handleDataSocket() {
    const self = this
    self.io.on('server-send-request-driver', function (data) {
      if (data) {
        self.setState({
          popupReq: {
            ...self.state.popupReq,
            show: true,
            popupReq: true,
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
  onShowPopupWarn() {
    const self = this
    self.setState({
      popupReq: {
        ...self.state.popupReq,
        show: true,
        popupType: false,
        title: 'Bạn vui lòng bật gps và tải lại trang để tiếp tục',
        mess: ''
      }
    })
  }
  onClosePopupWarn() {
    const self = this
    self.setState({
      popupReq: {
        ...self.state.popupReq,
        show: false,
        popupType: false,
        title: '',
        mess: ''
      }
    })
  }
  onConfirmPopup() {
    const self = this
    if (this.state.popupReq.popupType === true) {
      this.driverRes.mess = 'accept'
      self.setState({
        popupReq: {
          ...self.state.popupReq,
          show: false,
          title: '',
          mess: ''
        }
      }, () => {
        self.io.emit('driver-send-response', self.driverRes)
      })
    } else if (this.state.popupReq.popupType === false) {
      if (this.state.curLocate.lat === 0) {
        this.handleCurLocate()
      }
    }
  }
  onClosePopupReq() {
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
          showCancelButton={this.state.popupReq.popupType}
        // imageUrl="https://unsplash.it/400/200"
        // imageWidth="400"
        // imageHeight="200"
        />
        <Map center={this.state.curLocate} popup={this.props.popup} />
      </div>
    );
  }
}

class Map extends Component {
  constructor(props) {
    super(props);
    this.getPoint = this.getPoint.bind(this);
    this.state = {
      defaultCenter: {
        latitude: 0,
        longitude: 0
      },
      geoCurrCenter: {
        lat: null,
        lng: null
      },
      zoom: 16,
      directions: null,
      marker: false
    }
  }
  componentWillMount() {
    console.log('ok')
    const DirectionsService = new window.google.maps.DirectionsService();
    console.log(new window.google.maps.LatLng(10.801640, 106.741040))
    DirectionsService.route({
      origin: new window.google.maps.LatLng(10.801640, 106.741040),
      destination: new window.google.maps.LatLng(10.802670, 106.645150 ),
      provideRouteAlternatives: true,
      avoidTolls: true,
      avoidHighways: true,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
          marker: true
        }, () => console.log(this.state.directions.routes));
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      geoCurrCenter: {
        ...this.state.geoCurrCenter,
        lat: nextProps.center.lat,
        lng: nextProps.center.lng
      }
    }, () => this.render())
    this.setState({
      defaultCenter: {
        ...this.state.defaultCenter,
        latitude: nextProps.center.lat,
        longitude: nextProps.center.lng
      }
    })
  }
  componentDidMount() {
    this.render();
  }
  getPoint(event) {
    const distance = haversine(
      {
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng()
      }, this.state.defaultCenter, { unit: 'meter' })
    if (distance <= 100) {
      this.setState({
        geoCurrCenter: {
          ...this.state.geoCurrCenter,
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        }
      })
    } else {
      this.props.popup({ title: 'Không được phép điều chỉnh vị trí vượt quá 100m' })
    }
  }
  render() {

    return (
      <div className="google-map">
        <GoogleMapExample
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `90vh` }} />}
          mapElement={<div style={{ height: `90%` }} />}
          onMapClick={this.getPoint}
          geoCurrCenter={this.state.geoCurrCenter}
          zoom={this.state.zoom}
          directions={this.state.directions}
          marker={this.state.marker}
        />
      </div>
    );
  }
};

const GoogleMapExample = withGoogleMap(props => (
  <GoogleMap
    center={props.geoCurrCenter}
    defaultZoom={props.zoom}
    options={mapOptions}
    onClick={props.onMapClick}
  >
  {console.log(props.directions)}
    {props.directions && <DirectionsRenderer directions={props.directions} options={{suppressMarkers:true}} />}

    <Marker position={props.geoCurrCenter} icon={markerIco} onClick={props.onMarkerClick} />
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