import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import './Login.css'
import IconLogin from '../../assets/images/icon-login.svg';
class Login extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.isLogged(true);
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
    this.state = {
      errTitle: 'Đăng nhập thất bại'
    }
  }
  handleFormLoginSubmit(e) {
    e.preventDefault();
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
            <input type="text" id="username" className="fadeIn second" name="login" placeholder="Tài khoản" onChange={this.handleChange}></input>
            <input type="text" id="password" className="fadeIn third pass" name="login" placeholder="Mật khẩu" autoComplete="off" onChange={this.handleChange}></input>
            <input type="submit" className="fadeIn fourth" value="Đăng nhập"></input>
          </form>
          <div id="formFooter">
            <a className="underlineHover" href="">Quên mật khẩu?</a>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
