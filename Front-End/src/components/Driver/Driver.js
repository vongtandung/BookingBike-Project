import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from 'react-google-maps';
import SweetAlert from 'sweetalert2-react';
import Switch from "react-switch";
import haversine from 'haversine';
import io from 'socket.io-client';
import WebService from '../../utilities/WebServices';
import markerIco from '../../assets/images/marker-ico.png'
import "./Driver.css";

class Driver extends Component {
  constructor(props) {
    super(props);
    this.handleCurLocate = this.handleCurLocate.bind(this);
    this.handleCurrLocateFinish = this.handleCurrLocateFinish.bind(this);
    this.handleDataSocket = this.handleDataSocket.bind(this);
    this.handleInitInfApi = this.handleInitInfApi.bind(this);
    this.handleReqInfApi = this.handleReqInfApi.bind(this);
    this.handleReqAccApi = this.handleReqAccApi.bind(this);
    this.handleReqFinApi = this.handleReqFinApi.bind(this);
    this.handleUpdStateApi = this.handleUpdStateApi.bind(this);
    this.handleDriverBusyApi = this.handleDriverBusyApi.bind(this);
    this.onTimeOutReq = this.onTimeOutReq.bind(this);
    this.onShowPopupWarn = this.onShowPopupWarn.bind(this);
    this.onClosePopupWarn = this.onClosePopupWarn.bind(this);
    this.onConfirmPopup = this.onConfirmPopup.bind(this);
    this.onClosePopupReq = this.onClosePopupReq.bind(this);
    this.updateLocate = this.updateLocate.bind(this);
    this.changeSwitch = this.changeSwitch.bind(this);
    this.changeState = this.changeState.bind(this);
    this.webService = new WebService();
    this.state = {
      switchState: true,
      btnStateTitle: 'Bắt đầu',
      btnState: false,
      reqAccept: false,
      isBusy: false,
      curLocate: {
        lat: 0,
        lng: 0
      },
      popupReq: {
        show: false,
        popupType: true,
        title: '',
        mess: ''
      },
      userDet: {
        userId: '',
        reqId: '',
        addr: '',
        name: '',
        phone: '',
        center: {
          lat: 0,
          lng: 0
        }
      }
    }
    this.driverRes = {
      name: this.webService.getUserName(),
      driverphone: this.webService.getPhoneNum(),
      driverid: this.webService.getIdUser(),
      driverAccToken: this.webService.getToken(),
      driverRefToken: this.webService.getRefreshToken(),
      userphone: '',
      mess: ''
    }

    this.revLocate = {
      lat: 0,
      lng: 0
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
      this.handleDriverBusyApi(this.driverRes.driverid, this.driverRes.driverAccToken, this.driverRes.driverRefToken)
      this.io.disconnect()
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
          id: self.webService.getIdUser()
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
    let permission = null
    if (window.navigator) {
      if (window.navigator.permissions) {
        window.navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
          if (result.state === 'prompt' || result.state === 'denied') {
            self.changeSwitch(false)
            if (result.state === 'denied') {
              permission = result.state
            }
            self.onShowPopupWarn()
          } else if (result.state === 'granted') {
            permission = result.state
            return
          }
        });
      }
      window.navigator.geolocation.getCurrentPosition(function (data) {
        self.changeSwitch(true)
        self.setState({
          curLocate: {
            ...self.state.curLocate,
            lat: data.coords.latitude,
            lng: data.coords.longitude
          }
        }, () => {
          self.onClosePopupWarn()
          self.handleInitInfApi()
        })
      }, function () {
        if (permission != null && permission === 'denied') {
        }
      }, { enableHighAccuracy: true })
    }
  }
  handleCurrLocateFinish() {
    const self = this;
    window.navigator.geolocation.getCurrentPosition(function (data) {
      self.setState({
        curLocate: {
          ...self.state.curLocate,
          lat: data.coords.latitude,
          lng: data.coords.longitude
        }
      })
    }, function () {
    }, { enableHighAccuracy: true })
  }

  handleDataSocket() {
    const self = this
    self.io.on('server-send-request-driver', function (reqId) {
      if (reqId) {
        setTimeout(() => {
          self.handleReqInfApi(reqId)
        }, 350);
      }
    })
  }
  handleInitInfApi() {
    const self = this
    self.webService.updateLocate(self.webService.getIdUser(), self.state.curLocate.lat, self.state.curLocate.lng)
      .then(res => {

      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken()
            .then(res => {
              self.webService.updateToken(res.access_token)
              self.handleInitInfApi()
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
  handleReqInfApi(reqId) {
    const self = this
    self.webService.getRequestInfo(reqId)
      .then(res => {
        self.setState({
          userDet: {
            ...self.state.userDet,
            userId: res.userid,
            reqId: res.requestid,
            addr: res.place,
            name: res.username,
            phone: res.userphone,
            center: {
              ...self.state.userDet.center,
              lat: res.lat,
              lng: res.lng
            }
          },
          popupReq: {
            ...self.state.popupReq,
            show: true,
            popupType: true,
            title: res.username,
            mess: res.place + '|' + res.userphone
          }
        }, () => {
          self.onTimeOutReq()
          self.driverRes.userphone = res.userphone
        })
      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken()
            .then(res => {
              self.webService.updateToken(res.access_token)
              self.handleReqInfApi(reqId)
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
  handleReqAccApi(reqId) {
    const self = this;
    self.webService.acceptRequest(self.driverRes.driverid, self.state.userDet.reqId)
      .then(res => {
        self.setState({
          popupReq: {
            ...self.state.popupReq,
            show: false,
            title: '',
            mess: ''
          },
          reqAccept: true
        }, () => {
          if (res.mess === 'OK') {
            let params = {
              requestid: reqId,
              mess: 'accept'
            }
            self.io.emit('driver-send-response', params)
          }
        })

      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken()
            .then(res => {
              self.webService.updateToken(res.access_token)
              self.handleReqAccApi(reqId)
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
  handleReqFinApi() {
    const self = this
    self.webService.driverFinish(self.state.userDet.reqId, self.driverRes.driverid)
      .then(res => {
        if (res && res.mess === 'OK') {
          let userIdTem = self.state.userDet.userId
          self.setState({
            reqAccept: false,
            userDet: {
              ...self.state.userDet,
              userId: '',
              reqId: '',
              addr: '',
              name: '',
              phone: '',
              center: {
                ...self.state.userDet.center,
                lat: 0,
                lng: 0
              }
            }
          }, () => {
            self.io.emit('driver-finish', userIdTem)
            self.handleCurrLocateFinish()
            self.handleUpdStateApi(self.state.curLocate.lat, self.state.curLocate.lng, '1', self.driverRes.driverid)
          })
        }
      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken()
            .then(res => {
              self.webService.updateToken(res.access_token)
              self.handleReqFinApi()
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
  handleUpdStateApi(lat, lng, state, driverid) {
    const self = this;
    self.webService.updateState(lat, lng, state, driverid)
      .then(res => {

      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken()
            .then(res => {
              self.webService.updateToken(res.access_token)
              self.handleUpdStateApi(lat, lng, state, driverid)
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
  handleDriverBusyApi(driverid, accToken, refToken) {
    const self = this;
    self.webService.driverBusy(driverid, accToken)
      .then(res => {
      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken(refToken)
            .then(res => {
              self.webService.updateToken(res.access_token)
              self.handleDriverBusyApi(driverid, res.access_token)
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
  onTimeOutReq() {
    if (this.state.popupReq.show === true) {
      setTimeout(() => {
        if (this.state.popupReq.show === true) {
          this.onClosePopupReq()
          clearTimeout()
        }
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
    const reqId = this.state.userDet.reqId
    if (this.state.popupReq.popupType === true) {
      this.handleReqAccApi(reqId)
    } else if (this.state.popupReq.popupType === false) {
      if (this.state.curLocate.lat === 0) {
        this.handleCurLocate(reqId)
      }
    }
  }
  onClosePopupReq() {
    const self = this
    const reqId = this.state.userDet.reqId
    self.setState({
      popupReq: {
        ...self.state.popupReq,
        show: false,
        title: '',
        mess: ''
      },
      userDet: {
        ...self.state.userDet,
        userId: '',
        reqId: '',
        addr: '',
        name: '',
        phone: '',
        center: {
          ...self.state.userDet.center,
          lat: 0,
          lng: 0
        }
      }
    }, () => {
      let params = {
        requestid: reqId,
        mess: 'reject'
      }
      self.io.emit('driver-send-response', params)
    })

  }
  updateLocate(center) {
    this.revLocate.lat = center.lat
    this.revLocate.lng = center.lng
  }
  changeSwitch(state) {
    const self = this
    self.setState({
      switchState: state
    }, () => {
      if (self.state.switchState === true) {
        self.setState({
          isBusy: false
        }, () => {
          if (self.revLocate.lat !== 0 && self.revLocate.lng !== 0) {
            self.handleUpdStateApi(self.revLocate.lat, self.revLocate.lng, '1', self.driverRes.driverid)
          }
          else {
            self.handleUpdStateApi(self.state.curLocate.lat, self.state.curLocate.lng, '1', self.driverRes.driverid)
          }
        })
      } else {
        self.setState({
          isBusy: true
        }, () => {
          if (self.revLocate.lat !== 0 && self.revLocate.lng !== 0) {
            self.handleUpdStateApi(self.revLocate.lat, self.revLocate.lng, '0', self.driverRes.driverid)
          }
          else {
            self.handleUpdStateApi(self.state.curLocate.lat, self.state.curLocate.lng, '0', self.driverRes.driverid)
          }
        })
      }
    });
  }
  changeState(e) {
    e.preventDefault()
    this.setState({ btnState: !this.state.btnState },
      () => {
        if (this.state.btnState === true) {
          this.setState({ btnStateTitle: 'Kết thúc' })
        } else {
          this.setState({ btnStateTitle: 'Bắt đầu' })
          this.handleReqFinApi()
        }
      })
  }
  render() {
    return (
      <div className="driver">
        <div className="btn-state">
          <div className="btn-box">
            <div className="btn-state-group" >
              <button disabled={!this.state.reqAccept} className="btn btn-danger btn-lg" ref="btn" onClick={this.changeState}>
                {this.state.btnStateTitle}
              </button>
              <div className="switch-state">
                <Switch
                  checked={this.state.switchState}
                  onChange={this.changeSwitch}
                  onColor="#53b27c"
                  disabled={this.state.reqAccept}
                  offColor="#c42817"
                  onHandleColor="#ffffff"
                  width={75}
                  height={35}
                  uncheckedIcon={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 15,
                        color: "white",
                        paddingRight: 2
                      }}
                    >
                      <i className="fas fa-times fa-2x"></i>
                    </div>
                  }
                  checkedIcon={
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      fontSize: 15,
                      color: "white",
                      paddingRight: 2
                    }}>
                      <i className="fas fa-check fa-2x"></i>
                    </div>
                  }
                  className="react-switch"
                  id="icon-switch"
                />
              </div>
            </div>
            {this.state.reqAccept === true ?
              <div className="container-custom">
                <p><span style={{ "color": "red" }}>Tên:</span> {this.state.userDet.name}</p>
                <p><span style={{ "color": "red" }}>Địa chỉ:</span> {this.state.userDet.addr}</p>
                <p><span style={{ "color": "red" }}>Số điện thoại:</span> {this.state.userDet.phone}</p>
              </div>
              : null}
          </div>
        </div>
        <SweetAlert
          show={this.state.popupReq.show}
          title={this.state.popupReq.title}
          text={this.state.popupReq.mess}
          onConfirm={this.onConfirmPopup}
          onCancel={this.onClosePopupReq}
          showCancelButton={this.state.popupReq.popupType}
        // imageUrl="https://unsplash.it/400/200"
        // imageWidth="400"
        // imageHeight="200"
        />
        <Map center={this.state.curLocate} userCenter={this.state.userDet.center} reqAccept={this.state.reqAccept} isBusy={this.state.isBusy} popup={this.props.popup} updateLocate={this.updateLocate} />
      </div>
    );
  }
}

class Map extends Component {
  constructor(props) {
    super(props);
    this.getPoint = this.getPoint.bind(this);
    this.drawDirection = this.drawDirection.bind(this);
    this.findShortestRoute = this.findShortestRoute.bind(this);
    this.state = {
      defaultCenter: {
        latitude: 0,
        longitude: 0
      },
      geoCurrCenter: {
        lat: null,
        lng: null
      },
      userCurrCenter: {
        lat: null,
        lng: null
      },
      zoom: 16,
      directions: null,
      indexRoute: 0,
      marker: false
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.center && (nextProps.center !== this.props.center)) {
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
    if (nextProps.reqAccept === true && nextProps.reqAccept !== this.props.reqAccept) {
      this.setState({
        userCurrCenter: {
          ...this.state.userCurrCenter,
          lat: nextProps.userCenter.lat,
          lng: nextProps.userCenter.lng
        }
      }, () => {
        this.drawDirection();
      })
    } else if (nextProps.reqAccept === false) {
      this.setState({
        userCurrCenter: {
          ...this.state.userCurrCenter,
          lat: null,
          lng: null
        }
      })
    }
  }
  componentDidMount() {
    this.render();
  }
  getPoint(event) {
    if (this.props.reqAccept === false) {
      if (this.props.isBusy === false) {
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
    }
    this.props.updateLocate(this.state.geoCurrCenter)
  }
  drawDirection() {
    const DirectionsService = new window.google.maps.DirectionsService();
    if (this.state.userCurrCenter.lat != null) {
      DirectionsService.route({
        origin: new window.google.maps.LatLng(this.state.geoCurrCenter.lat, this.state.geoCurrCenter.lng),
        destination: new window.google.maps.LatLng(this.state.userCurrCenter.lat, this.state.userCurrCenter.lng),
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
          containerElement={<div style={{ height: `90vh` }} />}
          mapElement={<div style={{ height: `90%` }} />}
          onMapClick={this.getPoint}
          geoCurrCenter={this.state.geoCurrCenter}
          userCurrCenter={this.state.userCurrCenter}
          zoom={this.state.zoom}
          directions={this.state.directions}
          indexRoute={this.state.indexRoute}
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
    {props.directions && props.userCurrCenter.lat != null && <DirectionsRenderer directions={props.directions} routeIndex={props.indexRoute} options={{ suppressMarkers: true }} />}
    {props.geoCurrCenter.lat != null && <Marker position={props.geoCurrCenter} icon={markerIco} label={'Tài xế'} onClick={props.onMarkerClick} />}
    {props.userCurrCenter.lat != null && <Marker position={props.userCurrCenter} icon={markerIco} label={'Khách'} />}
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