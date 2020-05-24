import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router';
import User from '../../../api/UserService';

class AuthorizedRenderer extends React.Component {
  static propTypes = {
    component: PropTypes.func,
    match: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
  };

  state = {
    user: null,
    authFailed: null,
  };

  async componentDidMount() {
    try {
      const user = await User.getUserData();
      this.setState({ authFailed: false, user });
    } catch (_) {
      // assume session ended, clear existing session token
      // and redirect to login page
      await User.logout();
      this.setState({ authFailed: true });
    }
  }

  handleApiError = err => {
    if (err.message === 'Token expired') {
      this.setState({ authFailed: true });
    } else {
      console.error(err.stack);
    }
  };

  render() {
    const { component: Component, match, location, history } = this.props;

    const { authFailed, user } = this.state;

    if (authFailed === null) {
      return null;
    }

    const route = {
      match,
      location,
      history,
    };

    return authFailed
      ? <Redirect
          to={{ pathname: '/login', state: { from: route.location } }}
        />
      : <Component
          route={route}
          user={user}
          onApiError={this.handleApiError}
        />;
  }
}

export default withRouter(AuthorizedRenderer);
