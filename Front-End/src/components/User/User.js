import React, { Component } from "react";
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import SearchBox from "react-google-maps/lib/components/places/SearchBox"
import "./User.css";
import io from "socket.io-client";
import WebService from "../../utilities/WebServices";

class User extends Component {
  constructor(props) {
    super(props);
    this.onNameChange = this.onNameChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.onPlaceChange = this.onPlaceChange.bind(this);
    this.onNoteChange = this.onNoteChange.bind(this);
    this.onSendInfo = this.onSendInfo.bind(this);
    this.webService = new WebService();
    this.state = {
      name: '',
      phone: '',
      place: '',
      note: ''
    }
    this.io = null;
  }
  componentWillMount() {
    this.initData();
  }
  componentWillUnmount() {
    if (this.io != null) {
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
    } else if (this.webService.isDriver()) {
      this.props.history.push('/driver')
      return;
    } else if (this.webService.isUser()) {
      this.props.isLogged(false);
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
  handleDriverInfApi(driverid) {
    const self = this;
    self.webService.getDriverInfo(driverid)
      .then(res => {
        self.props.popup({
          title: 'Tài xế ' + res.driverName + ' đã nhận',
          mess: 'Số điện thoại: ' + res.driverPhone
        })
      }).catch((error) => {
        if (error === 401) {
          self.webService.renewToken()
            .then(res => {
              self.webService.updateToken(res.access_token)
              self.handleDriverInfApi(driverid)
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
  onNameChange(event) {
    this.setState({
      name: event.target.value
    })
  }
  onPhoneChange(event) {
    this.setState({
      phone: event.target.value
    })
  }
  onPlaceChange(value) {
    this.setState({
      place: value
    })
  }
  onNoteChange(event) {
    this.setState({
      note: event.target.value
    })
  }
  onCheckInfo(userInf) {
    let isInf = true;
    if (userInf.cusname === undefined || userInf.cusname === null || userInf.cusname === '') {
      isInf = false
    } else if (userInf.cusphone === undefined || userInf.cusphone === null || userInf.cusphone === '') {
      isInf = false
    } else if (userInf.place === undefined || userInf.place === null || userInf.place === '') {
      isInf = false
    }
    if (isInf === false) {
      this.props.popup({
        title: 'Thông tin nhập chưa đúng',
        mess: ''
      })
    }
    return isInf
  }
  onSendInfo(e) {
    e.preventDefault()
    const userInf = {
      cusname: this.state.name,
      cusphone: this.state.phone,
      place: this.state.place,
      note: this.state.note
    }
    if (this.onCheckInfo(userInf)) {
      this.io.emit('user-send-place', userInf)
      this.setState({
        name: '',
        phone: '',
        note: ''
      }, () => {
        this.refs.name.value = ''
        this.refs.phone.value = ''
        this.refs.note.value = ''
        this.props.popup({
          title: 'Thông tin khách gửi thành công',
          mess: ''
        })
      })
    }
  }
  render() {
    return (
      <div className="user">
        <div className="user-input container-fluid input-box1">
          <div className="input-group input-group-md">
            <input
              ref="name"
              onBlur={this.onNameChange}
              type="text"
              className="form-control"
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              placeholder="Nhập tên"
            />
          </div>
        </div>
        <div className="user-input container-fluid input-box2">
          <div className="input-group input-group-md">
            <input
              ref="phone"
              onBlur={this.onPhoneChange}
              type="text"
              className="form-control"
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              placeholder="Nhập SĐT"
              maxLength="10"
            />
          </div>
        </div>
        <div className="user-input container-fluid input-box3">
          <div className="input-group input-group-md">
            <input
              ref="note"
              onBlur={this.onNoteChange}
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
        <Map onPlaceChange={this.onPlaceChange} isPlace={this.state.place} />
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
  onPlacesChanged() {
    this.state.onSearchInput.focus();
  }
  onSearchBox(ref) {
    this.setState({ SearchBox: ref }, () => { });
  }
  onSearchInput(ref) {
    this.setState({ onSearchInput: ref }, () => {
      this.state.onSearchInput.value = this.props.isPlace
    });
  }
  onInputChange(event) {
    this.setState({ searchInput: event.target.value }, () => {
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
          center={this.state.center}
          zoom={this.state.zoom}
          onMapClick={this.getPoint}
          onPlacesChanged={this.onPlacesChanged}
          onSearchBox={this.onSearchBox}
          onSearchInput={this.onSearchInput}
          onInputChange={this.onInputChange}
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
    <SearchBox
      bounds={props.bounds}
      controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      ref={props.onSearchBox}
    >
      <div className="user-input container-fluid input-box">
        <input
          ref={props.onSearchInput}
          onBlur={props.onInputChange}
          type="text"
          className="form-control"
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          placeholder="Nhập địa chỉ"
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
