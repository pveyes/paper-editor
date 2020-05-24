import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
import AuthorizedRenderer from './AuthorizedRenderer';
import User from '../../../api/UserService';

const AuthorizedRoute = ({ component: Component, ...rest }) =>
  <Route
    {...rest}
    render={route => {
      /**
       * We render AuthorizedRenderer instead of directly render the component
       * because we have to make sure that user is really logged in, not just
       * having some string as token inside localStorage.
       *
       * Note that we don't call API to get user profile inside AuthorizedMatch
       * component because this component is always mounted, which means any
       * API call inside this component will be called as many as component
       * that need "quick" authentication. Using auth.loggedIn() check allow
       * us to short circuit when the token is already gone.
       */
      if (User.isLoggedIn()) {
        return <AuthorizedRenderer component={Component} />;
      }

      return (
        <Redirect
          to={{
            pathname: '/login',
            state: {
              from: route.location,
            },
          }}
        />
      );
    }}
  />;

AuthorizedRoute.propTypes = {
  component: PropTypes.func,
};

export default AuthorizedRoute;
