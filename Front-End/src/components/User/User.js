import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import SearchBox from "react-google-maps/lib/components/places/SearchBox"
import "./User.css";
import markerIco from '../../assets/images/marker-ico.png'

class User extends Component {
  constructor(props){
    super(props);
    this.onPlaceChange = this.onPlaceChange.bind(this);
    this.onNoteChange = this.onNoteChange.bind(this);
    this.onSendInfo = this.onSendInfo.bind(this);
    this.state ={
      place: '',
      note: ''
    }
  }
  onPlaceChange(value){
    this.setState({
      place: value
    })
  }
  onNoteChange(event){
    this.setState({
      note: event.target.value
    })
  }
  onSendInfo(){
  }
  render() {
    return (
      <div className="user">
        <div className="user-input container-fluid input-box1">
          <div className="input-group input-group-md">
          <input
            ref = "note"
            onBlur = {this.onNoteChange}
            type="text"
            className="form-control"
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            placeholder="Nhập ghi chú"
          />
        </div>
        <div className="btn-custom">
        <button type="button" className="btn btn-success btn-lg" onClick={this.onSendInfo}>Đặt Xe</button>
        </div>
        </div>
        <Map onPlaceChange={this.onPlaceChange}/>
      </div>
      
    );
  }
}
class Map extends Component {
  constructor(props) {
    super(props);
    this.getPoint = this.getPoint.bind(this);
    this.onSearchBox = this.onSearchBox.bind(this);
    this.onSearchInput = this.onSearchInput.bind(this);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.state = {
      center: {
        lat: 10.801940,
        lng: 106.738449
      },
      zoom: 16,
      searchhBox: null,
      searchInput: null,
      searchhBoxTemp: ''
    }
  }

  getPoint(event) {
    this.setState({
      center: {
        ...this.state.center,
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }
    })
  }
  onPlacesChanged(){
    this.state.onSearchInput.focus();
    console.log(this.state.SearchBox.getPlaces())
  }
  onSearchBox(ref){
    this.setState({SearchBox: ref}, () => {});
  }
  onSearchInput(ref){
    this.setState({onSearchInput: ref});
  }
  onInputChange(event){
    this.setState({searchInput: event.target.value}, () => {
      this.props.onPlaceChange(this.state.searchInput);
    })
  }
  render() {

    return (
      <div className="google-map">
        <GoogleMapExample
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `90vh` }} />}
          mapElement={<div style={{ height: `90%` }} />}
          onMapClick = {this.getPoint}
          center = {this.state.center}
          zoom = {this.state.zoom}
          onPlacesChanged = {this.onPlacesChanged}
          onSearchBox = {this.onSearchBox}
          onSearchInput = {this.onSearchInput}
          onInputChange = {this.onInputChange}
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
    <SearchBox
        bounds={props.bounds}
        controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
        ref={props.onSearchBox}
    >
        <div className="user-input container-fluid input-box">
          <input
            ref = {props.onSearchInput}
            onBlur = {props.onInputChange}
            type="text"
            className="form-control"
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            placeholder="Nhập địa chỉ..."
            autoComplete="true"
          />
          </div>
        </SearchBox>
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


export default User;
