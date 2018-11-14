import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import io from 'socket.io-client';
import LocateHeader from './LocateHeader';
import UserReq from './UserReq';
import WebService from '../../utilities/WebServices';
import "./LocateIdentify.css";
import markerIco from '../../assets/images/marker-ico.png'

class LocateIdentify extends Component {
  constructor() {
    super();
    this.onUserNum = this.onUserNum.bind(this);
    this.onUserSelect = this.onUserSelect.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.handleDataSocket = this.handleDataSocket.bind(this);
    this.state = {
      userList: [],
      userSelect: '',
      userNum: 0,
      isLoading: true
    }
    this.webService = new WebService();
    this.io = io('http://localhost:3002');
    this.exam = []

  }
  componentWillMount() {
    this.props.isLogged(true);
  }
  componentDidMount() {
    this.handleDataSocket();
  }
  handleDataSocket() {
    const self = this
    const userList = [...self.state.userList]
    self.io.on('server-send-place2', function (data) {
      let userDet = {
        id: data.id,
        addr: '',
        center: {
          lat: '',
          lng: ''
        }
      }
      self.webService.getPlace(data.place.place)
        .then(res => {
          userDet.addr = res.results[0].formatted_address;
          userDet.center = res.results[0].geometry.location;
          userList.push(userDet);
          self.setState({ userList: userList, userNum: userList.length })
        })
    })
  }
  onUserNum(value) {
    this.setState({ userNum: value })
  }
  onUserSelect(value) {
    this.setState({ userSelect: value })
  }
  onUserChange(value) {
    let userSelect = this.state.userSelect;
    if (userSelect !== '') {
      const locateChange = this.state.userList;
      locateChange[userSelect].center = value
      this.setState({ userList: locateChange })
    }
  }
  render() {
    return (
      <div>
        <LocateHeader />
        <div id="wrapper">
          <UserReq userList={this.state.userList} userSelect={this.onUserSelect} />
          <div id="content-wrapper">
            <div className="">
              <Map userList={this.state.userList} userSelect={this.state.userSelect} onUserChange={this.onUserChange} />
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
      zoom: 15
    }
  }

  getPoint(event) {
    const center = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    this.setState({
      center: center
    }, () => { this.props.onUserChange(center) })
  }
  render() {
    return (
      <div className="google-map">
        <GoogleMapExample
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `calc(100vh - 56px)` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          onMapClick={this.getPoint}
          center={this.state.center}
          zoom={this.state.zoom}
          userList={this.props.userList}
          userSelect={this.props.userSelect}
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
    onClick={props.userSelect !== '' ? props.onMapClick : null}
  >
    {props.userList.map((userMarker, index) => {
      console.log(index, props.userSelect)
      return (
        <div key={index}>
          <Marker position={userMarker.center} icon={markerIco} onClick={props.userSelect === index ? props.onMapClick : null} />
        </div>
      )
    })
    }
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