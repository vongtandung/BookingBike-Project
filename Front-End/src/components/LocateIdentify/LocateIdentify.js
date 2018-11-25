import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import io from 'socket.io-client';
import HeaderManager from '../HeaderManager';
import UserReq from './UserReq';
import WebService from '../../utilities/WebServices';
import "./LocateIdentify.css";
import markerIco from '../../assets/images/marker-ico.png'

class LocateIdentify extends Component {
  constructor(props) {
    super(props);
    this.onUserNum = this.onUserNum.bind(this);
    this.onUserSelect = this.onUserSelect.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onUserRemove = this.onUserRemove.bind(this);
    this.handleDataSocket = this.handleDataSocket.bind(this);
    this.handleRequestApi = this.handleRequestApi.bind(this);
    this.handleLocatedApi = this.handleLocatedApi.bind(this);
    this.handleMapApi = this.handleMapApi.bind(this);
    this.selfUserList = sessionStorage.getItem('userList') != null ? JSON.parse(sessionStorage.getItem('userList')) : [];
    this.selfUserNum = sessionStorage.getItem('userNum') != null ? sessionStorage.getItem('userNum') : 0;
    this.state = {
      userList: [],
      userSelect: '',
      userNum: 0,
    }
    this.webService = new WebService();
    this.userList = [];
    this.io = null;
  }
  componentWillMount() {
    this.initData();
  }
  componentDidMount() {
    if (this.io != null) {
      this.handleDataSocket();
    }
  }
  componentWillUnmount() {
    if (this.io != null) {
      this.io.disconnect()
    }
  }
  initData() {
    const self = this;
    if (this.webService.isLocate()) {
      this.props.isLogged(true);
      self.io = io(this.webService.sokDomain, {
        query: {
          permission: self.webService.getPermission(),
          name: self.webService.getUserName(),
          id: self.webService.getIdUser()
        }
      });
      self.initState()
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
  initSelfData(userList, userNum) {
    sessionStorage.setItem('userList', JSON.stringify(userList))
    sessionStorage.setItem('userNum', userNum)
  }
  initState() {
    this.setState({
      userList: this.selfUserList,
      userNum: this.selfUserNum
    }, () => {
      this.userList = this.state.userList
    })
  }
  handleDataSocket() {
    const self = this
    self.io.on('server-send-place-locate', function (reqId) {
      if (reqId) {
        self.handleRequestApi(reqId)
      }
    })
  }
  handleRequestApi(reqId) {
    const self = this
    self.webService.getRequest(reqId)
      .then(res => {
        if (res === 'No request') {
          self.props.popup({ title: res, mess: '' })
        } else {
          self.handleMapApi(res)
        }
      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken()
          .then(res =>{
            self.webService.updateToken(res.access_token)
            self.handleRequestApi(reqId)
          }).catch ((error) =>{
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
  handleLocatedApi(lat, lng, requestid) {
    const self = this
    self.webService.located(lat, lng, requestid)
      .then(res => {
        if (res === 'Located') {
          self.io.emit('locate-send-result', requestid)
        }
      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken()
          .then(res =>{
            self.webService.updateToken(res.access_token)
            self.handleLocatedApi(lat, lng, requestid)
          }).catch ((error) =>{
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
  handleMapApi(res) {
    const self = this
    let userDet = {
      userid: res.userid,
      requestid: res.requestid,
      name: res.username,
      phone: res.userphone,
      addrCur: res.place,
      note: res.note,
      addrAutoRev: '',
      addrRev: '',
      center: {
        lat: '',
        lng: ''
      }
    }
    self.webService.getPlace(res.place)
      .then(res => {
        userDet.addrAutoRev = res.results[0].formatted_address;
        userDet.center = res.results[0].geometry.location;
        self.userList.push(userDet);
        self.setState({ userList: self.userList, userNum: self.userList.length }, () => {
          self.initSelfData(self.state.userList, self.state.userNum)
        })
      }).catch(() => {
        userDet.center.lat = 10.801940;
        userDet.center.lng = 106.738449;
        self.userList.push(userDet);
        self.setState({ userList: self.userList, userNum: self.userList.length }, () => {
          self.initSelfData(self.state.userList, self.state.userNum)
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
    const self = this
    let userList = this.state.userList
    let userSel = this.state.userList
    userList = userList.filter((_, index) => {
      return index !== user
    })
    userSel = userSel.filter((_, index) => {
      return index === user
    })
    let result = {
      requestid: userSel[0].requestid,
      lat: userSel[0].center.lat,
      lng: userSel[0].center.lng
    }
    self.setState({
      userList: userList,
    }, () => {
      self.userList = self.state.userList
      self.initSelfData(self.state.userList, self.state.userList.length)
      self.handleLocatedApi(result.lat, result.lng, result.requestid)
    })
  }
  render() {
    return (
      <div className="locate">
        <HeaderManager name={this.webService.getUserName}/>
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
          <Marker position={userMarker.center} icon={markerIco} label={userMarker.name + ' --- id:' + userMarker.userid} onClick={props.userSelect === index ? props.onMapClick : null} />
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