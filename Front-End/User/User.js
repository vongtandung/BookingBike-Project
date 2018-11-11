import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import "./User.css";
import io from "socket.io-client";

var socket = io("http://localhost:3002");

class User extends Component {
  onClickMe(text)
  {
    socket.emit("client-send-place",text);
  }
  render() {
    return (
      <div className="user">
        <div className="user-input container-fluid input-box">
          <div class="input-group input-group-lg">
            <input
              type="text"
              class="form-control"
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              placeholder="nhập điểm đón"
            />
          </div>
          <div class="input-group input-group-lg">
          <input
            type="text"
            class="form-control"
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            placeholder="nhập Ghi Chú"
          />
        </div>
        <div className="btn-custom">
        <button type="button" class="btn btn-success btn-lg" id="bookbike" onClick={this.onClickMe.bind(this,"hehe") }>Đặt Xe</button>
        </div>
        </div>
        <GoogleMap />
      </div>      
    );
  }
}

class GoogleMap extends Component {
  static defaultProps = {
    center: {
      lat: 10.80194,
      lng: 106.73845
    },
    zoom: 16
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div className="google-map">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyAF4NnJmtnjQIsG3cOP3Ci3-uJb0QCVr5E",
            language: "vi",
            region: "vi"
          }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          options={mapOptions}
        />
      </div>
    );
  }
}

const mapOptions = {
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
