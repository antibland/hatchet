import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Create from './Create';
import Join from './Join';
import Login from './Login';
import Logout from './Logout';
import ForgotPassword from './ForgotPassword';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/create' component={Create}/>
      <Route exact path='/join' component={Join}/>
      <Route exact path='/login' component={Login}/>
      <Route exact path='/logout' component={Logout}/>
      <Route path='/forgot_password' component={ForgotPassword}/>
    </Switch>
  </main>
);

export default Main;
