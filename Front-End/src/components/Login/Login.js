import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import WebService from '../../utilities/WebServices';
import './Login.css'
import IconLogin from '../../assets/images/icon-login.svg';

class Login extends Component {
  constructor(props) {
    super();
    this.webService = new WebService();
  }
  componentWillMount() {
    this.props.isLogged(true);
    this.initData();
  }
  initData() {
    if (this.webService.isLocate()) {
      this.props.history.replace('/locate')
      return;
    } else if (this.webService.isAdmin()) {
      this.props.history.replace('/admin')
      return;
    } else if (this.webService.isDriver()) {
      this.props.history.replace('/driver')
      return;
    } else if (this.webService.isUser()) {
      this.props.history.replace('/user')
      return;
    } else{
      this.webService.logout()
    }
  }
  render() {
    return (
      <div className="login">
        <LoginForm popup={this.props.popup} history={this.props.history} />
      </div>
    );
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.handleFormLoginSubmit = this.handleFormLoginSubmit.bind(this);
    this.webService = new WebService();
    this.state = {
      errTitle: 'Đăng nhập thất bại'
    }
  }
  handleFormLoginSubmit(e) {
    const self = this;
    e.preventDefault();
    self.webService.login(e.target.username.value, e.target.password.value)
      .then(res => {
        if (res.auth === true) {
          self.webService.setInfo(res.ID, res.Name, res.PhoneNumber, res.Permission, res.access_token, res.refresh_token);
          if (res.Permission === 1) {
            self.props.history.push('/user');
          } else if (res.Permission === 2) {
            self.props.history.push('/locate');
          } else if (res.Permission === 3) {
            self.props.history.push('/admin');
          } else if (res.Permission === 4) {
            self.props.history.push('/driver');
          }
        }
        else {
          self.props.popup({ title: 'Mật khẩu hoặc tài khoản không đúng', mess: '' })
        }
      }).catch((err) => {
        self.props.popup({ title: self.state.errTitle, mess: '' })
      })
  }
  render() {
    return (
      <div className="login-form wrapper fadeInDown">
        <div id="formContentLogin">
          <div className="form-title">
            <h2 className="active"> Đăng nhập </h2>
          </div>
          <div className="fadeIn first">
            <img src={IconLogin} id="icon-login" alt="User Icon" />
          </div>
          <form onSubmit={this.handleFormLoginSubmit}>
            <input type="text" id="username" className="fadeIn second" name="login" placeholder="Tài khoản"></input>
            <input type="text" id="password" className="fadeIn third pass" name="login" placeholder="Mật khẩu" autoComplete="off"></input>
            <input type="submit" className="fadeIn fourth" value="Đăng nhập"></input>
          </form>
          <div id="formFooter">
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
