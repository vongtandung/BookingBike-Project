import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import io from 'socket.io-client';
import WebService from '../../utilities/WebServices';
import markerIco from '../../assets/images/marker-ico.png'
import "./Driver.css";

class Driver extends Component {
  constructor(props) {
    super(props);
    this.changeSwitch = this.changeSwitch.bind(this);
    this.changeState = this.changeState.bind(this);
    this.webService = new WebService();
    this.state = {
      switchState: "STAND BY",
      btnState: false,
      btnStateTitle: "Bắt đầu"
    }
    this.io = null
  }
  componentWillMount() {
    this.initData()
  }
  initData() {
    if (this.webService.isLocate()) {
      this.io = io('http://localhost:3002');
      this.io.emit('driver-login', function () {
        return true;
      })
      return;
    } else if (this.webService.isAdmin()) {
      this.props.history.push('/admin')
      return;
    } else if (this.webService.isDriver()) {
      this.props.history.push('/driver')
      return;
    } else if (this.webService.isUser()) {
      this.props.history.push('/user')
      return;
    } else {
      this.props.history.push('/login')
      return;
    }
  }
  changeSwitch() {
    if (this.refs.switch.checked) {
      this.setState({ switchState: "READY" })
    } else {
      this.setState({ switchState: "STAND BY" })
    }
  }
  changeState() {
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
    }, () => console.log(this.state))
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
