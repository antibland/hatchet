import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Create from './Create';
import Join from './Join';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/create' component={Create}/>
      <Route exact path='/join' component={Join}/>
    </Switch>
  </main>
);

export default Main;
