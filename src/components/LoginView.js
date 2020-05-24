import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import User from '../api/UserService';
import LogoLink from './shared/LogoLink';
import UserFormInput from './shared/UserFormInput';
import UserFormButton from './shared/UserFormButton';
import './LoginView.css';

export default class LoginView extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.object,
    }),
  };

  state = {
    submission: false,
    redirectTo: null,
    redirectToReferrer: false,
    email: '',
    password: '',
    error: null,
  };

  async componentDidMount() {
    if (await User.isLoggedIn()) {
      this.setState({ redirectTo: '/' });
    }
  }

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  handleSubmitLogin = async e => {
    e.preventDefault();
    this.setState({ submission: true, error: null });

    let redirectTo = '/';
    const { email, password } = this.state;
    const { state: locationState } = this.props.location;

    if (locationState && locationState.from.pathname !== '/login') {
      redirectTo = locationState.from;
    }

    try {
      const status = await User.login(email, password);
      if (!status) {
        const error = 'Wrong email or password';
        this.setState({ submission: false, error });
        return;
      }

      this.setState({ redirectTo });
    } catch (err) {
      this.setState({ submission: false });
      console.error(err);
    }
  };

  handleCloseError = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const { email, password, error } = this.state;

    return (
      <form className="LoginView">
        <LogoLink />
        {error &&
          <div className="LoginView-error" onClick={this.handleCloseError}>
            {error}
          </div>}
        <UserFormInput
          placeholder="email@domain.com"
          type="text"
          onChange={this.handleEmailChange}
          spellCheck="false"
          value={email}
          disabled={this.state.submission}
        />
        <UserFormInput
          placeholder="password"
          type="password"
          onChange={this.handlePasswordChange}
          value={password}
          disabled={this.state.submission}
        />
        <UserFormButton
          type="submit"
          onClick={this.handleSubmitLogin}
          disabled={this.state.submission}
        >
          {'Login'}
        </UserFormButton>
        <div className="LoginView-signup">
          {'Create new account '}
          <Link to="/register">
            {'here'}
          </Link>
        </div>
      </form>
    );
  }
}
