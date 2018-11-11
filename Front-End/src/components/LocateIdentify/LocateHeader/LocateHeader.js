import React, { Component } from 'react';
import { withRouter, Link } from "react-router-dom";

class LocateHeader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark static-top">
          <Link className="navbar-brand mr-1" to="/admin">Locate Indentify Site</Link>
          <button className="btn btn-link btn-sm text-white order-1 order-sm-0" id="sidebarToggle">
            <i className="fas fa-bars"></i>
          </button>
          {/* Navbar Search */}
          <form className="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
              <div className="input-group-append">
                <button className="btn btn-primary" type="button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </form>
          <ul className="navbar-nav ml-auto ml-md-0">
            <li className="nav-item dropdown no-arrow">
              <div className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fas fa-user-circle fa-fw" />
              </div>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                <button className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">Logout</button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default withRouter(LocateHeader);
