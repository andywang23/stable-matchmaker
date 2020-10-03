import React from 'react';
import AdminMain from './AdminMain';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Form } from '../styles/sharedStyles';

const LoginInput = styled(Form)`
  width: 265px;
  height: 37px;
`;

const LoginButton = styled.input`
  font-size: 1rem;
  font-weight: 500;
  padding: 7px;
  border-radius: 8px;
  color: black;
  width: 100%;
  font-family: 'Ubuntu', sans-serif;
`;

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameinput: '',
      passwordinput: '',
      validSubmissionBtn: false,
      userLoggedIn: false,
      invalidCredentials: false,
    };
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });

    if (this.state.usernameinput.length && this.state.passwordinput.length)
      this.setState({ validSubmissionBtn: true });
    else this.setState({ validSubmissionBtn: false });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const username = this.state.usernameinput;
    const password = this.state.passwordinput;
    const body = { username, password };

    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const validCred = await response.json();

    if (validCred) {
      this.setState({ userLoggedIn: true });
    } else {
      this.setState({ invalidCredentials: true });
    }
  };

  render() {
    return this.state.userLoggedIn ? (
      <AdminMain userName={this.state.usernameinput} />
    ) : (
      <div className="admin-login">
        <h1>Welcome to the Ultimate Matchmaker</h1>
        <h4>Please Log In</h4>
        <div className="main-login-container">
          <form id="login-form" onSubmit={this.handleSubmit}>
            <LoginInput
              name="usernameinput"
              required
              placeholder="Username"
              value={this.state.usernameinput}
              onChange={this.handleInputChange}
            />
            <br />
            <LoginInput
              className="password"
              name="passwordinput"
              required
              type="password"
              placeholder="Password"
              onChange={this.handleInputChange}
            />

            <center>
              {!this.state.validSubmissionBtn ? (
                <LoginButton className="invalid" type="submit" value="Log In" disabled />
              ) : (
                <LoginButton className="valid" type="submit" value="Log In" />
              )}
            </center>
          </form>
        </div>

        <div className={this.state.invalidCredentials ? 'incorrect-submission-text' : 'hide'}>
          Sorry, your username and/or password was incorrect. Please double-check and try again
        </div>

        <div className="signup-container">
          <p>
            Don't have an account? <NavLink to="/registration">Sign up</NavLink>
          </p>
        </div>
      </div>
    );
  }
}

export default AdminLogin;
