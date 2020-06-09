import React, { Component } from 'react';
import {Switch, Route, BrowserRouter} from "react-router-dom";

import Admin from './pages/admin'
import Login from './pages/login'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
