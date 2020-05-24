import React from 'react';
import { Link } from 'react-router-dom';
import Style from './LogoLink.css';

export default class LogoLink extends React.PureComponent {
  render() {
    return <Link to="/" className={Style.logo} />;
  }
}
