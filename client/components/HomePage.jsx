import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import UserLanding from './UserLanding';

const HomePage = (props) => {
  return (
    <div className="main-app-container">
      <h1>Welcome to the Ultimate Matchmaker</h1>
      <h4>Select Your Role Below</h4>
      <div className="role-btn-container">
        <NavLink to="/user">
          <button>User</button>
        </NavLink>
        <NavLink to="/admin">
          <button>Matchmaker</button>
        </NavLink>
      </div>
    </div>
  );
};

export default HomePage;
