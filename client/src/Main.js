import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Create from './Create';
import Join from './Join';
import Login from './Login';
import Logout from './Logout';
import ForgotPassword from './ForgotPassword';
import Resend from './Resend';
import Terms from './Terms';
import Privacy from './Privacy';
import Profile from './Profile';
import Fight from './Fight';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/create' component={Create}/>
      <Route exact path='/join' component={Join}/>
      <Route exact path='/login' component={Login}/>
      <Route exact path='/logout' component={Logout}/>
      <Route exact path='/profile' component={Profile}/>
      <Route exact path='/fight/:fightId' component={Fight} />
      <Route path='/forgot_password' component={ForgotPassword}/>
      <Route path='/resend' component={Resend}/>
      <Route exact path='/terms' component={Terms}/>
      <Route exact path='/privacy' component={Privacy}/>
    </Switch>
  </main>
);

export default Main;
