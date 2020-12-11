import React, { Component } from 'react';
import AdminMain from './AdminMain';
import { NavLink } from 'react-router-dom';
import {
  LoginInput,
  ValidLoginButton,
  InvalidLoginButton,
  Container,
  CenterFlex,
} from '../styles/styledComponents';

class AdminLogin extends Component {
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

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (this.state.usernameinput.length && this.state.passwordinput.length)
      this.setState({ validSubmissionBtn: true });
    else this.setState({ validSubmissionBtn: false });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
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

    if (validCred) this.setState({ userLoggedIn: true });
    else this.setState({ invalidCredentials: true });
  };

  render() {
    return this.state.userLoggedIn ? (
      <AdminMain userName={this.state.usernameinput} />
    ) : (
      <Container>
        <h1>Welcome to the Ultimate Matchmaker</h1>
        <h4>Please Log In</h4>

        <form id="login-form" onSubmit={this.handleSubmit}>
          <LoginInput
            name="usernameinput"
            required
            placeholder="Username"
            value={this.state.usernameinput}
            onChange={this.handleInputChange}
          />
          <LoginInput
            className="password"
            name="passwordinput"
            required
            type="password"
            placeholder="Password"
            onChange={this.handleInputChange}
          />

          <CenterFlex>
            {this.state.validSubmissionBtn ? (
              <ValidLoginButton type="submit" value="Log In" />
            ) : (
              <InvalidLoginButton type="submit" value="Log In" disabled />
            )}
          </CenterFlex>
        </form>

        <div
          style={this.state.invalidCredentials ? { color: 'darkred' } : { visibility: 'hidden' }}
        >
          Sorry, your username and/or password was incorrect. Please double-check and try again
        </div>

        <div>
          <p>
            Don't have an account? <NavLink to="/registration">Sign up</NavLink>
          </p>
        </div>
      </Container>
    );
  }
}

export default AdminLogin;
