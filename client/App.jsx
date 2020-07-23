import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import UserLanding from './components/UserLanding';
import HomePage from './components/HomePage';
import PrefSelector from './components/PrefSelector';
import AdminRegistration from './components/AdminRegistration';

const App = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/user" component={UserLanding} />
      <Route exact path="/admin" component={AdminLogin} />
      <Route exact path="/prefselector" component={PrefSelector} />
      <Route exact path="/registration" component={AdminRegistration} />
    </Switch>
  );
};

export default App;
