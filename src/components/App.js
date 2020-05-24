import React from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router';
import thunk from 'redux-thunk';
import AuthorizedRoute from './shared/router/AuthorizedRoute';
import ListView from './ListView';
import EditView from './EditView';
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import reducers from '../reducers/EditorReducer';

export default class App extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this.store = createStore(
      reducers,
      applyMiddleware(thunk.withExtraArgument({ router: context.router })),
    );
  }

  render() {
    return (
      <Provider store={this.store}>
        <div>
          <Switch>
            <Route path="/login" exactly component={LoginView} />
            <Route path="/register" exactly component={RegisterView} />
            <AuthorizedRoute path="/write" exactly component={EditView} />
            <AuthorizedRoute path="/edit/:id" exactly component={EditView} />
            <AuthorizedRoute path="/" exactly component={ListView} />
          </Switch>
        </div>
      </Provider>
    );
  }
}
