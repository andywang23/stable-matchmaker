import React from 'react';
import styled from 'styled-components';
import {
  LoginInput,
  ValidLoginButton,
  InvalidLoginButton,
  Container,
} from '../styles/styledComponents';

class AdminRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameinput: '',
      passwordinput: '',
      responseMsg: '',
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

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const parsedRes = await response.json();
      if (parsedRes.err) this.setState({ responseMsg: 'Username already exists!' });
      else this.setState({ responseMsg: 'Admin successfully created!' });
    } catch {
      this.setState({ responseMsg: 'Network Error' });
    }
  };

  render() {
    return this.state.userLoggedIn ? (
      <AdminMain userName={this.state.usernameinput} />
    ) : (
      <Container>
        <h1>Welcome to the Ultimate Matchmaker</h1>
        <h4>Please Register Below</h4>
        <div className="main-login-container">
          <form id="login-form" onSubmit={this.handleSubmit}>
            <LoginInput
              name="usernameinput"
              required
              placeholder="Username"
              value={this.state.usernameinput}
              onChange={this.handleInputChange}
            />
            <LoginInput
              name="passwordinput"
              required
              type="password"
              placeholder="Password"
              onChange={this.handleInputChange}
            />
            <center>
              {this.state.validSubmissionBtn ? (
                <ValidLoginButton type="submit" value="Register" />
              ) : (
                <InvalidLoginButton type="submit" value="Register" disabled />
              )}
            </center>
            {this.state.responseMsg}
          </form>
        </div>
      </Container>
    );
  }
}

export default AdminRegistration;
