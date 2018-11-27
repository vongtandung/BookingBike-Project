import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from 'react-google-maps';
import io from 'socket.io-client';
import HeaderManager from '../HeaderManager';
import UserReq from './UserReq';
import WebService from '../../utilities/WebServices';
import "./Manager.css";
import markerIco from '../../assets/images/marker-ico.png'

class Manager extends Component {
  constructor(props) {
    super(props);
    this.onUserNum = this.onUserNum.bind(this);
    this.onUserSelect = this.onUserSelect.bind(this);
    this.handleDataSocket = this.handleDataSocket.bind(this);
    this.handleGetAllReqApi = this.handleGetAllReqApi.bind(this);
    this.state = {
      userList: [],
      userSelect: '',
      userSelectData: null,
      userNum: null
    }
    this.webService = new WebService();
    this.userList = [];
    this.callLoopApi = null
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
    clearInterval(this.callLoopApi)
    if (this.io != null) {
      this.io.close()
    }
  }
  initData() {
    const self = this;
    if (this.webService.isAdmin()) {
      this.props.isLogged(true);
      this.callLoopApi = setInterval(this.handleGetAllReqApi, 2000)
      self.io = io(this.webService.sokDomain, {
        query: {
          permission: self.webService.getPermission(),
          name: self.webService.getUserName(),
          id: self.webService.getIdUser()
        }
      });
      return;
    } else if (this.webService.isLocate()) {
      this.props.history.push('/locate')
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

  }
  handleGetAllReqApi() {
    const self = this
    self.webService.getAllReq()
      .then(res => {
        self.setState({
          userList: res,
          userNum: res.length
        }, () => {
        })
      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken()
            .then(res => {
              self.webService.updateToken(res.access_token)
              self.handleGetAllReqApi()
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
  onUserNum(value) {
    this.setState({ userNum: value })
  }
  onUserSelect(value) {
    if (value.reqId === null) {
      this.setState({
        userSelect: '',
        userSelectData: null
      })
    } else {
      let userSel = this.state.userList
      userSel = userSel.filter((data, index) => {
        return data.id === value.reqId
      })
      this.setState({
        userSelect: value,
        userSelectData: {
          driverLat: value.driverLat,
          driverLng: value.driverLng,
          userLat: userSel[0].UserLat,
          userLng: userSel[0].UserLng,
        }
      })
    }
  }
  render() {
    return (
      <div className="admin">
        <HeaderManager name={this.webService.getUserName} />
        <div id="wrapper">
          <UserReq userList={this.state.userList} userSelect={this.onUserSelect} />
          <div id="content-wrapper">
            <div className="">
              <Map tripData={this.state.userSelectData} />
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
    this.drawDirection = this.drawDirection.bind(this);
    this.findShortestRoute = this.findShortestRoute.bind(this);
    this.state = {
      defaultCenter: {
        lat: 10.801940,
        lng: 106.738449
      },
      driverCenter: {
        lat: null,
        lng: null
      },
      userCenter: {
        lat: null,
        lng: null
      },
      zoom: 15,
      directions: null,
      marker: false
    }
  }

  componentDidMount() {
    this.render();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.tripData === null) {
      this.setState({
        driverCenter: {
          ...this.state.driverCenter,
          lat: null,
          lng: null
        },
        userCenter: {
          ...this.state.userCenter,
          lat: null,
          lng: null
        },
        directions: null,
        indexRoute: 0,
        zoom: 15
      })
    } else {
      this.setState({
        driverCenter: {
          ...this.state.driverCenter,
          lat: nextProps.tripData.driverLat,
          lng: nextProps.tripData.driverLng
        },
        userCenter: {
          ...this.state.userCenter,
          lat: nextProps.tripData.userLat,
          lng: nextProps.tripData.userLng
        },
      }, () => {
        this.drawDirection()
      })
    }
  }
  drawDirection() {
    const DirectionsService = new window.google.maps.DirectionsService();
    if (this.state.userCenter.lat != null) {
      DirectionsService.route({
        origin: new window.google.maps.LatLng(this.state.driverCenter.lat, this.state.driverCenter.lng),
        destination: new window.google.maps.LatLng(this.state.userCenter.lat, this.state.userCenter.lng),
        provideRouteAlternatives: true,
        avoidTolls: true,
        avoidHighways: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.findShortestRoute(result)
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  }
  findShortestRoute(result) {
    let shortest = result.routes[0].legs[0].distance.value
    let indexRoute = 0;
    result.routes.forEach((ele, index) => {
      if (ele.legs[0].distance.value < shortest) {
        shortest = ele.legs.distance.value
        indexRoute = index
      }
    });
    this.setState({
      directions: result,
      indexRoute: indexRoute,
      marker: true
    }, () => {
    });
  }

  render() {
    return (
      <div className="google-map">
        <GoogleMapExample
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `95vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          defaultCenter={this.state.defaultCenter}
          driverCenter={this.state.driverCenter}
          userCenter={this.state.userCenter}
          zoom={this.state.zoom}
          directions={this.state.directions}
          indexRoute={this.state.indexRoute}
        />
      </div>
    );
  }
};

const GoogleMapExample = withGoogleMap(props => (
  <GoogleMap
    center={props.defaultCenter}
    zoom={props.zoom}
    options={mapOptions}
  >
    {props.directions != null && <DirectionsRenderer directions={props.directions} routeIndex={props.indexRoute} options={{ suppressMarkers: true }} />}
    {props.driverCenter.lat != null && <Marker position={props.driverCenter} icon={markerIco} label={'Tài xế'} />}
    {props.userCenter.lat != null && <Marker position={props.userCenter} icon={markerIco} label={'Khách'} />}
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