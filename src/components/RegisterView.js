import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import User from '../api/UserService';
import LogoLink from './shared/LogoLink';
import UserFormInput from './shared/UserFormInput';
import UserFormButton from './shared/UserFormButton';
import Style from './RegisterView.css';

export default class RegisterView extends React.Component {
  state = {
    submission: false,
    redirectTo: null,
    name: '',
    email: '',
    password: '',
  };

  handleNameChange = e => {
    this.setState({ name: e.target.value });
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  handleSubmitRegister = async e => {
    e.preventDefault();
    this.setState({ submission: true });

    try {
      const response = await User.register(
        this.state.name,
        this.state.email,
        this.state.password,
      );

      if (response.status !== 'success') {
        throw new Error(response.error);
      }

      this.setState({ redirectTo: '/' });
    } catch (e) {
      this.setState({ submission: false });
      console.error('Failed to register', e.message);
    }
  };

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className={Style.container}>
        <LogoLink />
        <UserFormInput
          placeholder="Full Name"
          type="text"
          value={this.state.name}
          disabled={this.state.submission}
          onChange={this.handleNameChange}
        />
        <UserFormInput
          placeholder="email@domain.com"
          type="email"
          value={this.state.email}
          disabled={this.state.submission}
          onChange={this.handleEmailChange}
        />
        <UserFormInput
          placeholder="password"
          type="password"
          value={this.state.password}
          disabled={this.state.submission}
          onChange={this.handlePasswordChange}
        />
        <UserFormButton
          onClick={this.handleSubmitRegister}
          disabled={this.state.submission}
        >
          {'Register'}
        </UserFormButton>
        <div className="LoginView-signup">
          {'Login to your account '}
          <Link to="/login">
            {'here'}
          </Link>
        </div>
      </div>
    );
  }
}
