import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import io from 'socket.io-client';
import HeaderManager from '../HeaderManager';
import UserReq from './UserReq';
import WebService from '../../utilities/WebServices';
import "./Manager.css";
import markerIco from '../../assets/images/marker-ico.png'

class Manager extends Component {
  constructor() {
    super();
    this.onUserNum = this.onUserNum.bind(this);
    this.onUserSelect = this.onUserSelect.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onUserRemove = this.onUserRemove.bind(this);
    this.handleDataSocket = this.handleDataSocket.bind(this);
    this.state = {
      userList: [],
      userSelect: '',
      userNum: 0,
      isLoading: true
    }
    this.webService = new WebService();
    this.io = io('http://localhost:3002');
  }
  componentWillMount() {
    this.props.isLogged(true);
    //this.initData()
  }
  componentDidMount() {
    this.handleDataSocket();
  }
  initData() {
    if (this.webService.isLocate()) {
      this.props.isLogged(true);
      this.io = io('http://localhost:3002');
      this.io.emit('Manager-login', function () {
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
  handleDataSocket() {
    const self = this
    const userList = [...self.state.userList]
    self.io.on('server-send-place2', function (data) {
      let userDet = {
        id: data.id,
        addrCur: data.place.place,
        addrAutoRev: '',
        addrRev: '',
        center: {
          lat: '',
          lng: ''
        }
      }
      self.webService.getPlace(data.place.place)
        .then(res => {
          userDet.addrAutoRev = res.results[0].formatted_address;
          userDet.center = res.results[0].geometry.location;
          userList.push(userDet);
          self.setState({ userList: userList, userNum: userList.length })
        }).catch(() => {
          userDet.center.lat = 10.801940;
          userDet.center.lng = 106.738449;
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
  onUserChange(center, addrRev) {
    let userSelect = this.state.userSelect;
    if (userSelect !== '') {
      const locateChange = this.state.userList;
      locateChange[userSelect].center = center;
      locateChange[userSelect].addrRev = addrRev;
      this.setState({ userList: locateChange })
    }
  }
  onUserRemove(user) {
    let userList = this.state.userList
    userList = userList.filter((_, index) => {
      return index !== user
    })
    this.setState({
      userList: userList,
    })
  }
  render() {
    return (
      <div>
        <HeaderManager />
        <div id="wrapper">
          <UserReq userList={this.state.userList} userSelect={this.onUserSelect} userRemove={this.onUserRemove} />
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
    this.webService = new WebService();
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
    const self = this;
    const center = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    self.webService.getPlaceRev(center)
      .then(res => {
        let address = '';
        if (res.results[0].formatted_address) {
          address = res.results[0].formatted_address;
        }
        self.setState({
          center: center
        }, () => { self.props.onUserChange(center, address) })
      }).catch(error => { })
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

export default Manager;