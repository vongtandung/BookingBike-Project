import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import "./LocateIdentify.css";
import markerIco from '../../assets/images/marker-ico.png'


import LocateHeader from './LocateHeader';
import UserReq from './UserReq';

class LocateIdentify extends Component {
  componentWillMount() {
    this.props.isLogged(true);
  }
  render() {
    return (
      <div>
        <LocateHeader></LocateHeader>
        <div id="wrapper">
          <UserReq></UserReq>
          <div id="content-wrapper">
            <div className="">
            <Map/>
            </div>
          </div>
        </div>
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
          containerElement={<div style={{ height: `calc(100vh - 56px)` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          onMapClick = {this.getPoint}
          center = {this.state.center}
          zoom = {this.state.zoom}
        />
      </div>
    );
  }
};

const GoogleMapExample = withGoogleMap(props => (
  <GoogleMap
    defaultCenter={ props.center }
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

export default LocateIdentify;
