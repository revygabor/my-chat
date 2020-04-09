import React, { Component } from 'react';
import { Login } from './Login'
import { proxy } from './Proxy'
import { Main } from './Main';

export default class App extends Component {
  state = { loggedIn: false }

  componentDidMount() {
    proxy.addEventListener("login", () => this.setState({ loggedIn: true }), this)
  }
  
  render() {
    return (
      <div className="app">
        { this.state.loggedIn ? <Main /> : <Login/> }
      </div>
    );
  }
}
