import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import WebService from '../../utilities/WebServices';
import './ErrorPage.css'
class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.popBack = this.popBack.bind(this);
    this.webService = new WebService()
  }
  popBack() {
    if (this.webService.isUser()) {
      this.props.history.push('/user')
    } else if (this.webService.isLocate()) {
      this.props.history.push('/locate')
    } else if (this.webService.isAdmin()) {
      this.props.history.push('/admin')
    } else if (this.webService.isDriver()) {
      this.props.history.push('/driver')
    } else {
      this.props.history.push('/login')
    }
  }
  componentWillMount() {
    this.props.isLogged(true)
  }
  render() {
    return (
      <div className="error">
        <div className="error-title">
          <h1>Truy cập của bạn không đúng</h1>
        </div>
        <div>
          <button type="button" className="btn btn-danger btn-lg" onClick={this.popBack}>Quay về</button>
        </div>
      </div>
    );
  }
}

export default withRouter(ErrorPage);
