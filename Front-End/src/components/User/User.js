import React, { Component } from "react";
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import SearchBox from "react-google-maps/lib/components/places/SearchBox"
import "./User.css";
import io from "socket.io-client";
import WebService from "../../utilities/WebServices";

class User extends Component {
  constructor(props) {
    super(props);
    this.handleDataSocket = this.handleDataSocket.bind(this);
    this.onPlaceChange = this.onPlaceChange.bind(this);
    this.onNoteChange = this.onNoteChange.bind(this);
    this.onSendInfo = this.onSendInfo.bind(this);
    this.webService = new WebService();
    this.isPlace = localStorage.getItem('isPlace') != null ? localStorage.getItem('isPlace') : '';
    this.isNote = localStorage.getItem('isNote') != null ? localStorage.getItem('isNote') : '';
    this.isBook = localStorage.getItem('isBook') != null ? localStorage.getItem('isBook') : false;
    this.state = {
      place: '',
      note: '',
      isBook: false
    }
    this.io = null;
  }
  componentWillMount() {
    this.initData();
  }
  componentDidMount() {
    if (this.io != null) {
      this.handleDataSocket()
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
      self.initState()
      return;
    } else {
      this.props.history.push('/login')
      return;
    }
  }
  handleDataSocket() {
    const self = this;
    self.io.on('server-send-success-response-user', function (driverid) {
      if (driverid) {
        self.handleDriverInfApi(driverid)
      }
    })
    self.io.on('server-send-fail-response-user', function () {
      self.setState({ isBook: false }, () => {
        self.props.popup({
          title: 'Không tìm thấy tài xế',
        })
      })
    })
    self.io.on('finish', () => {
      self.setState({ isBook: false }, () => {
        self.props.popup({
          title: 'Chuyến đi đã kết thúc',
        })
      })
    })
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
  initState() {
    const self = this
    self.setState({
      place: self.isPlace,
      note: self.isNote,
    }, () => {
      self.refs.note.value = self.state.note
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

  onSendInfo() {
    const self = this
    const userInf = {
      place: this.state.place,
      note: this.state.note,
      id: this.webService.getIdUser(),
      name: this.webService.getUserName(),
      phone: this.webService.getPhoneNum()
    }
    self.setState({ isBook: true }, () => {
      localStorage.setItem('isPlace', self.state.place)
      localStorage.setItem('isNote', self.state.note)
      localStorage.setItem('isBook', self.state.isBook)
    });
    this.io.emit('user-send-place', userInf)
  }
  render() {
    return (
      <div className="user">
        <div className="user-input container-fluid input-box1">
          <div className="input-group input-group-md">
            <input disabled={this.state.isBook}
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
            <button disabled={this.state.isBook} type="button" className="btn btn-success btn-lg" onClick={this.onSendInfo}>Đặt Xe</button>
          </div>
        </div>
        <Map onPlaceChange={this.onPlaceChange} isBook={this.state.isBook} isPlace={this.state.place} />
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
    console.log(this.state.onSearchInput)
    this.state.onSearchInput.focus();
    console.log(this.state.SearchBox.getPlaces())
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
          isBook={this.props.isBook}
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
        <input disabled={props.isBook}
          ref={props.onSearchInput}
          onBlur={props.onInputChange}
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
