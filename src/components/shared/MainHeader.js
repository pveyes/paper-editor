import React from 'react';
import { Redirect } from 'react-router-dom';
import Header from './Header';
import AppContainer from './AppContainer';
import ChromelessButton from './ChromelessButton';
import Text from './Text';
import Style from './MainHeader.css';
import LogoLink from './LogoLink';
import User from '../../api/UserService';

export default class MainHeader extends React.Component {
  state = {
    logout: false,
  };

  handleLogoutClick = async e => {
    await User.logout();
    this.setState({ logout: true });
  };

  render() {
    if (this.state.logout) {
      return <Redirect to="/login" />;
    }

    return (
      <Header>
        <AppContainer wide className={Style.header}>
          <LogoLink />
          <ChromelessButton
            className={Style.logout}
            onClick={this.handleLogoutClick}
          >
            <Text primary>
              {'Logout'}
            </Text>
          </ChromelessButton>
        </AppContainer>
      </Header>
    );
  }
}
