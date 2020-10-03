import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../styles/sharedStyles';

const HomePage = (props) => {
  return (
    <div className="main-app-container">
      <h1>Welcome to the Ultimate Matchmaker</h1>
      <h4>Select Your Role Below</h4>
      <div className="role-btn-container">
        <NavLink to="/user">
          <Button>User</Button>
        </NavLink>
        <NavLink to="/admin">
          <Button>Matchmaker</Button>
        </NavLink>
      </div>
    </div>
  );
};

export default HomePage;
