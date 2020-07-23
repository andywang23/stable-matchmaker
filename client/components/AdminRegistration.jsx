import React from 'react';

class AdminRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameinput: '',
      passwordinput: '',
      responseMsg: '',
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

    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const parsedRes = await response.json();
    if (parsedRes.err)
      this.setState({ responseMsg: 'Username already exists!' });
    else this.setState({ responseMsg: 'Admin successfully created!' });
  };

  render() {
    return this.state.userLoggedIn ? (
      <AdminMain userName={this.state.usernameinput} />
    ) : (
      <div className="admin-login">
        <h1>Welcome to the Ultimate Matchmaker</h1>
        <h4>Please Register Below</h4>
        <div className="main-login-container">
          <form id="login-form" onSubmit={this.handleSubmit}>
            <input
              className="username"
              name="usernameinput"
              required
              placeholder="Username"
              value={this.state.usernameinput}
              onChange={this.handleInputChange}
            ></input>
            <br></br>
            <input
              className="password"
              name="passwordinput"
              required
              type="password"
              placeholder="Password"
              onChange={this.handleInputChange}
            ></input>

            <center>
              {!this.state.validSubmissionBtn ? (
                <input
                  className="login-btn invalid"
                  type="submit"
                  value="Register"
                  disabled
                ></input>
              ) : (
                <input
                  className="login-btn valid"
                  type="submit"
                  value="Register"
                ></input>
              )}
            </center>
            {this.state.responseMsg}
          </form>
        </div>

        <div
          className={
            this.state.invalidCredentials ? 'incorrect-submission-text' : 'hide'
          }
        >
          Sorry, your username and/or password was incorrect. Please
          double-check and try again
        </div>
      </div>
    );
  }
}

export default AdminRegistration;
